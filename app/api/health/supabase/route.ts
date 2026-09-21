import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ configured: false, connected: false }, { status: 200 });
  }

  const { error } = await supabase.from("consultations").select("id", { head: true, count: "exact" });

  if (error) {
    return NextResponse.json({ configured: true, connected: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, connected: true });
}
