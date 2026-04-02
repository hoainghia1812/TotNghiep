"use client";

import { useCallback, useEffect, useState } from "react";

export function EnvelopeHero() {
  const [open, setOpen] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [draggingSeal, setDraggingSeal] = useState(false);
  const [sealOffsetY, setSealOffsetY] = useState(0);
  const [dragStartY, setDragStartY] = useState<number | null>(null);

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

  const startSealDrag = useCallback((clientY: number) => {
    if (open) return;
    setDraggingSeal(true);
    setDragStartY(clientY);
    setSealOffsetY(0);
  }, [open]);

  const moveSealDrag = useCallback((clientY: number) => {
    if (!draggingSeal || dragStartY == null || open) return;
    const delta = clientY - dragStartY;
    // Chi cho kéo lên trên; giới hạn biên để chuyển động ổn định.
    const next = Math.max(-56, Math.min(0, delta));
    setSealOffsetY(next);
  }, [dragStartY, draggingSeal, open]);

  const endSealDrag = useCallback(() => {
    if (!draggingSeal || open) return;
    const pulledEnough = sealOffsetY <= -34;
    setDraggingSeal(false);
    setDragStartY(null);
    setSealOffsetY(0);
    if (pulledEnough) runSequence();
  }, [draggingSeal, open, runSequence, sealOffsetY]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] transition-all duration-700 ease-out ${
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
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") runSequence();
        }}
        className="envelope-scene group cursor-default rounded-2xl border-0 bg-transparent p-4 text-left outline-none ring-2 ring-transparent transition hover:ring-white/20 focus-visible:ring-white/40"
        aria-label="Kéo dấu niêm lên để mở thư mời"
      >
        <div className={`envelope ${open ? "open" : ""}`}>
          <div className="envelope-back-stack">
            <div className="envelope-back" aria-hidden />
          </div>
          <div
            className={`invitation-card font-display text-(--ocean-900) ${pulled ? "pulled" : ""}`}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-(--ocean-600)">
              Graduation
            </span>
            <span className="mt-2 block text-2xl font-semibold md:text-3xl">Lễ Tốt Nghiệp</span>
            <span className="mt-3 block text-sm font-sans text-(--ocean-700)/90">
              Kéo dấu niêm lên để mở thiệp
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
          <div
            className={`envelope-seal ${draggingSeal ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
              startSealDrag(e.clientY);
            }}
            onPointerMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveSealDrag(e.clientY);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
              endSealDrag();
            }}
            onPointerCancel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if ((e.currentTarget as HTMLDivElement).hasPointerCapture(e.pointerId)) {
                (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
              }
              endSealDrag();
            }}
            style={{
              transform: `translateY(${sealOffsetY}px)`,
              transition: draggingSeal ? "none" : "transform 180ms ease",
              touchAction: "none",
            }}
          >
            ✶
          </div>
        </div>
      </button>

      <p className="mt-10 max-w-sm text-center text-sm text-white/55">
        Giữ và kéo dấu niêm lên trên để mở thư mời.
      </p>
    </div>
  );
}
