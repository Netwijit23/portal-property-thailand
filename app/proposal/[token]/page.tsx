import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProposalView, { type SharedProposal } from "@/components/ProposalView";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/lib/supabase";

// The agent edits a proposal (and the tenant chooses) after it's shared, so
// never serve a cached copy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// dedupes the fetch between generateMetadata and the page render
const getProposal = cache(async (token: string): Promise<SharedProposal | null> => {
  // Tokens are 32 hex chars; reject anything else without touching the database.
  if (!/^[a-f0-9]{32}$/i.test(token)) return null;
  const { data, error } = await supabase.rpc("get_proposal", { p_token: token });
  if (error || !data) return null;
  return data as SharedProposal;
});

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const proposal = await getProposal(token);
  if (!proposal) notFound();

  const count = proposal.items.length;
  const title = proposal.client_name ? `${proposal.title} — ${proposal.client_name}` : proposal.title;
  const description = `A private proposal${proposal.agent?.name ? ` from ${proposal.agent.name}` : ""} — ${count} option${count === 1 ? "" : "s"} to choose from.`;
  const image = proposal.items.map((i) => i.listing.photos?.[0]).find(Boolean) ?? undefined;

  return {
    title: `${title} | ${BUSINESS.name}`,
    description,
    // Private by design: the link is the only way in, so keep it out of search.
    robots: { index: false, follow: false, nocache: true },
    openGraph: { title, description, type: "website", siteName: BUSINESS.name, ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const proposal = await getProposal(token);
  if (!proposal) notFound();

  return <ProposalView token={token} proposal={proposal} />;
}
