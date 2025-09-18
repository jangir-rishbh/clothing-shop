import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = 'product-images';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const productId = String(form.get('productId') || '')
      .trim();
    const file = form.get('file') as File | null;

    if (!productId || !file) {
      return NextResponse.json({ error: 'productId and file are required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${productId}/${Date.now()}.${ext}`;

    // Upload to storage
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, file, { upsert: false, contentType: file.type || undefined });
    if (upErr) {
      console.error('Upload error:', upErr);
      return NextResponse.json({ error: upErr.message || 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const { data: pub } = await supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    const publicUrl = pub?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json({ error: 'Could not get public URL' }, { status: 500 });
    }

    // Save override
    const { error: dbErr } = await supabaseAdmin
      .from('product_overrides')
      .upsert({ product_id: productId, image: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'product_id' });
    if (dbErr) {
      console.error('Override save error:', dbErr);
      return NextResponse.json({ error: dbErr.message || 'Failed to save override' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, image: publicUrl });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


