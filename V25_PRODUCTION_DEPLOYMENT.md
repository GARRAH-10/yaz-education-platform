# V25 — Production Admin + Supabase + Vercel

V25 focuses on deploying the existing YAZ platform safely to production. It intentionally does **not** change the AI behaviour; the AI issue can be resumed after production infrastructure is stable.

## What V25 adds

- Combined non-secret health endpoint at `/api/health`.
- AI configuration-only health endpoint at `/api/health/ai` (no billable model call).
- Stronger production admin cookie using the `__Host-` prefix.
- Same-origin checks on admin write/login routes as CSRF defence-in-depth.
- `no-store` handling for admin authentication/write responses.
- `X-Robots-Tag: noindex` on admin and admin API routes.
- Additional security headers: `X-Frame-Options: DENY` and `Cross-Origin-Opener-Policy: same-origin`.
- Updated production environment-variable checklist.

## Required Vercel environment variables

Add these to the **Production** environment in Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-PRODUCTION-DOMAIN
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_DASHBOARD_EMAIL=...
ADMIN_DASHBOARD_PASSWORD=...
ADMIN_SESSION_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-3.5-flash
YAZ_AI_WEB_SEARCH=false
GOOGLE_SITE_VERIFICATION=
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_DASHBOARD_PASSWORD`, `ADMIN_SESSION_SECRET`, or `GEMINI_API_KEY` in screenshots or GitHub.

## Deployment sequence

1. Copy your local `.env.local` only for local testing.
2. Run:

```powershell
npm install
npm run typecheck
npm run build
```

3. Push V25 to the GitHub repository connected to Vercel.
4. In Vercel, add/update all Production environment variables above.
5. Redeploy the latest `main` commit.
6. Open `/api/health` on the deployed domain.
7. Confirm `supabaseConnected: true`, `adminConfigured: true`, and `aiConfigured: true`.
8. Open `/admin/login` and verify the production admin session works.
9. Submit one test consultation from the public site and verify it appears in Admin.
10. Test one Add/Edit/Delete cycle with a temporary unverified record, then delete it.

## Production validation URLs

```text
/en
/ar
/en/programmes
/en/universities
/en/language-institutes
/admin/login
/api/health
/api/health/ai
/robots.txt
/sitemap.xml
```

## Important

`/api/health/ai` checks only whether Gemini is configured. It deliberately does not call Gemini, so opening the health page does not consume AI quota.
