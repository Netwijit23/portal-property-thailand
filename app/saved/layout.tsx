import type { Metadata } from "next";

// page.tsx is a client component, so metadata lives here
export const metadata: Metadata = {
  title: "Saved Properties | Portal Property Thailand",
  description: "Your saved condos and houses in Bangkok.",
  robots: { index: false },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
