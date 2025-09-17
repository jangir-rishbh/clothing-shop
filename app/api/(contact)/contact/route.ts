import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        { 
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          message: message
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to submit contact form. Please try again later.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully!',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
