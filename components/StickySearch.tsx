"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// Frosted-glass search pill that slides in once the user scrolls past the hero
// on the homepage. Submits to the listings page.
export default function StickySearch() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<"rent" | "sale">("rent");
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("type", tab);
    // Unified on the `q` search param so the term hydrates the results search
    // box and shows as a removable chip (see #2).
    if (q.trim()) params.set("q", q.trim());
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <div
      className={`fixed top-[68px] left-1/2 -translate-x-1/2 z-40 w-[min(92vw,560px)] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
      }`}
    >
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-full pl-2 pr-2 py-2 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px) saturate(1.6)", WebkitBackdropFilter: "blur(20px) saturate(1.6)" }}
      >
        {/* Rent / Buy */}
        <div className="flex rounded-full bg-black/[0.04] p-0.5 shrink-0">
          {(["rent", "sale"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`press font-sans text-[11px] font-medium px-3 py-1.5 rounded-full transition-all ${
                tab === t ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#8A8680]"
              }`}
            >
              {t === "rent" ? "Rent" : "Buy"}
            </button>
          ))}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Area, BTS or condo…"
          className="flex-1 min-w-0 bg-transparent font-sans text-[13px] text-[#0A0A0A] placeholder-[#9B958C] outline-none px-1"
        />

        <button
          type="submit"
          aria-label="Search"
          className="press w-9 h-9 rounded-full bg-[#B8935A] text-white flex items-center justify-center shrink-0 hover:bg-[#a07d4a] transition-colors"
        >
          <Search size={15} />
        </button>
      </form>
    </div>
  );
}
