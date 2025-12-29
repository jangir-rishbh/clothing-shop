import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOtpEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function generateSixDigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // ensure user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, role, is_banned')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (userError) {
      console.error('DB error fetching user:', userError);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if ((user as { is_banned?: boolean }).is_banned) {
      return NextResponse.json(
        { error: 'Your account has been banned. Please contact support for assistance.' },
        { status: 403 }
      );
    }

    const otp = generateSixDigitOtp();
    const expiresAtISO = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // upsert otp for login
    const { data: existingOtp } = await supabaseAdmin
      .from('otp_verifications')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const otpData = {
      email: normalizedEmail,
      otp,
      expires_at: expiresAtISO,
      created_at: new Date().toISOString(),
      purpose: 'login_otp',
    } as const;

    if (existingOtp) {
      const { error: updateError } = await supabaseAdmin
        .from('otp_verifications')
        .update(otpData)
        .eq('id', existingOtp.id);

      if (updateError) {
        console.error('DB error updating otp:', updateError);
        return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('otp_verifications')
        .insert(otpData);

      if (insertError) {
        console.error('DB error inserting otp:', insertError);
        return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
      }
    }

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (e) {
      console.error('Failed to send OTP email:', e);
      return NextResponse.json({ error: 'Failed to send OTP. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in login-otp send:', err);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
