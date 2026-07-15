"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Real live presence: everyone viewing this listing joins a Supabase Realtime
// channel; we show the count of *other* viewers. Only appears when >1 present,
// so it's never fake — it reflects genuine concurrent traffic.
export default function ViewingNow({ listingId }: { listingId: string }) {
  const [others, setOthers] = useState(0);

  useEffect(() => {
    const key = Math.random().toString(36).slice(2);
    const channel = supabase.channel(`viewing:${listingId}`, {
      config: { presence: { key } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const count = Object.keys(channel.presenceState()).length;
        setOthers(Math.max(0, count - 1));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ at: Date.now() });
      });

    return () => { supabase.removeChannel(channel); };
  }, [listingId]);

  if (others < 1) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[#1A3A2A]/8 border border-[#1A3A2A]/15">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A3A2A]" />
      </span>
      <span className="font-sans text-[12px] font-medium text-[#1A3A2A]">
        {others} {others === 1 ? "person" : "people"} viewing now
      </span>
    </div>
  );
}
