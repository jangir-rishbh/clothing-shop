import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { signSession } from '@/lib/session';
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
    const { email, password, otp } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in custom users table
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, name, mobile, gender, state, role, is_banned, email_verified_at')
      .eq('email', String(email).toLowerCase())
      .single();

    if (error) {
      console.error('DB error fetching user:', error);
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is banned
    if (user.is_banned) {
      return NextResponse.json(
        { error: 'Your account has been banned. Please contact support for assistance.' },
        { status: 403 }
      );
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Require email verification for admins only
    const userRole = (user as { role?: 'admin' | 'user' }).role || 'user';
    if (userRole === 'admin' && !(user as { email_verified_at?: string | null }).email_verified_at) {
      return NextResponse.json(
        { error: 'Admin email not verified. Please verify your email before logging in.' },
        { status: 403 }
      );
    }

    // Admin: enforce OTP step before issuing session
    if (userRole === 'admin') {
      // If OTP not provided, generate and email it, then return requiresOtp
      if (!otp) {
        const generatedOtp = generateSixDigitOtp();

        // Upsert OTP record with purpose 'admin_login'
        const expiresAtISO = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const { data: existingOtp } = await supabaseAdmin
          .from('otp_verifications')
          .select('id')
          .eq('email', user.email.toLowerCase())
          .maybeSingle();

        const otpData = {
          email: user.email.toLowerCase(),
          otp: generatedOtp,
          expires_at: expiresAtISO,
          created_at: new Date().toISOString(),
          purpose: 'admin_login'
        } as const;

        if (existingOtp) {
          await supabaseAdmin
            .from('otp_verifications')
            .update(otpData)
            .eq('id', existingOtp.id);
        } else {
          await supabaseAdmin
            .from('otp_verifications')
            .insert(otpData);
        }

        // Send OTP email
        try {
          await sendOtpEmail(user.email, generatedOtp);
        } catch (e) {
          console.error('Failed to send admin login OTP email:', e);
          return NextResponse.json(
            { error: 'Failed to send OTP. Please try again later.' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          requiresOtp: true,
          message: 'OTP sent to your email for admin login verification.'
        });
      } else {
        // OTP provided: verify it
        const { data: otpData, error: fetchError } = await supabaseAdmin
          .from('otp_verifications')
          .select('*')
          .eq('email', user.email.toLowerCase())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !otpData) {
          return NextResponse.json(
            { error: 'No OTP found. Please request a new OTP.' },
            { status: 400 }
          );
        }

        const now = new Date();
        const expiresAt = new Date(otpData.expires_at);
        if (now > expiresAt) {
          // Clean up expired
          await supabaseAdmin.from('otp_verifications').delete().eq('id', otpData.id);
          return NextResponse.json(
            { error: 'OTP expired. Please request a new one.' },
            { status: 400 }
          );
        }

        if (otpData.otp !== String(otp)) {
          return NextResponse.json(
            { error: 'Invalid OTP. Please try again.' },
            { status: 400 }
          );
        }

        // Optional: verify purpose matches admin_login
        // if (otpData.purpose && otpData.purpose !== 'admin_login') { ... }

        // Consume OTP (delete it)
        await supabaseAdmin.from('otp_verifications').delete().eq('id', otpData.id);
      }
    }

    // Issue session cookie including role
    const token = await signSession({ uid: user.id, email: user.email, role: userRole });
    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        state: user.state,
        role: (user as { role?: 'admin' | 'user' }).role || 'user',
      },
    });
    res.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err: unknown) {
    console.error('Error in login:', err);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
