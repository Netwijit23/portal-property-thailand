import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import { LanguageProvider } from "@/lib/i18n";

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
          <LanguageProvider>
            {children}
            <FloatingContact />
          </LanguageProvider>
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
