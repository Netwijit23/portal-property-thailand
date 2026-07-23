// Consistent, descriptive alt text for listing photos — both an accessibility
// requirement and an SEO signal, so we never ship `alt=""` or `alt={title}`
// alone on a real property photo. Pattern:
// "[Property name/type], [bedrooms] bed [property type] in [area], Bangkok"
export function listingPhotoAlt(listing: {
  title?: string | null;
  building_name?: string | null;
  bedrooms?: number | null;
  type?: string | null;
  zone?: string | null;
}, photoIndex?: number): string {
  const name = listing.building_name || listing.title || "Property";
  const beds = listing.bedrooms === 0 ? "Studio" : listing.bedrooms != null ? `${listing.bedrooms} bed` : null;
  const type = listing.type ? (listing.type === "condo" ? "condo" : "house") : "property";
  const area = listing.zone ? `${listing.zone}, Bangkok` : "Bangkok";
  const suffix = photoIndex != null && photoIndex > 0 ? ` — photo ${photoIndex + 1}` : "";
  return `${name}, ${beds ? `${beds} ` : ""}${type} in ${area}${suffix}`;
}
