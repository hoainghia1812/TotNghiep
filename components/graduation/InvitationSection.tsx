"use client";

import { useEffect, useState } from "react";
import { eventDateLineVi, venue } from "@/components/graduation/site-config";
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
      className="relative overflow-hidden px-5 py-24 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10 md:py-32"
    >
      <div
        className="parallax-slow pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(127,212,181,0.45), transparent 40%), radial-gradient(circle at 80% 60%, rgba(91,163,198,0.4), transparent 45%)",
          transform: `translateY(${py1}px)`,
        }}
      />

      <ScrollReveal className="relative mx-auto min-w-0 max-w-3xl">
        <div className="relative w-full min-w-0 overflow-hidden rounded-3xl border border-(--gold-soft) bg-white/90 p-6 shadow-[0_30px_80px_-24px_rgba(15,39,68,0.35)] backdrop-blur-sm sm:p-8 md:p-14">
          <div className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-(--gold-soft)/60 sm:inset-4 sm:rounded-[1.25rem]" />
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--mint-300)/50 blur-3xl"
            style={{ transform: `translateY(${py2}px)` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-(--ocean-300)/40 blur-3xl"
            style={{ transform: `translateY(${py1 * 0.6}px)` }}
            aria-hidden
          />

          <div className="mx-auto mt-2 max-w-xl text-center font-sans text-(--ocean-800)/95">
            <div className="flex items-center justify-center gap-3 text-(--gold)/85">
              <span className="h-px w-12 bg-(--gold-soft)" />
              <span aria-hidden>✦</span>
              <span className="h-px w-12 bg-(--gold-soft)" />
            </div>
            <p className="mt-4 font-display text-base uppercase tracking-[0.2em] text-(--ocean-900) sm:text-lg sm:tracking-[0.25em]">
              Trân trọng kính mời
            </p>
            <p className="mt-4 text-base font-medium leading-relaxed tracking-wide text-pretty">
              Quý Thầy Cô, Gia đình và Bạn bè
            </p>
            <p className="mt-3 text-base italic leading-relaxed text-pretty">
              Đến tham dự Lễ Tốt Nghiệp Đại Học của tôi.
            </p>
            <p className="text-pretty">
              Sự hiện diện của Quý vị là niềm vinh dự lớn lao, góp phần làm nên ý nghĩa trọn vẹn
              cho khoảnh khắc đặc biệt này - một dấu mốc quan trọng trên hành trình trưởng thành của
              tôi.
            </p>
            <p className="mt-3 text-pretty">
              Rất mong được đón tiếp và cùng Quý vị chia sẻ niềm vui trong ngày đáng nhớ này.
            </p>
            <p className="mt-4 font-display text-lg text-(--ocean-900)">Trân trọng kính mời!</p>
            <div className="mt-4 flex items-center justify-center gap-3 text-(--gold)/85">
              <span className="h-px w-12 bg-(--gold-soft)" />
              <span aria-hidden>✦</span>
              <span className="h-px w-12 bg-(--gold-soft)" />
            </div>
          </div>

          <div className="mt-10 space-y-3 text-center font-sans text-(--ocean-900)">
            <p className="text-base font-medium sm:text-lg">{eventDateLineVi}</p>
            <p className="text-pretty text-(--ocean-700)">{venue.name}</p>
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 wrap-break-word text-sm text-(--ocean-600) underline decoration-(--ocean-400)/70 underline-offset-4 transition hover:text-(--ocean-800)"
            >
              <span
                aria-hidden
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--ocean-100) text-(--ocean-700)"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M12 2a7 7 0 0 0-7 7c0 4.9 5.2 11.1 6.5 12.6a.65.65 0 0 0 1 0C13.8 20.1 19 13.9 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                </svg>
              </span>
              {venue.address}
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
