-- Create password_resets table for secure password recovery
CREATE TABLE IF NOT EXISTS public.password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_resets_token_hash ON public.password_resets (token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON public.password_resets (user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON public.password_resets (expires_at);

-- Create a function to clean up expired password reset tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_password_resets()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.password_resets 
  WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the cleanup function periodically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'trigger_cleanup_expired_password_resets'
  ) THEN
    CREATE TRIGGER trigger_cleanup_expired_password_resets
    AFTER INSERT OR UPDATE ON public.password_resets
    EXECUTE FUNCTION public.cleanup_expired_password_resets();
  END IF;
END $$;

-- Add a function to invalidate all existing password reset tokens for a user
CREATE OR REPLACE FUNCTION public.invalidate_user_password_resets(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.password_resets 
  SET used = TRUE 
  WHERE user_id = user_uuid AND used = FALSE;
END;
$$ LANGUAGE plpgsql;
