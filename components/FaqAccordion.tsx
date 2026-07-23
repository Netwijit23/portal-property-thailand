"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqGroup } from "@/lib/faq";

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="font-cormorant text-[26px] font-medium text-[#0A0A0A] mb-5">{group.title}</h2>
          <div className="flex flex-col gap-3">
            {group.items.map((item) => {
              const key = `${group.title}::${item.question}`;
              const open = openKey === key;
              return (
                <div key={key} className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenKey(open ? null : key)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-sans text-[14px] font-medium text-[#0A0A0A]">{item.question}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#B8935A] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <p className="px-5 pb-4 font-sans text-[13.5px] text-[#6B6963] leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
