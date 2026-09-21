create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "members select own" on public.members;
create policy "members select own"
  on public.members for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "members insert own" on public.members;
create policy "members insert own"
  on public.members for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "members update own" on public.members;
create policy "members update own"
  on public.members for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.members.full_name),
        phone = coalesce(nullif(excluded.phone, ''), public.members.phone),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, raw_user_meta_data on auth.users
  for each row execute function public.handle_new_member();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'members',
  'members',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists "members read own files" on storage.objects;
create policy "members read own files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'members' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "members upload own files" on storage.objects;
create policy "members upload own files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'members' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "members update own files" on storage.objects;
create policy "members update own files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'members' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'members' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "members delete own files" on storage.objects;
create policy "members delete own files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'members' and (storage.foldername(name))[1] = auth.uid()::text);
