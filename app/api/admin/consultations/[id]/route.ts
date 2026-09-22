import { NextResponse } from "next/server";
import { adminContext, cleanText } from "@/lib/admin-api";
import { isSameOriginRequest, noStoreHeaders } from "@/lib/request-security";

const allowed = new Set(["new", "contacted", "qualified", "closed"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ ok: false, error: "Cross-origin admin request is not allowed." }, { status: 403, headers: noStoreHeaders() });
  const { id } = await params;
  const context = await adminContext();
  if (!context.authorized) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  if (!context.supabase) return NextResponse.json({ ok: false, error: "Supabase admin connection is not configured." }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }
  const status = cleanText(body.status, 30);
  if (!allowed.has(status)) return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  const { data, error } = await context.supabase.from("consultations").update({ status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data }, { headers: noStoreHeaders() });
}
