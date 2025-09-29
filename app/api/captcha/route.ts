import { NextResponse } from 'next/server';
import { captchaToSvg, generateAlphaCode, signCaptcha } from '@/lib/captcha';

export async function GET() {
  const code = generateAlphaCode(5);
  const exp = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes
  const token = signCaptcha({ code, exp });
  const svg = captchaToSvg(code);
  return NextResponse.json({ svg, token, length: 5, type: 'numeric' });
}
