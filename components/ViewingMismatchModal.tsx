"use client";
import { useEffect, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import type { MismatchResult } from "@/lib/viewing";

// One modal for both conditions (lease term and/or budget) — the copy is built
// from the detected reasons rather than duplicating a modal per rule.
export default function ViewingMismatchModal({
  result,
  submitting,
  onContinue,
  onEdit,
}: {
  result: MismatchResult;
  submitting?: boolean;
  onContinue: () => void;
  onEdit: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Focus the dialog on open, restore focus on close, and close on Escape.
  useEffect(() => {
    const restoreTo = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onEdit();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo?.focus?.();
    };
  }, [onEdit]);

  // "the lease term and budget differ" / "the lease term differs"
  const subject = result.leaseMismatch && result.budgetMismatch
    ? "lease term and budget"
    : result.leaseMismatch
      ? "lease term"
      : "budget";

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onEdit(); }}
    >
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mismatch-title"
        tabIndex={-1}
        className="bg-white rounded-t-[24px] sm:rounded-[20px] w-full sm:max-w-[440px] elev-3 px-7 py-8 focus:outline-none"
        style={{ animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FDF6EC] flex items-center justify-center mb-5">
          <AlertCircle size={22} className="text-[#B8935A]" strokeWidth={1.8} />
        </div>

        <h3 id="mismatch-title" className="font-cormorant text-[26px] font-light text-[#0A0A0A] leading-tight mb-3">
          A quick note on this listing&apos;s terms
        </h3>

        <p className="font-sans text-[13.5px] text-[#6B6963] leading-relaxed mb-3">
          This listing&apos;s terms may not match what you&apos;ve entered — the {subject}{" "}
          {result.reasons.length > 1 ? "differ" : "differs"} from the listing.
        </p>

        {result.reasons.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {result.reasons.map((r) => (
              <li key={r} className="font-sans text-[12.5px] text-[#8A8680] leading-relaxed pl-3.5 relative">
                <span className="absolute left-0 top-[7px] w-1 h-1 rounded-full bg-[#B8935A]" />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </li>
            ))}
          </ul>
        )}

        <p className="font-sans text-[13px] text-[#6B6963] leading-relaxed mb-7">
          We&apos;ll still submit your request — an agent will reach out to confirm the
          details and viewing times.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onContinue}
            disabled={submitting}
            className="press w-full inline-flex items-center justify-center gap-2 font-sans text-[14px] font-medium py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors duration-300 disabled:opacity-60"
          >
            {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Continue"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            disabled={submitting}
            className="press w-full font-sans text-[14px] font-medium py-3.5 rounded-full text-[#4A4840] hover:bg-[#F5F2EC] transition-colors disabled:opacity-60"
          >
            Edit request
          </button>
        </div>
      </div>
    </div>
  );
}
