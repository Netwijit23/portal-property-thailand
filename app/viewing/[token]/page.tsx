import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ViewingListView, { type SharedList } from "@/components/ViewingListView";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/lib/supabase";

// A viewing list is edited by the agent after it's shared, so never serve a
// cached copy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// dedupes the fetch between generateMetadata and the page render
const getList = cache(async (token: string): Promise<SharedList | null> => {
  // Tokens are 32 hex chars; reject anything else without touching the database.
  if (!/^[a-f0-9]{32}$/i.test(token)) return null;
  const { data, error } = await supabase.rpc("get_viewing_list", { p_token: token });
  if (error || !data) return null;
  return data as SharedList;
});

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const list = await getList(token);
  if (!list) notFound();

  const count = list.items.length;
  const title = list.client_name ? `${list.title} — ${list.client_name}` : list.title;
  const description = `A private viewing list${list.agent?.name ? ` from ${list.agent.name}` : ""} — ${count} propert${count === 1 ? "y" : "ies"} in Bangkok.`;
  // The agent's chosen cover, else the first unit's first photo.
  const image = list.cover_url || list.items.map((i) => i.listing.photos?.[0]).find(Boolean) || undefined;

  return {
    title: `${title} | ${BUSINESS.name}`,
    description,
    // Private by design: the link is the only way in, so keep it out of search.
    robots: { index: false, follow: false, nocache: true },
    openGraph: { title, description, type: "website", siteName: BUSINESS.name, ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ViewingListPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const list = await getList(token);
  if (!list) notFound();

  return <ViewingListView list={list} />;
}
