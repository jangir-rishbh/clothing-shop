import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('product_overrides')
      .delete()
      .eq('product_id', id);

    if (error) {
      console.error('Remove override error:', error);
      return NextResponse.json({ error: error.message || 'Failed to remove image' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image override removed' });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


