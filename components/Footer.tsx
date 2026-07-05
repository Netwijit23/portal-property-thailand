import Link from "next/link";

const AREAS = ["Sukhumvit", "Sathorn", "Silom", "Rama 9", "On Nut", "Thonglor"];

export default function Footer() {
  return (
    <footer
      className="bg-[#0A0A0A] border-t-2 border-[#B8935A]"
      style={{ padding: "52px 48px 22px" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-baseline gap-[3px] mb-4">
              <span className="font-cormorant font-bold text-xl tracking-[2px] text-white uppercase">
                PORTAL
              </span>
              <span className="font-cormorant font-light text-xl tracking-[2px] text-white uppercase">
                PROPERTY
              </span>
            </div>
            <p className="font-sans text-[12px] text-[#6B6963] leading-relaxed">
              Bangkok&apos;s trusted real estate platform for condos, houses and apartments across the
              city&apos;s finest neighbourhoods.
            </p>
          </div>

          {/* Properties */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">
              Properties
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/listings?type=sale"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                Buy
              </Link>
              <Link
                href="/listings?type=rent"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                Rent
              </Link>
              <Link
                href="/listings"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                New Developments
              </Link>
            </div>
          </div>

          {/* Areas */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">
              Areas
            </p>
            <div className="flex flex-col gap-3">
              {AREAS.map((area) => (
                <Link
                  key={area}
                  href={`/listings?zone=${encodeURIComponent(area)}`}
                  className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[2px] text-[#6B6963] mb-5">
              Company
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/enquire/owner"
                className="font-sans text-[12px] text-[#4A4840] hover:text-[#B8935A] transition-colors"
              >
                List a Property
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1917] pt-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-sans text-[10px] text-[#3A3830]">
            © 2026 Portal Property Thailand. All rights reserved.
          </p>
          <p className="font-sans text-[10px] text-[#3A3830]">portalpropertyth.com</p>
        </div>
      </div>
    </footer>
  );
}
