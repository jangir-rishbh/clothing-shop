import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    console.log('Verifying OTP for email:', email);

    if (!email || !otp) {
      console.error('Missing email or OTP in request');
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Clean up any expired OTPs first
    await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .lt('expires_at', new Date().toISOString());

    // Get the stored OTP from the database
    const { data: otpData, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !otpData) {
      console.error('No OTP found for email:', email);
      return NextResponse.json(
        { error: 'No active OTP found for this email. Please request a new OTP.' },
        { status: 400 }
      );
    }

    console.log('Retrieved OTP data:', {
      storedOTP: otpData.otp,
      expiresAt: otpData.expires_at,
      currentTime: new Date().toISOString()
    });

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    
    if (now > expiresAt) {
      console.error('OTP has expired');
      // Delete expired OTP
      await supabaseAdmin
        .from('otp_verifications')
        .delete()
        .eq('email', email);
      
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      console.error('Invalid OTP provided');
      return NextResponse.json(
        { 
          error: 'The OTP you entered is incorrect. Please try again or request a new OTP.',
          code: 'INVALID_OTP'
        },
        { status: 400 }
      );
    }

    // Delete the used OTP
    await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .eq('email', email);

    console.log('OTP verified successfully for email:', email);
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while verifying your OTP. Please try again.',
        code: 'VERIFICATION_ERROR'
      },
      { status: 500 }
    );
  }
}
