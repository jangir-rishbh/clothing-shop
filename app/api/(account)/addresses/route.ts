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
      .from('addresses')
      .select('*')
      .eq('user_id', payload.uid)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    return NextResponse.json({ addresses: data || [] });
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

    const body = await request.json();
    const { label, line1, line2, city, state, pincode, is_default } = body;

    const insertData = { user_id: payload.uid, label, line1, line2, city, state, pincode, is_default: !!is_default };

    if (is_default) {
      await supabaseAdmin.from('addresses').update({ is_default: false }).eq('user_id', payload.uid);
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .insert(insertData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
    return NextResponse.json({ address: data });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
