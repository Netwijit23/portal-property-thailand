"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface RecentListing {
  id: string;
  title: string;
  photo: string | null;
  price: string;
  bts_station: string | null;
}

const KEY = "pp_recently_viewed";
const MAX = 6;

export function saveRecentlyViewed(listing: RecentListing) {
  try {
    const existing: RecentListing[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = existing.filter((l) => l.id !== listing.id);
    const updated = [listing, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [items, setItems] = useState<RecentListing[]>([]);

  useEffect(() => {
    try {
      const stored: RecentListing[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(stored.filter((l) => l.id !== currentId));
    } catch {}
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[#E8E4DC]">
      <h2 className="font-cormorant font-light text-3xl text-[#0A0A0A] mb-6">Recently viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/listings/${item.id}`}
            className="shrink-0 w-[200px] bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200 block"
          >
            <div className="relative h-[120px] bg-[#F5F2EC]" onContextMenu={(e) => e.preventDefault()}>
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C0BBB4]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-cormorant text-[15px] font-medium text-[#0A0A0A] leading-tight line-clamp-1">{item.title}</p>
              {item.bts_station && (
                <p className="font-sans text-[10px] text-[#1A3A2A] font-medium mt-0.5">BTS {item.bts_station}</p>
              )}
              <p className="font-sans text-[12px] text-[#B8935A] font-medium mt-1">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
