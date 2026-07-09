"use client";
import { useState } from "react";
import { Share2, Link, Check } from "lucide-react";

export default function ShareButton({ url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  function copyLink() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard can be denied (permissions / non-secure context) — fall
        // back to the prompt so the user can still copy the link.
        window.prompt("Copy this link:", url);
      });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-sans text-xs text-[#8A8680] hover:text-[#0A0A0A] transition-colors px-3 py-1.5 rounded-full border border-[#E8E4DC] hover:border-[#0A0A0A]"
      >
        <Share2 size={13} /> Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-9 z-20 bg-white border border-[#E8E4DC] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-3 w-[210px]">
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#8A8680] px-2 mb-2">Share this listing</p>

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 font-sans text-sm px-3 py-2.5 rounded-xl hover:bg-[#F5F2EC] transition-colors text-left"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Link size={15} className="text-[#8A8680]" />}
              <span className={copied ? "text-green-600" : "text-[#0A0A0A]"}>
                {copied ? "Copied!" : "Copy link"}
              </span>
            </button>

            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 font-sans text-sm px-3 py-2.5 rounded-xl hover:bg-[#F5F2EC] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#00B900">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span className="text-[#0A0A0A]">Share on LINE</span>
            </a>

            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 font-sans text-sm px-3 py-2.5 rounded-xl hover:bg-[#F5F2EC] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="text-[#0A0A0A]">Share on Facebook</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
