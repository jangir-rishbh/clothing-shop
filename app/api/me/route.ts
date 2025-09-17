import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : '';
    const payload = token ? verifySession(token) : null;

    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, mobile, gender, state')
      .eq('id', payload.uid)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('Error in /api/me:', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
