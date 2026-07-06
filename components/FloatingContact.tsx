"use client";
import { useState } from "react";
import { X, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/66650595097?text=Hi%20Portal%20Property%2C%20I%27d%20like%20to%20enquire%20about%20a%20property";
const LINE_URL = "https://line.me/R/ti/p/@portalproperty";
const PHONE = "+66650595097";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-5 bottom-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded panel — frosted glass */}
      {open && (
        <div
          className="rounded-3xl shadow-[0_16px_60px_rgba(0,0,0,0.22)] border border-white/50 p-5 w-[248px]"
          style={{ animation: "slideUp 0.2s cubic-bezier(0.16,1,0.3,1)", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-cormorant text-[19px] text-[#0A0A0A]">Talk to us</p>
            <button
              onClick={() => setOpen(false)}
              className="press text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <p className="font-sans text-[11px] text-[#8A8680] mb-4 leading-relaxed">
            We reply within 2 hours during business hours.
          </p>

          <div className="flex flex-col gap-2.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-sans text-[13px] font-medium px-4 py-2.5 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition-opacity"
            >
              {/* WhatsApp icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>

            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-sans text-[13px] font-medium px-4 py-2.5 rounded-xl bg-[#00B900] text-white hover:opacity-90 transition-opacity"
            >
              {/* LINE icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              LINE: @portalproperty
            </a>

            <a
              href={`tel:${PHONE}`}
              className="press flex items-center gap-2.5 font-sans text-[13px] font-medium px-4 py-2.5 rounded-xl bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
            >
              <Phone size={16} />
              Call us
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 text-center">
            <p className="font-sans text-[10px] text-[#8A8680]">Mon–Sat · 9 am – 7 pm</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`press w-14 h-14 rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(184,147,90,0.4)] transition-all duration-200 ${
          open
            ? "bg-[#0A0A0A] text-white rotate-0"
            : "bg-[#B8935A] text-white hover:bg-[#a07d4a]"
        }`}
        aria-label="Contact us"
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
