import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export interface Crumb {
  label: string;
  href: string; // relative path, e.g. "/areas/thonglor"
}

// Renders a visible breadcrumb trail AND its matching BreadcrumbList JSON-LD
// in one place, so the two can never drift out of sync. `items` excludes
// Home — it's always prepended automatically.
export default function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const full = [{ label: "Home", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${BUSINESS.url}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5">
        {full.map((item, i) => {
          const isLast = i === full.length - 1;
          return (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className={`shrink-0 ${dark ? "text-white/30" : "text-[#C0BBB4]"}`} />}
              {isLast ? (
                <span
                  className={`font-sans text-[12px] truncate max-w-[220px] ${dark ? "text-white/60" : "text-[#8A8680]"}`}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`font-sans text-[12px] hover:text-[#B8935A] transition-colors ${dark ? "text-white/60" : "text-[#8A8680]"}`}
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
