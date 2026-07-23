import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

// Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set (Vercel env
// vars / .env.local) — safe to mount unconditionally in the root layout.
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
