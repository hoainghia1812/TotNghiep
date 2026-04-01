"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollReveal } from "@/components/graduation/ScrollReveal";

type GuestMessage = {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
};

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

  useEffect(() => {
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
        if (json.message) {
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

  return (
    <section className="border-t border-[var(--ocean-300)]/40 bg-gradient-to-b from-[#eef6f3] to-[var(--cream)] px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold text-[var(--ocean-950)] md:text-4xl">
            Xác nhận tham dự
          </h2>
          <p className="mt-3 text-sm text-[var(--ocean-700)]">
            Giúp mình chủ động chuẩn bị chỗ ngồi và tiệc nhẹ. Thông tin được lưu qua Supabase; chỉ
            bạn (đăng nhập admin) xem được danh sách đầy đủ trong bảng{" "}
            <span className="font-mono text-xs">attendees</span>.
          </p>

          <form
            onSubmit={submitRsvp}
            className="mt-8 space-y-5 rounded-3xl border border-white/90 bg-white/95 p-8 shadow-lg shadow-[var(--ocean-900)]/10"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ocean-600)]">
                Họ và tên
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--ocean-300)]/70 bg-[var(--cream)] px-4 py-3 text-[var(--ocean-950)] outline-none transition focus:border-[var(--mint-500)] focus:ring-2 focus:ring-[var(--mint-400)]/40"
                placeholder="Nguyễn Văn A"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ocean-600)]">
                Số người đi cùng (không kể bạn)
              </span>
              <input
                type="number"
                min={0}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-2 w-full max-w-[120px] rounded-xl border border-[var(--ocean-300)]/70 bg-[var(--cream)] px-4 py-3 outline-none transition focus:border-[var(--mint-500)] focus:ring-2 focus:ring-[var(--mint-400)]/40"
              />
            </label>

            <button
              type="submit"
              disabled={rsvpSaving}
              className="w-full rounded-full bg-[var(--ocean-800)] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--ocean-700)] disabled:opacity-60"
            >
              {rsvpSaving ? "Đang gửi…" : "Gửi xác nhận"}
            </button>
            {rsvpError && (
              <p className="text-center text-sm text-red-600" role="alert">
                {rsvpError}
              </p>
            )}
            {rsvpOk && (
              <p className="text-center text-sm font-medium text-[var(--mint-600)]" role="status">
                Đã gửi — cảm ơn bạn!
              </p>
            )}
          </form>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <h2 className="font-display text-3xl font-semibold text-[var(--ocean-950)] md:text-4xl">
            Sổ lưu bút
          </h2>
          <p className="mt-3 text-sm text-[var(--ocean-700)]">
            Để lại vài dòng chúc mừng — dù không đến được, tình cảm vẫn tới được em/cháu.
          </p>

          <form
            onSubmit={submitMessage}
            className="mt-8 space-y-4 rounded-3xl border border-white/90 bg-white/95 p-8 shadow-lg shadow-[var(--ocean-900)]/10"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ocean-600)]">
                Tên hiển thị
              </span>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--ocean-300)]/70 bg-[var(--cream)] px-4 py-3 outline-none transition focus:border-[var(--mint-500)] focus:ring-2 focus:ring-[var(--mint-400)]/40"
                placeholder="Cô Chú / Bạn bè"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ocean-600)]">
                Lời chúc
              </span>
              <textarea
                required
                rows={4}
                value={guestMsg}
                onChange={(e) => setGuestMsg(e.target.value)}
                className="mt-2 w-full resize-y rounded-xl border border-[var(--ocean-300)]/70 bg-[var(--cream)] px-4 py-3 outline-none transition focus:border-[var(--mint-500)] focus:ring-2 focus:ring-[var(--mint-400)]/40"
                placeholder="Chúc con/cháu..."
              />
            </label>
            <button
              type="submit"
              disabled={guestSaving}
              className="w-full rounded-full border-2 border-[var(--ocean-700)] bg-transparent py-3.5 text-sm font-semibold text-[var(--ocean-800)] transition hover:bg-[var(--ocean-800)] hover:text-white disabled:opacity-60"
            >
              {guestSaving ? "Đang gửi…" : "Gửi lời chúc"}
            </button>
            {guestError && (
              <p className="text-center text-sm text-red-600" role="alert">
                {guestError}
              </p>
            )}
          </form>

          <ul className="mt-10 space-y-4">
            {messagesLoading && (
              <li className="rounded-2xl border border-[var(--ocean-200)] bg-white/60 px-4 py-8 text-center text-sm text-[var(--ocean-600)]">
                Đang tải lời chúc…
              </li>
            )}
            {!messagesLoading && messagesError && (
              <li className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-4 text-center text-sm text-red-700">
                {messagesError}
              </li>
            )}
            {!messagesLoading && !messagesError && messages.length === 0 && (
              <li className="rounded-2xl border border-dashed border-[var(--ocean-300)]/80 bg-white/40 px-4 py-8 text-center text-sm text-[var(--ocean-600)]">
                Chưa có lời chúc nào — hãy là người đầu tiên nhé.
              </li>
            )}
            {!messagesLoading &&
              !messagesError &&
              messages.map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl border border-[var(--ocean-200)] bg-white/80 px-5 py-4 shadow-sm"
                >
                  <p className="font-display text-lg text-[var(--ocean-900)]">{m.display_name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ocean-800)]">{m.message}</p>
                  <p className="mt-3 text-xs text-[var(--ocean-500)]">
                    {new Date(m.created_at).toLocaleString("vi-VN")}
                  </p>
                </li>
              ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
