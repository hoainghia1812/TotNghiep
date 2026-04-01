"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parkingSpots, venue } from "@/components/graduation/site-config";
import { oceanMapStyles } from "@/components/graduation/map-style";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

const MAPS_SCRIPT_ATTR = "data-graduation-gmaps";

export function EventMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const openDirections = useCallback((fromLat: number, fromLng: number) => {
    const dest = `${venue.lat},${venue.lng}`;
    const origin = `${fromLat},${fromLng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    if (!apiKey || !ref.current) return;

    const init = () => {
      if (!ref.current || !window.google?.maps) return;
      const center = { lat: venue.lat, lng: venue.lng };
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom: 16,
        styles: oceanMapStyles as google.maps.MapTypeStyle[],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      mapRef.current = map;

      const mainMarker = new window.google.maps.Marker({
        position: center,
        map,
        title: venue.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#0f2744",
          fillOpacity: 1,
          strokeColor: "#c9a962",
          strokeWeight: 2,
        },
      });
      const mainInfo = new window.google.maps.InfoWindow({
        content: `<div style="font-family:system-ui,sans-serif;max-width:220px;padding:4px">
          <strong style="color:#0f2744">${venue.name}</strong><br/>
          <span style="font-size:12px;color:#2a6a8f">${venue.address}</span>
        </div>`,
      });
      mainMarker.addListener("click", () => mainInfo.open({ map, anchor: mainMarker }));

      parkingSpots.forEach((p) => {
        const pm = new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.title,
          label: { text: "P", color: "#fff", fontSize: "11px", fontWeight: "700" },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: "#3d9b7a",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        });
        const iw = new window.google.maps.InfoWindow({
          content: `<div style="font-family:system-ui,sans-serif;max-width:240px;padding:6px">
            <strong style="color:#0f2744">${p.title}</strong><br/>
            <p style="margin:8px 0 0;font-size:12px;line-height:1.45;color:#153a5c">${p.hint}</p>
            <button type="button" id="walk-${p.id}" style="margin-top:10px;padding:8px 12px;border-radius:999px;border:0;background:#153a5c;color:#fff;font-size:12px;cursor:pointer">
              Chỉ đường đi bộ tới hội trường
            </button>
          </div>`,
        });
        pm.addListener("click", () => {
          iw.open({ map, anchor: pm });
          window.google.maps.event.addListenerOnce(iw, "domready", () => {
            const btn = document.getElementById(`walk-${p.id}`);
            btn?.addEventListener("click", () => openDirections(p.lat, p.lng));
          });
        });
      });

      setReady(true);
    };

    if (window.google?.maps) {
      init();
      return;
    }

    const existing = document.querySelector(`script[${MAPS_SCRIPT_ATTR}]`);
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.setAttribute(MAPS_SCRIPT_ATTR, "1");
    script.onload = () => init();
    script.onerror = () => setError("Không tải được Google Maps. Kiểm tra API key và billing.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [apiKey, openDirections]);

  const fallbackLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;

  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ocean-950)] md:text-4xl">
            Bản đồ &amp; hướng dẫn
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[var(--ocean-700)]">
            Ghim vị trí hội trường và các bãi gửi xe gần nhất. Mở popup trên bản đồ để xem gợi ý lối
            đi bộ và nút chỉ đường.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-12" delayMs={80}>
          <div className="overflow-hidden rounded-3xl border border-[var(--ocean-300)]/50 shadow-xl shadow-[var(--ocean-900)]/15">
            {!apiKey ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 bg-[var(--ocean-100)] px-6 py-16 text-center">
                <a
                  href={fallbackLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--ocean-800)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--ocean-700)]"
                >
                  Mở vị trí trên Google Maps
                </a>
              </div>
            ) : (
              <>
                <div ref={ref} className="h-[min(70vh,480px)] w-full bg-[var(--ocean-200)]" />
                {error && (
                  <p className="bg-red-50 px-4 py-3 text-center text-sm text-red-800">{error}</p>
                )}
                {!ready && !error && (
                  <p className="bg-[var(--cream)] px-4 py-3 text-center text-sm text-[var(--ocean-600)]">
                    Đang tải bản đồ…
                  </p>
                )}
              </>
            )}
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {parkingSpots.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-[var(--ocean-200)] bg-white/90 p-5 shadow-sm"
              >
                <p className="font-semibold text-[var(--ocean-900)]">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ocean-700)]">{p.hint}</p>
                <button
                  type="button"
                  onClick={() => openDirections(p.lat, p.lng)}
                  className="mt-4 text-sm font-semibold text-[var(--mint-600)] underline-offset-2 hover:underline"
                >
                  Chỉ đường đi bộ → hội trường
                </button>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
