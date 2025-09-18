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
      .from('product_overrides')
      .select('product_id, image');
    if (error) throw error;
    return NextResponse.json({ overrides: data || [] }, { status: 200 });
  } catch (e: unknown) {
    console.error('Error fetching overrides:', e);
    return NextResponse.json({ overrides: [] }, { status: 200 });
  }
}


