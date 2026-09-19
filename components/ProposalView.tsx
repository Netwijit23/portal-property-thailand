import { ArrowUpRight, Bath, BedDouble, Building2, CheckCircle2, ListChecks, Maximize2, MapPin, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoWatermark from "@/components/PhotoWatermark";
import { SelectionProvider, SelectToggle } from "@/components/ProposalSelection";
import { BUSINESS } from "@/lib/business";
import { cleanStationName } from "@/lib/supabase";
import { displayName, hasThai, lineHref, shortDate, type SharedListing } from "@/lib/sharedListing";

// Shape returned by the get_proposal() database function (no owner contact details).
export interface SharedProposal {
  title: string;
  client_name: string | null;
  message: string | null;
  valid_until: string | null;
  /** Link-preview image the agent chose; null/absent = use the first unit's photo. */
  cover_url?: string | null;
  /** When the tenant last sent their picks; null until they do. */
  submitted_at: string | null;
  tenant_note: string | null;
  /** Token of the viewing list the agent built from the tenant's picks, once it exists. */
  viewing_list_token: string | null;
  agent: { name: string | null; phone: string | null; line_id: string | null } | null;
  items: {
    id: number;
    position: number;
    monthly_price: number | null;
    deposit: string | null;
    lease_term: string | null;
    move_in_date: string | null;
    terms_note: string | null;
    /** The tenant ticked this unit ("I'd like to view this"). */
    selected: boolean;
    listing: SharedListing;
  }[];
}

const STATUS_NOTICE: Record<string, string> = {
  reserved: "Currently reserved",
  rented: "Recently rented — ask your agent about similar units",
  sold: "Recently sold — ask your agent about similar units",
};

function longDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok" });
}

