import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type ConsultationPayload = {
  name?: unknown;
  nationality?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  level?: unknown;
  field?: unknown;
  intake?: unknown;
  message?: unknown;
  locale?: unknown;
};

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: ConsultationPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const record = {
    full_name: clean(body.name, 120),
    nationality: clean(body.nationality, 100),
    whatsapp: clean(body.whatsapp, 80),
    email: clean(body.email, 160) || null,
    study_level: clean(body.level, 100),
    field_of_study: clean(body.field, 160) || null,
    preferred_intake: clean(body.intake, 120) || null,
    message: clean(body.message, 1500) || null,
    locale: body.locale === "ar" ? "ar" : "en",
    source: "website",
    status: "new",
  };

  if (!record.full_name || !record.nationality || !record.whatsapp || !record.study_level) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // The site remains usable before Supabase is connected. The UI can still continue to WhatsApp.
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      saved: false,
      mode: "whatsapp-only",
      message: "Supabase is not configured yet; lead was not stored in the database.",
    });
  }

  const { data, error } = await supabase
    .from("consultations")
    .insert(record)
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Consultation storage error", error);
    return NextResponse.json({ ok: false, error: "Unable to save consultation." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: true, consultation: data });
}
