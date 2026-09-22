import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata = { title: "YAZ Admin Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return <AdminDashboard configured={false} universities={[]} programmes={[]} institutes={[]} consultations={[]} />;
  }

  const [universitiesResult, programmesResult, institutesResult, consultationsResult] = await Promise.all([
    supabase.from("universities").select("*").order("name"),
    supabase.from("programmes").select("*, universities(name,short_name,slug)").order("name"),
    supabase.from("language_institutes").select("*").order("name"),
    supabase.from("consultations").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  const firstError = universitiesResult.error || programmesResult.error || institutesResult.error || consultationsResult.error;
  if (firstError) console.error("Admin dashboard Supabase read error", firstError.message);

  return (
    <AdminDashboard
      configured={!firstError}
      universities={universitiesResult.data || []}
      programmes={programmesResult.data || []}
      institutes={institutesResult.data || []}
      consultations={consultationsResult.data || []}
    />
  );
}
