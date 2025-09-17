import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      email: process.env.NEXT_PUBLIC_GMAIL_EMAIL ? 'Configured' : 'Not Configured',
      appPassword: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Not Configured',
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'Not Configured',
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
