"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-icon"><LockKeyhole size={26} /></div>
        <p className="admin-eyebrow">YAZ EDUCATION</p>
        <h1>Admin Dashboard</h1>
        <p>Manage catalogue data and consultation leads without editing the source code.</p>

        {!configured ? (
          <div className="admin-warning">
            Admin login is not configured yet. Add <code>ADMIN_DASHBOARD_EMAIL</code>, <code>ADMIN_DASHBOARD_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> to your server environment.
          </div>
        ) : null}

        <form onSubmit={submit} className="admin-login-form">
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required disabled={!configured} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required disabled={!configured} />
          </label>
          {error ? <div className="admin-error">{error}</div> : null}
          <button type="submit" disabled={!configured || loading}>
            <LogIn size={17} /> {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
