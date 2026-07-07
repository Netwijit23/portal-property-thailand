-- Refresh listings.updated_at ONLY when a listing is marked available,
-- so the "Confirmed available Xd ago" freshness badge reflects genuine
-- availability confirmations — not price edits or typo fixes.
--
-- Run once in the Supabase SQL editor: Dashboard → SQL Editor → paste → Run.
-- (If you already ran the previous version of this file, running this one
-- replaces it.)

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;

create trigger listings_set_updated_at
before update on public.listings
for each row
when (new.status = 'available' and old.status is distinct from new.status)
execute function public.set_updated_at();
