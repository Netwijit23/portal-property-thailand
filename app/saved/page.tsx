"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSaved } from "@/lib/favourites";
import SaveButton from "@/components/SaveButton";

export default function SavedPage() {
  const { saved, count } = useSaved();

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Your Collection</span>
            </div>
            <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A]">
              Saved <em className="italic text-[#B8935A]">Properties</em>
            </h1>
            {count > 0 && (
              <p className="font-sans text-sm text-[#8A8680] mt-3">{count} {count === 1 ? "property" : "properties"} saved</p>
            )}
          </div>

          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0ECE4] flex items-center justify-center mb-6">
                <Heart size={26} className="text-[#B8935A]" strokeWidth={1.5} />
              </div>
              <p className="font-cormorant text-3xl text-[#0A0A0A] mb-2">No saved properties yet</p>
              <p className="font-sans text-sm text-[#8A8680] mb-8 max-w-sm">
                Tap the heart on any property to save it here — build your shortlist and compare at your leisure.
              </p>
              <Link
                href="/listings"
                className="press inline-flex items-center gap-2 font-sans text-[13px] font-medium px-7 py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
              >
                Browse properties <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {saved.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.id}`}
                  className="group block bg-white border border-[#E8E4DC] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative photo-grade h-[240px] overflow-hidden bg-[#F5F2EC]">
                    {item.photo && (
                      <Image src={item.photo} alt={`${item.title}${item.bts_station ? `, near BTS ${item.bts_station}` : ""}, Bangkok`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" draggable={false} />
                    )}
                    <div className="absolute top-3 right-3 z-10">
                      <SaveButton listing={item} />
                    </div>
                    {item.bts_station && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009B77]" />
                        <span className="font-sans text-[10px] text-[#333]">{item.bts_station}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-cormorant text-[22px] font-medium text-[#0A0A0A] leading-snug line-clamp-1">{item.title}</h3>
                    <p className="font-sans text-lg font-medium text-[#B8935A] mt-1">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
