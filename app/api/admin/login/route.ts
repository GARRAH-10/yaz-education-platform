import { NextResponse } from "next/server";
import { adminAuthConfigured, adminCookieName, adminCookieOptions, createAdminToken, validateAdminCredentials } from "@/lib/admin-auth";
import { isSameOriginRequest, noStoreHeaders } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin admin login is not allowed." }, { status: 403, headers: noStoreHeaders() });
  }

  if (!adminAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin authentication is not configured." }, { status: 503, headers: noStoreHeaders() });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers: noStoreHeaders() });
  }

  if (!validateAdminCredentials(body.email || "", body.password || "")) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401, headers: noStoreHeaders() });
  }

  const response = NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
  response.cookies.set(adminCookieName(), createAdminToken(), adminCookieOptions());
  return response;
}
