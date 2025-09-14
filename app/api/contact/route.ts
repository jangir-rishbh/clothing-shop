import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    console.log('Received contact form submission request');
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Connecting to Supabase...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
    
    // Insert the contact form data into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        { 
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          message: message,
          created_at: new Date().toISOString()
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { 
          error: 'Failed to submit contact form',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data[0] 
    });

  } catch (error) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
