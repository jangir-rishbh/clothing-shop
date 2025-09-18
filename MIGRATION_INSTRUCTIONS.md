# Fix for User Ban Functionality

## Problem
The user ban functionality is failing with the error:
```
Could not find the 'is_banned' column of 'users' in the schema cache
```

This is because the `is_banned` column is missing from the `users` table in the database.

## Solution
A new migration file has been created: `supabase/migrations/20250918_add_is_banned_to_users.sql`

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the following SQL:

```sql
-- Add is_banned column to users table
alter table public.users add column if not exists is_banned boolean not null default false;

-- Add index for efficient querying of banned users
create index if not exists idx_users_is_banned on public.users (is_banned);

-- Add a comment to document the column
comment on column public.users.is_banned is 'Indicates whether the user is banned from the platform';
```

4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI (if configured)
If you have the Supabase CLI configured locally:
```bash
supabase db push
```

## What This Migration Does
1. Adds the `is_banned` boolean column to the `users` table with a default value of `false`
2. Creates an index on the `is_banned` column for efficient querying
3. Adds documentation for the column

## After Migration
Once the migration is applied, the user ban/unban functionality should work correctly:
- Users can be banned/unbanned from the admin panel
- The ban status will be displayed correctly in the users list
- The API endpoint `/api/admin/users/ban` will function properly

## Verification
After applying the migration, you can verify it worked by:
1. Going to the admin users page
2. Trying to ban/unban a user
3. The operation should complete successfully without errors
