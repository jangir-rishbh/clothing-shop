import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, is_banned')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error('DB error checking email:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    if ((user as { is_banned?: boolean }).is_banned) {
      return NextResponse.json({ exists: true, banned: true });
    }

    return NextResponse.json({ exists: true });
  } catch (err) {
    console.error('Error in check-email:', err);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
