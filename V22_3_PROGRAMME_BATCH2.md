# V22.3 — Programme Batch 2

This batch expands the verified catalogue into business, accounting, finance, marketing, HR, analytics, supply chain and related disciplines.

Public tuition amounts remain hidden. Fee fields already stored internally are not exposed by the public programme pages.

## Records in this batch

- **APU**: 21
- **TAYLORS**: 8
- **UCSI**: 14
- **MMU**: 12
- **SUNWAY**: 12

**Total:** 67 new/updated programme records.

## Run

Execute `supabase/migrations/004_programme_batch2_business_finance.sql` after migrations 001–003. The script is idempotent and does not delete existing data.

## Sources

Every row has an official university source URL and the source audit file is `supabase/programme_batch2_sources.csv`.
