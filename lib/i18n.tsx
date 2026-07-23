"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "th";

// [en, th] pairs for UI chrome. Listing data (title_th, description_th,
// zone_th) comes from the database and is switched per-field.
const STRINGS = {
  // Navbar
  navBuy: ["Buy", "ซื้อ"],
  navRent: ["Rent", "เช่า"],
  navAreas: ["Areas", "ทำเล"],
  navInsights: ["Insights", "บทความ"],
  navFaq: ["FAQ", "คำถามที่พบบ่อย"],
  navEnquire: ["Enquire", "สอบถาม"],
  navAbout: ["About", "เกี่ยวกับเรา"],
  listProperty: ["List a Property", "ลงประกาศขาย/เช่า"],

  // Hero
  heroEyebrow: ["Bangkok Real Estate", "อสังหาริมทรัพย์กรุงเทพฯ"],
  heroTitlePre: ["Bangkok's ", "ที่สุดแห่ง"],
  heroTitleEm: ["Finest", "อสังหาฯ"],
  heroTitlePost: [" Properties", " กรุงเทพฯ"],
  heroSub: [
    "Explore condos, houses and apartments across Bangkok's most sought-after neighbourhoods",
    "ค้นหาคอนโด บ้าน และอพาร์ตเมนต์ ในทำเลที่ดีที่สุดของกรุงเทพฯ",
  ],

  // Listing card / shared listing labels
  forRent: ["For Rent", "ให้เช่า"],
  forSale: ["For Sale", "ขาย"],
  forBoth: ["For Sale · For Rent", "ขาย · ให้เช่า"],
  forRentAndSale: ["For Rent & Sale", "ให้เช่าและขาย"],
  rented: ["Rented", "ติดผู้เช่า"],
  featured: ["Featured", "แนะนำ"],
  studio: ["Studio", "สตูดิโอ"],
  sqm: ["sqm", "ตร.ม."],
  perMonth: ["/mo", "/เดือน"],
  perMonthLong: ["/ month", "/ เดือน"],
  priceOnRequest: ["Price on request", "สอบถามราคา"],
  viewProperty: ["View Property", "ดูรายละเอียด"],
  available: ["Available", "ว่าง"],
  availableSoon: ["Available soon", "ว่างเร็วๆ นี้"],
  or: ["or", "หรือ"],
  toBuy: ["to buy", "ราคาขาย"],

  // Freshness badge
  confirmedToday: ["Confirmed available today", "ยืนยันว่าว่าง วันนี้"],
  confirmedDaysAgo: ["Confirmed available {n}d ago", "ยืนยันว่าว่าง {n} วันก่อน"],

  // Listing detail
  bedrooms: ["Bedrooms", "ห้องนอน"],
  bathrooms: ["Bathrooms", "ห้องน้ำ"],
  size: ["Size", "ขนาด"],
  floor: ["Floor", "ชั้น"],
  aboutProperty: ["About this property", "เกี่ยวกับทรัพย์นี้"],
  similarProperties: ["Similar properties", "ทรัพย์ที่คล้ายกัน"],
  chatOnLine: ["Chat on LINE", "แชททาง LINE"],
  chatOnWhatsApp: ["WhatsApp", "WhatsApp"],
  chatPrefill: [
    "Hi, I'm interested in {title} ({price}) {url}",
    "สวัสดีครับ/ค่ะ สนใจ {title} ({price}) {url}",
  ],
  enquireCta: ["Enquire", "สอบถาม"],

  // Floating contact
  talkToUs: ["Talk to us", "ติดต่อเรา"],
  replyTime: [
    "We reply within 2 hours during business hours.",
    "เราตอบกลับภายใน 2 ชั่วโมง ในเวลาทำการ",
  ],
  callUs: ["Call us", "โทรหาเรา"],
  openingHours: ["Mon–Sat · 9 am – 7 pm", "จันทร์–เสาร์ · 9:00 – 19:00 น."],
} as const;

export type StringKey = keyof typeof STRINGS;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore persisted choice after hydration (SSR always renders English)
  useEffect(() => {
    const stored = localStorage.getItem("pp_lang");
    if (stored === "th") setLangState("th");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pp_lang", l);
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = (key: StringKey, vars?: Record<string, string | number>) => {
    let s: string = STRINGS[key][lang === "th" ? 1 : 0];
    if (vars) {
      for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    }
    return s;
  };
  return { lang, setLang, t };
}

// Inline translated string — usable from server components
export function T({ k, vars }: { k: StringKey; vars?: Record<string, string | number> }) {
  const { t } = useLang();
  return <>{t(k, vars)}</>;
}

// Bilingual data field — shows the Thai DB value when available
export function BiText({ en, th }: { en: string; th?: string | null }) {
  const { lang } = useLang();
  return <>{lang === "th" && th ? th : en}</>;
}
