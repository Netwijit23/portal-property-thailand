"use client";
import { Scale } from "lucide-react";
import { useCompare, type CompareListing } from "@/lib/compare";

// Toggles a listing into the compare tray. Sits over card photos next to the
// save heart, so it stops propagation to avoid triggering the parent link.
export default function CompareButton({
  listing,
  size = 15,
  className = "",
}: {
  listing: CompareListing;
  size?: number;
  className?: string;
}) {
  const { isComparing, isFull, toggle } = useCompare();
  const active = isComparing(listing.id);
  const blocked = isFull && !active;

  return (
    <button
      type="button"
      aria-label={active ? "Remove from compare" : "Add to compare"}
      aria-pressed={active}
      title={blocked ? "Compare list is full (4 max)" : active ? "Remove from compare" : "Compare"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listing);
      }}
      className={`press w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
        active
          ? "bg-white/90 border-white"
          : blocked
            ? "bg-black/20 border-white/20 opacity-50"
            : "bg-black/25 border-white/30 hover:bg-black/40"
      } ${className}`}
    >
      <Scale
        size={size}
        strokeWidth={2}
        stroke={active ? "#B8935A" : "#FFFFFF"}
        className="transition-all"
      />
    </button>
  );
}
