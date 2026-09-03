create table if not exists public.payment_attempts (
  reference text primary key,
  status text not null check (status in ('initiated', 'pending', 'success', 'failed', 'abandoned', 'reversed')),
  amount_kobo bigint not null check (amount_kobo > 0),
  amount_naira numeric(14, 2) not null check (amount_naira > 0),
  currency text not null,
  customer_name text,
  customer_email text,
  plan text,
  payment_type text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_attempts_updated_at_idx
  on public.payment_attempts (updated_at desc);

alter table public.payment_attempts enable row level security;
