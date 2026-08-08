// Schedule-a-viewing domain logic, kept pure so the mismatch rules are easy to
// read, tune, and test independently of the form UI.

export type LeaseTerm = "under-6" | "6-11" | "1-year" | "1-plus";
export type TimeOfDay = "morning" | "afternoon" | "evening";

export const LEASE_TERMS: { value: LeaseTerm; label: string; months: number }[] = [
  { value: "under-6", label: "Under 6 months", months: 3 },
  { value: "6-11", label: "6–11 months", months: 6 },
  { value: "1-year", label: "1 year", months: 12 },
  { value: "1-plus", label: "1 year or more", months: 24 },
];

export const TIMES_OF_DAY: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

// ── Tunable thresholds ──────────────────────────────────────────────────────
/** Budget within ±10% of the listing price is treated as a match. */
export const BUDGET_TOLERANCE = 0.1;
/** Business-wide minimum lease. There is no per-listing minimum column in the
 *  listings table yet, so this policy value stands in for it — if a
 *  `min_lease_months` column is added later, prefer that per listing. */
export const DEFAULT_MIN_LEASE_MONTHS = 12;

export interface ViewingListingTerms {
  /** Monthly rent, when the listing is available to rent. */
  rentPrice?: number | null;
  /** Sale price, when the listing is available to buy. */
  salePrice?: number | null;
  /** Per-listing minimum lease in months; falls back to the business policy. */
  minLeaseMonths?: number | null;
  listingType?: "rent" | "sale" | "both" | null;
}

export interface MismatchResult {
  /** True when at least one condition fired — the caller shows the modal. */
  hasMismatch: boolean;
  leaseMismatch: boolean;
  budgetMismatch: boolean;
  /** Short human-readable reasons, used in the modal copy and the lead notes. */
  reasons: string[];
  /** Compact tags for the agent inbox, e.g. ["Term mismatch"]. */
  tags: string[];
}

function parseBudget(raw: string): number | null {
  const n = parseInt(String(raw).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Compares the visitor's request against the listing's actual terms.
 *  Only checks what it can: with no listing referenced (general enquiry), the
 *  budget rule can't apply, but the lease-minimum policy still can. */
export function detectMismatch(input: {
  leaseTerm: LeaseTerm | "";
  budget: string;
  listing?: ViewingListingTerms | null;
}): MismatchResult {
  const reasons: string[] = [];
  const tags: string[] = [];
  const listing = input.listing;

  // ── Lease term vs the listing's (or the business's) minimum ──
  const minMonths = listing?.minLeaseMonths ?? DEFAULT_MIN_LEASE_MONTHS;
  const requested = LEASE_TERMS.find((t) => t.value === input.leaseTerm);
  const leaseMismatch = Boolean(requested && requested.months < minMonths);
  if (leaseMismatch && requested) {
    reasons.push(
      `you asked for ${requested.label.toLowerCase()}, but the minimum lease is ${minMonths} months`,
    );
    tags.push("Term mismatch");
  }

  // ── Budget vs the listing's asking price (only when a listing is known) ──
  const budget = parseBudget(input.budget);
  let budgetMismatch = false;
  if (budget && listing) {
    // Compare against rent for rentals, sale price for sales; a "both" listing
    // matches if the figure is close to either.
    const targets: number[] = [];
    if (listing.listingType !== "sale" && listing.rentPrice) targets.push(listing.rentPrice);
    if (listing.listingType !== "rent" && listing.salePrice) targets.push(listing.salePrice);

    if (targets.length > 0) {
      const withinTolerance = targets.some(
        (target) => Math.abs(budget - target) <= target * BUDGET_TOLERANCE,
      );
      // Only flag a budget that falls short — offering more than asking isn't a
      // problem the agent needs to reconcile.
      const belowAll = targets.every((target) => budget < target * (1 - BUDGET_TOLERANCE));
      budgetMismatch = !withinTolerance && belowAll;
      if (budgetMismatch) {
        const asking = targets[0];
        reasons.push(
          `your budget of ฿${budget.toLocaleString()} is below the asking price of ฿${asking.toLocaleString()}`,
        );
        tags.push("Budget mismatch");
      }
    }
  }

  return {
    hasMismatch: leaseMismatch || budgetMismatch,
    leaseMismatch,
    budgetMismatch,
    reasons,
    tags,
  };
}

/** Today as YYYY-MM-DD, for the date input's `min` attribute. */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
