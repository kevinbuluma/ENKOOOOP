-- ENKOP content and lead schema (Supabase/PostgreSQL).
-- Run in the Supabase SQL editor. Never expose a service_role key in the browser.
create extension if not exists pgcrypto;

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text not null default 'Nairobi',
  region text not null default 'Nairobi County',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  location_id uuid references public.locations(id) on delete set null,
  property_type text not null check (property_type in ('Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Land')),
  listing_type text not null check (listing_type in ('sale', 'rent')),
  price numeric(16,2) not null check (price >= 0),
  currency text not null default 'KES',
  bedrooms smallint not null default 0 check (bedrooms >= 0),
  bathrooms smallint not null default 0 check (bathrooms >= 0),
  area numeric(10,2) not null default 0 check (area >= 0),
  parking smallint not null default 0 check (parking >= 0),
  status text not null check (status in ('For Sale', 'For Rent', 'Sold', 'Let', 'Coming Soon')),
  featured boolean not null default false,
  is_published boolean not null default false,
  hero_image_url text,
  property_video_url text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  youtube_url text,
  x_url text,
  virtual_tour_url text,
  external_listing_url text,
  google_maps_url text,
  whatsapp_number text,
  contact_phone text,
  latitude double precision,
  longitude double precision,
  agent_name text,
  agent_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional media and conversion links; safe to re-run against an existing project.
alter table public.properties add column if not exists hero_image_url text;
alter table public.properties add column if not exists property_video_url text;
alter table public.properties add column if not exists instagram_url text;
alter table public.properties add column if not exists facebook_url text;
alter table public.properties add column if not exists tiktok_url text;
alter table public.properties add column if not exists youtube_url text;
alter table public.properties add column if not exists x_url text;
alter table public.properties add column if not exists virtual_tour_url text;
alter table public.properties add column if not exists external_listing_url text;
alter table public.properties add column if not exists google_maps_url text;
alter table public.properties add column if not exists whatsapp_number text;
alter table public.properties add column if not exists contact_phone text;

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.property_amenities (
  property_id uuid not null references public.properties(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  primary key (property_id, amenity_id)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text not null check (char_length(phone) between 5 and 40),
  message text not null check (char_length(message) between 2 and 3000),
  property_id uuid references public.properties(id) on delete set null,
  property_slug text,
  property_title text,
  property_location text,
  preferred_date date,
  preferred_time text,
  preferred_contact text not null default 'WhatsApp' check (preferred_contact in ('Phone', 'Email', 'WhatsApp')),
  interest text not null default 'General enquiry',
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'viewing_scheduled', 'follow_up', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null default '',
  body text[] not null default '{}',
  image_url text,
  image_alt text not null default '',
  published_at date,
  read_time text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  portrait_url text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Insert an auth.users UUID here to grant a team member administrative access.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at before update on public.properties for each row execute function public.set_updated_at();
drop trigger if exists insights_set_updated_at on public.insights;
create trigger insights_set_updated_at before update on public.insights for each row execute function public.set_updated_at();
drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at before update on public.team_members for each row execute function public.set_updated_at();

create or replace function public.is_enkop_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_enkop_admin() from public;
grant execute on function public.is_enkop_admin() to anon, authenticated;

alter table public.locations enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.amenities enable row level security;
alter table public.property_amenities enable row level security;
alter table public.enquiries enable row level security;
alter table public.insights enable row level security;
alter table public.team_members enable row level security;
alter table public.admins enable row level security;

-- Public visitors can only read published content. Admins manage all content.
drop policy if exists "Published locations are readable" on public.locations;
create policy "Published locations are readable" on public.locations for select to anon, authenticated
  using (exists (select 1 from public.properties p where p.location_id = locations.id and p.is_published) or public.is_enkop_admin());
drop policy if exists "Admins manage locations" on public.locations;
create policy "Admins manage locations" on public.locations for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Published properties are readable" on public.properties;
create policy "Published properties are readable" on public.properties for select to anon, authenticated using (is_published or public.is_enkop_admin());
drop policy if exists "Admins manage properties" on public.properties;
create policy "Admins manage properties" on public.properties for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Published property images are readable" on public.property_images;
create policy "Published property images are readable" on public.property_images for select to anon, authenticated
  using (exists (select 1 from public.properties p where p.id = property_id and p.is_published) or public.is_enkop_admin());
drop policy if exists "Admins manage property images" on public.property_images;
create policy "Admins manage property images" on public.property_images for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Amenities are readable" on public.amenities;
create policy "Amenities are readable" on public.amenities for select to anon, authenticated using (true);
drop policy if exists "Admins manage amenities" on public.amenities;
create policy "Admins manage amenities" on public.amenities for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());
drop policy if exists "Published property amenities are readable" on public.property_amenities;
create policy "Published property amenities are readable" on public.property_amenities for select to anon, authenticated
  using (exists (select 1 from public.properties p where p.id = property_id and p.is_published) or public.is_enkop_admin());
drop policy if exists "Admins manage property amenities" on public.property_amenities;
create policy "Admins manage property amenities" on public.property_amenities for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Public visitors may submit enquiries" on public.enquiries;
create policy "Public visitors may submit enquiries" on public.enquiries for insert to anon, authenticated
  with check (status = 'new' and char_length(name) between 2 and 120 and char_length(message) between 2 and 3000);
drop policy if exists "Admins can review enquiries" on public.enquiries;
create policy "Admins can review enquiries" on public.enquiries for select to authenticated using (public.is_enkop_admin());
drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries" on public.enquiries for update to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Published insights are readable" on public.insights;
create policy "Published insights are readable" on public.insights for select to anon, authenticated using (is_published or public.is_enkop_admin());
drop policy if exists "Admins manage insights" on public.insights;
create policy "Admins manage insights" on public.insights for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());

