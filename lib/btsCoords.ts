// Approximate lat/lng for Bangkok BTS/MRT stations + key zones.
// Used to place listings on the map when exact coordinates aren't stored.
export const BTS_COORDS: Record<string, [number, number]> = {
  // Sukhumvit line
  "mo chit": [13.8025, 100.5535],
  "saphan khwai": [13.7935, 100.5495],
  "ari": [13.7796, 100.5449],
  "sanam pao": [13.7735, 100.5420],
  "victory monument": [13.7649, 100.5373],
  "phaya thai": [13.7566, 100.5339],
  "ratchathewi": [13.7519, 100.5316],
  "siam": [13.7455, 100.5340],
  "chit lom": [13.7442, 100.5430],
  "phloen chit": [13.7432, 100.5486],
  "ploenchit": [13.7432, 100.5486],
  "nana": [13.7405, 100.5556],
  "asok": [13.7368, 100.5601],
  "asoke": [13.7368, 100.5601],
  "phrom phong": [13.7305, 100.5698],
  "thong lo": [13.7240, 100.5785],
  "thonglor": [13.7240, 100.5785],
  "ekkamai": [13.7197, 100.5853],
  "phra khanong": [13.7157, 100.5918],
  "on nut": [13.7057, 100.6013],
  "on-nut": [13.7057, 100.6013],
  "udomsuk": [13.6795, 100.6095],
  "bearing": [13.6613, 100.6015],
  // Silom line
  "ratchadamri": [13.7397, 100.5390],
  "sala daeng": [13.7286, 100.5340],
  "chong nonsi": [13.7236, 100.5290],
  "saint louis": [13.7215, 100.5245],
  "surasak": [13.7195, 100.5165],
  "saphan taksin": [13.7188, 100.5140],
  "krung thon buri": [13.7220, 100.5085],
  "wongwian yai": [13.7215, 100.4990],
  // MRT / zones
  "sathorn": [13.7220, 100.5290],
  "silom": [13.7280, 100.5340],
  "sukhumvit": [13.7380, 100.5600],
  "rama 9": [13.7570, 100.5655],
  "ratchada": [13.7660, 100.5695],
  "ladprao": [13.8160, 100.5610],
  "chatuchak": [13.7995, 100.5535],
  "riverside": [13.7220, 100.5115],
  "bang na": [13.6680, 100.6045],
};

const BANGKOK_CENTER: [number, number] = [13.7380, 100.5600];

// Resolve a listing's approximate coordinates from its BTS/zone text,
// with a small deterministic jitter so co-located listings don't overlap.
export function coordsFor(key: string | null | undefined, seed: number): [number, number] | null {
  if (!key) return null;
  const k = key.trim().toLowerCase();
  let base = BTS_COORDS[k];
  if (!base) {
    // try partial match
    const hit = Object.keys(BTS_COORDS).find((name) => k.includes(name) || name.includes(k));
    if (hit) base = BTS_COORDS[hit];
  }
  if (!base) return null;
  const jitter = (n: number) => ((Math.sin(seed * n) * 43758.5453) % 1) * 0.006 - 0.003;
  return [base[0] + jitter(12.9898), base[1] + jitter(78.233)];
}

export { BANGKOK_CENTER };
