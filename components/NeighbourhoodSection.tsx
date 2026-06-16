import { Train, GraduationCap, Heart, ShoppingBag } from "lucide-react";

const BTS_LINES: Record<string, { line: string; color: string }> = {
  // Sukhumvit line (dark green)
  "Mo Chit": { line: "Sukhumvit", color: "#009B77" },
  "Saphan Khwai": { line: "Sukhumvit", color: "#009B77" },
  "Ari": { line: "Sukhumvit", color: "#009B77" },
  "Sanam Pao": { line: "Sukhumvit", color: "#009B77" },
  "Victory Monument": { line: "Sukhumvit", color: "#009B77" },
  "Phaya Thai": { line: "Sukhumvit", color: "#009B77" },
  "Ratchathewi": { line: "Sukhumvit", color: "#009B77" },
  "Siam": { line: "Sukhumvit / Silom", color: "#009B77" },
  "Chit Lom": { line: "Sukhumvit", color: "#009B77" },
  "Phloen Chit": { line: "Sukhumvit", color: "#009B77" },
  "Nana": { line: "Sukhumvit", color: "#009B77" },
  "Asoke": { line: "Sukhumvit", color: "#009B77" },
  "Phrom Phong": { line: "Sukhumvit", color: "#009B77" },
  "Thong Lo": { line: "Sukhumvit", color: "#009B77" },
  "Thonglor": { line: "Sukhumvit", color: "#009B77" },
  "Ekkamai": { line: "Sukhumvit", color: "#009B77" },
  "On Nut": { line: "Sukhumvit", color: "#009B77" },
  "Bang Chak": { line: "Sukhumvit", color: "#009B77" },
  "Punnawithi": { line: "Sukhumvit", color: "#009B77" },
  "Udom Suk": { line: "Sukhumvit", color: "#009B77" },
  "Bang Na": { line: "Sukhumvit", color: "#009B77" },
  "Bearing": { line: "Sukhumvit", color: "#009B77" },
  // Silom line (dark red)
  "National Stadium": { line: "Silom", color: "#C8102E" },
  "Ratchadamri": { line: "Silom", color: "#C8102E" },
  "Sala Daeng": { line: "Silom", color: "#C8102E" },
  "Chong Nonsi": { line: "Silom", color: "#C8102E" },
  "Saint Louis": { line: "Silom", color: "#C8102E" },
  "Surasak": { line: "Silom", color: "#C8102E" },
  "Saphan Taksin": { line: "Silom", color: "#C8102E" },
  "Krung Thon Buri": { line: "Silom", color: "#C8102E" },
  "Wongwian Yai": { line: "Silom", color: "#C8102E" },
  // MRT Blue line
  "Silom": { line: "MRT Blue", color: "#1E3A8A" },
  "Lumphini": { line: "MRT Blue", color: "#1E3A8A" },
  "Khlong Toei": { line: "MRT Blue", color: "#1E3A8A" },
  "Queen Sirikit": { line: "MRT Blue", color: "#1E3A8A" },
  "Sukhumvit": { line: "MRT Blue", color: "#1E3A8A" },
  "Lat Phrao": { line: "MRT Blue", color: "#1E3A8A" },
  "Ratchadaphisek": { line: "MRT Blue", color: "#1E3A8A" },
};

