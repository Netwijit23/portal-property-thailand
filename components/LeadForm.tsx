"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const CONTACT_METHODS = ["📞 Phone call", "💬 WhatsApp", "LINE"] as const;
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3+ months"];
const BUDGETS = ["Around listed price", "Flexible ±10%", "Negotiable"];

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
    useState<(typeof CONTACT_METHODS)[number]>("💬 WhatsApp");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [budget, setBudget] = useState(BUDGETS[0]);
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
      `Budget flexibility: ${budget}`,
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
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 text-center sticky top-24">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="font-cormorant text-2xl text-[#0A0A0A] mb-2">Enquiry Sent!</h3>
        <p className="font-sans text-sm text-[#8A8680] leading-relaxed">
          Our team will be in touch within 2 hours during business hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sticky top-24">
      <h3 className="font-cormorant text-xl text-[#0A0A0A] mb-1">
        {isRented ? "Join the waitlist" : "I'm interested in this unit"}
      </h3>
      <p className="font-sans text-sm text-[#8A8680] mb-5">
        {isRented ? "We'll notify you when this unit becomes available" : "Our team will contact you within 2 hours"}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Name + Phone */}
        <div className="flex gap-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            className={inputClass + " flex-1 min-w-0"}
          />
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone *"
            className={inputClass + " flex-1 min-w-0"}
          />
        </div>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className={inputClass}
        />

        {/* LINE ID */}
        <input
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
          placeholder="LINE ID (optional)"
          className={inputClass}
        />

        {/* Preferred contact */}
        <div>
          <p className="font-sans text-[10px] uppercase tracking-wider text-[#8A8680] mb-2">
            Preferred contact
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {CONTACT_METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setContactMethod(m)}
                className={`font-sans text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                  contactMethod === m
                    ? "border-[#B8935A] bg-[#B8935A]/10 text-[#B8935A]"
                    : "border-[#E8E4DC] text-[#8A8680] hover:border-[#B8935A]/40"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline + Budget */}
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="font-sans text-[10px] uppercase tracking-wider text-[#8A8680] mb-1.5">
              Move-in
            </p>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className={inputClass}
            >
              {TIMELINES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <p className="font-sans text-[10px] uppercase tracking-wider text-[#8A8680] mb-1.5">
              Budget
            </p>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            >
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific requirements? (e.g. furnished, high floor, parking...)"
          rows={2}
          className={inputClass + " resize-none"}
        />

        {error && (
          <p className="font-sans text-xs text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium py-3.5 rounded-xl bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors disabled:opacity-60 mt-1"
        >
          {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : isRented ? "Join Waitlist →" : "Send Enquiry →"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#B8935A] transition-colors bg-white placeholder-[#C0BBB4]";
