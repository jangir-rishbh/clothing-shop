import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromCookie } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, gender, state } = await request.json();

    // Get current user from custom session cookie
    const user = await getCurrentUserFromCookie();
    
    if (!user) {
      return NextResponse.json({ error: 'No active session found' }, { status: 401 });
    }

    // Update user profile in custom users table
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        name: name || undefined,
        mobile: mobile || undefined,
        gender: gender || undefined,
        state: state || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email)
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
