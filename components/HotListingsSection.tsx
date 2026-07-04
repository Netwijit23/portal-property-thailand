"use client";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HotListingCard, { formatHotPrice, type HotBadge } from "./HotListingCard";
import Reveal from "./Reveal";
import EnquiryModal from "./EnquiryModal";
import type { Listing } from "@/lib/supabase";

type Props = {
  listings: Listing[];
  badges: HotBadge[];
};

export default function HotListingsSection({ listings, badges }: Props) {
  const [enquiryListing, setEnquiryListing] = useState<Listing | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback(() => {
    drag.current.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  // Suppress the click that follows a drag so cards don't navigate mid-swipe
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  return (
    <section className="bg-[#FAFAF8] pt-20 pb-12">
      {/* Section header */}
      <Reveal className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#B8935A]" />
            <p className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">
              Updated Daily
            </p>
          </div>
          <h2 className="font-cormorant text-[38px] md:text-[44px] font-light text-[#0A0A0A] leading-tight">
            Featured <em className="italic text-[#B8935A]">Residences</em>
          </h2>
        </div>
        <Link
          href="/listings"
          className="group flex items-center gap-2 font-sans text-[11px] uppercase tracking-[2px] text-[#0A0A0A] hover:text-[#B8935A] transition-colors self-start md:self-auto shrink-0 pb-1 border-b border-[#0A0A0A]/20 hover:border-[#B8935A]"
        >
          View all properties
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      {/* Horizontally scrollable card strip — drag to scroll on desktop */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-6 scrollbar-hide select-none"
        style={{ WebkitOverflowScrolling: "touch", cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        <div className="flex gap-5 px-6 md:px-12 w-max snap-x">
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
