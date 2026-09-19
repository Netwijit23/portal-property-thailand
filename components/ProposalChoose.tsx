"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

/**
 * The tenant's "choose this unit" control for one option on a proposal.
 * Choosing records the pick and notifies the agent; the tenant can switch to a
 * different option (or edit their note) until the agent clears the choice.
 */
export default function ProposalChoose({
  token,
  itemId,
  project,
  isChosen,
  anyChosen,
  disabled,
  initialNote,
  agentName,
}: {
  token: string;
  itemId: number;
  project: string;
  isChosen: boolean;
  anyChosen: boolean;
  disabled: boolean;
  initialNote: string;
  agentName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/proposal-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, itemId, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong — please try again.");
        setBusy(false);
        return;
      }
      setOpen(false);
      router.refresh(); // re-render with the recorded choice
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
    }
    setBusy(false);
  }

  if (disabled && !isChosen) return null;

  return (
    <div className="mt-6 pt-5 border-t border-[#E8E4DC]">
      {isChosen && !open && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[#1F7A4D]">
            <CheckCircle2 size={18} /> This is your choice
          </span>
          {!disabled && (
            <button type="button" onClick={() => setOpen(true)} className="font-sans text-[13px] underline underline-offset-2 text-[#5C5850] hover:text-[#B8935A]">
              {initialNote ? "Edit my note" : "Add a note"}
            </button>
          )}
        </div>
      )}

      {!isChosen && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto font-sans text-[14px] font-medium px-7 py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
        >
          {anyChosen ? "Switch to this one" : "Choose this one"}
        </button>
      )}

      {open && (
        <div>
          <p className="font-sans text-sm text-[#3A3835]">
            {isChosen ? "Update your note for" : "You're choosing"} <span className="font-medium">{project}</span>. {agentName} will be notified straight away.
          </p>
          <label className="block mt-3">
            <span className="font-sans text-xs uppercase tracking-wide text-[#8A8680]">Anything to add? (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="e.g. Preferred move-in date, questions about the terms…"
              className="mt-1.5 w-full rounded-xl border border-[#E8E4DC] bg-white px-4 py-3 font-sans text-[15px] text-[#0A0A0A] placeholder:text-[#B0AEA8] focus:outline-none focus:border-[#B8935A]"
            />
          </label>
          {error && <p role="alert" className="mt-2 font-sans text-sm text-[#7B2020]">{error}</p>}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={confirm}
              disabled={busy}
              className="inline-flex items-center gap-2 font-sans text-[14px] font-medium px-7 py-3.5 rounded-full bg-[#B8935A] text-white hover:bg-[#a5834f] disabled:opacity-60 transition-colors"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {isChosen ? "Save note" : "Confirm my choice"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); setNote(initialNote); }}
              disabled={busy}
              className="font-sans text-[14px] px-5 py-3.5 rounded-full border border-[#E8E4DC] text-[#3A3835] hover:border-[#B8935A] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
