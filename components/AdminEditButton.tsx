"use client";

import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";

const ADMIN_URL = "https://portal-property-admin.vercel.app";

export default function AdminEditButton({ listingId }: { listingId: string }) {
  const searchParams = useSearchParams();
  if (searchParams.get("admin") !== "1") return null;

  return (
    <a
      href={`${ADMIN_URL}/listings/${listingId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#B8935A", color: "#111110" }}
    >
      <Pencil className="w-3.5 h-3.5" />
      Edit in Admin
    </a>
  );
}
