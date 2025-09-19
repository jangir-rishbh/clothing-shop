import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const userResponse = await fetch(`${request.nextUrl.origin}/api/me`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await userResponse.json();
    const user = userData.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch messages for the user from contact_submissions table with replies
    const { data: messages, error } = await supabase
      .from('contact_submissions')
      .select(`
        *,
        replies (
          id,
          admin_reply,
          created_at
        )
      `)
      .eq('email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const userResponse = await fetch(`${request.nextUrl.origin}/api/me`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await userResponse.json();
    const user = userData.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message too long (max 1000 characters)' }, { status: 400 });
    }

    // Insert message into contact_submissions table
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          first_name: user.name || 'User',
          last_name: '',
          email: user.email,
          phone: user.mobile || null,
          message: message.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
