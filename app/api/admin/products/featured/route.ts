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
      .from('featured_products')
      .select('product_id, featured');
    if (error) throw error;
    const featuredIds = (data || []).filter(r => r.featured).map(r => r.product_id);
    return NextResponse.json({ featured: featuredIds });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { productId, featured } = await request.json();
    if (!productId || typeof featured !== 'boolean') {
      return NextResponse.json({ error: 'productId and featured are required' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('featured_products')
      .upsert({ product_id: productId, featured, updated_at: new Date().toISOString() }, { onConflict: 'product_id' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


