import { BUSINESS } from "@/lib/business";

// Helpers + types shared by the tenant-facing viewing-list and proposal pages.

// Shape returned by the get_viewing_list() / get_proposal() database functions. Deliberately has
// no owner contact details — see the migration.
export interface SharedListing {
  id: number;
  title: string | null;
  title_en: string | null;
  project: string | null;
  zone: string | null;
  bts_mrt: string | null;
  listing_type: "rent" | "sale" | "both" | null;
  building_type: string | null;
  status: "available" | "reserved" | "rented" | "sold" | null;
  is_published: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  floor: number | null;
  floor_number: number | null;
  sale_price: number | null;
  rent_price_1m: number | null;
  pet_allowed: boolean | null;
  foreigner_quota: boolean | null;
  available_from: string | null;
  website_description: string | null;
  description_en: string | null;
  photos: string[] | null;
}

export const hasThai = (s: string | null | undefined) => !!s && /[฀-๿]/.test(s);

export function displayName(l: SharedListing): string {
  if (l.project && !hasThai(l.project)) return l.project;
  return l.title_en || (!hasThai(l.title) ? l.title : null) || "Property";
}



export function lineHref(lineId: string | null | undefined): string {
  const id = lineId?.trim();
  if (!id) return BUSINESS.line;
  return id.startsWith("@") ? `https://line.me/R/ti/p/${id}` : `https://line.me/ti/p/~${id}`;
}

export function shortDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Bangkok" });
}
