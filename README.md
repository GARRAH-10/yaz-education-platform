# YAZ Education V25 — Production Infrastructure

V25 hardens the existing platform for Vercel production deployment. The AI behaviour is intentionally unchanged from V24.6 so deployment can be validated independently before returning to the AI issue.

See `V25_PRODUCTION_DEPLOYMENT.md` for the exact production sequence.

V24.6 improves YAZ AI response speed and catalogue understanding. Clear YAZ catalogue requests such as `SE in APU`, `what about UTM?`, and `Which universities have Cybersecurity?` now use the verified catalogue directly instead of waiting for a full Gemini tool round-trip. General questions still go to Gemini.

See `V24_6_FAST_AI_CONTEXT.md` for details.

---

# YAZ Education — V19 SEO & AI Search Readiness

This version prepares the public YAZ Education website for search-engine indexing and AI-search discovery while retaining the V18 Supabase foundation.

## What V19 adds

- Page-specific SEO titles and meta descriptions in English and Arabic.
- Canonical URLs for home, directories and profile pages.
- `hreflang` alternates for English (`en-MY`) and Arabic (`ar`) pages.
- Open Graph and Twitter/X metadata.
- Dynamic `sitemap.xml` covering:
  - both language homepages
  - university directory and profiles
  - programme directory and verified programme pages
  - language institute directory and profiles
- Dynamic `robots.txt` that allows public crawling, explicitly allows `OAI-SearchBot`, and blocks `/api/` from crawling.
- Organization and WebSite JSON-LD on localized pages.
- Breadcrumb structured data on directories and profile pages.
- `CollegeOrUniversity` structured data on university profiles.
- `Course` structured data on programme pages.
- `EducationalOrganization` structured data on language-institute profiles.
- Static generation parameters for localized profile URLs.
- Google Search Console verification support through an environment variable.
- Web app manifest and YAZ icon metadata.
- Permanent root redirect from `/` to `/en`.

## Important production setting

Before deployment, set your real public domain in `.env.local` locally and in Vercel production environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.com
```

Do not launch with `http://localhost:3000`, otherwise canonical URLs and sitemap entries will point to localhost.

## Google Search Console

After you create a Search Console property, copy the verification value into:

```env
GOOGLE_SITE_VERIFICATION=your_google_verification_value
```

Restart/redeploy the application, verify the property, and submit:

```text
https://YOUR-DOMAIN.com/sitemap.xml
```

## ChatGPT / AI-search discovery

`robots.txt` explicitly permits `OAI-SearchBot` on public pages. Do not place public university/programme pages behind login, `noindex`, firewall rules or bot protection that blocks legitimate crawlers.

Allowing a crawler does not guarantee ranking or citation. Search visibility still depends on useful original content, accurate data, authority, links, freshness and relevance.

## Run locally

```bash
npm install
npm run dev
```

English:

```text
http://localhost:3000/en
```

Arabic:

```text
http://localhost:3000/ar
```

SEO endpoints:

```text
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/manifest.webmanifest
```

## Recommended next launch steps

1. Finish Supabase content migration.
2. Confirm the production domain.
3. Deploy to Vercel.
4. Set `NEXT_PUBLIC_SITE_URL` in Vercel.
5. Connect Google Search Console.
6. Submit the sitemap.
7. Add analytics/conversion tracking.
8. Expand official-source content for university and programme pages.
9. Build original guide/article pages targeting real student search queries.


## V20 — Production launch preparation

V20 adds production scripts, security headers, a GitHub Actions production check, and launch documentation.

```bash
npm run typecheck
npm run build
```

See `DEPLOYMENT_GUIDE_AR.md` and `PRODUCTION_CHECKLIST.md` before public launch.

## V21 — Database-connected catalogue + Admin Dashboard

V21 adds the first operational content-management layer:

- Public university, programme and language-institute pages prefer verified Supabase records.
- Existing local verified data remains as a safe fallback while migration is in progress.
- Dynamic sitemap reads from the same catalogue layer.
- Protected `/admin` dashboard for catalogue CRUD and consultation-lead status management.
- Server-only service-role access for administrative writes.
- HTTP-only signed admin session cookie.
- `/admin` is excluded from search-engine crawling.

