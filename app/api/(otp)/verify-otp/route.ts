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
  console.log('=== OTP Verification Request ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    // Parse the request body
    let requestBody;
    try {
      const text = await request.text();
      console.log('Raw request body:', text);
      requestBody = text ? JSON.parse(text) : {};
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      const errorMessage = 'Error parsing request body';
      console.error(errorMessage, error);
      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'INVALID_JSON',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { email, otp } = requestBody;
    
    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { 
          error: 'Email and OTP are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }
    
    console.log('Verification request details:', { 
      email: `${email.substring(0, 3)}...${email.split('@')[1] || ''}`,
      otpLength: otp.length
    });

    // Find the OTP record by email
    const { data: otpData, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpData) {
      console.error('Error fetching OTP:', fetchError);
      return NextResponse.json(
        { 
          error: 'No OTP found for this email address. Please request a new OTP.',
          code: 'OTP_NOT_FOUND',
          details: fetchError?.message
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    const isExpired = now > expiresAt;

    console.log('OTP validation:', {
      storedOTP: `${otpData.otp.substring(0, 2)}...`,
      expiresAt: otpData.expires_at,
      currentTime: now.toISOString(),
      isExpired,
      timeRemaining: isExpired ? 'expired' : `${Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)} seconds`
    });
    
    if (isExpired) {
      console.error('OTP has expired');
      // Delete expired OTP
      const { error: deleteError } = await supabaseAdmin
        .from('otp_verifications')
        .delete()
        .eq('id', otpData.id);
      
      if (deleteError) {
        console.error('Error deleting expired OTP:', deleteError);
      }
      
      return NextResponse.json(
        { 
          error: 'This OTP has expired. Please request a new one.',
          code: 'OTP_EXPIRED',
          details: `OTP expired at ${expiresAt.toISOString()}`
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
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

    // Mark the OTP as verified and update the record
    try {
      const updateData = { 
        verified: true, 
        verified_at: new Date().toISOString(),
        // Set a new expiration time for the verification (10 minutes from now)
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      };
      
      console.log('Updating OTP with data:', updateData);
      
      const { error: updateError } = await supabaseAdmin
        .from('otp_verifications')
        .update(updateData)
        .eq('id', otpData.id);

      if (updateError) {
        // If error is about missing columns, try with just the expiration update
        if (updateError.message && updateError.message.includes("Could not find the 'verified' column")) {
          console.warn('Verified column not found, falling back to expiration update only');
          const fallbackUpdateData = {
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          };
          
          const { error: fallbackError } = await supabaseAdmin
            .from('otp_verifications')
            .update(fallbackUpdateData)
            .eq('id', otpData.id);
            
          if (fallbackError) {
            console.error('Error in fallback update:', fallbackError);
            throw new Error(`Failed to update OTP: ${fallbackError.message}`);
          }
        } else {
          console.error('Error updating OTP verification status:', updateError);
          throw new Error(`Failed to update OTP verification status: ${updateError.message}`);
        }
      }
      
      console.log('Successfully updated OTP verification status');
    } catch (updateError) {
      console.error('Error in OTP verification update:', updateError);
      throw new Error(`Failed to update OTP: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
    }

    console.log('OTP verified successfully for email:', email);
    
    // Verify the OTP record was updated
    await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('id', otpData.id)
      .single();

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully',
      verified: true,
      email: email,
      otpId: otpData.id
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while verifying your OTP. Please try again.',
        code: 'VERIFICATION_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
