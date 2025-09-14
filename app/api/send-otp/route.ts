import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('Received OTP request for email:', email);

    if (!email) {
      console.error('No email provided in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Store OTP in the database
    console.log('Generated OTP:', otp, 'expires at:', expiresAt);

    const { error } = await supabaseAdmin
      .from('otp_verifications')
      .upsert(
        {
          email,
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error storing OTP in database:', error);
      throw error;
    }

    console.log('OTP stored successfully in database');

    // For development, log OTP to console
    console.log('Generated OTP for development:', otp);
    
    // Always try to send email in both development and production
    try {
      // Create Nodemailer transporter with Gmail service
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      } as const);

      // Check if SMTP credentials are configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials are not configured. Email will not be sent.');
        console.log('For development, use the OTP from console:', otp);
      } else {
        // Send email
        const info = await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || 'Your App'}" <${process.env.SMTP_USER}>`,
          to: email, // Using the email from request, not hardcoded
          subject: 'Your OTP Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Your OTP Code</h2>
              <p>Use the following OTP to verify your email:</p>
              <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 2px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This OTP is valid for 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          `
        });

        console.log('Email sent successfully:', info.messageId);
        console.log('Email sent to:', email);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request in development
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to send OTP email');
      } else {
        console.log('For development, use the OTP from console:', otp);
      }
    }

    console.log(`OTP email sent to ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
