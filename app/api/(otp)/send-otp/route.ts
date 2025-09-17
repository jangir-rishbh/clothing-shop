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
    
    let email, purpose, name;
    try {
      const json = JSON.parse(requestBody);
      email = json.email;
      name = json.name || '';
      purpose = json.purpose || 'verification';
      console.log('Parsed request:', { email, purpose });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Check if email is provided
    if (!email) {
      console.error('No email provided in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // If this OTP request is for signup, ensure email is NOT already registered
    try {
      if ((purpose || '').toString().toLowerCase().includes('signup')) {
        const { data: existingUser, error: userCheckError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', String(email).toLowerCase())
          .maybeSingle();

        if (userCheckError) {
          console.error('Error checking existing user by email:', userCheckError);
          return NextResponse.json(
            { error: 'Server error while checking email' },
            { status: 500 }
          );
        }

        if (existingUser) {
          return NextResponse.json(
            { error: 'This email is already registered. Please log in instead.' },
            { status: 400 }
          );
        }
      }
    } catch (checkErr) {
      console.error('Unexpected error during email existence check:', checkErr);
      return NextResponse.json(
        { error: 'Server error while checking email' },
        { status: 500 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Store OTP in the database
    const expiresAtISO = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    // Function to store OTP for a given identifier (email or phone)
    const storeOtp = async (identifier: string, type: 'email' | 'phone') => {
      const identifierField = type === 'email' ? 'email' : 'phone';
      console.log(`Storing OTP for ${type}:`, identifier, 'expires at:', expiresAtISO);

      // Check if an OTP already exists for this identifier
      console.log(`Checking for existing OTPs for ${type}:`, identifier);
      const { data: existingOtp, error: fetchError } = await supabaseAdmin
        .from('otp_verifications')
        .select('id')
        .eq(identifierField, identifier)
        .maybeSingle();

      console.log(`Existing OTP check result for ${type}:`, { existingOtp, fetchError });
      
      const otpData = {
        [identifierField]: identifier,
        otp,
        expires_at: expiresAtISO,
        created_at: new Date().toISOString(),
        purpose
      };
      
      console.log('OTP data to be used:', JSON.stringify(otpData, null, 2));
      
      if (existingOtp) {
        // Update existing OTP record
        console.log(`Updating existing OTP for ${type}:`, identifier);
        const result = await supabaseAdmin
          .from('otp_verifications')
          .update(otpData)
          .eq('id', existingOtp.id)
          .select()
          .single();
        
        return { data: result.data, error: result.error };
      } else {
        // Insert new OTP
        console.log(`Inserting new OTP for ${type}:`, identifier);
        const result = await supabaseAdmin
          .from('otp_verifications')
          .insert(otpData)
          .select()
          .single();
        
        return { data: result.data, error: result.error };
      }
    };

    // Store OTP for email
    const { error: emailError } = await storeOtp(email.toLowerCase(), 'email');
    if (emailError) {
      console.error('Error storing email OTP:', emailError);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    console.log('OTP stored successfully in database');

    // For development, log OTP to console
    console.log('Generated OTP for development:', otp);
    
    // Send OTP via email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        debug: true
      });

      const mailOptions = {
        from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'Your App'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your OTP Code</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <p>Thanks,<br>Your App Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully');
    } catch (error) {
      console.error('Error in send-otp:', error);
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    console.log(`OTP email sent to ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
      deliveryMethod: 'email',
      deliveryTarget: email
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
