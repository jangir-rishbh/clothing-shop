import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { name, mobile, gender, state, two_factor_enabled } = body || {};

    const updates: Record<string, string | null | boolean> = {};
    if (typeof name === 'string') updates.name = name;
    if (typeof mobile === 'string' || mobile === null) updates.mobile = mobile ?? null;
    if (typeof gender === 'string' || gender === null) updates.gender = gender ?? null;
    if (typeof state === 'string' || state === null) updates.state = state ?? null;
    if (typeof two_factor_enabled === 'boolean') updates.two_factor_enabled = two_factor_enabled;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', admin!.id)
      .select('id, email, name, mobile, gender, state, role, is_banned, two_factor_enabled')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated', user: data });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}
