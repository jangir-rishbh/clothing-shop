import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, full_name } = await request.json();
    const authHeader = request.headers.get('Authorization');
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // If we have an auth header, use it to set the session
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // Verify the user ID matches
      if (data.user.id !== id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    } else {
      // Fallback to session check if no auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }

      if (session.user.id !== id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }
    
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
      })
      .select()
      .single();

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
