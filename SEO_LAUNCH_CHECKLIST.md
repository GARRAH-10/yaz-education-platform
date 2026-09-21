# YAZ Education SEO Launch Checklist

## Before deployment

- [ ] Choose the final production domain.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.com` in Vercel.
- [ ] Confirm every public page loads without login.
- [ ] Confirm university and programme facts are sourced from official institutions.
- [ ] Remove temporary/demo claims and placeholder data.
- [ ] Verify WhatsApp, email and Instagram links.
- [ ] Confirm Arabic and English versions contain substantive localized content.

## Technical SEO

- [ ] Open `/robots.txt` and confirm public pages are allowed.
- [ ] Confirm `OAI-SearchBot` is allowed.
- [ ] Open `/sitemap.xml` and confirm URLs use the production domain.
- [ ] Check canonical URLs in page source.
- [ ] Check `hreflang` for English and Arabic versions.
- [ ] Validate Organization/Breadcrumb/Course structured data.
- [ ] Confirm filtered/search query URLs canonicalize to the main directory page.
- [ ] Confirm 404 pages return a real 404 status.
- [ ] Use HTTPS only in production.

## Google Search Console

- [ ] Create a Domain or URL-prefix property.
- [ ] Add `GOOGLE_SITE_VERIFICATION` to Vercel if using HTML-tag verification.
- [ ] Submit `https://YOUR-DOMAIN.com/sitemap.xml`.
- [ ] Inspect `/en`, `/ar`, `/en/universities`, and 3–5 important profile pages.
- [ ] Request indexing for priority pages after launch.
- [ ] Monitor Page Indexing, Core Web Vitals and manual actions.

## AI-search discoverability

- [ ] Keep `OAI-SearchBot` accessible in robots.txt.
- [ ] Make sure CDN/firewall/bot protection does not return 403 to legitimate crawlers.
- [ ] Keep important information visible in HTML, not only inside client-side chat interactions.
- [ ] Cite official sources on university/programme pages.
- [ ] Show clear update/verification dates for time-sensitive information.
- [ ] Use descriptive page titles and headings that directly answer student queries.

## Content strategy after launch

Prioritize original pages that answer high-intent searches, for example:

- Study in Malaysia for Arabic-speaking students
- APU Malaysia fees and admission requirements
- UTM Malaysia admission requirements for international students
- English language institutes in Kuala Lumpur
- Cost of studying in Malaysia
- Computer Science universities in Malaysia
- Foundation programmes in Malaysia

Do not mass-produce thin AI pages. Each page should contain useful, verified, differentiated information.

## Local trust signals

- [ ] Create/complete YAZ Education Google Business Profile if eligible.
- [ ] Keep business name, phone, city and website consistent across profiles.
- [ ] Add genuine office/team/activity photos.
- [ ] Collect genuine student reviews rather than manufactured testimonials.
- [ ] Link Instagram and other official profiles to the website.

## Measurement

- [ ] Install Google Analytics or another analytics platform.
- [ ] Track consultation-form submissions.
- [ ] Track WhatsApp clicks.
- [ ] Track university-profile and programme-page conversions.
- [ ] Segment Arabic vs English performance.
- [ ] Track ChatGPT referral traffic separately when available.
