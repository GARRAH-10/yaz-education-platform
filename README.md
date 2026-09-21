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
