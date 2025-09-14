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
    console.log('=== Starting OTP Request ===');
    const requestBody = await request.text();
    console.log('Raw request body:', requestBody);
    
    let email, purpose;
    try {
      const json = JSON.parse(requestBody);
      email = json.email;
      purpose = json.purpose || 'verification';
      console.log('Parsed request:', { email, purpose });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

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
    const expiresAtISO = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    console.log('Storing OTP for email:', email, 'expires at:', expiresAtISO);

    // Check if an OTP already exists for this email
    console.log('Checking for existing OTPs for email:', email);
    const { data: existingOtp, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    console.log('Existing OTP check result:', { existingOtp, fetchError });
    
    let data, error;
    const otpData = {
      email,
      otp,
      expires_at: expiresAtISO,
      created_at: new Date().toISOString()
    };
    
    console.log('OTP data to be used:', JSON.stringify(otpData, null, 2));
    
    if (existingOtp) {
      // Update existing OTP record
      console.log('Updating existing OTP for email:', email);
      const result = await supabaseAdmin
        .from('otp_verifications')
        .update(otpData)
        .eq('id', existingOtp.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new OTP
      console.log('Inserting new OTP for email:', email);
      const result = await supabaseAdmin
        .from('otp_verifications')
        .insert(otpData)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    console.log('OTP storage result:', { data, error });

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
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'OTP Service'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}\nThis code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your OTP Code</h2>
            <p>Your one-time verification code is:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 15px; background: #f5f5f5; display: inline-block; border-radius: 5px;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `,
      };

      console.log('Sending email to:', email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails, as OTP is already stored
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
