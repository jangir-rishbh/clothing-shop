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
      .from('notification_settings')
      .select('*')
      .eq('user_id', payload.uid)
      .maybeSingle();

    if (error) return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    return NextResponse.json({ notifications: data || null });
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
    const { email_offers, email_orders, sms_updates, whatsapp_updates, push_enabled } = body;

    type NotificationSettingsUpdate = {
      user_id: string;
      email_offers?: boolean;
      email_orders?: boolean;
      sms_updates?: boolean;
      whatsapp_updates?: boolean;
      push_enabled?: boolean;
      updated_at: string;
    };

    const upsertData: NotificationSettingsUpdate = {
      user_id: payload.uid,
      email_offers: typeof email_offers === 'boolean' ? email_offers : undefined,
      email_orders: typeof email_orders === 'boolean' ? email_orders : undefined,
      sms_updates: typeof sms_updates === 'boolean' ? sms_updates : undefined,
      whatsapp_updates: typeof whatsapp_updates === 'boolean' ? whatsapp_updates : undefined,
      push_enabled: typeof push_enabled === 'boolean' ? push_enabled : undefined,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('notification_settings')
      .upsert(upsertData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    return NextResponse.json({ notifications: data });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
