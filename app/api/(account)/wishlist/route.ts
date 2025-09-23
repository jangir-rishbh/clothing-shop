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
      .from('wishlist')
      .select('product_id, created_at')
      .eq('user_id', payload.uid)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    return NextResponse.json({ wishlist: data || [] });
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
    const { product_id } = body as { product_id?: string };
    if (!product_id) return NextResponse.json({ error: 'product_id is required' }, { status: 400 });

    // Toggle: if exists -> delete, else -> insert
    const { data: existing } = await supabaseAdmin
      .from('wishlist')
      .select('id')
      .eq('user_id', payload.uid)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin.from('wishlist').delete().eq('id', (existing as { id: string }).id);
      return NextResponse.json({ removed: true });
    } else {
      const { error } = await supabaseAdmin.from('wishlist').insert({ user_id: payload.uid, product_id });
      if (error) return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
      return NextResponse.json({ added: true });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
