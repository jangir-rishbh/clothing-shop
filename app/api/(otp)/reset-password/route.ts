import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Get user from custom users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 400 }
      );
    }

    // Hash new password and update users table
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateUserError) {
      console.error('Error updating password:', updateUserError);
      throw new Error('Failed to update password');
    }

    // Mark OTP as used and/or clean up
    await supabase
      .from('otp_verifications')
      .update({ 
        verified: true, 
        verified_at: new Date().toISOString()
      })
      .eq('id', otpData.id);

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}
