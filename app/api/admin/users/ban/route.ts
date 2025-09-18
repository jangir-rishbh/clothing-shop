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
    const { userId, ban } = await request.json();

    if (!userId || typeof ban !== 'boolean') {
      return NextResponse.json({ error: 'userId and ban are required' }, { status: 400 });
    }
    if (userId === admin!.id) {
      return NextResponse.json({ error: 'You cannot ban yourself' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase env missing for ban route:', { hasUrl: !!supabaseUrl, hasServiceKey: !!supabaseServiceKey });
      return NextResponse.json({ error: 'Server not configured (Supabase env missing)' }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ is_banned: ban, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error banning user:', error);
      throw error;
    }

    return NextResponse.json({ message: ban ? 'User banned' : 'User unbanned' });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const generic = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    const message = e instanceof Error ? e.message : generic;
    return NextResponse.json({ error: message }, { status });
  }
}
