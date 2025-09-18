-- Add is_banned column to users table
alter table public.users add column if not exists is_banned boolean not null default false;

-- Add index for efficient querying of banned users
create index if not exists idx_users_is_banned on public.users (is_banned);

-- Add a comment to document the column
comment on column public.users.is_banned is 'Indicates whether the user is banned from the platform';
