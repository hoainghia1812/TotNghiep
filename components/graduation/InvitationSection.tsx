"use client";

import { useEffect, useState } from "react";
import { eventDateLineVi, eventTitle, venue } from "@/components/graduation/site-config";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

function useParallaxY(factor: number) {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setY(window.scrollY * factor);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);
  return y;
}

export function InvitationSection() {
  const py1 = useParallaxY(0.06);
  const py2 = useParallaxY(-0.04);

  return (
    <section
      id="invitation"
      className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32"
    >
      <div
        className="parallax-slow pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(127,212,181,0.45), transparent 40%), radial-gradient(circle at 80% 60%, rgba(91,163,198,0.4), transparent 45%)",
          transform: `translateY(${py1}px)`,
        }}
      />

      <ScrollReveal className="relative mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--gold-soft)] bg-white/90 p-8 shadow-[0_30px_80px_-24px_rgba(15,39,68,0.35)] backdrop-blur-sm md:p-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--mint-300)]/50 blur-3xl"
            style={{ transform: `translateY(${py2}px)` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[var(--ocean-300)]/40 blur-3xl"
            style={{ transform: `translateY(${py1 * 0.6}px)` }}
            aria-hidden
          />

          <p className="font-display text-center text-sm uppercase tracking-[0.4em] text-[var(--ocean-600)]">
            Trân trọng kính mời
          </p>
          <h1 className="font-display mt-4 text-center text-4xl font-semibold leading-tight text-[var(--ocean-950)] md:text-5xl">
            {eventTitle}
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-[var(--ocean-800)]/95">
            Rất hân hạnh được đón tiếp Quý vị tới dự buổi lễ tốt nghiệp — chia sẻ niềm vui và ghi
            dấu cột mốc quan trọng trên hành trình trưởng thành.
          </p>

          <div className="mt-10 space-y-3 text-center font-sans text-[var(--ocean-900)]">
            <p className="text-lg font-medium">{eventDateLineVi}</p>
            <p className="text-[var(--ocean-700)]">{venue.name}</p>
            <p className="text-sm text-[var(--ocean-600)]">{venue.address}</p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
