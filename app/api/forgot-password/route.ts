import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomInt } from 'crypto';
import { sendOtpEmail } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      // Return a specific status to indicate email not found
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP valid for 15 minutes

    // Upsert OTP in database
    const { error: upsertError } = await supabase
      .from('otp_verifications')
      .upsert(
        {
          email,
          otp,
          expires_at: expiresAt.toISOString(),
          verified: false,
        },
        { onConflict: 'email' }
      );

    if (upsertError) {
      console.error('Error storing OTP:', upsertError);
      throw new Error('Failed to generate OTP');
    }

    // Send OTP via email
    console.log('Attempting to send OTP email to:', email);
    try {
      const emailResult = await sendOtpEmail(email, otp);
      console.log('Email sent successfully. Message ID:', emailResult.messageId);
      
      // For development/testing, log the OTP
      console.log('OTP for testing:', otp);
      
    } catch (error) {
      const emailError = error as Error;
      console.error('Failed to send email. Error details:', {
        message: emailError.message,
        stack: emailError.stack,
        email: email,
        time: new Date().toISOString()
      });
      // Continue even if email fails, as the OTP is already stored
    }

    return NextResponse.json(
      { message: 'If an account with this email exists, a password reset OTP has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
