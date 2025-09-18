import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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
    // Parse the request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password, name, mobile, gender, state, otp } = requestBody;
    console.log('Completing signup for email:', email);

    if (!email || !password || !name || !mobile || !gender || !state || !otp) {
      console.error('Missing required fields in request');
      return NextResponse.json(
        { 
          error: 'All fields are required',
          missing: {
            email: !email,
            password: !password,
            name: !name,
            mobile: !mobile,
            gender: !gender,
            state: !state,
            otp: !otp
          }
        },
        { status: 400 }
      );
    }

    // First, get all OTPs for this email for debugging
    const { data: allOtps } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email);

    console.log('All OTPs for email during signup:', email, allOtps);

    // Find a matching OTP that's either verified or matches the provided OTP
    const otpData = allOtps?.find(otpRecord => 
      otpRecord.otp === otp || otpRecord.verified
    );

    if (!otpData) {
      console.error('No matching or verified OTP found for email:', email);
      return NextResponse.json(
        { 
          error: 'No matching or verified OTP found. Please complete the OTP verification first.',
          code: 'NO_MATCHING_OTP',
          availableOtps: allOtps?.map(o => ({ id: o.id, otp: o.otp, verified: o.verified, expires_at: o.expires_at }))
        },
        { status: 400 }
      );
    }

    console.log('Using OTP record:', {
      id: otpData.id,
      verified: otpData.verified,
      expires_at: otpData.expires_at
    });

    // Check if OTP is still valid
    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    
    if (now > expiresAt) {
      console.error('OTP has expired');
      return NextResponse.json(
        { 
          error: 'OTP has expired. Please request a new one.',
          code: 'OTP_EXPIRED'
        },
        { status: 400 }
      );
    }

    // Check if verification is still within time limit
    const verifiedAt = otpData.verified_at ? new Date(otpData.verified_at) : now;
    const verificationTimeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    if ((now.getTime() - verifiedAt.getTime()) > verificationTimeLimit) {
      console.error('OTP verification has expired');
      return NextResponse.json(
        { 
          error: 'OTP verification has expired. Please start the signup process again.',
          code: 'VERIFICATION_EXPIRED'
        },
        { status: 400 }
      );
    }

    // Hash password and insert into custom users table (no Auth)
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        mobile,
        gender,
        state,
        email_verified_at: verifiedAt.toISOString(),
        role: 'user',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting user into users table:', insertError);
      // Handle unique violation gracefully
      const msg = insertError.code === '23505' ? 'This email is already registered' : 'Failed to create user account';
      return NextResponse.json(
        { error: msg, details: insertError.message },
        { status: 400 }
      );
    }

    // Clean up all OTPs for this email after successful signup
    await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .eq('email', email);

    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: insertedUser.id,
        email: insertedUser.email,
        name: insertedUser.name || name,
        role: insertedUser.role || 'user',
      }
    });

  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
