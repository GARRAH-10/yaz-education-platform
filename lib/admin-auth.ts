import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const DEV_COOKIE_NAME = "yaz_admin_session";
const PROD_COOKIE_NAME = "__Host-yaz_admin_session";

function cookieName() {
  return process.env.NODE_ENV === "production" ? PROD_COOKIE_NAME : DEV_COOKIE_NAME;
}
const SESSION_HOURS = 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(payload: string) {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_DASHBOARD_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function validateAdminCredentials(email: string, password: string) {
  const expectedEmail = (process.env.ADMIN_DASHBOARD_EMAIL || "admin@yaz.local").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_DASHBOARD_PASSWORD || "";
  if (!expectedPassword) return false;
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword);
}

export function createAdminToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;
  const [expiresRaw, signature] = token.split(".");
  const expires = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = sign(expiresRaw);
  return Boolean(expected && safeEqual(signature, expected));
}

export async function hasAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(cookieName())?.value);
}

export function adminCookieName() {
  return cookieName();
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
