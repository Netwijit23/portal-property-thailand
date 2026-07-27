"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Scale, ArrowRight } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/lib/compare";

// Fixed bottom tray that appears once the visitor adds listings to compare.
// Sits above the floating contact button on mobile so the two don't collide.
export default function CompareTray() {
  const { items, count, remove, clear } = useCompare();
  const pathname = usePathname();
  // The /compare page already shows the full set with its own remove controls.
  if (count === 0 || pathname === "/compare") return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] max-w-[560px]">
      <div className="glass elev-3 rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[#0A0A0A]">
          <Scale size={15} className="text-[#B8935A]" />
          <span className="font-sans text-[12px] font-medium">Compare</span>
          <span className="font-sans text-[11px] text-[#8A8680] tabular">{count}/{MAX_COMPARE}</span>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          {items.map((l) => (
            <div key={l.id} className="relative shrink-0 group">
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EFEBE3] border border-white/60">
                {l.photo && (
                  <Image src={l.photo} alt={l.title} width={44} height={44} className="w-full h-full object-cover" draggable={false} />
                )}
              </div>
              <button
                onClick={() => remove(l.id)}
                aria-label={`Remove ${l.title} from compare`}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={clear}
          className="hidden sm:block shrink-0 font-sans text-[11px] text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className={`press shrink-0 inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-4 py-2.5 rounded-full transition-colors ${
            count >= 2 ? "bg-[#0A0A0A] text-white hover:bg-[#B8935A]" : "bg-[#E8E4DC] text-[#8A8680] pointer-events-none"
          }`}
          aria-disabled={count < 2}
        >
          Compare <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
