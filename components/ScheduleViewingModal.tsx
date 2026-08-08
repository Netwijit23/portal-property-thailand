"use client";
import { useEffect, useState } from "react";
import { X, Check, Loader2, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isValidEmail, isValidPhone, useSpamGuard } from "@/lib/formGuards";
import { trackFormStart, trackFormComplete } from "@/lib/analytics";
import {
  detectMismatch, todayISO, LEASE_TERMS, TIMES_OF_DAY,
  type LeaseTerm, type TimeOfDay, type ViewingListingTerms, type MismatchResult,
} from "@/lib/viewing";
import ViewingMismatchModal from "@/components/ViewingMismatchModal";

export interface ScheduleViewingContext {
  /** Listing this request is for. Omitted on the general enquiry page. */
  listingId?: string | null;
  listingTitle?: string | null;
  listingPrice?: string | null;
  terms?: ViewingListingTerms | null;
}

export default function ScheduleViewingModal({
  context,
  onClose,
}: {
  context: ScheduleViewingContext;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line, setLine] = useState("");
  const [email, setEmail] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | "">("");
  const [leaseTerm, setLeaseTerm] = useState<LeaseTerm | "">("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  // Free-text listing reference when there's no listing in context
  const [listingRef, setListingRef] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [mismatch, setMismatch] = useState<MismatchResult | null>(null);
  const { trapRef, isSpam } = useSpamGuard();

  useEffect(() => { trackFormStart("schedule_viewing"); }, []);

  // Escape closes; lock background scroll while open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape" && !mismatch) onClose(); }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, mismatch]);

  function validate(): string | null {
    if (name.trim().length < 2) return "Please enter your name.";
    if (!isValidPhone(phone)) return "Please enter a valid phone number.";
    if (!isValidEmail(email)) return "Please enter a valid email address.";
    if (!date1) return "Please choose a preferred viewing date.";
    if (!leaseTerm) return "Please choose a lease term.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const invalid = validate();
    if (invalid) { setError(invalid); return; }
    setError("");
    if (isSpam()) { setDone(true); return; }

    const result = detectMismatch({ leaseTerm, budget, listing: context.terms });
    if (result.hasMismatch) {
      // Confirm before submitting — the request still goes through on Continue.
      setMismatch(result);
      return;
    }
    void send(null);
  }

  async function send(result: MismatchResult | null) {
    setSubmitting(true);
    const reference = context.listingTitle
      ? `${context.listingTitle}${context.listingId ? ` (ID: ${context.listingId})` : ""}`
      : listingRef.trim() || "Not sure yet — open to suggestions";
    const leaseLabel = LEASE_TERMS.find((t) => t.value === leaseTerm)?.label ?? "—";
    const timeLabel = TIMES_OF_DAY.find((t) => t.value === timeOfDay)?.label;

    const notesLines = [
      "── SCHEDULE VIEWING REQUEST ──",
      // Surfaced first so the agent sees the flag immediately in the inbox.
      result?.tags.length ? `⚠ ${result.tags.join(" · ")}` : null,
      `Listing: ${reference}`,
      context.listingPrice ? `Listed at: ${context.listingPrice}` : null,
      `Preferred date: ${date1}${date2 ? ` (alt: ${date2})` : ""}`,
      timeLabel ? `Preferred time: ${timeLabel}` : null,
      `Lease term wanted: ${leaseLabel}`,
      budget ? `Budget: ฿${budget}` : null,
      email ? `Email: ${email}` : null,
      notes ? `Notes: ${notes}` : null,
      result?.reasons.length ? `Mismatch detail: ${result.reasons.join("; ")}` : null,
    ].filter(Boolean).join("\n");

    const { error: dbError } = await supabase.from("leads").insert({
      client_name: name,
      client_phone: phone,
      client_line: line || null,
      email: email || null,
      status: "new" as const,
      notes: notesLines,
      listing_type: "rent" as const,
    });

    // Email is best-effort — the lead is already saved.
    fetch("/api/send-lead-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: name, client_phone: phone, client_email: email, client_line: line,
        listing_id: context.listingId ?? "", listing_title: `Viewing request — ${reference}`,
        listing_price: context.listingPrice ?? "", notes: notesLines,
      }),
    }).catch(() => {});

    setSubmitting(false);
    setMismatch(null);
    if (dbError) {
      setError("Something went wrong. Please try again, or contact us on LINE or WhatsApp.");
      return;
    }
    trackFormComplete("schedule_viewing");
    setDone(true);
  }

  const field = "w-full font-sans text-[14px] text-[#0A0A0A] bg-[#F7F5F1] rounded-xl px-4 py-3 outline-none placeholder-[#B0AAA2] focus:ring-1 focus:ring-[#B8935A]/50 transition-shadow";
  const label = "font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-2 block";

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => { if (e.target === e.currentTarget && !mismatch) onClose(); }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="viewing-title"
          className="bg-white rounded-t-[24px] sm:rounded-[20px] w-full sm:max-w-[520px] elev-3 overflow-y-auto max-h-[92vh]"
          style={{ animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {done ? (
            <div className="px-8 py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1A3A2A] flex items-center justify-center mx-auto mb-5">
                <Check size={22} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-cormorant text-[26px] font-light text-[#0A0A0A] mb-2">Viewing request sent</h3>
              <p className="font-sans text-[13.5px] text-[#8A8680] leading-relaxed max-w-xs mx-auto mb-7">
                An agent will contact you to confirm the time — times aren&apos;t booked
                until we&apos;ve spoken.
              </p>
              <button onClick={onClose} className="press font-sans text-[14px] font-medium px-8 py-3 rounded-full border border-[#E8E4DC] text-[#0A0A0A] hover:bg-[#F5F2EC] transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#E8E4DC]">
                <div className="pr-2">
                  <div className="flex items-center gap-2 mb-1 text-[#B8935A]">
                    <CalendarDays size={14} />
                    <span className="font-sans text-[10px] uppercase tracking-[2px]">Book a viewing</span>
                  </div>
                  <h3 id="viewing-title" className="font-cormorant text-[24px] font-light text-[#0A0A0A] leading-snug">
                    {context.listingTitle || "Schedule a viewing"}
                  </h3>
                  {context.listingPrice && (
                    <p className="font-sans text-[13px] text-[#B8935A] font-medium mt-0.5 tabular">{context.listingPrice}</p>
                  )}
                </div>
                <button onClick={onClose} aria-label="Close" className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors shrink-0 mt-0.5">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                <input ref={trapRef} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] w-px h-px opacity-0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={label} htmlFor="v-name">Name</label>
                    <input id="v-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="v-phone">Phone / WhatsApp</label>
                    <input id="v-phone" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+66…" className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="v-email">Email</label>
                    <input id="v-email" required type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="v-line">LINE ID <span className="normal-case tracking-normal text-[#B0AAA2]">· optional</span></label>
                    <input id="v-line" value={line} onChange={(e) => setLine(e.target.value)} placeholder="@yourid" className={field} />
                  </div>
                </div>

                {/* Listing reference — only when not opened from a listing */}
                {!context.listingTitle && (
                  <div>
                    <label className={label} htmlFor="v-ref">Which property? <span className="normal-case tracking-normal text-[#B0AAA2]">· optional</span></label>
                    <input id="v-ref" value={listingRef} onChange={(e) => setListingRef(e.target.value)} placeholder="Condo or listing name — or leave blank if you're not sure yet" className={field} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={label} htmlFor="v-date1">Preferred date</label>
                    <input id="v-date1" required type="date" min={todayISO()} value={date1} onChange={(e) => setDate1(e.target.value)} className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="v-date2">Alternative date <span className="normal-case tracking-normal text-[#B0AAA2]">· optional</span></label>
                    <input id="v-date2" type="date" min={date1 || todayISO()} value={date2} onChange={(e) => setDate2(e.target.value)} className={field} />
                  </div>
                </div>

                <div>
                  <span className={label}>Preferred time <span className="normal-case tracking-normal text-[#B0AAA2]">· optional</span></span>
                  <div className="flex gap-2">
                    {TIMES_OF_DAY.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTimeOfDay(timeOfDay === t.value ? "" : t.value)}
                        aria-pressed={timeOfDay === t.value}
                        className={`flex-1 font-sans text-[13px] py-2.5 rounded-xl border transition-colors ${
                          timeOfDay === t.value
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "bg-white text-[#6B6963] border-[#E8E4DC] hover:border-[#B8935A]/50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={label} htmlFor="v-lease">Lease term</label>
                    <select id="v-lease" required value={leaseTerm} onChange={(e) => setLeaseTerm(e.target.value as LeaseTerm)} className={`${field} appearance-none cursor-pointer`}>
                      <option value="">Select…</option>
                      {LEASE_TERMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={label} htmlFor="v-budget">Budget <span className="normal-case tracking-normal text-[#B0AAA2]">· per month</span></label>
                    <div className="flex items-center bg-[#F7F5F1] rounded-xl px-4 focus-within:ring-1 focus-within:ring-[#B8935A]/50 transition-shadow">
                      <span className="font-sans text-[14px] text-[#B8935A] font-medium">฿</span>
                      <input id="v-budget" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^\d,]/g, ""))} placeholder="e.g. 45,000" className="w-full font-sans text-[14px] text-[#0A0A0A] bg-transparent px-2 py-3 outline-none placeholder-[#B0AAA2] tabular" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={label} htmlFor="v-notes">Message <span className="normal-case tracking-normal text-[#B0AAA2]">· optional</span></label>
                  <textarea id="v-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know before the viewing?" className={`${field} resize-none`} />
                </div>

                {error && <p className="font-sans text-[12px] text-red-500">{error}</p>}

                <button type="submit" disabled={submitting} className="press w-full inline-flex items-center justify-center gap-2 font-sans text-[14px] font-medium py-3.5 rounded-full bg-[#B8935A] text-white hover:bg-[#a07d4a] transition-colors disabled:opacity-60">
                  {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Request viewing"}
                </button>
                <p className="font-sans text-[11px] text-[#A8A29A] text-center -mt-1">
                  An agent confirms every viewing personally — nothing is booked automatically.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {mismatch && (
        <ViewingMismatchModal
          result={mismatch}
          submitting={submitting}
          onContinue={() => void send(mismatch)}
          onEdit={() => setMismatch(null)}
        />
      )}
    </>
  );
}
