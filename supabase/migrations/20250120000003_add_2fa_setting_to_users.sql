-- Add 2FA setting column to users table
alter table public.users add column if not exists two_factor_enabled boolean not null default true;

-- Add index for efficient querying of 2FA settings
create index if not exists idx_users_two_factor_enabled on public.users (two_factor_enabled);

-- Add a comment to document the column
comment on column public.users.two_factor_enabled is 'Indicates whether two-factor authentication (email OTP) is enabled for the user';