const ZONE_AMENITIES: Record<string, { hospitals: string[]; schools: string[]; malls: string[] }> = {
  sukhumvit: {
    hospitals: ["Bumrungrad International", "Samitivej Sukhumvit"],
    schools: ["NIST International School", "Bangkok Patana School"],
    malls: ["Terminal 21", "EmQuartier", "Emporium"],
  },
  silom: {
    hospitals: ["Bangkok Christian Hospital", "Saint Louis Hospital"],
    schools: ["St. Joseph Convent School", "Assumption College"],
    malls: ["Silom Complex", "Robinson Silom"],
  },
  sathorn: {
    hospitals: ["Saint Louis Hospital", "Bumrungrad International"],
    schools: ["KIS International School", "Wells International School"],
    malls: ["Silom Complex", "The Commons Sathorn"],
  },
  thonglor: {
    hospitals: ["Samitivej Sukhumvit", "Vejthani Hospital"],
    schools: ["NIST International School", "Bangkok Prep"],
    malls: ["J Avenue", "Donki Mall Thonglor"],
  },
  ekkamai: {
    hospitals: ["Samitivej Sukhumvit", "Bangkok Hospital"],
    schools: ["Bangkok Prep", "Ekkamai International School"],
    malls: ["Gateway Ekkamai", "Major Cineplex Ekkamai"],
  },
  ari: {
    hospitals: ["Phyathai 1 Hospital", "Rajavithi Hospital"],
    schools: ["Shrewsbury International School", "Ruamrudee International School"],
    malls: ["Central Ladprao", "Siam Paragon (nearby)"],
  },
};

function getZoneAmenities(zone: string | null) {
  if (!zone) return null;
  const key = zone.toLowerCase().replace(/\s+/g, "");
  return ZONE_AMENITIES[key] || ZONE_AMENITIES[zone.toLowerCase()] || null;
}

interface Props {
  bts_station: string | null;
  zone: string | null;
}

export default function NeighbourhoodSection({ bts_station, zone }: Props) {
  const stationInfo = bts_station ? BTS_LINES[bts_station] : null;
  const amenities = getZoneAmenities(zone);
  const mapQuery = bts_station
    ? `${bts_station} BTS Station, Bangkok`
    : zone
    ? `${zone}, Bangkok`
    : "Bangkok";

  return (
    <div className="mb-10">
      <h2 className="font-cormorant text-2xl text-[#0A0A0A] mb-5">Neighbourhood</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-[#E8E4DC] h-[220px]">
          <iframe
            title="Neighbourhood map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15`}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3">
          {/* BTS line badge */}
          {bts_station && (
            <div className="bg-[#F5F2EC] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Train size={15} className="text-[#B8935A]" />
                <span className="font-sans text-xs uppercase tracking-widest text-[#8A8680]">Nearest Transit</span>
              </div>
              <p className="font-cormorant text-xl text-[#0A0A0A]">{bts_station}</p>
              {stationInfo && (
                <span
                  className="inline-block mt-1 font-sans text-[10px] font-medium px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: stationInfo.color }}
                >
                  {stationInfo.line} Line
                </span>
              )}
            </div>
          )}

          {amenities && (
            <>
              <div className="bg-[#F5F2EC] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={14} className="text-[#B8935A]" />
                  <span className="font-sans text-xs uppercase tracking-widest text-[#8A8680]">Hospitals</span>
                </div>
                <ul className="space-y-0.5">
                  {amenities.hospitals.map((h) => (
                    <li key={h} className="font-sans text-sm text-[#0A0A0A]">{h}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F5F2EC] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={14} className="text-[#B8935A]" />
                  <span className="font-sans text-xs uppercase tracking-widest text-[#8A8680]">Shopping</span>
                </div>
                <ul className="space-y-0.5">
                  {amenities.malls.map((m) => (
                    <li key={m} className="font-sans text-sm text-[#0A0A0A]">{m}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {!amenities && !stationInfo && (
            <div className="bg-[#F5F2EC] rounded-2xl p-4 flex items-center gap-2 text-[#8A8680]">
              <Train size={15} />
              <span className="font-sans text-sm">Bangkok, Thailand</span>
            </div>
          )}
        </div>
      </div>

      {/* Schools row (if space) */}
      {amenities?.schools && (
        <div className="bg-[#F5F2EC] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={14} className="text-[#B8935A]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A8680]">International Schools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.schools.map((s) => (
              <span key={s} className="font-sans text-xs px-3 py-1 rounded-full bg-white border border-[#E8E4DC] text-[#0A0A0A]">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
