import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { adminAuthConfigured, hasAdminSession } from "@/lib/admin-auth";

export const metadata = { title: "YAZ Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return <AdminLoginForm configured={adminAuthConfigured()} />;
}
