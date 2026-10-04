create extension if not exists pgcrypto;

create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  blood_group text,
  age integer check (age is null or age between 18 and 65),
  location text,
  availability text not null default 'Available'
    check (availability in ('Available', 'Unavailable')),
  last_donation date,
  created_at timestamptz not null default now()
);

create table if not exists public.blood_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text not null,
  donor_id uuid references public.donors(id) on delete set null,
  blood_group text not null,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'fulfilled')),
  created_at timestamptz not null default now()
);

alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;

drop policy if exists "Anyone can view donors" on public.donors;
create policy "Anyone can view donors"
  on public.donors for select
  using (true);

drop policy if exists "Authenticated users can create donor records" on public.donors;
create policy "Authenticated users can create donor records"
  on public.donors for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

drop policy if exists "Authenticated users can update their donor record" on public.donors;
create policy "Authenticated users can update their donor record"
  on public.donors for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "Authenticated users can create blood requests" on public.blood_requests;
create policy "Authenticated users can create blood requests"
  on public.blood_requests for insert
  to authenticated
  with check (requester_email = auth.jwt() ->> 'email');

drop policy if exists "Users can view their own blood requests" on public.blood_requests;
create policy "Users can view their own blood requests"
  on public.blood_requests for select
  to authenticated
  using (requester_email = auth.jwt() ->> 'email');

create or replace function public.create_donor_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.donors (auth_user_id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_donor on auth.users;
create trigger on_auth_user_created_create_donor
  after insert on auth.users
  for each row execute procedure public.create_donor_profile();
