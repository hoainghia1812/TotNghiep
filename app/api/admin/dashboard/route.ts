import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseRouteClient } from "@/lib/supabase/server-client";

const LIST_LIMIT = 500;

let cachedService: SupabaseClient | null = null;

function getReadClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) {
    if (!cachedService) {
      cachedService = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    }
    return cachedService;
  }
  return getSupabaseRouteClient();
}

function extractSecret(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  const key = new URL(request.url).searchParams.get("key");
  return key?.trim() ?? null;
}

/** Đăng nhập cố định (theo yêu cầu). Có thể bổ sung ADMIN_LIST_SECRET trong .env để dùng Bearer. */
const ADMIN_USER = "123";
const ADMIN_PASS = "123";

function isAuthorized(request: Request): boolean {
  const u = request.headers.get("x-admin-user")?.trim() ?? "";
  const p = request.headers.get("x-admin-pass")?.trim() ?? "";
  if (u === ADMIN_USER && p === ADMIN_PASS) return true;
  const expected = process.env.ADMIN_LIST_SECRET;
  if (expected) {
    const token = extractSecret(request);
    if (token === expected) return true;
  }
  return false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Sai tài khoản hoặc mật khẩu, hoặc không có quyền truy cập." },
      { status: 401 },
    );
  }

  const supabase = getReadClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Thiếu cấu hình Supabase (URL + key)." },
      { status: 503 },
    );
  }

  const [att, gb] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, full_name, guest_count, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    supabase
      .from("guestbook")
      .select("id, display_name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
  ]);

  if (att.error) {
    console.error("[admin/dashboard] attendees", att.error);
    return NextResponse.json({ error: "Không tải được danh sách tham dự." }, { status: 500 });
  }
  if (gb.error) {
    console.error("[admin/dashboard] guestbook", gb.error);
    return NextResponse.json({ error: "Không tải được lời chúc." }, { status: 500 });
  }

  return NextResponse.json({
    attendees: att.data ?? [],
    messages: gb.data ?? [],
  });
}
