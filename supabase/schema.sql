-- ============================================================================
-- Ex-Servicemen Information Portal — Veer Connect Supabase schema
-- ============================================================================

create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist to force schema updates
drop table if exists updates cascade;
drop table if exists jobs cascade;
drop table if exists schemes cascade;
drop table if exists data_sources cascade;
drop table if exists admin_users cascade;
drop table if exists sync_logs cascade;

-- ---------- admin_users ----------
create table admin_users (
  id uuid primary key,
  email text unique,
  role text default 'admin',
  created_at timestamp default now()
);

alter table admin_users enable row level security;

create policy "Anyone can view admin_users"
  on admin_users for select
  using (true);

create policy "Admins can manage admin_users"
  on admin_users for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Automatically add signed up users to admin_users table (acting as the admin)
create or replace function public.handle_new_admin()
returns trigger as $$
begin
  insert into public.admin_users (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin();

-- ---------- updates ----------
create table updates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  category text,
  source text,
  link text unique,
  published_date timestamp,
  created_at timestamp default now(),
  trending boolean default false
);

alter table updates enable row level security;

create policy "Updates are publicly readable"
  on updates for select
  using (true);

create policy "Admins can CRUD updates"
  on updates for all
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()))
  with check (exists (select 1 from admin_users where admin_users.id = auth.uid()));

-- ---------- jobs ----------
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  organization text,
  location text,
  description text,
  deadline date,
  link text unique,
  created_at timestamp default now(),
  state text default 'All States',
  eligibility text default 'Ex-Servicemen'
);

alter table jobs enable row level security;

create policy "Jobs are publicly readable"
  on jobs for select
  using (true);

create policy "Admins can CRUD jobs"
  on jobs for all
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()))
  with check (exists (select 1 from admin_users where admin_users.id = auth.uid()));

-- ---------- schemes ----------
create table schemes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  eligibility text,
  benefits text,
  source text,
  link text unique,
  created_at timestamp default now(),
  category text default 'Welfare',
  published_date timestamp default now(),
  summary text,
  documents_required text,
  last_date date
);

alter table schemes enable row level security;

create policy "Schemes are publicly readable"
  on schemes for select
  using (true);

create policy "Admins can CRUD schemes"
  on schemes for all
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()))
  with check (exists (select 1 from admin_users where admin_users.id = auth.uid()));

-- ---------- data_sources ----------
create table data_sources (
  id uuid primary key default uuid_generate_v4(),
  name text,
  url text,
  category text,
  is_active boolean default true,
  last_synced_at timestamp,
  created_at timestamp default now()
);

alter table data_sources enable row level security;

create policy "Data sources readable by admins"
  on data_sources for select
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()));

create policy "Data sources manageable by admins"
  on data_sources for all
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()));

-- ---------- sync_logs ----------
create table sync_logs (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  items_found int not null default 0,
  items_added int not null default 0,
  status text not null check (status in ('success','partial','failed')),
  message text,
  ran_at timestamp default now()
);

alter table sync_logs enable row level security;

create policy "Admins can read sync logs"
  on sync_logs for select
  using (exists (select 1 from admin_users where admin_users.id = auth.uid()));

-- ---------- Indexes ----------
create index if not exists idx_updates_title on updates (title);
create index if not exists idx_updates_category on updates (category);
create index if not exists idx_updates_published_date on updates (published_date desc);

create index if not exists idx_jobs_title on jobs (title);
create index if not exists idx_jobs_organization on jobs (organization);
create index if not exists idx_jobs_deadline on jobs (deadline desc);

create index if not exists idx_schemes_title on schemes (title);
create index if not exists idx_schemes_source on schemes (source);

-- ---------- Seed Data ----------
insert into data_sources (id, name, url, category, is_active) values
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'ECHS', 'https://www.echs.gov.in', 'medical', true),
  ('d2a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'DGR', 'https://dgrindia.gov.in', 'jobs', true),
  ('d3a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'KSB', 'https://ksb.gov.in', 'schemes', true),
  ('d4a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'SPARSH', 'https://sparsh.defencepension.gov.in', 'pension', true)
on conflict do nothing;

-- Optionally pre-seed the auth authentication code as an admin user ID
insert into admin_users (id, email, role)
values ('d38b8369-88c8-4a32-94d6-549394975b51', 'admin@veerconnect.in', 'admin')
on conflict (id) do nothing;
