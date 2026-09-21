create table if not exists public.crm_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'website',
  kind text not null check (kind in ('estimate', 'feedback')),
  name text not null,
  phone text not null default '',
  email text not null default '',
  service text not null default '',
  city text not null default '',
  body text not null default '',
  read boolean not null default false
);

alter table public.crm_messages enable row level security;

drop policy if exists "crm_messages insert public" on public.crm_messages;
create policy "crm_messages insert public"
  on public.crm_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "crm_messages select public" on public.crm_messages;
create policy "crm_messages select public"
  on public.crm_messages for select
  to anon, authenticated
  using (true);

drop policy if exists "crm_messages update public" on public.crm_messages;
create policy "crm_messages update public"
  on public.crm_messages for update
  to anon, authenticated
  using (true)
  with check (true);
