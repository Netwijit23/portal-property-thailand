// Lightweight BTS network model → estimate travel time between stations.
// Two lines that interchange at Siam. Names normalised to a canonical key.

const SUKHUMVIT = [
  "Mo Chit", "Saphan Khwai", "Ari", "Sanam Pao", "Victory Monument",
  "Phaya Thai", "Ratchathewi", "Siam", "Chit Lom", "Phloen Chit",
  "Nana", "Asok", "Phrom Phong", "Thong Lo", "Ekkamai",
  "Phra Khanong", "On Nut", "Bang Chak", "Punnawithi", "Udomsuk",
  "Bang Na", "Bearing",
];

const SILOM = [
  "National Stadium", "Siam", "Ratchadamri", "Sala Daeng", "Chong Nonsi",
  "Saint Louis", "Surasak", "Saphan Taksin", "Krung Thon Buri", "Wongwian Yai",
];

const LINES = [SUKHUMVIT, SILOM];

// Aliases → canonical station name
const ALIAS: Record<string, string> = {
  "asoke": "Asok", "thonglor": "Thong Lo", "thong lor": "Thong Lo",
  "on-nut": "On Nut", "phloenchit": "Phloen Chit", "ploenchit": "Phloen Chit",
  "chitlom": "Chit Lom", "saladaeng": "Sala Daeng", "phrompong": "Phrom Phong",
  "phromphong": "Phrom Phong", "ekamai": "Ekkamai", "victory": "Victory Monument",
};

function canon(name: string | null | undefined): string | null {
  if (!name) return null;
  let s = name.trim();
  // strip a leading "BTS " / "MRT " and anything after a separator
  s = s.replace(/^(bts|mrt)\s+/i, "").split(/[·,(/-]/)[0].trim();
  const key = s.toLowerCase();
  if (ALIAS[key]) return ALIAS[key];
  // match case-insensitively against known stations
  for (const line of LINES) {
    const hit = line.find((st) => st.toLowerCase() === key);
    if (hit) return hit;
  }
  // partial contains (e.g. "Thonglor Soi 10")
  for (const line of LINES) {
    const hit = line.find((st) => key.includes(st.toLowerCase()));
    if (hit) return hit;
  }
  return null;
}

// Adjacency + line membership
const adj = new Map<string, Set<string>>();
const lineOf = new Map<string, Set<number>>();
LINES.forEach((line, li) => {
  line.forEach((st, i) => {
    if (!adj.has(st)) adj.set(st, new Set());
    if (!lineOf.has(st)) lineOf.set(st, new Set());
    lineOf.get(st)!.add(li);
    if (i > 0) { adj.get(st)!.add(line[i - 1]); adj.get(line[i - 1])!.add(st); }
  });
});

export type Commute = { stops: number; minutes: number; transfers: number };

// BFS fewest-stops path between two stations. Transfer counted if the two
// stations sit on different lines (interchange at Siam).
export function estimateCommute(from: string | null | undefined, to: string | null | undefined): Commute | null {
  const a = canon(from);
  const b = canon(to);
  if (!a || !b || !adj.has(a) || !adj.has(b)) return null;
  if (a === b) return { stops: 0, minutes: 0, transfers: 0 };

  const queue: string[] = [a];
  const dist = new Map<string, number>([[a, 0]]);
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === b) break;
    const neighbors = adj.get(cur);
    if (neighbors) {
      Array.from(neighbors).forEach((nb) => {
        if (!dist.has(nb)) { dist.set(nb, dist.get(cur)! + 1); queue.push(nb); }
      });
    }
  }
  const stops = dist.get(b);
  if (stops == null) return null;

  const sameLine = Array.from(lineOf.get(a) ?? []).some((l) => lineOf.get(b)?.has(l));
  const transfers = sameLine ? 0 : 1;
  const minutes = Math.max(2, Math.round(stops * 2.2 + transfers * 5 + 4));
  return { stops, minutes, transfers };
}

// Popular destinations expats commute to, mapped to their BTS station.
export const COMMUTE_DESTINATIONS: { label: string; station: string }[] = [
  { label: "Asok (Sukhumvit business hub)", station: "Asok" },
  { label: "Siam (shopping / central)", station: "Siam" },
  { label: "Sala Daeng / Silom (CBD)", station: "Sala Daeng" },
  { label: "Sathorn (Chong Nonsi)", station: "Chong Nonsi" },
  { label: "Phrom Phong (EmQuartier)", station: "Phrom Phong" },
  { label: "Thong Lo", station: "Thong Lo" },
  { label: "Phaya Thai (Airport Link)", station: "Phaya Thai" },
  { label: "Mo Chit (Chatuchak)", station: "Mo Chit" },
  { label: "Saphan Taksin (Riverside)", station: "Saphan Taksin" },
  { label: "On Nut", station: "On Nut" },
];
