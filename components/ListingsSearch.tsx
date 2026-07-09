"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function ListingsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  function push(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("q", next); else params.delete("q");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(next), 350);
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue("");
    push("");
  }

  return (
    <div className="relative mb-6">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by building, project, or zone..."
        className="w-full font-sans text-sm bg-white border border-[#E8E4DC] rounded-xl pl-11 pr-10 py-3.5 text-[#0A0A0A] placeholder-[#8A8680] focus:outline-none focus:border-[#B8935A] transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
