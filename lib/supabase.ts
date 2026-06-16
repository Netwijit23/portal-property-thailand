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
  featured?: boolean
}

// Returns the string only if it contains no Thai characters; otherwise null.
function enOnly(s: string | null | undefined): string | null {
  if (!s) return null;
  return /[฀-๿]/.test(s) ? null : s;
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
    bts_station: enOnly(r.bts_mrt),
    floor: r.floor,
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
    featured: r.featured || false,
  }
}
