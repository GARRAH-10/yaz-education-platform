import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { adminContext, ENTITY_TABLES, normalizePayload, type AdminEntity } from "@/lib/admin-api";
import { isSameOriginRequest, noStoreHeaders } from "@/lib/request-security";

export async function POST(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ ok: false, error: "Cross-origin admin request is not allowed." }, { status: 403, headers: noStoreHeaders() });
  const { entity } = await params;
  if (!(entity in ENTITY_TABLES)) return NextResponse.json({ ok: false, error: "Unsupported entity." }, { status: 404 });

  const context = await adminContext();
  if (!context.authorized) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  if (!context.supabase) return NextResponse.json({ ok: false, error: "Supabase admin connection is not configured." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }

  const key = entity as AdminEntity;
  const payload = normalizePayload(key, body);
  if (!payload.slug || !payload.name) return NextResponse.json({ ok: false, error: "Slug and name are required." }, { status: 400 });
  if (key === "programmes" && (!(payload as any).university_id || !(payload as any).level)) {
    return NextResponse.json({ ok: false, error: "University and study level are required." }, { status: 400 });
  }

  const { data, error } = await context.supabase.from(ENTITY_TABLES[key]).insert(payload).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  revalidateTag("catalog");
  return NextResponse.json({ ok: true, data }, { headers: noStoreHeaders() });
}
