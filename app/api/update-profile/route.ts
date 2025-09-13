import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, full_name } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Update the user's metadata
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      data: { full_name }
    });

    if (userError) throw userError;

    // Update the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id,
        full_name,
        updated_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userData.user,
      profile: profileData
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
