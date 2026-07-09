export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { ArrowRight, Train, Star, Users } from "lucide-react";
import { AREA_GUIDES, getAreaGuide } from "@/lib/areas";
import { supabase, dbToListing } from "@/lib/supabase";
import type { Listing, DBListing } from "@/lib/supabase";

const HIGHLIGHT_ICONS = [Train, Star, Users];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaGuide(slug);
  if (!area) return { title: "Area Not Found | Portal Property Thailand" };
  return {
    title: `Living in ${area.name}, Bangkok — Neighbourhood Guide | Portal Property Thailand`,
    description: `${area.tagline}. ${area.intro[0].slice(0, 150)}…`,
  };
}

async function getAreaListings(match: string): Promise<Listing[]> {
  noStore();
  // Filter at the database instead of fetching all ~760 rows per request.
  // `match` values are our own slugs (no commas/parens), so the .or() string
  // is safe to interpolate.
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["available", "reserved", "rented"])
    .eq("is_published", true)
    .or(`zone.ilike.%${match}%,bts_mrt.ilike.%${match}%,project.ilike.%${match}%`)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return (data as DBListing[]).map(dbToListing);
}

function compactBaht(n: number): string {
  return n >= 1000 ? `฿${Math.round(n / 1000)}k` : `฿${n}`;
}

export default async function AreaGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getAreaGuide(slug);
  if (!area) notFound();

  const listings = await getAreaListings(area.match);
  const preview = listings.slice(0, 6);
  const others = AREA_GUIDES.filter((a) => a.slug !== area.slug).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        {/* Hero */}
        <section className="bg-[#0A0A0A] text-white">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">Neighbourhood Guide</span>
            </div>
            <h1 className="font-cormorant text-[48px] md:text-[64px] font-light leading-tight">{area.name}</h1>
            <p className="font-cormorant italic text-[20px] md:text-[24px] text-[#E5C795] mt-1">{area.tagline}</p>
            <div className="flex flex-wrap gap-6 mt-8 items-end">
              <div>
                <p className="font-sans text-[22px] font-medium text-white">{listings.length}</p>
                <p className="font-sans text-[11px] uppercase tracking-wider text-white/50">Available homes</p>
              </div>
              <div className="w-px h-10 bg-white/15 hidden sm:block" />
              {([
                ["1 Bed", area.marketRent.br1],
                ["2 Bed", area.marketRent.br2],
                ["3 Bed", area.marketRent.br3],
              ] as const).map(([label, rent]) => (
                <div key={label}>
                  <p className="font-sans text-[22px] font-medium text-white">{compactBaht(rent)}</p>
                  <p className="font-sans text-[11px] uppercase tracking-wider text-white/50">{label} / month</p>
                </div>
              ))}
              <p className="basis-full font-sans text-[10px] text-white/40 -mt-2">
                Typical Bangkok market rents for the area — independent benchmarks, not our list prices.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Intro copy */}
          <div className="max-w-2xl">
            {area.intro.map((p, i) => (
              <p key={i} className="font-sans text-[15px] text-[#4A4840] leading-[1.85] mb-5">{p}</p>
            ))}
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
            {area.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
              return (
                <div key={h.label} className="bg-white border border-[#E8E4DC] rounded-2xl p-5">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2EC] flex items-center justify-center mb-3">
                    <Icon size={16} className="text-[#B8935A]" strokeWidth={1.8} />
                  </div>
                  <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#B8935A] mb-1.5">{h.label}</p>
                  <p className="font-sans text-[13px] text-[#4A4840] leading-relaxed">{h.text}</p>
                </div>
              );
            })}
          </div>

          {/* Listings preview */}
          {preview.length > 0 && (
            <section className="mt-14">
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-cormorant font-light text-[32px] text-[#0A0A0A]">
                  Homes in {area.name}
                </h2>
                <Link
                  href={`/listings?zone=${encodeURIComponent(area.match)}`}
                  className="font-sans text-[12px] uppercase tracking-[1.5px] text-[#B8935A] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                >
                  View all {listings.length} <ArrowRight size={13} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {preview.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </section>
          )}

          {/* Other areas */}
          <section className="mt-16 pt-10 border-t border-[#E8E4DC]">
            <h2 className="font-cormorant font-light text-2xl text-[#0A0A0A] mb-5">Explore other neighbourhoods</h2>
            <div className="flex flex-wrap gap-2.5">
              {others.map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  className="font-sans text-[13px] px-4 py-2 rounded-full border border-[#E8E4DC] bg-white text-[#4A4840] hover:border-[#B8935A] hover:text-[#B8935A] transition-colors"
                >
                  {a.name}
                </Link>
              ))}
              <Link
                href="/areas"
                className="font-sans text-[13px] px-4 py-2 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
              >
                All areas
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
