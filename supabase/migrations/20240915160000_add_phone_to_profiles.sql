-- Add phone column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create an index on phone for faster lookups
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles(phone);

-- Add a comment to the column
COMMENT ON COLUMN profiles.phone IS 'Stores user phone number with country code (e.g., +911234567890)';
