-- Add missing columns to profiles to match app expectations
alter table if exists public.profiles
  add column if not exists phone text,
  add column if not exists gender text,
  add column if not exists state text;


