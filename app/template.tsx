"use client";

// Wraps every route; re-mounts on navigation so the fade-up plays each time.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
