"use client";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

// ─── Shared Apple-style intake form primitives ───────────────────────────────

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#86868B]">
          {label}
        </label>
        {hint && <span className="font-sans text-[11px] text-[#B0AAA2]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const baseInput =
  "w-full font-sans text-[15px] text-[#0A0A0A] bg-[#F5F2EC] rounded-xl px-4 py-3.5 outline-none placeholder-[#B0AAA2] focus:ring-2 focus:ring-[#B8935A]/40 transition-shadow";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={baseInput} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} resize-none leading-relaxed`} />;
}

// Prefix input (e.g. ฿ budget)
export function PrefixInput({
  prefix,
  ...props
}: { prefix: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center bg-[#F5F2EC] rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#B8935A]/40 transition-shadow">
      <span className="font-sans text-[15px] text-[#B8935A] font-medium">{prefix}</span>
      <input
        {...props}
        className="w-full font-sans text-[15px] text-[#0A0A0A] bg-transparent px-2 py-3.5 outline-none placeholder-[#B0AAA2]"
      />
    </div>
  );
}

// Single-choice segmented control
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl bg-[#F5F2EC] p-1 gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 font-sans text-[13px] font-medium py-2.5 rounded-lg transition-all duration-200 ${
            value === o.value
              ? "bg-white text-[#0A0A0A] shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
              : "text-[#86868B] hover:text-[#0A0A0A]"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Multi-select chips
export function ChipMulti({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`font-sans text-[13px] px-3.5 py-2 rounded-full border transition-all duration-150 ${
              on
                ? "bg-[#B8935A] text-white border-[#B8935A]"
                : "bg-white text-[#4A4840] border-[#E8E4DC] hover:border-[#B8935A]/50"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

// Single-select chips (pills)
export function ChipSingle<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`font-sans text-[13px] px-4 py-2 rounded-full border transition-all duration-150 ${
            value === o.value
              ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
              : "bg-white text-[#4A4840] border-[#E8E4DC] hover:border-[#0A0A0A]/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Step wrapper with progress + nav
export function StepShell({
  step,
  total,
  title,
  subtitle,
  canNext,
  onBack,
  onNext,
  nextLabel,
  submitting,
  children,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  canNext: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  submitting?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-[#F0EDE8]">
        <div
          className="h-full bg-[#B8935A] transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>

      <div className="px-6 md:px-9 py-8">
        <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#B8935A] mb-2">
          Step {step} of {total}
        </p>
        <h2 className="font-cormorant text-[30px] font-light text-[#0A0A0A] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-[13px] text-[#86868B] mt-1.5">{subtitle}</p>
        )}

        <div className="mt-7 space-y-6">{children}</div>

        <div className="flex items-center gap-3 mt-9">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="press font-sans text-[14px] font-medium px-6 py-3.5 rounded-full text-[#4A4840] hover:bg-[#F5F2EC] transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext || submitting}
            className="press flex-1 font-sans text-[14px] font-medium py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors duration-300 disabled:opacity-40 disabled:hover:bg-[#0A0A0A]"
          >
            {submitting ? "Sending…" : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] px-8 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-[#1A3A2A] flex items-center justify-center mx-auto mb-6">
        <Check size={26} className="text-white" strokeWidth={2.5} />
      </div>
      <h2 className="font-cormorant text-[30px] font-light text-[#0A0A0A] mb-3">{title}</h2>
      <p className="font-sans text-[14px] text-[#86868B] leading-relaxed max-w-sm mx-auto">
        {message}
      </p>
    </div>
  );
}

// ─── Short-stay notice ────────────────────────────────────────────────────────
// Shown when the stay is under 6 months and the budget is under ฿50,000/month.
export const SHORT_STAY_BUDGET_LIMIT = 50000;

export function isShortStayCase(lengthOfStay: string, budget: string): boolean {
  if (lengthOfStay !== "Under 6 months") return false;
  const amount = parseFloat(budget.replace(/[^\d.]/g, ""));
  return !isNaN(amount) && amount > 0 && amount < SHORT_STAY_BUDGET_LIMIT;
}

export function ShortStayNotice({
  open,
  onContinue,
  onAdjust,
}: {
  open: boolean;
  onContinue: () => void;
  onAdjust: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onAdjust(); }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] px-7 py-8 text-center"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="w-12 h-12 rounded-full bg-[#F5F2EC] flex items-center justify-center mx-auto mb-5">
          <span className="font-cormorant text-[22px] text-[#B8935A]">i</span>
        </div>
        <h3 className="font-cormorant text-[26px] font-light text-[#0A0A0A] leading-tight mb-3">
          A quick note on short stays
        </h3>
        <p className="font-sans text-[13.5px] text-[#6B6963] leading-relaxed mb-2">
          Our minimum rental contract is <strong className="text-[#0A0A0A]">1 year</strong>.
          For stays under 6 months, we recommend looking into a{" "}
          <strong className="text-[#0A0A0A]">serviced apartment</strong> — they&apos;re designed
          for short-term living with flexible contracts.
        </p>
        <p className="font-sans text-[12.5px] text-[#86868B] leading-relaxed mb-7">
          You&apos;re welcome to continue — we&apos;ll do our best to advise.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onContinue}
            className="w-full font-sans text-[14px] font-medium py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors duration-300"
          >
            Continue anyway
          </button>
          <button
            type="button"
            onClick={onAdjust}
            className="w-full font-sans text-[14px] font-medium py-3.5 rounded-full text-[#4A4840] hover:bg-[#F5F2EC] transition-colors"
          >
            Adjust my requirements
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Structured-field helpers (chip values → typed columns) ─────────────────

/** "Studio" → 0, "4+" → 4, "2" → 2, unset/unrecognised → null. */
export function bedsToInt(beds: string | null): number | null {
  if (!beds) return null;
  if (beds === "Studio") return 0;
  if (beds === "4+") return 4;
  const n = parseInt(beds, 10);
  return Number.isNaN(n) ? null : n;
}

/** "฿45,000" → 45000, blank/unparsable → null. */
export function budgetToInt(budget: string): number | null {
  const n = parseInt(budget.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
}

/** Move-in timeline chip → an approximate ISO date, used only to compute
 * urgency (e.g. "within 7 days" → High priority) on the admin side. "Just
 * browsing" has no real timeline, so it's intentionally left null. */
export function timelineToDate(timeline: string): string | null {
  const days: Record<string, number> = {
    "ASAP": 0,
    "Within 1 month": 20,
    "1–3 months": 75,
  };
  if (!(timeline in days)) return null;
  const d = new Date();
  d.setDate(d.getDate() + days[timeline]);
  return d.toISOString().slice(0, 10);
}

// ─── Submit helper: writes to leads + fires email notification ───────────────
import { supabase } from "@/lib/supabase";

export async function submitEnquiry({
  kind,
  name,
  phone,
  line,
  email,
  summaryTitle,
  notesLines,
  dbNotesLines,
  listingType,
  propertyType,
  bedroomsWanted,
  zonesInterested,
  budgetMax,
  moveInDate,
  stayLength,
  nationality,
  occupants,
  pets,
  occupation,
}: {
  kind: string;
  name: string;
  phone: string;
  line?: string;
  email?: string;
  summaryTitle: string;
  /** Full pretty text for the notification email. */
  notesLines: (string | null | undefined)[];
  /** Genuinely freeform leftovers stored in the lead's notes column — the
   * structured answers below go into their own typed columns instead. */
  dbNotesLines?: (string | null | undefined)[];
  listingType?: "rent" | "sale" | null;
  propertyType?: string | null;
  bedroomsWanted?: number | null;
  zonesInterested?: string[] | null;
  budgetMax?: number | null;
  moveInDate?: string | null; // ISO date (YYYY-MM-DD)
  stayLength?: string | null;
  nationality?: string | null;
  occupants?: string | null;
  pets?: string | null;
  occupation?: string | null;
}): Promise<boolean> {
  const emailNotes = [`── ${kind} ──`, ...notesLines.filter(Boolean)].join("\n");
  // The "── kind ──" header stays in DB notes: the admin's lead-type badges
  // (Client / Co-broke / Owner) are derived from it.
  const dbNotes = [`── ${kind} ──`, ...(dbNotesLines ?? notesLines).filter(Boolean)].join("\n");

  const { error } = await supabase.from("leads").insert({
    client_name: name,
    client_phone: phone,
    client_line: line || null,
    email: email || null,
    status: "new",
    notes: dbNotes,
    listing_type: listingType ?? null,
    property_type: propertyType ?? null,
    bedrooms_wanted: bedroomsWanted ?? null,
    zones_interested: zonesInterested?.length ? zonesInterested : null,
    budget_max: budgetMax ?? null,
    move_in_date: moveInDate ?? null,
    stay_length: stayLength ?? null,
    nationality: nationality ?? null,
    occupants: occupants ?? null,
    pets: pets ?? null,
    occupation: occupation ?? null,
  });

  // Email is best-effort either way — if the DB insert failed it's also the
  // team's only copy of the enquiry, so definitely still send it.
  await fetch("/api/send-lead-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listing_title: summaryTitle,
      client_name: name,
      client_phone: phone,
      client_email: email || "",
      client_line: line || "",
      notes: emailNotes,
    }),
  }).catch(() => {});

  return !error;
}
