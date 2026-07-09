import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { AREA_GUIDES } from "@/lib/areas";

const BASE = "https://portalpropertythailand.com";

// Regenerate at most once an hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/listings`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/enquire`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/enquire/client`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/enquire/agent`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/enquire/owner`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/areas`, changeFrequency: "weekly", priority: 0.7 },
    ...AREA_GUIDES.map((a) => ({
      url: `${BASE}/areas/${a.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const { data } = await supabase
    .from("listings")
    .select("id, created_at")
    .eq("is_published", true);

  const listingRoutes: MetadataRoute.Sitemap = (data ?? []).map((l) => ({
    url: `${BASE}/listings/${l.id}`,
    lastModified: l.created_at ? new Date(l.created_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...listingRoutes];
}
