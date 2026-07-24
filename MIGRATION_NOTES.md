# Migration & Infra Notes — CX Audit Fix Pack (`fix/cx-audit-pack`)

These items need a database migration, an RLS/storage policy change, or an
env/Vercel change. **None of them have been executed** — they are written up here
for review and manual application. No production data was touched.

---

## 1. Env vars to set (Vercel → Project → Settings → Environment Variables)

### `AI_INTERNAL_SECRET` (required for #9)
`/api/generate-description` and `/api/lookup-bts` are now **fail-closed**: without
this secret set AND sent as an `x-internal-secret` header, they return `401`.

- The **public website no longer calls these routes** (the listing page uses
  `lib/ai.ts` directly), so leaving the secret unset simply disables the HTTP
  routes — safe for the web app.
- **If the admin app calls these endpoints**, set the same `AI_INTERNAL_SECRET`
  in the admin's env and have it send `x-internal-secret: <secret>`. Until then,
  those admin calls will 401. (Could not verify the admin app from this repo —
  please check `~/Desktop/PortalWebAdmin`.)

Generate one with e.g. `openssl rand -hex 32`.

---

## 2. Pre-generate listing enrichment at ingest (improves #1)

The listing detail page no longer blocks first paint on AI calls: the description
streams in via `<Suspense>` and the nearest station is read from the stored
`bts_mrt` column. To eliminate the per-view AI cost entirely and guarantee copy
is present instantly:

- At **ingest / admin save**, generate the description + nearest BTS once and
  store them on the row (e.g. populate `website_description` and `bts_mrt`).
- Optionally have `lib/ai.ts` results cached back to the row on first generation
  (a service-role write from a route) so each listing is only ever generated once.

Also worth a data cleanup: `bts_mrt` values are inconsistent in the DB
(`"Asok"`, `"Asok BTS"`, `"BTS Thonglor stat"`). The app now normalises these at
read time (`cleanStationName`), but a one-off `UPDATE` to normalise the stored
values would let the commute graph match more reliably and keep admin displays
clean.

---

## 3. Card image weight (#5) — no safe in-app fix available

The audit flagged full-res images in cards. Investigation found:

- Next.js image optimizer is intentionally **off** (`unoptimized: true`) because
  Vercel returned `402` once the transformation quota was exhausted.
- Supabase Storage's on-the-fly render/transform endpoint returns **`403`**
  (image transformation not enabled on the current plan).
- There is **no thumbnail column / no thumbnail derivative** stored.
- Mitigating factor: originals are already compressed by the admin app to
  ~60–100 KB each, so this is less severe than a raw-upload scenario.

**Options (pick one), all requiring infra/DB or the admin app:**
1. Generate a small thumbnail derivative at upload in the admin app, store its
   URL in a new `thumbnail_url` column, and serve it in `ListingCard` /
   `HotListingCard` / `RecentlyViewed`; reserve full-res for the detail gallery.
2. Enable Supabase Storage image transformations (Pro) and append
   `?width=…&quality=…` to card image URLs.
3. Re-enable the Next optimizer once the Vercel transformation quota allows, and
   rely on the `sizes` attributes already present on every card image.

---

## 4. True server-side price-sort pagination (#6)

Filtering, the exact count, and pagination now run **server-side** in
`getListings()` for the default (newest-first) sort via `.range()`. Sorting by
**price** still fetches the filtered set (reduced columns, capped at 1000) and
sorts/paginates in memory, because a coalesced `rent_price_1m ?? sale_price`
ordering can't be expressed in a PostgREST `.order()`.

To make price-sort fully server-paginated too:

```sql
alter table listings
  add column effective_price bigint
  generated always as (coalesce(rent_price_1m, sale_price)) stored;

create index on listings (effective_price);
```

Then in `getListings()` replace the in-memory price branch with
`.order("effective_price", { ascending, nullsFirst: false }).range(from, to)`.

---
