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
      .from('product_overrides')
      .select('product_id, image');
    if (error) throw error;
    return NextResponse.json({ overrides: data || [] });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { productId, image } = await request.json();
    if (!productId || typeof image !== 'string') {
      return NextResponse.json({ error: 'productId and image are required' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('product_overrides')
      .upsert({ product_id: productId, image, updated_at: new Date().toISOString() }, { onConflict: 'product_id' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


