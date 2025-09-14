-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved'))
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Enable insert for public" ON public.contact_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy to restrict read access (admin only)
CREATE POLICY "Enable read access for admin only" ON public.contact_submissions
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');
