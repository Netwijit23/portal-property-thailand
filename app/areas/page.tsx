import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, MapPin } from "lucide-react";
import { AREA_GUIDES } from "@/lib/areas";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bangkok Neighbourhood Guides | Portal Property Thailand",
  description:
    "Where should you live in Bangkok? Explore our guides to Sukhumvit, Thonglor, Sathorn, Ari, and more — transit, lifestyle, and current listings for each area.",
  path: "/areas",
});

export default function AreasIndexPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">Neighbourhoods</span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>
            <h1 className="font-cormorant text-[40px] md:text-[52px] font-light text-[#0A0A0A] leading-tight">
              Where in Bangkok <em className="italic text-[#B8935A]">suits you</em>?
            </h1>
            <p className="font-sans text-[14px] text-[#86868B] mt-3 max-w-lg mx-auto">
              Every neighbourhood has its own rhythm. These are the areas we know street by street.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AREA_GUIDES.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group bg-white rounded-2xl p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#B8935A]" strokeWidth={1.8} />
                  <span className="font-sans text-[10px] uppercase tracking-[2px] text-[#B8935A]">{area.tagline}</span>
                </div>
                <h2 className="font-cormorant text-[30px] font-medium text-[#0A0A0A] leading-tight mb-2">{area.name}</h2>
                <p className="font-sans text-[13px] text-[#6B6963] leading-relaxed line-clamp-2">{area.intro[0]}</p>
                <span className="inline-flex items-center gap-2 mt-5 font-sans text-[12px] uppercase tracking-[1.5px] text-[#0A0A0A] group-hover:text-[#B8935A] transition-colors">
                  Explore {area.name}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
