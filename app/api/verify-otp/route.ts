import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  console.log('=== OTP Verification Request ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    // Parse the request body
    let requestBody;
    try {
      const text = await request.text();
      console.log('Raw request body:', text);
      requestBody = text ? JSON.parse(text) : {};
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      const errorMessage = 'Error parsing request body';
      console.error(errorMessage, error);
      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'INVALID_JSON',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { email, otp, purpose } = requestBody;
    console.log('Verification request details:', { 
      email: email ? `${email.substring(0, 3)}...${email.split('@')[1] || ''}` : 'none',
      otpLength: otp ? otp.length : 0,
      purpose: purpose || 'not specified'
    });

    // Validate required fields
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!otp) missingFields.push('OTP');
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.error(errorMessage);
      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'MISSING_FIELDS',
          missingFields
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Clean up any expired OTPs first
    const { error: cleanupError } = await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (cleanupError) {
      console.error('Error cleaning up expired OTPs:', cleanupError);
      // Continue execution as this is not a critical error
    }

    // First, get all OTPs for this email for debugging
    const { data: allOtps } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email);

    console.log('Found OTPs for email:', {
      count: allOtps?.length || 0,
      otps: allOtps?.map(otp => ({
        id: otp.id,
        otp: `${otp.otp.substring(0, 2)}...`,
        verified: otp.verified,
        expires_at: otp.expires_at,
        created_at: otp.created_at
      }))
    });

    // Then get the specific OTP
    const { data: otpData, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching OTP:', {
        email,
        otp: `${otp.substring(0, 2)}...`,
        error: fetchError
      });
      
      return NextResponse.json(
        { 
          error: 'An error occurred while verifying your OTP. Please try again.',
          code: 'OTP_FETCH_ERROR',
          details: fetchError?.message
        },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!otpData) {
      console.error('No matching OTP found:', {
        email,
        otp: `${otp.substring(0, 2)}...`
      });
      
      return NextResponse.json(
        { 
          error: 'The OTP you entered is incorrect or has expired. Please request a new one.',
          code: 'INVALID_OTP',
          details: 'No matching OTP record found',
          suggestion: 'Please request a new OTP if you haven\'t received one or if it has expired.'
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    const isExpired = now > expiresAt;

    console.log('OTP validation:', {
      storedOTP: `${otpData.otp.substring(0, 2)}...`,
      verified: otpData.verified,
      expiresAt: otpData.expires_at,
      currentTime: now.toISOString(),
      isExpired,
      timeRemaining: isExpired ? 'expired' : `${Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)} seconds`
    });
    
    if (isExpired) {
      console.error('OTP has expired');
      // Delete expired OTP
      const { error: deleteError } = await supabaseAdmin
        .from('otp_verifications')
        .delete()
        .eq('email', email);
      
      if (deleteError) {
        console.error('Error deleting expired OTP:', deleteError);
      }
      
      return NextResponse.json(
        { 
          error: 'This OTP has expired. Please request a new one.',
          code: 'OTP_EXPIRED',
          details: `OTP expired at ${expiresAt.toISOString()}`
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      console.error('Invalid OTP provided');
      return NextResponse.json(
        { 
          error: 'The OTP you entered is incorrect. Please try again or request a new OTP.',
          code: 'INVALID_OTP'
        },
        { status: 400 }
      );
    }

    // First, check if OTP is already verified
    if (otpData.verified) {
      console.log('OTP already verified at:', otpData.verified_at);
      // Continue with the flow even if already verified
    } else {
      // Mark the OTP as verified and update the record
      try {
        // First try with the new schema that includes verified columns
        const updateData = { 
          verified: true, 
          verified_at: new Date().toISOString(),
          // Set a new expiration time for the verification (10 minutes from now)
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        };
        
        console.log('Updating OTP with data:', updateData);
        
        const { error: updateError } = await supabaseAdmin
          .from('otp_verifications')
          .update(updateData)
          .eq('id', otpData.id);

        if (updateError) {
          // If error is about missing columns, try with just the expiration update
          if (updateError.message && updateError.message.includes("Could not find the 'verified' column")) {
            console.warn('Verified column not found, falling back to expiration update only');
            const fallbackUpdateData = {
              expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            };
            
            const { error: fallbackError } = await supabaseAdmin
              .from('otp_verifications')
              .update(fallbackUpdateData)
              .eq('id', otpData.id);
              
            if (fallbackError) {
              console.error('Error in fallback update:', fallbackError);
              throw new Error(`Failed to update OTP: ${fallbackError.message}`);
            }
          } else {
            console.error('Error updating OTP verification status:', updateError);
            throw new Error(`Failed to update OTP verification status: ${updateError.message}`);
          }
        }
        
        console.log('Successfully updated OTP verification status');
      } catch (updateError) {
        console.error('Error in OTP verification update:', updateError);
        throw new Error(`Failed to update OTP: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
      }
    }

    console.log('OTP verified successfully for email:', email);
    // Get the updated OTP record
    const { data: updatedOtp } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('id', otpData.id)
      .single();

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully',
      verified: true,
      otpId: otpData.id,
      otpData: updatedOtp
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while verifying your OTP. Please try again.',
        code: 'VERIFICATION_ERROR'
      },
      { status: 500 }
    );
  }
}
