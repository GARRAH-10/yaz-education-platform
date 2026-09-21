# Supabase setup — YAZ Education V18

V18 introduces the database layer without breaking local development. Until Supabase is configured, the site continues to use the existing verified TypeScript catalogue and consultation submissions continue to WhatsApp.

## 1. Create a Supabase project

Create a project in Supabase, then open **SQL Editor**.

## 2. Create the schema

Run:

`supabase/migrations/001_initial_schema.sql`

Then run:

`supabase/seed.sql`

The seed gives you a starter catalogue for universities, language institutes and several verified programmes.

## 3. Configure `.env.local`

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`, expose it in browser code, screenshot it, or commit it to GitHub.

## 4. What is database-backed in V18?

- Consultation form submissions are stored in `consultations` when Supabase is configured.
- The database schema is ready for universities, language institutes and programmes.
- The current directories still use the verified local TypeScript dataset as a fallback while catalogue migration is completed.

This staged approach keeps the site working while data is migrated and audited.

## 5. Verify a consultation

Submit the homepage consultation form. In Supabase open **Table Editor → consultations**. A new row should appear with status `new`.

## Security

- Public users may only read verified catalogue records through RLS.
- The `consultations` table has no public insert/read policy.
- Consultation inserts are performed by the Next.js server using the service-role key.
