"use client";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCompare } from "@/lib/compare";

const ROWS: { label: string; get: (l: ReturnType<typeof useCompare>["items"][number]) => string }[] = [
  { label: "Price", get: (l) => l.price },
  { label: "Type", get: (l) => (l.type ? l.type.charAt(0).toUpperCase() + l.type.slice(1) : "—") },
  { label: "Bedrooms", get: (l) => (l.bedrooms === 0 ? "Studio" : String(l.bedrooms)) },
  { label: "Bathrooms", get: (l) => String(l.bathrooms) },
  { label: "Size", get: (l) => (l.size_sqm != null ? `${l.size_sqm} sqm` : "—") },
  { label: "Floor", get: (l) => (l.floor != null ? `${l.floor}F` : "—") },
  { label: "Nearest BTS", get: (l) => (l.bts_station ? `BTS ${l.bts_station}` : "—") },
  { label: "Zone", get: (l) => l.zone?.split(",")[0]?.trim() || "—" },
];

export default function ComparePage() {
  const { items, remove, clear } = useCompare();

  return (
    <>
      <Navbar />
      <main id="compare-main" className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#B8935A]">
                <Scale size={15} />
                <span className="font-sans text-[10px] uppercase tracking-[2.5px]">Side by side</span>
              </div>
              <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A]">Compare properties</h1>
            </div>
            {items.length > 0 && (
              <button onClick={clear} className="font-sans text-[13px] text-[#8A8680] hover:text-[#B8935A] transition-colors underline underline-offset-4 shrink-0">
                Clear all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0ECE4] flex items-center justify-center mb-6 text-[#B8935A]">
                <Scale size={26} strokeWidth={1.5} />
              </div>
              <p className="font-cormorant text-3xl text-[#0A0A0A] mb-2">Nothing to compare yet</p>
              <p className="font-sans text-sm text-[#8A8680] mb-8 max-w-sm">
                Tap the scales icon on any property to add it here, then see how your shortlist stacks up.
              </p>
              <Link href="/listings" className="press inline-flex items-center gap-2 font-sans text-[13px] font-medium px-7 py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors">
                Browse properties <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
              <div className="inline-grid gap-4" style={{ gridTemplateColumns: `140px repeat(${items.length}, minmax(200px, 1fr))` }}>
                {/* Header row: photos + titles */}
                <div aria-hidden />
                {items.map((l) => (
                  <div key={l.id} className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden elev-1">
                    <div className="relative h-32 bg-[#EFEBE3]">
                      {l.photo && <Image src={l.photo} alt={l.title} fill className="object-cover" sizes="240px" draggable={false} />}
                      <button
                        onClick={() => remove(l.id)}
                        aria-label={`Remove ${l.title}`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <Link href={`/listings/${l.id}`} className="block px-4 py-3 group">
                      <p className="font-cormorant text-[18px] font-medium text-[#0A0A0A] leading-snug line-clamp-2 group-hover:text-[#B8935A] transition-colors">{l.title}</p>
                    </Link>
                  </div>
                ))}

                {/* Spec rows */}
                {ROWS.map((row, ri) => (
                  <div key={row.label} className="contents">
                    <div className={`flex items-center font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] ${ri === 0 ? "" : ""}`}>
                      {row.label}
                    </div>
                    {items.map((l) => (
                      <div
                        key={l.id + row.label}
                        className={`flex items-center px-4 py-3 rounded-xl font-sans text-[14px] tabular ${
                          row.label === "Price" ? "text-[#B8935A] font-medium" : "text-[#0A0A0A]"
                        } ${ri % 2 === 0 ? "bg-white border border-[#F0ECE4]" : "bg-[#F7F5F1]"}`}
                      >
                        {row.get(l)}
                      </div>
                    ))}
                  </div>
                ))}

                {/* CTA row */}
                <div aria-hidden />
                {items.map((l) => (
                  <Link
                    key={l.id + "cta"}
                    href={`/listings/${l.id}`}
                    className="press inline-flex items-center justify-center gap-1.5 font-sans text-[13px] font-medium px-4 py-3 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
                  >
                    View <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
