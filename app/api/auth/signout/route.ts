import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear any authentication cookies or tokens
    const response = NextResponse.json({ success: true });
    
    // Clear auth token cookie if it exists
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Failed to sign out' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
