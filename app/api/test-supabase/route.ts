import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey ? createClient(
  supabaseUrl!,
  supabaseServiceKey!
) : null;

export async function GET() {
  // Check environment variables first
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json(
      { 
        error: 'Supabase configuration missing',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey
        }
      },
      { status: 500 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      { 
        error: 'Supabase client initialization failed'
      },
      { status: 500 }
    );
  }

  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service Role Key exists:', !!supabaseServiceKey);

    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    console.log('Supabase test response:', { data, error });

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase connection failed', 
          details: error.message,
          url: supabaseUrl,
          hasKey: !!supabaseServiceKey
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Supabase connection successful',
      data: data,
      url: supabaseUrl,
      hasKey: !!supabaseServiceKey
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
