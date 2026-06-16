"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  listing: { id: string; title: string; price: string };
  onClose: () => void;
};

const CONTACT_METHODS = ["📞 Phone call", "💬 WhatsApp", "LINE"] as const;
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3+ months"];
const BUDGETS = ["Around listed price", "Flexible ±10%", "Negotiable"];

export default function EnquiryModal({ listing, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [contactMethod, setContactMethod] =
    useState<(typeof CONTACT_METHODS)[number]>("💬 WhatsApp");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const notesLines = [
      `Source: hot listings enquiry (ID: ${listing.id})`,
      `Listing: ${listing.title} — ${listing.price}`,
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
      await supabase.from("leads").insert(leadData);
      await fetch("/api/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          listing_title: listing.title,
          listing_price: listing.price,
        }),
      });
    } catch {
      // Still show success — lead saved to DB even if email fails
    } finally {
      setSuccess(true);
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[24px] md:rounded-[20px] w-full md:max-w-[480px] shadow-2xl overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.22s ease-out" }}
      >
        {success ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-5">✅</div>
            <h3 className="font-cormorant text-[26px] font-light text-[#0A0A0A] mb-2">
              Enquiry Sent!
            </h3>
            <p className="font-sans text-[13px] text-[#8A8680] mb-8 leading-relaxed">
              Our team will contact you within 2 hours during business hours.
            </p>
            <button
              onClick={onClose}
              className="font-sans text-sm font-medium px-8 py-3 rounded-full border border-[#E8E4DC] text-[#0A0A0A] hover:bg-[#F5F2EC] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#E8E4DC]">
              <div className="pr-4">
                <h3 className="font-cormorant text-[22px] font-light text-[#0A0A0A] leading-snug mb-1">
                  {listing.title}
                </h3>
                <p className="font-sans text-[13px] text-[#B8935A] font-medium">
                  {listing.price}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors mt-0.5 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <p className="font-sans text-[13px] text-[#8A8680] leading-relaxed">
                Leave your details and one of our team will contact you within 2 hours during
                business hours.
              </p>

              {/* Name + Phone */}
              <div className="flex gap-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name *"
                  className="flex-1 font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#B8935A] transition-colors min-w-0"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone / WhatsApp *"
                  className="flex-1 font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#B8935A] transition-colors min-w-0"
                />
              </div>

              {/* LINE ID */}
              <input
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="LINE ID (optional)"
                className="w-full font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#B8935A] transition-colors"
              />

              {/* Preferred contact */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-2.5">
                  Preferred contact method
                </p>
                <div className="flex gap-2 flex-wrap">
                  {CONTACT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setContactMethod(m)}
                      className={`font-sans text-[12px] px-3.5 py-1.5 rounded-full border transition-all ${
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
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-2">
                    Move-in timeline
                  </p>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none bg-white focus:border-[#B8935A] transition-colors"
                  >
                    {TIMELINES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <p className="font-sans text-[11px] uppercase tracking-wider text-[#8A8680] mb-2">
                    Budget
                  </p>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none bg-white focus:border-[#B8935A] transition-colors"
                  >
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requirements */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. pet-friendly, high floor, furnished, parking..."
                rows={3}
                className="w-full font-sans text-sm border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#B8935A] transition-colors resize-none"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-sans text-sm font-medium py-3.5 rounded-xl bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send My Enquiry →"}
              </button>

              {/* Direct contact */}
              <div className="pt-2 border-t border-[#E8E4DC]">
                <p className="font-sans text-[11px] text-[#8A8680] text-center mb-3">
                  Or contact us directly:
                </p>
                <div className="flex gap-3 justify-center">
                  <a
                    href="https://wa.me/66650595097"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[12px] font-medium px-5 py-2 rounded-full bg-[#25D366] text-white"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://line.me/R/ti/p/@portalproperty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[12px] font-medium px-5 py-2 rounded-full bg-[#00B900] text-white"
                  >
                    LINE: @portalproperty
                  </a>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
