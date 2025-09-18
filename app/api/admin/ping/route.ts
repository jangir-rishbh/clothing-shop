import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await requireAdmin();
    return NextResponse.json({ ok: true, admin: { id: admin!.id, email: admin!.email } });
  } catch (e: unknown) {
    const status = e instanceof Response ? e.status : 401;
    return NextResponse.json({ ok: false, error: status === 403 ? 'Access Denied' : 'Unauthorized' }, { status });
  }
}
