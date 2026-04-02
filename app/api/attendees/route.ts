import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseRouteClient } from "@/lib/supabase/server-client";

const MAX_NAME = 200;
let cachedServiceClient: SupabaseClient | null = null;

function getSupabaseAttendeesClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) {
    if (!cachedServiceClient) {
      cachedServiceClient = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    }
    return cachedServiceClient;
  }
  return getSupabaseRouteClient();
}

export async function POST(request: Request) {
  const supabase = getSupabaseAttendeesClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Thiếu cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, hoặc fallback ANON).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload không hợp lệ." }, { status: 400 });
  }

  const { full_name: rawName, guest_count: rawGuests } = body as Record<string, unknown>;

  const full_name =
    typeof rawName === "string" ? rawName.trim().slice(0, MAX_NAME) : "";
  if (!full_name) {
    return NextResponse.json({ error: "Họ và tên là bắt buộc." }, { status: 400 });
  }

  let guest_count = 0;
  if (rawGuests !== undefined && rawGuests !== null) {
    const n = typeof rawGuests === "number" ? rawGuests : Number(rawGuests);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return NextResponse.json({ error: "Số người đi cùng không hợp lệ." }, { status: 400 });
    }
    guest_count = n;
  }

  if (guest_count < 0 || guest_count > 10) {
    return NextResponse.json(
      { error: "Số người đi cùng phải từ 0 đến 10." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("attendees")
    .insert({ full_name, guest_count })
    .select("id, full_name, guest_count, created_at")
    .single();

  if (error) {
    console.error("[attendees] insert", error);
    if (error.code === "42501") {
      return NextResponse.json(
        {
          error:
            "Bảng attendees bị RLS chặn với ANON key. Thêm SUPABASE_SERVICE_ROLE_KEY vào .env.local hoặc mở policy INSERT cho role anon.",
        },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Không lưu được xác nhận. Thử lại sau." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, attendee: data }, { status: 201 });
}
