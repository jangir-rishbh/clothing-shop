import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Get admin user from session
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

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { contact_submission_id, admin_reply } = await request.json();

    if (!contact_submission_id || !admin_reply || typeof admin_reply !== 'string' || admin_reply.trim().length === 0) {
      return NextResponse.json({ error: 'Contact submission ID and admin reply are required' }, { status: 400 });
    }

    if (admin_reply.length > 1000) {
      return NextResponse.json({ error: 'Reply too long (max 1000 characters)' }, { status: 400 });
    }

    // Insert reply
    const { data, error } = await supabase
      .from('replies')
      .insert([
        {
          contact_submission_id: parseInt(contact_submission_id),
          admin_reply: admin_reply.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating reply:', error);
      return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
    }

    // Update the contact submission status to in_progress
    await supabase
      .from('contact_submissions')
      .update({ 
        status: 'in_progress',
        is_read: true 
      })
      .eq('id', contact_submission_id);

    return NextResponse.json({ reply: data });
  } catch (error) {
    console.error('Error in POST /api/admin/replies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get admin user from session
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

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const contactSubmissionId = searchParams.get('contact_submission_id');

    if (!contactSubmissionId) {
      return NextResponse.json({ error: 'Contact submission ID is required' }, { status: 400 });
    }

    // Fetch replies for a specific contact submission
    const { data: replies, error } = await supabase
      .from('replies')
      .select('*')
      .eq('contact_submission_id', contactSubmissionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching replies:', error);
      return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
    }

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('Error in GET /api/admin/replies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
