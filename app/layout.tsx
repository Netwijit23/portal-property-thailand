import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
