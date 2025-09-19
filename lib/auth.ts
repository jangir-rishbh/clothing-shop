import { cookies } from 'next/headers';
import { verifySession, SessionPayload } from '@/lib/session';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  mobile?: string | null;
  gender?: string | null;
  state?: string | null;
  role: 'admin' | 'user';
} | null;

export async function getCurrentUserFromCookie(): Promise<CurrentUser> {
  const store = await cookies();
  const token = store.get('session')?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, mobile, gender, state, role')
    .eq('id', payload.uid)
    .single();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    gender: user.gender,
    state: user.state,
    role: (user as { role?: 'admin' | 'user' }).role || 'user',
  };
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  if (user.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 });
  }
  return user;
}

export async function extractSessionFromRequestCookie(req: Request): Promise<SessionPayload | null> {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : '';
  return token ? await verifySession(token) : null;
}