drop policy if exists "Public team members are readable" on public.team_members;
create policy "Public team members are readable" on public.team_members for select to anon, authenticated using (is_public or public.is_enkop_admin());
drop policy if exists "Admins manage team members" on public.team_members;
create policy "Admins manage team members" on public.team_members for all to authenticated using (public.is_enkop_admin()) with check (public.is_enkop_admin());
drop policy if exists "Admins can read their own record" on public.admins;
create policy "Admins can read their own record" on public.admins for select to authenticated using (user_id = auth.uid());

-- Public visitors can only create enquiry records; they cannot read, update or delete leads.
revoke all on public.enquiries from anon, authenticated;
grant insert (name, email, phone, message, property_id, property_slug, property_title, property_location, preferred_date, preferred_time, preferred_contact, interest, source, status) on public.enquiries to anon, authenticated;
grant select, update on public.enquiries to authenticated;

-- Public property/insight reads are controlled by RLS; public writes remain unavailable.
grant select on public.locations, public.properties, public.property_images, public.amenities, public.property_amenities, public.insights, public.team_members to anon, authenticated;
grant insert, update, delete on public.locations, public.properties, public.property_images, public.amenities, public.property_amenities, public.insights, public.team_members to authenticated;
grant select on public.admins to authenticated;

-- Optional public media bucket. Restrict writes to authenticated ENKOP admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('enkop-property-media', 'enkop-property-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ENKOP media is publicly readable" on storage.objects;
create policy "ENKOP media is publicly readable" on storage.objects for select to anon, authenticated
  using (bucket_id = 'enkop-property-media');
drop policy if exists "ENKOP admins can upload media" on storage.objects;
create policy "ENKOP admins can upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'enkop-property-media' and public.is_enkop_admin());
drop policy if exists "ENKOP admins can update media" on storage.objects;
create policy "ENKOP admins can update media" on storage.objects for update to authenticated
  using (bucket_id = 'enkop-property-media' and public.is_enkop_admin()) with check (bucket_id = 'enkop-property-media' and public.is_enkop_admin());
drop policy if exists "ENKOP admins can delete media" on storage.objects;
create policy "ENKOP admins can delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'enkop-property-media' and public.is_enkop_admin());

-- Deploy a CAPTCHA-enabled Edge Function for public enquiry submission in production.
-- Keep the anon key public, never use the service-role key in VITE_* client variables.
