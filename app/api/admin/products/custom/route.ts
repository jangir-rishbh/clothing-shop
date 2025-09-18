import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from('custom_products')
      .select('id, name, price, image, category, description, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data || [] }, { status: 200 });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


