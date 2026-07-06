"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Check, Phone, MessageCircle } from "lucide-react";

const CONTACT_METHODS = ["Phone", "WhatsApp", "LINE"] as const;
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3+ months"];
const BUDGETS = ["Around listed price", "Flexible ±10%", "Negotiable"];
const CUSTOM_BUDGET = "Custom amount…";

type Props = {
  listingId: string;
  listingTitle: string;
  listingPrice: string;
  isRented?: boolean;
};

export default function LeadForm({ listingId, listingTitle, listingPrice, isRented = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [contactMethod, setContactMethod] =
    useState<(typeof CONTACT_METHODS)[number]>("WhatsApp");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [customBudget, setCustomBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const notesLines = [
      `Source: listing detail page (ID: ${listingId})`,
      `Listing: ${listingTitle} — ${listingPrice}`,
      email ? `Email: ${email}` : null,
      `Preferred contact: ${contactMethod}`,
      `Move-in: ${timeline}`,
      `Budget: ${budget === CUSTOM_BUDGET ? (customBudget ? `฿${customBudget}` : "Custom (not specified)") : budget}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean).join("\n");

    const leadData = {
      client_name: name,
      client_phone: phone,
      client_line: lineId || null,
      status: "new" as const,
      notes: notesLines,
    };

    try {
      // Save to Supabase
      await supabase.from("leads").insert(leadData);

      // Send email notification
      await fetch("/api/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          listing_title: listingTitle,
          listing_price: listingPrice,
        }),
      });

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-10 text-center sticky top-24">
        <div className="w-12 h-12 rounded-full bg-[#1A3A2A] flex items-center justify-center mx-auto mb-5">
          <Check size={22} className="text-white" strokeWidth={2.5} />
        </div>
        <h3 className="font-cormorant text-2xl text-[#0A0A0A] mb-2">Enquiry sent</h3>
        <p className="font-sans text-[13px] text-[#8A8680] leading-relaxed">
          Our team will be in touch within 2 hours during business hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-5">
        <h3 className="font-cormorant text-[22px] font-medium text-[#0A0A0A] leading-tight">
          {isRented ? "Join the waitlist" : "Enquire about this home"}
        </h3>
        <p className="font-sans text-[12px] text-[#8A8680] mt-1">
          {isRented ? "We'll notify you when this unit becomes available" : "Response within 2 hours"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Grouped fields — iOS settings style */}
        <div className="mx-6 rounded-xl bg-[#F7F5F1] overflow-hidden">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={groupedInput}
          />
          <div className={divider} />
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className={groupedInput}
          />
          <div className={divider} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email · optional"
            className={groupedInput}
          />
          <div className={divider} />
          <input
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            placeholder="LINE ID · optional"
            className={groupedInput}
          />
        </div>

        {/* Preferred contact — segmented control */}
        <div className="px-6 mt-5">
          <p className={label}>Preferred contact</p>
          <div className="flex rounded-xl bg-[#F7F5F1] p-1">
            {CONTACT_METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setContactMethod(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 font-sans text-[12px] font-medium py-2 rounded-lg transition-all duration-200 ${
                  contactMethod === m
                    ? "bg-white text-[#0A0A0A] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "text-[#8A8680] hover:text-[#0A0A0A]"
                }`}
              >
                {m === "Phone" && <Phone size={12} strokeWidth={1.8} />}
                {m === "WhatsApp" && <MessageCircle size={12} strokeWidth={1.8} />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Move-in + Budget */}
        <div className="px-6 mt-5 flex gap-3">
          <div className="flex-1 min-w-0">
            <p className={label}>Move-in</p>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className={selectClass}
            >
              {TIMELINES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <p className={label}>Budget</p>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={selectClass}
            >
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              <option>{CUSTOM_BUDGET}</option>
            </select>
          </div>
        </div>

        {/* Custom budget amount — revealed when "Custom amount…" is selected */}
        {budget === CUSTOM_BUDGET && (
          <div className="px-6 mt-3">
            <div className="flex items-center bg-[#F7F5F1] rounded-xl px-4 focus-within:ring-1 focus-within:ring-[#B8935A]/50 transition-shadow">
              <span className="font-sans text-[13px] text-[#B8935A] font-medium">฿</span>
              <input
                autoFocus
                inputMode="numeric"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value.replace(/[^\d,.]/g, ""))}
                placeholder="Your budget, e.g. 45,000 / month"
                className="w-full font-sans text-[13px] text-[#0A0A0A] bg-transparent px-2 py-3 outline-none placeholder-[#A8A29A]"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="px-6 mt-5">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything specific? Furnished, high floor, parking…"
            rows={2}
            className="w-full font-sans text-[13px] text-[#0A0A0A] bg-[#F7F5F1] rounded-xl px-4 py-3 outline-none resize-none placeholder-[#A8A29A] focus:ring-1 focus:ring-[#B8935A]/50 transition-shadow"
          />
        </div>

        {error && (
          <p className="px-6 mt-3 font-sans text-xs text-red-500">{error}</p>
        )}

        {/* Submit */}
        <div className="px-6 pb-6 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="press w-full flex items-center justify-center gap-2 font-sans text-[14px] font-medium py-3.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors duration-300 disabled:opacity-60"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
              : isRented ? "Join Waitlist" : "Send Enquiry"}
          </button>
          <p className="font-sans text-[10px] text-[#A8A29A] text-center mt-3">
            No spam — we only contact you about this property.
          </p>
        </div>
      </form>
    </div>
  );
}

const groupedInput =
  "w-full font-sans text-[13px] text-[#0A0A0A] bg-transparent px-4 py-3 outline-none placeholder-[#A8A29A]";
const divider = "h-px bg-[#E8E4DC] mx-4";
const label =
  "font-sans text-[10px] uppercase tracking-[1.5px] text-[#A8A29A] mb-2";
const selectClass =
  "w-full font-sans text-[13px] text-[#0A0A0A] bg-[#F7F5F1] rounded-xl px-3.5 py-3 outline-none appearance-none cursor-pointer";
