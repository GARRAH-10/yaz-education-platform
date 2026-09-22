import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { adminAuthConfigured } from "@/lib/admin-auth";

export type RuntimeStatus = {
  environment: string;
  siteUrlConfigured: boolean;
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  adminConfigured: boolean;
  aiConfigured: boolean;
  aiModel: string | null;
};

export async function getRuntimeStatus(): Promise<RuntimeStatus> {
  const supabase = getSupabaseAdmin();
  let supabaseConnected = false;

  if (supabase) {
    try {
      const { error } = await supabase
        .from("universities")
        .select("id", { head: true, count: "exact" });
      supabaseConnected = !error;
    } catch {
      supabaseConnected = false;
    }
  }

  return {
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseConnected,
    adminConfigured: adminAuthConfigured(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    aiModel: process.env.GEMINI_MODEL || null,
  };
}
