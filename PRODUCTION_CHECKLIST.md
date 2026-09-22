# YAZ Education V25 Production Checklist

## Build
- [ ] `npm install`
- [ ] `npm run typecheck`
- [ ] `npm run build`

## Vercel secrets
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ADMIN_DASHBOARD_EMAIL`
- [ ] `ADMIN_DASHBOARD_PASSWORD`
- [ ] `ADMIN_SESSION_SECRET`
- [ ] `GEMINI_API_KEY`
- [ ] `GEMINI_MODEL`
- [ ] `GEMINI_FALLBACK_MODELS`
- [ ] `YAZ_AI_WEB_SEARCH=false`

## Health
- [ ] `/api/health` returns `supabaseConnected: true`
- [ ] `/api/health` returns `adminConfigured: true`
- [ ] `/api/health` returns `aiConfigured: true`
- [ ] `/api/health/ai` works without making a model call

## Admin
- [ ] `/admin/login` works over HTTPS
- [ ] admin page is not indexed
- [ ] create temporary test record
- [ ] edit temporary test record
- [ ] delete temporary test record

## Leads
- [ ] submit test consultation
- [ ] lead stored in Supabase
- [ ] lead visible in Admin
- [ ] lead status can be updated

## Public site
- [ ] `/en`
- [ ] `/ar`
- [ ] programme search
- [ ] university pages
- [ ] language institute pages
- [ ] comparison
- [ ] WhatsApp CTAs

## SEO/security
- [ ] canonical domain correct
- [ ] `/robots.txt`
- [ ] `/sitemap.xml`
- [ ] admin excluded from indexing
- [ ] no secrets committed to GitHub
- [ ] old exposed keys revoked
