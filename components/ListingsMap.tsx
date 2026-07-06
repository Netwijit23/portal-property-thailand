"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Listing } from "@/lib/supabase";
import { coordsFor, BANGKOK_CENTER } from "@/lib/btsCoords";

function priceLabel(l: Listing): string {
  if (l.listing_type === "sale" && l.sale_price) {
    return l.sale_price >= 1_000_000 ? `฿${(l.sale_price / 1_000_000).toFixed(1)}M` : `฿${l.sale_price.toLocaleString()}`;
  }
  if (l.rent_price) return `฿${Math.round(l.rent_price / 1000)}k`;
  if (l.sale_price) return `฿${(l.sale_price / 1_000_000).toFixed(1)}M`;
  return "—";
}

export default function ListingsMap({ listings }: { listings: Listing[] }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      // Inject Leaflet CSS once
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (cancelled || !mapEl.current) return;

      map = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: false }).setView(BANGKOK_CENTER, 12);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const bounds: [number, number][] = [];
      listings.forEach((l, i) => {
        const pos = coordsFor(l.bts_station || l.zone, i + 1);
        if (!pos) return;
        bounds.push(pos);

        const rented = l.status === "rented";
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${rented ? "#7B2020" : "#0A0A0A"};
            color:#fff;font:600 11px/1 'DM Sans',sans-serif;
            padding:6px 9px;border-radius:999px;white-space:nowrap;
            box-shadow:0 3px 10px rgba(0,0,0,0.28);border:1.5px solid #fff;
            transform:translate(-50%,-50%);cursor:pointer;">
            ${priceLabel(l)}</div>`,
          iconSize: [0, 0],
        });

        const photo = l.photos?.[0];
        const marker = L.marker(pos, { icon }).addTo(map!);
        marker.bindPopup(
          `<div style="width:200px;font-family:'DM Sans',sans-serif">
            ${photo ? `<img src="${photo}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px"/>` : ""}
            <div style="font:500 14px/1.2 'Cormorant Garamond',serif;color:#0A0A0A;margin-bottom:2px">${l.building_name || l.title}</div>
            <div style="font-size:11px;color:#8A8680;margin-bottom:6px">${[l.zone, l.bts_station].filter(Boolean).join(" · ")}</div>
            <div style="font-size:13px;font-weight:600;color:#B8935A">${priceLabel(l)}</div>
            <button data-id="${l.id}" class="pp-map-view" style="margin-top:8px;width:100%;background:#0A0A0A;color:#fff;border:none;padding:8px;border-radius:8px;font-size:12px;cursor:pointer">View property</button>
          </div>`,
          { closeButton: false, minWidth: 200 }
        );
      });

      map.on("popupopen", (e) => {
        const btn = (e.popup.getElement()?.querySelector(".pp-map-view")) as HTMLButtonElement | null;
        if (btn) btn.onclick = () => router.push(`/listings/${btn.dataset.id}`);
      });

      if (bounds.length) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [listings, router]);

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E4DC] shadow-sm" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
      <div ref={mapEl} className="w-full h-full" style={{ background: "#EDEBE6" }} />
    </div>
  );
}
