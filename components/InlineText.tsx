import Link from "next/link";

// Renders "[label](href)" markdown-style links inside plain paragraph text —
// just enough to let blog content author its own internal links without a
// full markdown pipeline.
export default function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={i}>{part}</span>;
        const [, label, href] = match;
        return (
          <Link key={i} href={href} className="text-[#B8935A] underline underline-offset-2 hover:text-[#0A0A0A] transition-colors">
            {label}
          </Link>
        );
      })}
    </>
  );
}
