-- Listing view tracking (internal analytics only).
-- Run once in the Supabase SQL editor: Dashboard → SQL Editor → paste → Run.

create table if not exists public.listing_views (
  id bigint generated always as identity primary key,
  listing_id bigint not null,
  viewed_at timestamptz not null default now()
);

create index if not exists listing_views_listing_id_idx
  on public.listing_views (listing_id);

-- Lock the table down: only the service role (used by /api/track-view and the
-- admin app) can touch it. The public anon key gets nothing.
alter table public.listing_views enable row level security;

-- Convenience view for the admin app: views per listing, last 30 days
create or replace view public.listing_view_counts as
select
  listing_id,
  count(*)                                              as total_views,
  count(*) filter (where viewed_at > now() - interval '7 days')  as views_7d,
  count(*) filter (where viewed_at > now() - interval '30 days') as views_30d
from public.listing_views
group by listing_id;
