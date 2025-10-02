import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

const dataFile = path.join(process.cwd(), 'data', 'notice.json');

export async function GET() {
  await requireAdmin();
  try {
    const raw = await fs.readFile(dataFile, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json, { status: 200 });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === 'ENOENT') {
      // Return default if file not found
      return NextResponse.json({ message: '', startDate: '', endDate: '', active: false }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to read notice' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await requireAdmin();
  try {
    const body = await req.json();
    const { message = '', startDate = '', endDate = '', active = false } = body || {};

    const payload = { message, startDate, endDate, active };
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, notice: payload }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to save notice' }, { status: 500 });
  }
}
