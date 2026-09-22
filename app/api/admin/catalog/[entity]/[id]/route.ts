import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { adminContext, ENTITY_TABLES, normalizePayload, type AdminEntity } from "@/lib/admin-api";
import { isSameOriginRequest, noStoreHeaders } from "@/lib/request-security";

function validEntity(entity: string): entity is AdminEntity {
  return entity in ENTITY_TABLES;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ ok: false, error: "Cross-origin admin request is not allowed." }, { status: 403, headers: noStoreHeaders() });
  const { entity, id } = await params;
  if (!validEntity(entity)) return NextResponse.json({ ok: false, error: "Unsupported entity." }, { status: 404 });
  const context = await adminContext();
  if (!context.authorized) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  if (!context.supabase) return NextResponse.json({ ok: false, error: "Supabase admin connection is not configured." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }
  const payload = normalizePayload(entity, body);
  const { data, error } = await context.supabase.from(ENTITY_TABLES[entity]).update(payload).eq("id", id).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  revalidateTag("catalog");
  return NextResponse.json({ ok: true, data }, { headers: noStoreHeaders() });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ ok: false, error: "Cross-origin admin request is not allowed." }, { status: 403, headers: noStoreHeaders() });
  const { entity, id } = await params;
  if (!validEntity(entity)) return NextResponse.json({ ok: false, error: "Unsupported entity." }, { status: 404 });
  const context = await adminContext();
  if (!context.authorized) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  if (!context.supabase) return NextResponse.json({ ok: false, error: "Supabase admin connection is not configured." }, { status: 503 });

  const { error } = await context.supabase.from(ENTITY_TABLES[entity]).delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  revalidateTag("catalog");
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
}
