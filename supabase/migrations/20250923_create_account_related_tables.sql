-- Addresses table
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  label text,
  line1 text not null,
  line2 text,
  city text,
  state text,
  pincode text,
  is_default boolean default false,
  created_at timestamptz default now(),
  constraint fk_addresses_user foreign key (user_id) references public.users (id) on delete cascade
);
create index if not exists idx_addresses_user on public.addresses(user_id);

-- Wishlist table
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  product_id text not null,
  created_at timestamptz default now(),
  constraint uq_wishlist unique (user_id, product_id),
  constraint fk_wishlist_user foreign key (user_id) references public.users (id) on delete cascade
);
create index if not exists idx_wishlist_user on public.wishlist(user_id);

-- User Preferences table
create table if not exists public.user_preferences (
  user_id uuid primary key,
  size text check (size in ('S','M','L','XL') or size is null),
  categories text[],
  brands text[],
  colors text[],
  currency text default 'INR',
  theme text check (theme in ('light','dark') or theme is null),
  updated_at timestamptz default now(),
  constraint fk_prefs_user foreign key (user_id) references public.users (id) on delete cascade
);

-- Notification Settings table
create table if not exists public.notification_settings (
  user_id uuid primary key,
  email_offers boolean default true,
  email_orders boolean default true,
  sms_updates boolean default false,
  whatsapp_updates boolean default false,
  push_enabled boolean default false,
  updated_at timestamptz default now(),
  constraint fk_notif_user foreign key (user_id) references public.users (id) on delete cascade
);
