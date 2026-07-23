import type { Metadata } from "next";
import { BUSINESS } from "./business";

/**
 * Builds a consistent Metadata object: unique title/description, canonical
 * link, Open Graph, and a Twitter large-image card.
 * `path` must be the page's own clean path (e.g. "/areas/thonglor") with no
 * trailing slash or query/tracking params — it becomes the canonical URL.
 *
 * When `image` is omitted we fall back to BUSINESS.ogImageUrl (the site's
 * dynamically-rendered default OG card). We set this explicitly rather than
 * relying on the `app/opengraph-image.tsx` file convention, because that
 * convention did NOT reliably inject og:image on our `generateMetadata`
 * routes (areas / insights / faq) — only on static-metadata pages. Setting
 * it here guarantees every page ships an og:image. Listing pages pass their
 * own real photo via `image` to take priority.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const ogImage = image || BUSINESS.ogImageUrl;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: BUSINESS.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Truncates to a clean sentence boundary near `max` chars — used to keep
 * meta descriptions in the recommended 140–160 character range. */
export function truncateDescription(text: string, max = 158): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}
