import { NextResponse } from "next/server";
import { getSupabaseRouteClient } from "@/lib/supabase/server-client";

const MAX_NAME = 120;
const MAX_MESSAGE = 2000;
const LIST_LIMIT = 100;

export async function GET() {
  const supabase = getSupabaseRouteClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Thiếu cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("guestbook")
    .select("id, display_name, message, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (error) {
    console.error("[guestbook] select", error);
    return NextResponse.json(
      { error: "Không tải được lời chúc." },
      { status: 500 },
    );
  }

  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseRouteClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Thiếu cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)." },
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

  const { display_name: rawDisplay, message: rawMessage } = body as Record<string, unknown>;

  const display_name = (
    typeof rawDisplay === "string" && rawDisplay.trim()
      ? rawDisplay.trim()
      : "Khách mời"
  ).slice(0, MAX_NAME);

  const message =
    typeof rawMessage === "string" ? rawMessage.trim().slice(0, MAX_MESSAGE) : "";
  if (!message) {
    return NextResponse.json({ error: "Lời chúc là bắt buộc." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("guestbook")
    .insert({ display_name, message })
    .select("id, display_name, message, created_at")
    .single();

  if (error) {
    console.error("[guestbook] insert", error);
    return NextResponse.json(
      { error: "Không gửi được lời chúc. Thử lại sau." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: data }, { status: 201 });
}
