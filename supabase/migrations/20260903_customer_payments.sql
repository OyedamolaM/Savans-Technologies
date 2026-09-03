create table if not exists public.customer_users (
  email text primary key,
  name text not null,
  password_hash text not null,
  salt text not null,
  email_verified boolean not null default false,
  verification_token text unique,
  reset_token text unique,
  reset_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  token text primary key,
  email text not null,
  role text not null check (role in ('admin', 'customer')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists app_sessions_expires_at_idx on public.app_sessions (expires_at);

create table if not exists public.payment_records (
  reference text primary key,
  status text not null check (status = 'success'),
  amount_kobo bigint not null check (amount_kobo > 0),
  amount_naira numeric(14, 2) not null check (amount_naira > 0),
  currency text not null,
  customer_name text,
  customer_email text,
  plan text,
  payment_type text,
  paid_at timestamptz not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists payment_records_customer_email_idx
  on public.payment_records (lower(customer_email));
create index if not exists payment_records_paid_at_idx on public.payment_records (paid_at desc);

-- All database access is made with the server-only service-role key. These tables
-- are not available to browsers through the Supabase Data API.
alter table public.customer_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.payment_records enable row level security;
