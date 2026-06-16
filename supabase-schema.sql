-- Portal Property Thailand — Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_th text,
  type text not null check (type in ('condo', 'house')),
  listing_type text not null check (listing_type in ('rent', 'sale')),
  zone text,
  building_name text,
  bts_station text,
  floor integer,
  bedrooms integer not null default 1,
  bathrooms integer not null default 1,
  size_sqm numeric not null,
  sale_price numeric,
  rent_price numeric,
  description text,
  description_th text,
  photos text[] default '{}',
  agent_name text,
  agent_phone text,
  agent_line text,
  status text not null default 'available' check (status in ('available', 'rented', 'sold')),
  featured boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table listings enable row level security;

-- Allow anyone to read available listings
create policy "Public read available listings"
  on listings for select
  using (status = 'available');

-- Allow anyone to insert (agents submit without auth)
create policy "Anyone can insert listings"
  on listings for insert
  with check (true);

-- Storage bucket for listing photos
-- Run this separately or create via Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true);
