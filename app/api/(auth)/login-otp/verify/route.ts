import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signSession } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const otpStr = String(otp).trim();

    const { data: otpData, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpData) {
      return NextResponse.json({ error: 'No OTP found. Please request a new OTP.' }, { status: 400 });
    }

    const expiresAt = new Date(otpData.expires_at);
    if (Date.now() > expiresAt.getTime()) {
      await supabaseAdmin.from('otp_verifications').delete().eq('id', otpData.id);
      return NextResponse.json({ error: 'OTP expired. Please request a new OTP.' }, { status: 400 });
    }

    if (String(otpData.otp) !== otpStr) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // consume otp
    await supabaseAdmin.from('otp_verifications').delete().eq('id', otpData.id);

    // fetch user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, mobile, gender, state, role, is_banned')
      .eq('email', normalizedEmail)
      .single();

    if (userError || !user) {
      console.error('DB error fetching user after otp verify:', userError);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    if ((user as { is_banned?: boolean }).is_banned) {
      return NextResponse.json(
        { error: 'Your account has been banned. Please contact support for assistance.' },
        { status: 403 }
      );
    }

    const role = (user as { role?: 'admin' | 'user' }).role || 'user';
    const token = await signSession({ uid: user.id, email: user.email, role });

    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        state: user.state,
        role,
      },
    });

    res.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('Error in login-otp verify:', err);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
