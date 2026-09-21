# YAZ Education Production Checklist

## Code
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] No console errors on main pages
- [ ] No dead internal links

## Security
- [ ] `.env.local` is not committed
- [ ] Old/exposed API keys revoked
- [ ] Supabase service-role key exists only server-side
- [ ] Production secrets configured in Vercel

## Domain / SEO
- [ ] Final domain chosen
- [ ] `NEXT_PUBLIC_SITE_URL` equals final HTTPS domain
- [ ] `/robots.txt` works
- [ ] `/sitemap.xml` works
- [ ] Arabic/English canonical + hreflang checked
- [ ] Search Console verified
- [ ] Sitemap submitted

## Content
- [ ] University data reviewed against official sources
- [ ] Language institute data reviewed
- [ ] Programme fees/intakes include dates or verification notes
- [ ] YAZ contact details confirmed
- [ ] No unsupported partnership claims

## UX
- [ ] Desktop tested
- [ ] iPhone/mobile width tested
- [ ] Android/mobile width tested
- [ ] Arabic RTL tested
- [ ] Dropdowns tested
- [ ] Consultation form tested
- [ ] WhatsApp links tested

## Launch
- [ ] GitHub main branch clean
- [ ] Vercel production deployment successful
- [ ] Custom domain resolves with HTTPS
- [ ] Production pages manually checked
- [ ] Search Console indexing requested
