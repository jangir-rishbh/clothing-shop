import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/session';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? await verifySession(token) : null;
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { label, line1, line2, city, state, pincode, is_default } = body;

    if (is_default) {
      await supabaseAdmin.from('addresses').update({ is_default: false }).eq('user_id', payload.uid);
    }

    const { error } = await supabaseAdmin
      .from('addresses')
      .update({ label, line1, line2, city, state, pincode, is_default: !!is_default })
      .eq('id', id)
      .eq('user_id', payload.uid);

    if (error) return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    return NextResponse.json({ message: 'Address updated' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? await verifySession(token) : null;
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { error } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', payload.uid);

    if (error) return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    return NextResponse.json({ message: 'Address deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
