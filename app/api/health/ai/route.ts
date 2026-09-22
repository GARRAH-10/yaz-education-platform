import { NextResponse } from "next/server";
import { noStoreHeaders } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json(
    {
      configured,
      model: process.env.GEMINI_MODEL || null,
      webSearchEnabled: process.env.YAZ_AI_WEB_SEARCH === "true",
      note: "This endpoint checks configuration only and does not make a billable AI request.",
    },
    { status: configured ? 200 : 503, headers: noStoreHeaders() },
  );
}
