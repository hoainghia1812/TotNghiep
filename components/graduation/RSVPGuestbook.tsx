"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";
import { enableGuestbookFallAnimation } from "@/components/graduation/site-config";

type GuestMessage = {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
};

/**
 * Tọa độ ngang (trung tâm thẻ, %) — luôn trong dải an toàn để thẻ không tràn mép màn hình
 * (kết hợp với `left: clamp(...)` + `width` trong CSS).
 */
function guestbookFallLeftPercent(messageId: string, index: number): number {
  let h = 2166136261;
  for (let k = 0; k < messageId.length; k++) {
    h ^= messageId.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  h ^= index * 0x9e3779b9;
  h >>>= 0;
  return 30 + (h % 4000) / 100;
}

export function RSVPGuestbook() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestMsg, setGuestMsg] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [rsvpOk, setRsvpOk] = useState(false);

  const [guestSaving, setGuestSaving] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enableGuestbookFallAnimation) {
      setMessagesLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setMessagesLoading(true);
      setMessagesError(null);
      try {
        const res = await fetch("/api/guestbook");
        const json = (await res.json()) as { messages?: GuestMessage[]; error?: string };
        if (!res.ok) {
          throw new Error(json.error ?? "Không tải được lời chúc.");
        }
        if (!cancelled) setMessages(json.messages ?? []);
      } catch (e) {
        if (!cancelled) {
          setMessagesError(e instanceof Error ? e.message : "Lỗi tải lời chúc.");
        }
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitRsvp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const full_name = name.trim();
      if (!full_name) return;

      setRsvpError(null);
      setRsvpOk(false);
      setRsvpSaving(true);
      try {
        const res = await fetch("/api/attendees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name, guest_count: Math.max(0, Math.min(10, guests)) }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(json.error ?? "Gửi thất bại.");
        setRsvpOk(true);
        setName("");
        setGuests(0);
        window.setTimeout(() => setRsvpOk(false), 4000);
      } catch (err) {
        setRsvpError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      } finally {
        setRsvpSaving(false);
      }
    },
    [name, guests],
  );

  const submitMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const message = guestMsg.trim();
      if (!message) return;

      setGuestError(null);
      setGuestSaving(true);
      try {
        const display_name = guestName.trim() || "Khách mời";
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_name, message }),
        });
        const json = (await res.json()) as { message?: GuestMessage; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Gửi thất bại.");
        if (json.message && enableGuestbookFallAnimation) {
          setMessages((prev) => [json.message!, ...prev]);
        }
        setGuestMsg("");
      } catch (err) {
        setGuestError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      } finally {
        setGuestSaving(false);
      }
    },
    [guestName, guestMsg],
  );

  const fallPortal =
    enableGuestbookFallAnimation &&
    mounted &&
    typeof document !== "undefined" &&
    !reduceMotion &&
    !messagesLoading &&
    messages.length > 0 &&
    createPortal(
      <div className="guestbook-fall-overlay" aria-hidden>
        {messages.map((m, i) => {
          const n = Number.parseInt(m.id.replace(/\D/g, "").slice(-8), 10) || i * 17;
          const leftPct = guestbookFallLeftPercent(m.id, i);
          /* Thưa pha: mỗi lời lệch ~14s, không gói % — tránh dồn cùng lúc */
          const durationSec = 40 + i * 6 + (n % 7) * 1.2;
          const delaySec = i * 14 + (n % 5) * 0.9;
          const tilt = ((n % 19) - 9) * 0.35;
          return (
            <div
              key={m.id}
              className="guestbook-fall-line--viewport"
              style={
                {
                  "--fall-left": `${leftPct}%`,
                  "--tag-tilt": `${tilt}deg`,
                  animationDuration: `${durationSec}s`,
                  animationDelay: `-${delaySec}s`,
                } as React.CSSProperties
              }
            >
              <div className="guestbook-fall-tag">
                <div className="guestbook-fall-tag__shine" aria-hidden />
                <div className="guestbook-fall-tag__decor" aria-hidden>
                  <span className="guestbook-fall-tag__ornament" />
                  <span className="guestbook-fall-tag__gild" />
                  <span className="guestbook-fall-tag__ornament guestbook-fall-tag__ornament--alt" />
                </div>
                <p className="guestbook-fall-tag__quote">{m.message}</p>
              </div>
            </div>
          );
        })}
      </div>,
      document.body,
    );

  return (
    <section className="border-t border-(--ocean-300)/40 bg-linear-to-b from-[#eef6f3] to-(--cream) px-5 py-20 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10 md:py-28">
      <div className="mx-auto grid min-w-0 max-w-5xl gap-14 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="min-w-0">
          <h2 className="font-display text-3xl font-semibold text-(--ocean-950) md:text-4xl">
            Xác nhận tham dự
          </h2>
          <p className="mt-3 text-sm text-(--ocean-700)">
            Cảm ơn bạn rất nhiều và hy vọng sẽ được gặp bạn trong ngày đặc biệt này!
          </p>

          <form
            onSubmit={submitRsvp}
            className="mt-8 space-y-5 rounded-3xl border border-white/90 bg-white/95 p-6 shadow-lg shadow-(--ocean-900)/10 sm:p-8"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-(--ocean-600)">
                Họ và tên
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 text-(--ocean-950) outline-none transition focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
                placeholder="Nguyễn Văn A"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-(--ocean-600)">
                Số người đi cùng (không kể bạn)
              </span>
              <input
                type="number"
                min={0}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-2 w-full max-w-30 rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 outline-none transition focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
              />
            </label>

            <button
              type="submit"
              disabled={rsvpSaving}
              className="w-full rounded-full bg-(--ocean-800) py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-(--ocean-700) disabled:opacity-60"
            >
              {rsvpSaving ? "Đang gửi…" : "Gửi xác nhận"}
            </button>
            {rsvpError && (
              <p className="text-center text-sm text-red-600" role="alert">
                {rsvpError}
              </p>
            )}
            {rsvpOk && (
              <p className="text-center text-sm font-medium text-(--mint-600)" role="status">
                Đã gửi — cảm ơn bạn!
              </p>
            )}
          </form>
        </ScrollReveal>

        <ScrollReveal delayMs={100} className="min-w-0">
          <h2 className="font-display text-3xl font-semibold text-(--ocean-950) md:text-4xl">
            Sổ lưu bút
          </h2>
          <p className="mt-3 text-sm text-(--ocean-700)">
            Để lại vài dòng chúc mừng — dù không đến được, tình cảm vẫn tới được em/cháu.
          </p>

          <form
            onSubmit={submitMessage}
            className="mt-8 space-y-4 rounded-3xl border border-white/90 bg-white/95 p-6 shadow-lg shadow-(--ocean-900)/10 sm:p-8"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-(--ocean-600)">
                Tên hiển thị
              </span>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 outline-none transition focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
                placeholder="Cô Chú / Bạn bè"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-(--ocean-600)">
                Lời chúc
              </span>
              <textarea
                required
                rows={4}
                value={guestMsg}
                onChange={(e) => setGuestMsg(e.target.value)}
                className="mt-2 w-full resize-y rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 outline-none transition focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
                placeholder="Chúc con/cháu..."
              />
            </label>
            <button
              type="submit"
              disabled={guestSaving}
              className="w-full rounded-full border-2 border-(--ocean-700) bg-transparent py-3.5 text-sm font-semibold text-(--ocean-800) transition hover:bg-(--ocean-800) hover:text-white disabled:opacity-60"
            >
              {guestSaving ? "Đang gửi…" : "Gửi lời chúc"}
            </button>
            {guestError && (
              <p className="text-center text-sm text-red-600" role="alert">
                {guestError}
              </p>
            )}
          </form>

          {enableGuestbookFallAnimation && (
            <div className="mt-10">
              {messagesLoading && (
                <div className="rounded-2xl border border-(--ocean-200) bg-white/60 px-4 py-10 text-center text-sm text-(--ocean-600)">
                  Đang tải lời chúc…
                </div>
              )}
              {!messagesLoading && messagesError && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-4 text-center text-sm text-red-700">
                  {messagesError}
                </div>
              )}
              {!messagesLoading && !messagesError && messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-(--ocean-300)/80 bg-white/35 px-4 py-10 text-center text-sm text-(--ocean-600)">
                  Chưa có lời chúc nào — hãy là người đầu tiên nhé.
                </div>
              )}
              {!messagesLoading && !messagesError && messages.length > 0 && reduceMotion && (
                <div className="guestbook-fall-static mt-2">
                  {messages.map((m, i) => (
                    <div
                      key={m.id}
                      className="guestbook-fall-tag guestbook-fall-tag--static"
                      style={
                        {
                          "--tag-tilt": `${(((i * 7 + m.id.length) % 15) - 7) * 0.35}deg`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="guestbook-fall-tag__shine" aria-hidden />
                      <div className="guestbook-fall-tag__decor" aria-hidden>
                        <span className="guestbook-fall-tag__ornament" />
                        <span className="guestbook-fall-tag__gild" />
                        <span className="guestbook-fall-tag__ornament guestbook-fall-tag__ornament--alt" />
                      </div>
                      <p className="guestbook-fall-tag__quote">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {fallPortal}
        </ScrollReveal>
      </div>
    </section>
  );
}
