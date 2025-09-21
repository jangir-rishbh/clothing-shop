import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
    const { name, mobile, gender, state, two_factor_enabled } = await request.json();
    
    // Get the current session using custom session system
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? await verifySession(token) : null;
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const updates: Record<string, string | null | boolean> = {};
    if (typeof name === 'string') updates.name = name.trim();
    if (typeof mobile === 'string' || mobile === null) updates.mobile = mobile?.trim() || null;
    if (typeof gender === 'string' || gender === null) updates.gender = gender?.trim() || null;
    if (typeof state === 'string' || state === null) updates.state = state?.trim() || null;
    if (typeof two_factor_enabled === 'boolean') updates.two_factor_enabled = two_factor_enabled;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update the users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', payload.uid)
      .select('id, email, name, mobile, gender, state, role, is_banned, two_factor_enabled')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: data
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
