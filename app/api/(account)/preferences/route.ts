import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? await verifySession(token) : null;
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', payload.uid)
      .maybeSingle();

    if (error) return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    return NextResponse.json({ preferences: data || null });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? await verifySession(token) : null;
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { size, categories, brands, colors, currency, theme } = body;

    const upsertData = { user_id: payload.uid, size: size || null, categories: categories || null, brands: brands || null, colors: colors || null, currency: currency || 'INR', theme: theme || null, updated_at: new Date().toISOString() };

    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .upsert(upsertData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    return NextResponse.json({ preferences: data });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
