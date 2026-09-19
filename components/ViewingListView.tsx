import { ArrowUpRight, Bath, BedDouble, Building2, CheckCircle2, Hourglass, Maximize2, MapPin, Phone, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoWatermark from "@/components/PhotoWatermark";
import { BUSINESS } from "@/lib/business";
import { cleanStationName } from "@/lib/supabase";

// Shape returned by the get_viewing_list() database function. Deliberately has
// no owner contact details — see the migration.
export interface SharedListing {
  id: number;
  title: string | null;
  title_en: string | null;
  project: string | null;
  zone: string | null;
  bts_mrt: string | null;
  listing_type: "rent" | "sale" | "both" | null;
  building_type: string | null;
  status: "available" | "reserved" | "rented" | "sold" | null;
  is_published: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  floor: number | null;
  floor_number: number | null;
  sale_price: number | null;
  rent_price_1m: number | null;
  pet_allowed: boolean | null;
  foreigner_quota: boolean | null;
  available_from: string | null;
  website_description: string | null;
  description_en: string | null;
  photos: string[] | null;
}

export interface SharedList {
  title: string;
  client_name: string | null;
  message: string | null;
  viewing_date: string | null;
  agent: { name: string | null; phone: string | null; line_id: string | null } | null;
  items: {
    position: number;
    note: string | null;
    /** "HH:MM:SS", or null when no time has been proposed yet. */
    viewing_time?: string | null;
    /** Whether the owner has confirmed the viewing time. Absent on lists served
     *  before the owner-confirmation migration — then no status is shown. */
    owner_status?: "pending" | "confirmed";
    listing: SharedListing;
  }[];
}

const hasThai = (s: string | null | undefined) => !!s && /[฀-๿]/.test(s);

function priceLabel(l: SharedListing): string {
  const rent = l.rent_price_1m ? `฿${l.rent_price_1m.toLocaleString("en-US")} / month` : null;
  const sale = l.sale_price ? `฿${l.sale_price.toLocaleString("en-US")}` : null;
  if (l.listing_type === "sale") return sale ?? "Price on request";
  if (l.listing_type === "rent") return rent ?? "Price on request";
  if (rent && sale) return `${rent}  ·  ${sale} to buy`;
  return rent ?? sale ?? "Price on request";
}

function displayName(l: SharedListing): string {
  if (l.project && !hasThai(l.project)) return l.project;
  return l.title_en || (!hasThai(l.title) ? l.title : null) || "Property";
}

function lineHref(lineId: string | null | undefined): string {
  const id = lineId?.trim();
  if (!id) return BUSINESS.line;
  return id.startsWith("@") ? `https://line.me/R/ti/p/${id}` : `https://line.me/ti/p/~${id}`;
}

function shortDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Bangkok" });
}

function formatViewingDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Bangkok" });
}

const STATUS_NOTICE: Record<string, string> = {
  reserved: "Currently reserved",
  rented: "Recently rented — ask your agent about similar units",
  sold: "Recently sold — ask your agent about similar units",
};

