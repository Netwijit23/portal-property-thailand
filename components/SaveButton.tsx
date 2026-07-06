"use client";
import { Heart } from "lucide-react";
import { useSaved, type SavedListing } from "@/lib/favourites";

// Heart toggle that persists to localStorage. Sits over photos, so it stops
// propagation to avoid triggering the parent link.
export default function SaveButton({
  listing,
  className = "",
  size = 16,
}: {
  listing: SavedListing;
  className?: string;
  size?: number;
}) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(listing.id);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save property"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listing);
      }}
      className={`press w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
        saved
          ? "bg-white/90 border-white"
          : "bg-black/25 border-white/30 hover:bg-black/40"
      } ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={2}
        fill={saved ? "#B8935A" : "none"}
        stroke={saved ? "#B8935A" : "#FFFFFF"}
        className="transition-all"
      />
    </button>
  );
}
