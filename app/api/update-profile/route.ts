import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, gender, state } = await request.json();

    // Get current user from session cookie
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'No active session found' }, { status: 401 });
    }

    // Update user profile in custom users table
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: name || undefined,
        mobile: mobile || undefined,
        gender: gender || undefined,
        state: state || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });

  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
