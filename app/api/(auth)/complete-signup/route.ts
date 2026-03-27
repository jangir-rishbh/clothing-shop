import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get pending user data from cookie
    const cookieHeader = request.headers.get('cookie');
    const pendingUserCookie = cookieHeader?.split('; ')
      .find(cookie => cookie.trim().startsWith('pendingUser='))
      ?.split('=')[1];
    
    let pendingUser = null;
    
    if (pendingUserCookie) {
      try {
        pendingUser = JSON.parse(decodeURIComponent(pendingUserCookie));
      } catch (error) {
        console.error('Failed to parse pending user cookie:', error);
      }
    }

    if (!pendingUser) {
      return NextResponse.json(
        { error: 'User session not found. Please restart the signup process.' },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create user in the custom users table
    console.log('Creating user with data:', {
      email: pendingUser.email,
      name: pendingUser.name,
      mobile: pendingUser.mobile,
      gender: pendingUser.gender,
      state: pendingUser.state,
      hasPasswordHash: !!passwordHash
    });

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        email: pendingUser.email,
        password_hash: passwordHash,
        name: pendingUser.name,
        mobile: pendingUser.mobile,
        gender: pendingUser.gender,
        state: pendingUser.state,
        email_verified_at: new Date().toISOString()
      })
      .select()
      .single();

    console.log('Supabase response:', { userData, userError });

    if (userError) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        { error: userError.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    // Clear the pending user cookie
    const response = NextResponse.json(
      { 
        message: 'Account created successfully',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: 'user'
        }
      },
      { status: 200 }
    );

    // Clear pending user cookie
    response.cookies.set('pendingUser', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Complete signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
