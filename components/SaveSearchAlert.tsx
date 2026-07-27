"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isValidEmail, useSpamGuard } from "@/lib/formGuards";

// Lets a visitor subscribe to new-listing alerts for their current filters.
// MVP: captures the search + email as a tagged lead (via the existing leads
// pipeline + notification email) so the agent is notified and can act on it.
// Automated matching/sending is a future backend job — see MIGRATION_NOTES.
function summariseFilters(p: URLSearchParams): string {
  const parts: string[] = [];
  if (p.get("q")) parts.push(`“${p.get("q")}”`);
  if (p.get("type")) parts.push(p.get("type") === "rent" ? "For rent" : "For sale");
  if (p.get("zone")) parts.push(p.get("zone")!);
  if (p.get("propType")) parts.push(p.get("propType")!);
  if (p.get("minBeds")) parts.push(`${p.get("minBeds")}+ bed`);
  if (p.get("bedrooms")) parts.push(`${p.get("bedrooms")} bed`);
  const lo = p.get("priceMin"), hi = p.get("priceMax");
  if (lo || hi) parts.push(`฿${lo || "0"}–${hi || "∞"}`);
  return parts.length ? parts.join(" · ") : "All Bangkok listings";
}

export default function SaveSearchAlert() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { trapRef, isSpam } = useSpamGuard();

  const summary = summariseFilters(searchParams);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { setState("error"); return; }
    if (isSpam()) { setState("done"); return; }
    setState("loading");

    const notes = [
      "── NEW-LISTING ALERT REQUEST ──",
      `Search: ${summary}`,
      `Query string: ?${searchParams.toString()}`,
      `Notify: ${email}`,
    ].join("\n");

    const { error } = await supabase.from("leads").insert({
      client_name: "New-listing alert",
      client_email: email,
      status: "new" as const,
      notes,
    });
    fetch("/api/send-lead-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_name: "New-listing alert", client_email: email, listing_title: `Alert — ${summary}`, notes }),
    }).catch(() => {});

    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl bg-[#1A3A2A]/[0.06] border border-[#1A3A2A]/15">
        <Check size={16} className="text-[#1A3A2A] shrink-0" />
        <p className="font-sans text-[13px] text-[#1A3A2A]">
          You&apos;re set — we&apos;ll email you when new matches for <span className="font-medium">{summary}</span> are listed.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="press inline-flex items-center gap-2 font-sans text-[13px] text-[#4A4840] px-4 py-2.5 rounded-full border border-[#E8E4DC] bg-white hover:border-[#B8935A] transition-colors"
        >
          <Bell size={14} className="text-[#B8935A]" />
          Get alerts for this search
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-4 py-3 rounded-xl border border-[#E8E4DC] bg-white elev-1">
          <input ref={trapRef} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] w-px h-px opacity-0" />
          <div className="flex items-center gap-2 shrink-0 text-[#0A0A0A]">
            <Bell size={15} className="text-[#B8935A]" />
            <span className="font-sans text-[12px] font-medium">Alert me about <span className="text-[#8A8680]">{summary}</span></span>
          </div>
          <div className="flex gap-2 flex-1 sm:justify-end">
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
              placeholder="you@email.com"
              className={`flex-1 sm:flex-none sm:w-56 font-sans text-[13px] bg-[#F7F5F1] rounded-lg px-3.5 py-2.5 outline-none focus:ring-1 transition-shadow ${state === "error" ? "ring-1 ring-red-400" : "focus:ring-[#B8935A]/50"}`}
            />
            <button type="submit" disabled={state === "loading"} className="press inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-4 py-2.5 rounded-lg bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors disabled:opacity-60">
              {state === "loading" ? <Loader2 size={14} className="animate-spin" /> : "Notify me"}
            </button>
          </div>
        </form>
      )}
      {state === "error" && (
        <p className="font-sans text-[11px] text-red-500 mt-1.5 px-1">Please enter a valid email address.</p>
      )}
    </div>
  );
}