See `ADMIN_SETUP_AR.md` for the Arabic setup guide.

## V21.1 programme taxonomy improvement

Programme search now uses a full study-field taxonomy independent of the currently verified programme records. Engineering subfields such as Civil, Mechanical, Electrical & Electronic, Mechatronics, Chemical and others are searchable even while detailed programme records are still being verified. The interface shows matching institutions when exact programme-level data is not yet available rather than inventing programme details.

## V22 — Programme CMS

V22 introduces a richer programme data model and admin workflow for tuition, admissions requirements, documents, accreditation, scholarships and source verification. Existing Supabase projects must run `supabase/migrations/002_programme_details.sql` once before using the new fields. See `V22_PROGRAMME_CMS.md`.


## V22.1 Programme Batch 1

Run `supabase/migrations/003_programme_batch1_engineering_computing.sql` after migrations 001 and 002. See `V22_1_PROGRAMME_BATCH1.md` for scope and verification rules.

## V22.3 programme expansion

The second verified programme batch expands Business, Accounting, Finance, Marketing, HR, Analytics, Supply Chain and related undergraduate fields. Public tuition amounts remain intentionally hidden; students are directed to YAZ advisors for the latest official fee.

Run `supabase/migrations/004_programme_batch2_business_finance.sql` after migrations 001–003.



## V22.4 — Programme Batch 3

Adds 41 verified programme records covering health sciences, built environment, psychology, communication and creative media. Run `supabase/migrations/005_programme_batch3_health_built_media.sql` in Supabase. Exact tuition values remain hidden from public pages.


## V22.5 — Programme discovery UX

Primary navigation now includes a grouped Programmes mega-menu and the homepage includes a quick programme finder. Deep links preselect programme filters using query parameters.


## V23 — Programme Comparison

Students can select up to three verified programmes and compare objective programme information side by side before contacting a YAZ advisor. See `V23_PROGRAMME_COMPARISON.md`.

## V23.1 comparison UX
The comparison tray now includes an in-place programme picker so students can add the second or third programme even when the current filter returns only one result.


## V24 — Grounded YAZ AI Advisor

V24 connects the floating YAZ AI experience to the verified Supabase catalogue before the model is called. The AI receives only a small set of relevant verified programme records rather than the whole database.

Key behaviour:

- Extracts study field, level, university and location from the conversation.
- Retrieves matching verified programmes from the YAZ catalogue.
- Sends only the retrieved matches to the OpenAI Responses API.
- Never exposes internal tuition amounts to public users.
- Returns programme cards with direct profile links and comparison actions.
- Works on all public English/Arabic routes, not only the homepage.
- Falls back to deterministic verified-data matching if `OPENAI_API_KEY` is missing, out of credit, or temporarily unavailable.

No Supabase migration is required for V24. See `V24_YAZ_AI_ADVISOR.md`.

## V24.1 — Real conversational AI

YAZ AI now uses OpenAI Responses API function calling to query the verified YAZ Supabase catalogue when institution-specific facts are needed, while answering normal study/education questions conversationally. Multi-turn context is preserved for follow-up questions such as “what about UTM?”. Optional OpenAI web search is available for time-sensitive public information. See `V24_1_REAL_AI_TOOLS.md`.

## V24.2 — Gemini-powered YAZ AI

V24.2 replaces the OpenAI runtime dependency with Google Gemini while keeping the same verified YAZ/Supabase tool architecture. The advisor can answer general study questions conversationally, query the YAZ catalogue for institution-specific facts, preserve multi-turn context, and fall back to verified retrieval if Gemini is unavailable. Optional current-web grounding is disabled by default. See `V24_2_GEMINI_AI.md`.


## V24.3 Gemini resilience

See `V24_3_GEMINI_RESILIENCE.md` for retry and fallback behavior.

## V24.4 context fallback fix

Short follow-up questions now retain the latest user constraint correctly even when Gemini temporarily falls back to verified YAZ retrieval. For example, after discussing Cybersecurity, `What about APU?` uses APU as the current university and inherits Cybersecurity from the earlier turn. See `V24_4_CONTEXT_FALLBACK_FIX.md`.