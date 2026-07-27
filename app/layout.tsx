import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import { LanguageProvider } from "@/lib/i18n";
import OrganizationSchema from "@/components/OrganizationSchema";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CompareTray from "@/components/CompareTray";
import NextTopLoader from "nextjs-toploader";

// Self-hosted via next/font — no render-blocking Google Fonts request
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portalpropertythailand.com"),
  title: "Portal Property Thailand — Bangkok Real Estate",
  description: "Find condos and houses for rent and sale in Bangkok. Premium real estate listings.",
  openGraph: {
    title: "Portal Property Thailand — Bangkok Real Estate",
    description: "Find condos and houses for rent and sale in Bangkok. Premium real estate listings.",
    url: "https://portalpropertythailand.com",
    siteName: "Portal Property Thailand",
    type: "website",
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (Vercel env / .env.local) with
  // the meta-tag verification code from Google Search Console — renders
  // <meta name="google-site-verification" content="..."> automatically.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
        <body className="antialiased">
          <NextTopLoader color="#B8935A" height={2} showSpinner={false} shadow="0 0 8px #B8935A" />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <OrganizationSchema />
          <LanguageProvider>
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
            <FloatingContact />
            <CompareTray />
          </LanguageProvider>
          <Analytics />
          <GoogleAnalytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
