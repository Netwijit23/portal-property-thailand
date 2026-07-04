"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Buy", href: "/listings?type=sale" },
  { label: "Rent", href: "/listings?type=rent" },
  { label: "Areas", href: "/#bts-map" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Transparent over the homepage hero; frosted white everywhere else / on scroll
  const transparent = pathname === "/" && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent border-b border-white/10"
            : "bg-white/[0.96] backdrop-blur-md border-b border-[#E8E4DC]"
        } ${scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.08)]" : ""}`}
        style={{ height: 60 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-[3px] z-10">
            <span className={`font-cormorant font-bold text-[20px] tracking-[2px] uppercase transition-colors duration-300 ${
              transparent ? "text-white" : "text-[#0A0A0A]"
            }`}>
              PORTAL
            </span>
            <span className={`font-cormorant font-light text-[20px] tracking-[2px] uppercase transition-colors duration-300 ${
              transparent ? "text-[#E5C795]" : "text-[#0A0A0A]"
            }`}>
              PROPERTY
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`font-sans text-[11px] uppercase tracking-[1.5px] transition-colors duration-300 ${
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-[#8A8680] hover:text-[#0A0A0A]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA button */}
          <Link
            href="/submit"
            className={`hidden md:inline-flex font-sans text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 z-10 ${
              transparent
                ? "bg-white/15 text-white border border-white/30 backdrop-blur-md hover:bg-white/25"
                : "bg-[#B8935A] text-white hover:bg-[#a07d4a]"
            }`}
          >
            List a Property
          </Link>

          {/* Hamburger */}
          <button
            className={`md:hidden z-10 transition-colors duration-300 ${transparent ? "text-white" : "text-[#0A0A0A]"}`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="absolute top-[18px] right-6 text-[#0A0A0A]"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={26} />
        </button>

        <Link
          href="/"
          className="flex items-baseline gap-[3px] mb-14"
          onClick={() => setOpen(false)}
        >
          <span className="font-cormorant font-bold text-2xl tracking-[2px] text-[#0A0A0A] uppercase">
            PORTAL
          </span>
          <span className="font-cormorant font-light text-2xl tracking-[2px] text-[#0A0A0A] uppercase">
            PROPERTY
          </span>
        </Link>

        <div className="flex flex-col items-center gap-9">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-cormorant text-[32px] font-light text-[#0A0A0A] hover:text-[#B8935A] transition-colors"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/submit"
          className="mt-14 font-sans text-sm font-medium px-8 py-3.5 rounded-full bg-[#B8935A] text-white"
          onClick={() => setOpen(false)}
        >
          List a Property
        </Link>
      </div>
    </>
  );
}
