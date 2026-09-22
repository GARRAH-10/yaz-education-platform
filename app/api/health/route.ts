import { NextResponse } from "next/server";
import { getRuntimeStatus } from "@/lib/runtime-status";
import { noStoreHeaders } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getRuntimeStatus();
  const healthy = status.supabaseConfigured ? status.supabaseConnected : false;

  return NextResponse.json(
    {
      ok: healthy,
      ...status,
      checkedAt: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: noStoreHeaders(),
    },
  );
}
