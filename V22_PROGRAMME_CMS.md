# V22 — Programme Data System

V22 expands the programme model from a small directory record into a structured dataset that can support admissions guidance, fee comparison and later AI matching.

## Database migration

If the Supabase project already has the V21 schema, run this file once in Supabase SQL Editor:

`supabase/migrations/002_programme_details.sql`

It adds fields for:

- Arabic programme name
- study mode
- numeric international fee
- fee currency and fee period
- academic requirements in English and Arabic
- English-language requirements in English and Arabic
- required documents in English and Arabic
- accreditation / recognition
- scholarship information
- application notes

The migration is idempotent (`add column if not exists`), so it is safe to rerun.

## Admin dashboard

The Programme editor is now divided into five sections:

1. Programme information
2. Tuition
3. Admission requirements
4. Quality, funding and notes
5. Verification

A programme is public only when `verified_at` has a date. This preserves the verified-data rule used by the public site.

## Public programme pages

When data exists, profile pages can now display:

- study mode
- fee and fee period
- academic requirements
- English requirements
- required documents
- accreditation
- scholarship information
- application notes

Missing fields are not invented.

## Recommended data workflow

For each programme:

1. Open the official university programme page.
2. Enter the exact programme title and field.
3. Enter fees and requirements exactly as supported by the source.
4. Add the official source URL.
5. Add the verification date only after checking the source.
6. Review the public page after saving.
