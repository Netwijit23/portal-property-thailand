"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pencil, CheckCircle2, Loader2 } from "lucide-react";

const ADMIN_URL = "https://portal-property-admin.vercel.app";
const KEY_STORAGE = "pp_admin_key";

export default function AdminEditButton({ listingId }: { listingId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = searchParams.get("admin") === "1";

  // A ?key=... in the URL is remembered so future visits only need ?admin=1
  useEffect(() => {
    const key = searchParams.get("key");
    if (isAdmin && key) localStorage.setItem(KEY_STORAGE, key);
  }, [isAdmin, searchParams]);

  if (!isAdmin) return null;

  async function confirmAvailable() {
    const key = localStorage.getItem(KEY_STORAGE);
    if (!key) {
      setState("error");
      setErrorMsg("No admin key — open this page once with &key=YOUR_KEY");
      return;
    }
    setState("busy");
    try {
      const res = await fetch("/api/confirm-available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listingId, key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setState("done");
      router.refresh(); // re-render the freshness badge with the new timestamp
      setTimeout(() => setState("idle"), 2500);
    } catch (e) {
      setState("error");
      setErrorMsg(e instanceof Error ? e.message : "Failed");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {state === "error" && (
        <p className="font-sans text-[11px] bg-[#7B2020] text-white px-3 py-1.5 rounded-full max-w-[260px]">
          {errorMsg}
        </p>
      )}
      <button
        onClick={confirmAvailable}
        disabled={state === "busy"}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg transition-all hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: state === "done" ? "#1A3A2A" : "#FFFFFF",
          color: state === "done" ? "#FFFFFF" : "#1A3A2A",
          border: "1px solid #1A3A2A",
        }}
      >
        {state === "busy" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        {state === "done" ? "Confirmed ✓" : "Confirm available"}
      </button>
      <a
        href={`${ADMIN_URL}/listings/${listingId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#B8935A", color: "#111110" }}
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit in Admin
      </a>
    </div>
  );
}
