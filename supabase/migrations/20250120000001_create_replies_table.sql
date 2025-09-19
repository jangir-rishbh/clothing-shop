-- Create replies table for admin replies to messages
create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  contact_submission_id bigint not null references public.contact_submissions(id) on delete cascade,
  admin_reply text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for better performance
create index if not exists idx_replies_contact_submission_id on public.replies(contact_submission_id);
create index if not exists idx_replies_created_at on public.replies(created_at desc);

-- Trigger function to keep updated_at fresh
create or replace function public.set_replies_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to replies table
drop trigger if exists set_replies_updated_at on public.replies;
create trigger set_replies_updated_at
before update on public.replies
for each row execute procedure public.set_replies_updated_at();
