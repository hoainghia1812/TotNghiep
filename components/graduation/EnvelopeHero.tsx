"use client";

import { useCallback, useEffect, useState } from "react";

export function EnvelopeHero() {
  const [open, setOpen] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (removed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [removed]);

  const runSequence = useCallback(() => {
    if (open) return;
    setOpen(true);
    window.setTimeout(() => setPulled(true), 480);
    window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(() => {
        setRemoved(true);
        document.body.style.overflow = "";
        const el = document.getElementById("invitation");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 700);
    }, 1500);
  }, [open]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 20%, rgba(91,163,198,0.35), transparent 55%), linear-gradient(165deg, #0a1628 0%, #153a5c 45%, #0f2744 100%)",
      }}
      aria-hidden={exiting}
    >
      <p className="font-display mb-10 max-w-md text-center text-lg text-white/85 md:text-xl">
        Bạn có một lời mời
      </p>

      <button
        type="button"
        onClick={runSequence}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") runSequence();
        }}
        className="envelope-scene group cursor-pointer rounded-2xl border-0 bg-transparent p-4 text-left outline-none ring-2 ring-transparent transition hover:ring-white/20 focus-visible:ring-white/40"
        aria-label="Mở thư mời"
      >
        <div className={`envelope ${open ? "open" : ""}`}>
          <div className="envelope-back-stack">
            <div className="envelope-back" aria-hidden />
          </div>
          <div
            className={`invitation-card font-display text-[var(--ocean-900)] ${pulled ? "pulled" : ""}`}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--ocean-600)]">
              Graduation
            </span>
            <span className="mt-2 block text-2xl font-semibold md:text-3xl">Lễ Tốt Nghiệp</span>
            <span className="mt-3 block text-sm font-sans text-[var(--ocean-700)]/90">
              Chạm để mở thiệp
            </span>
          </div>
          <div className="envelope-back-sleeve" aria-hidden />
          <div className="envelope-pocket" aria-hidden>
            <div className="envelope-pocket-wing envelope-pocket-wing--left" />
            <div className="envelope-pocket-wing envelope-pocket-wing--right" />
            <div className="envelope-pocket-bottom" />
          </div>
          <div className="envelope-flap">
            <div className="envelope-flap-inner" />
          </div>
          <div className="envelope-seal" aria-hidden>
            ✶
          </div>
        </div>
      </button>

      <p className="mt-10 max-w-sm text-center text-sm text-white/55">
        Nhấn hoặc chạm vào phong bì để xem nội dung trang.
      </p>
    </div>
  );
}
