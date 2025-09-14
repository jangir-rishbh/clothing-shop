-- Add verified and verified_at columns to otp_verifications table
ALTER TABLE public.otp_verifications
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to have verified set to false
UPDATE public.otp_verifications
SET verified = FALSE
WHERE verified IS NULL;