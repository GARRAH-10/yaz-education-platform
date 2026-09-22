# V22.1 — Programme Database Batch 1

This update adds an idempotent Supabase migration containing **49 verified programme records** across six Malaysian universities. Four of these slugs already existed in the starter seed and are corrected/updated; the remainder are new. After running the migration, the Batch-1 programme set should contain **49 records**.

## Coverage

- **UTM**: 10 records
- **APU**: 10 records
- **TAYLORS**: 7 records
- **UCSI**: 8 records
- **MMU**: 8 records
- **SUNWAY**: 6 records

## Scope

The first batch prioritises Engineering and Computing because those were the largest gaps in programme search:

- Civil Engineering
- Mechanical Engineering
- Electrical & Electronic Engineering
- Mechatronics Engineering
- Chemical Engineering
- Petroleum Engineering
- Aerospace Engineering
- Computer Science
- Software Engineering
- Artificial Intelligence
- Cybersecurity
- Data Science
- Information Technology

## Data-quality rules

1. `field` uses the website's controlled study-field taxonomy so exact filters work correctly.
2. `international_fee_amount`, `fee_currency`, `fee_period`, and the human-readable fee display describe the same fee basis.
3. Unknown values are left `NULL` or empty rather than inferred.
4. UTM fees in this batch use UTM's current **field-level international tuition totals for students exempted from the Bridging Programme**; they are not presented as programme-specific quotations.
5. Sunway's international USD values are stored as **estimated annual fees**, not total programme fees, because that is how the university publishes them.
6. UCSI amounts are labelled approximate and without bridging where stated.
7. Fees/intakes can change. `verified_at` records the source-review date; staff should re-check official sources before issuing a quotation or admission advice.

## Run it

In Supabase SQL Editor, after migrations `001` and `002`, run:

`supabase/migrations/003_programme_batch1_engineering_computing.sql`

The final query should return:

`batch1_programme_count = 49`

Then refresh `/admin` and `/en/programmes`.

## Source audit

A machine-readable source register is included at:

`supabase/programme_batch1_sources.csv`
