import { NextResponse } from 'next/server';
import { sendOtpEmail } from '@/lib/email';

export async function GET() {
  const testEmail = process.env.NEXT_PUBLIC_GMAIL_EMAIL;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!testEmail || !appPassword) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'GMAIL_EMAIL is not configured in environment variables',
        config: {
          email: process.env.NEXT_PUBLIC_GMAIL_EMAIL ? 'Configured' : 'Not Configured',
          appPassword: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Not Configured'
        }
      },
      { status: 500 }
    );
  }

  try {
    const result = await sendOtpEmail(testEmail, '123456');
    return NextResponse.json({
      status: 'success',
      message: 'Test email sent successfully',
      details: result
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      status: 'error',
      message: 'Failed to send test email',
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
