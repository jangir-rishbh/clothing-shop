import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('custom_products')
      .select('id, name, price, image, category, description, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data || [] }, { status: 200 });
  } catch (e: unknown) {
    console.error('Error fetching custom products:', e);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}


