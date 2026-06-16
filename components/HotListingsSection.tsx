"use client";
import { useState } from "react";
import Link from "next/link";
import HotListingCard, { formatHotPrice, type HotBadge } from "./HotListingCard";
import EnquiryModal from "./EnquiryModal";
import type { Listing } from "@/lib/supabase";

type Props = {
  listings: Listing[];
  badges: HotBadge[];
};

export default function HotListingsSection({ listings, badges }: Props) {
  const [enquiryListing, setEnquiryListing] = useState<Listing | null>(null);

  return (
    <section className="bg-[#FAFAF8] pt-20 pb-10">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#B8935A] mb-2">
            Updated Daily
          </p>
          <h2 className="font-cormorant text-[38px] font-light text-[#0A0A0A] leading-tight">
            🔥{" "}
            <em className="italic text-[#B8935A]">Hot</em> Listings Right Now
          </h2>
        </div>
        <Link
          href="/listings"
          className="font-sans text-sm text-[#B8935A] underline underline-offset-4 hover:text-[#a07d4a] transition-colors self-start md:self-auto shrink-0"
        >
          View all listings →
        </Link>
      </div>

      {/* Horizontally scrollable card strip */}
      <div className="overflow-x-auto pb-6" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="flex gap-4 px-6 md:px-12 w-max snap-x snap-mandatory">
          {listings.map((listing, i) => (
            <HotListingCard
              key={listing.id}
              listing={listing}
              badge={badges[i] || "Hot"}
              onEnquiry={setEnquiryListing}
            />
          ))}
        </div>
      </div>

      {/* Enquiry modal */}
      {enquiryListing && (
        <EnquiryModal
          listing={{
            id: enquiryListing.id,
            title: enquiryListing.title,
            price: formatHotPrice(enquiryListing).primary,
          }}
          onClose={() => setEnquiryListing(null)}
        />
      )}
    </section>
  );
}