export default function ViewingListView({ list }: { list: SharedList }) {
  const agent = list.agent;
  const agentName = agent?.name?.trim() || "Your agent";
  const phone = agent?.phone?.trim() || BUSINESS.phoneE164;
  const dateLabel = formatViewingDate(list.viewing_date);
  const tracked = list.items.filter((i) => i.owner_status);
  const confirmedCount = tracked.filter((i) => i.owner_status === "confirmed").length;
  const pendingCount = tracked.length - confirmedCount;
  const count = list.items.length;

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#B8935A]" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Private viewing list</span>
          </div>
          <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A] leading-tight">{list.title}</h1>
          <p className="font-sans text-sm text-[#8A8680] mt-3">
            {[
              list.client_name ? `Prepared for ${list.client_name}` : null,
              agent?.name ? `by ${agent.name}` : null,
              dateLabel,
              tracked.length > 0 ? `${confirmedCount} of ${tracked.length} confirmed by owners` : null,
              `${count} ${count === 1 ? "property" : "properties"}`,
            ].filter(Boolean).join("  ·  ")}
          </p>

          {pendingCount > 0 && (
            <p className="mt-5 flex items-start gap-2 font-sans text-[13px] leading-relaxed text-[#8A5A00]">
              <Hourglass size={15} className="mt-0.5 shrink-0" />
              <span>
                Each property shows whether its owner has confirmed the viewing time. Times marked
                &ldquo;awaiting&rdquo; are proposed and may still change &mdash; we&apos;ll update this page as owners reply.
              </span>
            </p>
          )}

          {list.message && (
            <div className="mt-6 rounded-xl bg-white border border-[#E8E4DC] p-5 font-sans text-[15px] leading-relaxed text-[#3A3835] whitespace-pre-line">
              {list.message}
            </div>
          )}

          {/* Units */}
          {count === 0 ? (
            <p className="mt-10 font-sans text-sm text-[#8A8680]">No properties have been added to this list yet — check back soon.</p>
          ) : (
            <ol className="mt-10 space-y-10">
              {list.items.map((item, index) => {
                const l = item.listing;
                const name = displayName(l);
                const zone = l.zone && !hasThai(l.zone) ? l.zone.split(",")[0].trim() : null;
                const station = cleanStationName(hasThai(l.bts_mrt) ? null : l.bts_mrt);
                const floor = l.floor ?? l.floor_number;
                const photos = (l.photos ?? []).filter(Boolean);
                const notice = l.status ? STATUS_NOTICE[l.status] : undefined;
                const description = l.website_description || l.description_en;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Bangkok`)}`;
                const facts = [
                  { icon: BedDouble, label: l.bedrooms === 0 ? "Studio" : l.bedrooms != null ? `${l.bedrooms} bed` : null },
                  { icon: Bath, label: l.bathrooms ? `${l.bathrooms} bath` : null },
                  { icon: Maximize2, label: l.size_sqm ? `${l.size_sqm} sqm` : null },
                  { icon: Building2, label: floor != null ? `Floor ${floor}` : null },
                ].filter((f) => f.label);
                const tags = [l.pet_allowed ? "Pets welcome" : null, l.foreigner_quota ? "Foreign quota available" : null].filter(Boolean);

                return (
                  <li key={`${item.position}-${l.id}`}>
                    <article className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                      {/* Hero photo */}
                      <div className="relative photo-grade aspect-[16/10] bg-[#F0ECE4] overflow-hidden">
                        {photos[0] ? (
                          <PhotoWatermark>
                            {/* Plain <img>: older listings can carry photos from hosts next/image isn't configured for. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photos[0]}
                              alt={`${name}${station ? `, near BTS ${station}` : ""}, Bangkok`}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                              draggable={false}
                            />
                          </PhotoWatermark>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center font-sans text-xs text-[#8A8680]">Photos coming soon</div>
                        )}
                        <span className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-[#B8935A] text-white font-sans text-sm font-medium flex items-center justify-center shadow-md">
                          {index + 1}
                        </span>
                      </div>

                      {photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-1 px-1 pt-1">
                          {photos.slice(1, 5).map((src, i) => (
                            <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] bg-[#F0ECE4] overflow-hidden block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" draggable={false} />
                              {i === 3 && photos.length > 5 && (
                                <span className="absolute inset-0 bg-black/45 text-white font-sans text-sm flex items-center justify-center">+{photos.length - 5}</span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="p-5 md:p-6">
                        {item.owner_status && (() => {
                          const confirmed = item.owner_status === "confirmed";
                          const date = shortDate(list.viewing_date);
                          const time = item.viewing_time ? item.viewing_time.slice(0, 5) : null;
                          const detail = time
                            ? `${confirmed ? "Viewing" : "Proposed"}: ${[date, time].filter(Boolean).join(" · ")}`
                            : confirmed
                              ? (date ? `Viewing confirmed for ${date}` : "Viewing confirmed")
                              : (date ? `${date} · time to be confirmed` : "Viewing time to be confirmed");
                          return (
                            <div
                              className={`mb-4 flex items-start gap-2.5 rounded-lg px-4 py-3 font-sans text-sm border ${
                                confirmed ? "bg-[#E6F4EC] border-[#1F7A4D]/25 text-[#1F5C3B]" : "bg-[#FFF3D6] border-[#8A5A00]/25 text-[#6B4500]"
                              }`}
                              role="status"
                            >
                              {confirmed ? <CheckCircle2 size={18} className="mt-px shrink-0" /> : <Hourglass size={18} className="mt-px shrink-0" />}
                              <div>
                                <p className="font-medium">{confirmed ? "Confirmed by owner" : "Awaiting owner confirmation"}</p>
                                <p className="text-[13px] opacity-85">{detail}</p>
                              </div>
                            </div>
                          );
                        })()}
                        {item.note && (
                          <div className="mb-4 rounded-lg bg-[#B8935A]/10 border border-[#B8935A]/25 px-4 py-3 font-sans text-sm text-[#5C4520]">
                            <span className="font-medium">From {agentName}: </span>{item.note}
                          </div>
                        )}

                        <h2 className="font-cormorant text-3xl text-[#0A0A0A] leading-tight">{name}</h2>
                        <p className="font-sans text-sm text-[#8A8680] mt-1 flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#B8935A] shrink-0" />
                          {[zone, station ? `BTS ${station}` : null].filter(Boolean).join("  ·  ") || "Bangkok"}
                        </p>

                        <p className="font-cormorant text-2xl text-[#B8935A] mt-4">{priceLabel(l)}</p>

                        {facts.length > 0 && (
                          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-3 font-sans text-sm text-[#3A3835]">
                            {facts.map(({ icon: Icon, label }) => (
                              <li key={label} className="flex items-center gap-1.5"><Icon size={15} className="text-[#8A8680]" />{label}</li>
                            ))}
                          </ul>
                        )}

                        {(tags.length > 0 || notice) && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((t) => (
                              <span key={t} className="font-sans text-xs px-2.5 py-1 rounded-full bg-[#F0ECE4] text-[#5C5850]">{t}</span>
                            ))}
                            {notice && (
                              <span className="font-sans text-xs px-2.5 py-1 rounded-full bg-[#7B2020]/10 text-[#7B2020]">{notice}</span>
                            )}
                          </div>
                        )}

                        {description && (
                          <p className="font-sans text-sm leading-relaxed text-[#5C5850] mt-4 line-clamp-4">{description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-5">
                          {l.is_published && (
                            <a
                              href={`/listings/${l.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
                            >
                              Full details <ArrowUpRight size={14} />
                            </a>
                          )}
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-5 py-2.5 rounded-full border border-[#E8E4DC] text-[#3A3835] hover:border-[#B8935A] transition-colors"
                          >
                            <MapPin size={14} /> Directions
                          </a>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Contact */}
          <section className="mt-12 rounded-2xl bg-[#0A0A0A] text-white p-6 md:p-8">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Questions?</p>
            <h2 className="font-cormorant font-light text-3xl mt-2">Talk to {agentName}</h2>
            <p className="font-sans text-sm text-white/65 mt-2">Want to change the order, add a unit, or move the time? Just message me.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={lineHref(agent?.line_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-[13px] font-medium px-6 py-3 rounded-full bg-[#06C755] text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} /> Message on LINE
              </a>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 font-sans text-[13px] font-medium px-6 py-3 rounded-full border border-white/25 text-white hover:border-[#B8935A] transition-colors"
              >
                <Phone size={16} /> {phone}
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
