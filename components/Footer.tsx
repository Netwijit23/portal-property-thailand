import Link from "next/link";
import { Star, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { BUSINESS } from "@/lib/business";

const AREAS = ["Sukhumvit", "Sathorn", "Silom", "Rama 9", "On Nut", "Thonglor"];
const GOOGLE_REVIEWS_URL = BUSINESS.googleReviewsUrl;

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Skyline line-art */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
        viewBox="0 0 1440 160"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
        style={{ opacity: 0.10 }}
      >
        <g stroke="#B8935A" strokeWidth="1.5" fill="none">
          <path d="M0 160 V120 H40 V90 H70 V120 H110 V70 H140 V120 H175 V100 H200 V60 H215 V40 H230 V60 H255 V100 H290 V130 H330 V80 H360 V50 H380 V80 H410 V125 H450 V95 H480 V125 H520 V60 H540 V30 H560 V60 H590 V110 H630 V85 H660 V110 H700 V70 H730 V120 H770 V95 H800 V125 H840 V55 H860 V25 H878 V55 H900 V115 H940 V90 H970 V115 H1010 V75 H1040 V120 H1080 V100 H1110 V60 H1130 V38 H1148 V60 H1170 V105 H1210 V85 H1240 V120 H1280 V70 H1310 V120 H1350 V95 H1380 V125 H1420 V100 H1440 V160 Z" />
          <line x1="230" y1="40" x2="230" y2="10" /><circle cx="230" cy="8" r="2" />
          <line x1="550" y1="30" x2="550" y2="6" /><circle cx="550" cy="4" r="2" />
          <line x1="869" y1="25" x2="869" y2="4" /><circle cx="869" cy="2" r="2" />
          <line x1="1139" y1="38" x2="1139" y2="12" /><circle cx="1139" cy="10" r="2" />
        </g>
      </svg>

      <div className="relative border-t-2 border-[#B8935A]" style={{ padding: "56px 48px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand + rating */}
            <div className="col-span-2">
              <div className="flex items-baseline gap-[3px] mb-4">
                <span className="font-cormorant font-bold text-2xl tracking-[2px] text-white uppercase">PORTAL</span>
                <span className="font-cormorant font-light text-2xl tracking-[2px] text-[#E5C795] uppercase">PROPERTY</span>
              </div>
              <p className="font-sans text-[12.5px] text-[#8A8680] leading-relaxed max-w-xs mb-6">
                Bangkok&apos;s trusted real estate partner for expats and international buyers — condos,
                houses and apartments across the city&apos;s finest neighbourhoods.
              </p>

              {/* Google rating badge */}
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-3 rounded-2xl px-4 py-3 border border-[#2A2825] hover:border-[#B8935A]/50 transition-colors group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[15px] font-semibold text-white">5.0</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill="#E5C795" stroke="#E5C795" />
                      ))}
                    </div>
                  </div>
                  <p className="font-sans text-[10px] text-[#8A8680] mt-0.5">Rated on Google Reviews</p>
                </div>
                <ArrowUpRight size={15} className="text-[#8A8680] group-hover:text-[#B8935A] transition-colors" />
              </a>
            </div>

            {/* Properties */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">Properties</p>
              <div className="flex flex-col gap-3">
                <FooterLink href="/listings?type=sale">Buy</FooterLink>
                <FooterLink href="/listings?type=rent">Rent</FooterLink>
                <FooterLink href="/saved">Saved</FooterLink>
                <FooterLink href="/enquire/client">Find me a home</FooterLink>
              </div>
            </div>

            {/* Areas */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">Areas</p>
              <div className="flex flex-col gap-3">
                {AREAS.map((area) => (
                  <FooterLink key={area} href={`/listings?zone=${encodeURIComponent(area)}`}>{area}</FooterLink>
                ))}
              </div>
            </div>

            {/* Company + contact */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">Company</p>
              <div className="flex flex-col gap-3">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/insights">Insights</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/enquire/owner">List a Property</FooterLink>
                <FooterLink href="/enquire/agent">Agent Co-broke</FooterLink>
              </div>
              <div className="flex flex-col gap-2.5 mt-6">
                <a href={`tel:${BUSINESS.phoneE164}`} className="flex items-center gap-2 font-sans text-[12px] text-[#8A8680] hover:text-[#B8935A] transition-colors">
                  <Phone size={12} /> {BUSINESS.phoneDisplay}
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 font-sans text-[12px] text-[#8A8680] hover:text-[#B8935A] transition-colors">
                  <Mail size={12} /> {BUSINESS.email}
                </a>
                <p className="flex items-center gap-2 font-sans text-[12px] text-[#8A8680]">
                  <MapPin size={12} /> Bangkok, Thailand
                </p>
                <a
                  href={BUSINESS.googleBusinessProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-[12px] text-[#8A8680] hover:text-[#B8935A] transition-colors"
                >
                  <MapPin size={12} /> Find us on Google
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1A1917] pt-5 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="font-sans text-[10px] text-[#3A3830]">
              © {new Date().getFullYear()} Portal Property Thailand. All rights reserved.
            </p>
            <p className="font-sans text-[10px] text-[#3A3830]">Mon–Sat · 9 am – 7 pm · Bangkok</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-sans text-[12px] text-[#8A8680] hover:text-[#B8935A] transition-colors w-fit">
      {children}
    </Link>
  );
}
