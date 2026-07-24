"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

// Renders one removable chip per applied constraint (search term, listing type,
// zone, property type, bedrooms, price) above the results grid, so an active
// filter is always visible and individually clearable — not just "Clear all".
export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (k: string) => searchParams.get(k) || "";
  const q = get("q");
  const type = get("type");
  const zone = get("zone");
  const propType = get("propType");
  const minBeds = get("minBeds");
  const bedrooms = get("bedrooms");
  const priceMin = get("priceMin");
  const priceMax = get("priceMax");

  const bedsLabel = (v: string) =>
    v
      .split(",")
      .map((n) => (n === "0" ? "Studio" : n === "5" ? "5+" : n))
      .join(", ");

  const fmtPrice = (n: string) => {
    const v = parseInt(n, 10);
    if (isNaN(v)) return n;
    return v >= 1_000_000 ? `฿${(v / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M` : `฿${v.toLocaleString()}`;
  };

  // Each chip lists the param key(s) it clears.
  const chips: { label: string; keys: string[] }[] = [];
  if (q) chips.push({ label: `“${q}”`, keys: ["q"] });
  if (type) chips.push({ label: type === "rent" ? "For rent" : "For sale", keys: ["type"] });
  if (zone) chips.push({ label: zone, keys: ["zone"] });
  if (propType) chips.push({ label: propType.charAt(0).toUpperCase() + propType.slice(1), keys: ["propType"] });
  if (minBeds) chips.push({ label: `${minBeds}+ bed`, keys: ["minBeds"] });
  if (bedrooms) chips.push({ label: `${bedsLabel(bedrooms)} bed`, keys: ["bedrooms"] });
  if (priceMin || priceMax) {
    const label = priceMin && priceMax ? `${fmtPrice(priceMin)}–${fmtPrice(priceMax)}` : priceMin ? `From ${fmtPrice(priceMin)}` : `Up to ${fmtPrice(priceMax)}`;
    chips.push({ label, keys: ["priceMin", "priceMax"] });
  }

  if (chips.length === 0) return null;

  function remove(keys: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((k) => params.delete(k));
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {chips.map((chip) => (
        <button
          key={chip.keys.join("-")}
          onClick={() => remove(chip.keys)}
          className="group inline-flex items-center gap-1.5 font-sans text-[12px] pl-3 pr-2 py-1.5 rounded-full bg-white border border-[#E8E4DC] text-[#4A4840] hover:border-[#B8935A] transition-colors"
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <X size={13} className="text-[#B0AAA2] group-hover:text-[#B8935A]" strokeWidth={2.5} />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => router.push(pathname)}
          className="font-sans text-[12px] text-[#8A8680] hover:text-[#B8935A] transition-colors underline underline-offset-4 ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
