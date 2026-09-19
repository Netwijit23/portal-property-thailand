"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Loader2, Plus } from "lucide-react";

/**
 * The tenant ticks the units they'd like to VIEW, then sends their picks to the
 * agent in one go. Ticking is local until they send; they can update and resend
 * any time before the proposal expires.
 */
interface SelectionState {
  selected: Set<number>;
  toggle: (id: number) => void;
  disabled: boolean;
}

const Ctx = createContext<SelectionState | null>(null);

function sameSet(a: Set<number>, b: Set<number>) {
  return a.size === b.size && Array.from(a).every((x) => b.has(x));
}

export function SelectionProvider({
  token,
  initialSelected,
  initialNote,
  expired,
  agentName,
  children,
}: {
  token: string;
  initialSelected: number[];
  initialNote: string;
  expired: boolean;
  agentName: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set(initialSelected));
  const [note, setNote] = useState(initialNote);
  // What the agent currently has — updated locally on a successful send.
  const [saved, setSaved] = useState(() => ({ ids: new Set(initialSelected), note: initialNote }));
  const [noteOpen, setNoteOpen] = useState(!!initialNote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = !sameSet(selected, saved.ids) || note.trim() !== saved.note.trim();
  const barVisible = !expired && (selected.size > 0 || dirty);

  function toggle(id: number) {
    setError(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function send() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/proposal-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, itemIds: Array.from(selected), note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong — please try again.");
        setBusy(false);
        return;
      }
      setSaved({ ids: new Set(selected), note: note.trim() });
      router.refresh(); // re-render the banner with what was recorded
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <Ctx.Provider value={{ selected, toggle, disabled: expired }}>
      {children}
      {barVisible && <div aria-hidden className="h-40" />}
      {barVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#E8E4DC] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          {/* pr-20 keeps clear of the floating chat button */}
          <div className="max-w-3xl mx-auto px-5 pt-3 pb-4 pr-20 md:pr-5">
            {noteOpen && (
              <textarea
                value={note}
                onChange={(e) => { setNote(e.target.value); setError(null); }}
                maxLength={500}
                rows={2}
                placeholder="Anything to add? e.g. preferred days or times, questions…"
                aria-label="Note for your agent"
                className="mb-3 w-full rounded-xl border border-[#E8E4DC] bg-white px-4 py-2.5 font-sans text-[14px] text-[#0A0A0A] placeholder:text-[#B0AEA8] focus:outline-none focus:border-[#B8935A]"
              />
            )}
            {error && <p role="alert" className="mb-2 font-sans text-sm text-[#7B2020]">{error}</p>}
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-medium text-[#0A0A0A]">
                  {selected.size} unit{selected.size === 1 ? "" : "s"} selected
                </p>
                {!dirty && selected.size > 0 ? (
                  <p className="font-sans text-xs text-[#1F7A4D] flex items-center gap-1"><CheckCircle2 size={13} /> Sent to {agentName}</p>
                ) : (
                  <button type="button" onClick={() => setNoteOpen((v) => !v)} className="font-sans text-xs underline underline-offset-2 text-[#8A8680] hover:text-[#B8935A]">
                    {noteOpen ? "Hide note" : "Add a note"}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={send}
                disabled={busy || !dirty || selected.size === 0}
                className="inline-flex items-center gap-2 font-sans text-[14px] font-medium px-6 py-3 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] disabled:opacity-40 disabled:hover:bg-[#0A0A0A] transition-colors shrink-0"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                {saved.ids.size > 0 ? "Update my picks" : "Send my picks"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** "I'd like to view this" toggle for one unit. Renders nothing once the proposal has expired. */
export function SelectToggle({ itemId }: { itemId: number }) {
  const ctx = useContext(Ctx);
  if (!ctx || ctx.disabled) return null;
  const on = ctx.selected.has(itemId);
  return (
    <div className="mt-6 pt-5 border-t border-[#E8E4DC]">
      <button
        type="button"
        onClick={() => ctx.toggle(itemId)}
        aria-pressed={on}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-[14px] font-medium px-7 py-3.5 rounded-full border transition-colors ${
          on ? "bg-[#1F7A4D] border-[#1F7A4D] text-white" : "bg-white border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
        }`}
      >
        {on ? <Check size={17} strokeWidth={2.5} /> : <Plus size={17} />}
        I&apos;d like to view this
      </button>
    </div>
  );
}
