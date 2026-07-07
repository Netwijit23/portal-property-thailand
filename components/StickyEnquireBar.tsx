"use client";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";

// Mobile-only bottom bar that appears after scrolling past the hero and
// hides once the lead form sidebar is on screen.
export default function StickyEnquireBar({
  title,
  price,
}: {
  title: string;
  price: string;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const form = document.getElementById("lead-form");
    let formOnScreen = false;

    const observer = form
      ? new IntersectionObserver(([entry]) => {
          formOnScreen = entry.isIntersecting;
          setVisible(window.scrollY > 300 && !formOnScreen);
        })
      : null;
    if (form && observer) observer.observe(form);

    const onScroll = () => setVisible(window.scrollY > 300 && !formOnScreen);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  function scrollToForm() {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E4DC] px-5 py-3 flex items-center justify-between gap-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="min-w-0">
        <p className="font-cormorant text-[16px] font-medium text-[#0A0A0A] leading-tight truncate">
          {title}
        </p>
        <p className="font-sans text-[13px] font-medium text-[#B8935A] leading-tight">{price}</p>
      </div>
      <button
        onClick={scrollToForm}
        className="shrink-0 flex items-center gap-2 font-sans text-[13px] font-medium px-6 py-3 rounded-full bg-[#B8935A] text-white hover:bg-[#a07d4a] transition-colors"
      >
        <MessageCircle size={15} />
        {t("enquireCta")}
      </button>
    </div>
  );
}
