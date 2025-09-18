import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Expected table schema:
// create table if not exists public.custom_products (
//   id text primary key,
//   name text not null,
//   price numeric not null,
//   image text,
//   category text not null,
//   description text,
//   created_at timestamptz default now()
// );

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, name, price, category, description } = body || {};

    if (!id || !name || typeof price !== 'number' || !category) {
      return NextResponse.json({ error: 'id, name, price, category are required' }, { status: 400 });
    }

    const { data: existing, error: exErr } = await supabaseAdmin
      .from('custom_products')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (exErr) {
      console.error('Check existing error:', exErr);
    }
    if (existing) {
      return NextResponse.json({ error: 'A product with this id already exists' }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin
      .from('custom_products')
      .insert([{ id, name, price, image: null, category, description: description || null }])
      .select('id, name, price, image, category, description')
      .single();

    if (error) {
      console.error('Create product error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 500;
    const msg = status === 401 ? 'Not authenticated' : status === 403 ? 'Access denied' : 'Server error';
    return NextResponse.json({ error: msg }, { status });
  }
}


