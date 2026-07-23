// Thin wrapper around gtag so the rest of the app never touches
// `window.gtag` directly. Safe no-op when GA4 isn't configured (no
// NEXT_PUBLIC_GA_MEASUREMENT_ID) or gtag.js hasn't loaded yet.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Fired once per form the first time a visitor advances past step 1 —
 * compare against `form_complete` to see drop-off between start and finish. */
export function trackFormStart(form: string) {
  trackEvent("form_start", { form });
}

/** Fired on a successful lead submission (after the DB insert / email send
 * resolves), tagged with the same `form` key as its matching `form_start`. */
export function trackFormComplete(form: string) {
  trackEvent("form_complete", { form });
}

/** Fired on outbound WhatsApp/LINE/phone taps — `location` identifies which
 * button was used (floating contact, listing chat buttons, enquiry modal…). */
export function trackContactClick(method: "whatsapp" | "line" | "phone", location: string) {
  trackEvent("contact_click", { method, location });
}
