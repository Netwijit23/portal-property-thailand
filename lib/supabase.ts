import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzxyzxyz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!(url && url.startsWith('http') && url !== 'your_supabase_url_here')
}

// Matches the actual Supabase table schema
export type DBListing = {
  id: number
  original_id: number | null
  ref_no: string | null
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  zone: string | null
  zone_th: string | null
  project: string | null
  building_type: string | null
  listing_type: 'rent' | 'sale' | 'both' | null
  status: 'available' | 'reserved' | 'rented' | 'sold' | null
  available_from: string | null
  is_published: boolean
  website_description: string | null
  floor: number | null
  floor_number: number | null
  bedrooms: number
  bathrooms: number
  size_sqm: number | null
  direction: string | null
  pet_allowed: boolean
  foreigner_quota: boolean
  is_penthouse: boolean
  is_duplex: boolean
  sale_price: number | null
  full_price: number | null
  rent_price_1m: number | null
  rent_price_3m: number | null
  rent_price_6m: number | null
  agent_name: string | null
  agent_tel: string | null
  agent_line: string | null
  agent_email: string | null
  bts_mrt: string | null
  photos: string[] | null
  original_url: string | null
  posted_at: string | null
  created_at: string
  updated_at: string | null
  availability_checked_at: string | null
  featured?: boolean
}

// Normalised type used throughout the UI (maps DB columns to friendly names)
export type Listing = {
  id: string
  title: string
  title_th: string | null
  type: 'condo' | 'house'
  listing_type: 'rent' | 'sale' | 'both'
  zone: string | null
  zone_th?: string | null
  building_name: string | null
  bts_station: string | null
  floor: number | null
  bedrooms: number
  bathrooms: number
  size_sqm: number
  sale_price: number | null
  rent_price: number | null
  description: string | null
  description_th: string | null
  photos: string[]
  agent_name: string | null
  agent_phone: string | null
  agent_line: string | null
  status: 'available' | 'rented' | 'sold'
  available_from?: string | null
  created_at: string
  updated_at?: string | null
  availability_checked_at?: string | null
  featured?: boolean
}

// Returns the string only if it contains no Thai characters; otherwise null.
function enOnly(s: string | null | undefined): string | null {
  if (!s) return null;
  return /[฀-๿]/.test(s) ? null : s;
}

// The stored bts_mrt column is inconsistent — values arrive as "Asok",
// "Asok BTS", "Thong Lo BTS", and even "BTS Thonglor stat" (a leading prefix
// plus a truncated "station"). Normalise to the bare station name so callers
// can prefix "BTS" exactly once and the commute graph can match by name.
export function cleanStationName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw
    .trim()
    .replace(/^(?:bts|mrt)\s+/i, "")   // leading "BTS "/"MRT "
    .replace(/\s+(?:bts|mrt)$/i, "")   // trailing " BTS"/" MRT"
    .replace(/\s+stat(?:ion)?$/i, "")  // trailing " station" or truncated " stat"
    .trim();
  return s || null;
}

export function dbToListing(r: DBListing): Listing {
  return {
    id: String(r.id),
    title: r.title_en || enOnly(r.title) || 'Property Listing',
    title_th: r.title,
    type: (r.building_type?.toLowerCase() === 'house' ? 'house' : 'condo') as 'condo' | 'house',
    listing_type: (r.listing_type || 'rent') as 'rent' | 'sale' | 'both',
    zone: enOnly(r.zone),
    zone_th: r.zone_th,
    building_name: enOnly(r.project),
    bts_station: cleanStationName(enOnly(r.bts_mrt)),
    // The DB has both columns: legacy imports fill `floor`, the admin form
    // writes `floor_number` — read whichever is present so units show a floor.
    floor: r.floor ?? r.floor_number,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    size_sqm: r.size_sqm || 0,
    sale_price: r.sale_price,
    rent_price: r.rent_price_1m,
    description: r.website_description || r.description_en || enOnly(r.description),
    description_th: r.description,
    photos: r.photos || [],
    agent_name: enOnly(r.agent_name),
    agent_phone: r.agent_tel,
    agent_line: r.agent_line,
    status: r.status === 'rented' ? 'rented' : r.status === 'sold' ? 'sold' : 'available',
    available_from: r.available_from || null,
    created_at: r.created_at,
    updated_at: r.updated_at || null,
    availability_checked_at: r.availability_checked_at || null,
    featured: r.featured || false,
  }
}
