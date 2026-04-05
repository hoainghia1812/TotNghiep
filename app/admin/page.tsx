"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Attendee = {
  id: string;
  full_name: string;
  guest_count: number;
  created_at: string;
};

type GuestMessage = {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
};

type SavedLogin = { user: string; pass: string };

const STORAGE_KEY = "graduation-admin-login";

function formatViDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function readSavedLogin(): SavedLogin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { user?: string; pass?: string };
    if (typeof o.user === "string" && typeof o.pass === "string") return { user: o.user, pass: o.pass };
  } catch {
    /* ignore */
  }
  return null;
}

export default function AdminDashboardPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async (cred: SavedLogin) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: {
          "x-admin-user": cred.user,
          "x-admin-pass": cred.pass,
        },
      });
      const json = (await res.json()) as {
        attendees?: Attendee[];
        messages?: GuestMessage[];
        error?: string;
      };
      if (!res.ok) {
        throw new Error(json.error ?? "Không tải được dữ liệu.");
      }
      setAttendees(json.attendees ?? []);
      setMessages(json.messages ?? []);
      setLoaded(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cred));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định.");
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = readSavedLogin();
    if (saved) {
      setUsername(saved.user);
      setPassword(saved.pass);
      void load(saved).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [load]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    const p = password;
    if (!u || !p) return;
    void load({ user: u, pass: p });
  };

  const logout = () => {
    setUsername("");
    setPassword("");
    setAttendees([]);
    setMessages([]);
    setLoaded(false);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const refresh = () => {
    const saved = readSavedLogin();
    if (saved) void load(saved);
    else if (username.trim() && password) void load({ user: username.trim(), pass: password });
  };

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--cream) text-(--ocean-700)">
        <p className="text-sm">Đang tải…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream) px-4 py-10 text-(--ocean-950) md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">Bảng tổng hợp</h1>
            <p className="mt-2 text-sm text-(--ocean-700)">
              Danh sách xác nhận tham dự và lời chúc (chỉ dành cho bạn).
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-(--ocean-600) underline underline-offset-4 hover:text-(--ocean-900)"
          >
            ← Về trang thư mời
          </Link>
        </div>

        {!loaded && (
          <form
            onSubmit={onSubmit}
            className="mb-10 max-w-md space-y-4 rounded-2xl border border-(--ocean-300)/40 bg-white/90 p-6 shadow-lg shadow-(--ocean-900)/10"
          >
            <label className="block text-sm font-medium text-(--ocean-800)">
              Tài khoản
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 outline-none focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
                placeholder="123"
              />
            </label>
            <label className="block text-sm font-medium text-(--ocean-800)">
              Mật khẩu
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-(--ocean-300)/70 bg-(--cream) px-4 py-3 outline-none focus:border-(--mint-500) focus:ring-2 focus:ring-(--mint-400)/40"
                placeholder="123"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full rounded-full bg-(--ocean-800) py-3 text-sm font-semibold text-white transition hover:bg-(--ocean-700) disabled:opacity-50"
            >
              {loading ? "Đang tải…" : "Đăng nhập"}
            </button>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-(--ocean-600)">
              Cần cấu hình Supabase (URL + key). Đọc bảng attendees nên có{" "}
              <code className="font-mono text-[0.7rem]">SUPABASE_SERVICE_ROLE_KEY</code> nếu RLS chặn
              anon.
            </p>
          </form>
        )}

        {loaded && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => refresh()}
                disabled={loading}
                className="rounded-full border border-(--ocean-700) px-4 py-2 text-sm font-semibold text-(--ocean-800) hover:bg-(--ocean-800) hover:text-white disabled:opacity-50"
              >
                {loading ? "Đang làm mới…" : "Làm mới"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-(--ocean-600) underline underline-offset-4 hover:text-(--ocean-900)"
              >
                Thoát
              </button>
            </div>
            {error && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold text-(--ocean-950)">
                Người xác nhận tham dự ({attendees.length})
              </h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-(--ocean-300)/30 bg-white/95 shadow-md">
                <table className="w-full min-w-130 text-left text-sm">
                  <thead className="border-b border-(--ocean-200) bg-(--ocean-100)/50 text-(--ocean-800)">
                    <tr>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Họ và tên</th>
                      <th className="px-4 py-3 font-semibold">Người đi cùng</th>
                      <th className="px-4 py-3 font-semibold">Gửi lúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-(--ocean-600)">
                          Chưa có xác nhận nào.
                        </td>
                      </tr>
                    ) : (
                      attendees.map((a, i) => (
                        <tr
                          key={a.id}
                          className="border-b border-(--ocean-200)/60 last:border-0 hover:bg-(--cream)/80"
                        >
                          <td className="px-4 py-3 text-(--ocean-600)">{i + 1}</td>
                          <td className="px-4 py-3 font-medium">{a.full_name}</td>
                          <td className="px-4 py-3">{a.guest_count}</td>
                          <td className="px-4 py-3 text-(--ocean-700)">{formatViDate(a.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-(--ocean-950)">
                Lời chúc ({messages.length})
              </h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-(--ocean-300)/30 bg-white/95 shadow-md">
                <table className="w-full min-w-140 text-left text-sm">
                  <thead className="border-b border-(--ocean-200) bg-(--ocean-100)/50 text-(--ocean-800)">
                    <tr>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Tên hiển thị</th>
                      <th className="px-4 py-3 font-semibold">Lời chúc</th>
                      <th className="px-4 py-3 font-semibold">Gửi lúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-(--ocean-600)">
                          Chưa có lời chúc nào.
                        </td>
                      </tr>
                    ) : (
                      messages.map((m, i) => (
                        <tr
                          key={m.id}
                          className="border-b border-(--ocean-200)/60 last:border-0 align-top hover:bg-(--cream)/80"
                        >
                          <td className="px-4 py-3 text-(--ocean-600)">{i + 1}</td>
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{m.display_name}</td>
                          <td className="max-w-md px-4 py-3 text-(--ocean-800) whitespace-pre-wrap">
                            {m.message}
                          </td>
                          <td className="px-4 py-3 text-(--ocean-700) whitespace-nowrap">
                            {formatViDate(m.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