export default function ProposalView({ token, proposal }: { token: string; proposal: SharedProposal }) {
  const agent = proposal.agent;
  const agentName = agent?.name?.trim() || "Your agent";
  const phone = agent?.phone?.trim() || BUSINESS.phoneE164;

  const todayBangkok = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  const validUntil = proposal.valid_until?.slice(0, 10) ?? null;
  const expired = !!validUntil && validUntil < todayBangkok;

  const picked = proposal.items.filter((i) => i.selected);
  const submitted = !!proposal.submitted_at && picked.length > 0;
  const count = proposal.items.length;

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#B8935A]" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Your proposal</span>
          </div>
          <h1 className="font-cormorant font-light text-4xl md:text-5xl text-[#0A0A0A] leading-tight">{proposal.title}</h1>
          <p className="font-sans text-sm text-[#8A8680] mt-3">
            {[
              proposal.client_name ? `Prepared for ${proposal.client_name}` : null,
              agent?.name ? `by ${agent.name}` : null,
              validUntil ? `${expired ? "Expired" : "Valid until"} ${longDate(validUntil)}` : null,
              `${count} ${count === 1 ? "option" : "options"}`,
            ].filter(Boolean).join("  ·  ")}
          </p>

          {/* Status banners */}
          {proposal.viewing_list_token && (
            <a
              href={`/viewing/${proposal.viewing_list_token}`}
              className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#0A0A0A] text-white p-5 md:p-6 hover:bg-[#1a1a1a] transition-colors"
            >
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Your viewing is being arranged</p>
                <p className="font-cormorant font-light text-2xl md:text-3xl mt-1">See your viewing list</p>
              </div>
              <span className="shrink-0 w-11 h-11 rounded-full bg-[#B8935A] flex items-center justify-center">
                <ListChecks size={20} />
              </span>
            </a>
          )}
          {submitted && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#E6F4EC] border border-[#1F7A4D]/25 p-5" role="status">
              <CheckCircle2 size={22} className="text-[#1F7A4D] shrink-0 mt-0.5" />
              <div className="font-sans text-[#1F5C3B]">
                <p className="font-medium">You picked {picked.length} unit{picked.length === 1 ? "" : "s"} to view</p>
                <p className="text-sm opacity-85 mt-0.5">
                  {agentName} will confirm viewing times with the owners and be in touch.
                  {!expired && " You can still change your picks below."}
                </p>
                {proposal.tenant_note && <p className="text-sm mt-2 italic opacity-90">&ldquo;{proposal.tenant_note}&rdquo;</p>}
              </div>
            </div>
          )}
          {!submitted && !expired && count > 0 && (
            <p className="mt-6 font-sans text-[15px] leading-relaxed text-[#3A3835]">
              Tap <span className="font-medium">&ldquo;I&apos;d like to view this&rdquo;</span> on any unit that interests you, then send your picks to {agentName}. You don&apos;t need to decide on anything yet — this is just to arrange viewings.
            </p>
          )}
          {expired && !submitted && (
            <div className="mt-6 rounded-2xl bg-[#FFF3D6] border border-[#8A5A00]/25 p-5 font-sans text-[#6B4500]" role="status">
              <p className="font-medium">This proposal has expired</p>
              <p className="text-sm mt-0.5">Message {agentName} below and they&apos;ll refresh it for you.</p>
            </div>
          )}

          {proposal.message && (
            <div className="mt-6 rounded-xl bg-white border border-[#E8E4DC] p-5 font-sans text-[15px] leading-relaxed text-[#3A3835] whitespace-pre-line">
              {proposal.message}
            </div>
          )}

          {count === 0 ? (
            <p className="mt-10 font-sans text-sm text-[#8A8680]">No options have been added yet — check back soon.</p>
          ) : (
            <SelectionProvider
              token={token}
              initialSelected={picked.map((i) => i.id)}
              initialNote={proposal.tenant_note ?? ""}
              expired={expired}
              agentName={agentName}
            >
            <ol className="mt-10 space-y-10">
              {proposal.items.map((item, index) => {
                const l = item.listing;
                const name = displayName(l);
                const zone = l.zone && !hasThai(l.zone) ? l.zone.split(",")[0].trim() : null;
                const station = cleanStationName(hasThai(l.bts_mrt) ? null : l.bts_mrt);
                const floor = l.floor ?? l.floor_number;
                const photos = (l.photos ?? []).filter(Boolean);
                const notice = l.status ? STATUS_NOTICE[l.status] : undefined;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Bangkok`)}`;
                const terms = [
                  { label: "Deposit", value: item.deposit },
                  { label: "Lease term", value: item.lease_term },
                  { label: "Available from", value: item.move_in_date ? shortDate(item.move_in_date) : null },
                ].filter((t) => t.value);
                const facts = [
                  { icon: BedDouble, label: l.bedrooms === 0 ? "Studio" : l.bedrooms != null ? `${l.bedrooms} bed` : null },
                  { icon: Bath, label: l.bathrooms ? `${l.bathrooms} bath` : null },
                  { icon: Maximize2, label: l.size_sqm ? `${l.size_sqm} sqm` : null },
                  { icon: Building2, label: floor != null ? `Floor ${floor}` : null },
                ].filter((f) => f.label);
                const tags = [l.pet_allowed ? "Pets welcome" : null, l.foreigner_quota ? "Foreign quota available" : null].filter(Boolean);

                return (
                  <li key={item.id}>
                    <article
                      className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#E8E4DC]"
                    >
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
                        <h2 className="font-cormorant text-3xl text-[#0A0A0A] leading-tight">{name}</h2>
                        <p className="font-sans text-sm text-[#8A8680] mt-1 flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#B8935A] shrink-0" />
                          {[zone, station ? `BTS ${station}` : null].filter(Boolean).join("  ·  ") || "Bangkok"}
                        </p>

                        <p className="font-cormorant text-3xl text-[#B8935A] mt-4">
                          {item.monthly_price ? `฿${item.monthly_price.toLocaleString("en-US")} / month` : "Price to be confirmed"}
                        </p>

                        {terms.length > 0 && (
                          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                            {terms.map((t) => (
                              <div key={t.label} className="rounded-lg bg-[#FAF8F4] border border-[#E8E4DC] px-3.5 py-2.5">
                                <dt className="font-sans text-[11px] uppercase tracking-wide text-[#8A8680]">{t.label}</dt>
                                <dd className="font-sans text-sm font-medium text-[#0A0A0A] mt-0.5">{t.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {item.terms_note && (
                          <div className="mt-4 rounded-lg bg-[#B8935A]/10 border border-[#B8935A]/25 px-4 py-3 font-sans text-sm text-[#5C4520] whitespace-pre-line">
                            {item.terms_note}
                          </div>
                        )}

                        {facts.length > 0 && (
                          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-4 font-sans text-sm text-[#3A3835]">
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
                            {notice && <span className="font-sans text-xs px-2.5 py-1 rounded-full bg-[#7B2020]/10 text-[#7B2020]">{notice}</span>}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-5">
                          {l.is_published && (
                            <a
                              href={`/listings/${l.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-5 py-2.5 rounded-full border border-[#E8E4DC] text-[#3A3835] hover:border-[#B8935A] transition-colors"
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

                        <SelectToggle itemId={item.id} />
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
            </SelectionProvider>
          )}

          <section className="mt-12 rounded-2xl bg-[#0A0A0A] text-white p-6 md:p-8">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">Questions?</p>
            <h2 className="font-cormorant font-light text-3xl mt-2">Talk to {agentName}</h2>
            <p className="font-sans text-sm text-white/65 mt-2">Want other options, a different area or budget, or to change your picks? Just message me.</p>
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
