# V22.2 — Public Tuition Fee Policy

## Decision
Exact tuition amounts are not displayed on public university/programme pages.

## Why
University fees can change by academic year, intake, programme structure, nationality, taxes, scholarships and other applicant-specific conditions. Publishing a stale amount can mislead students.

## Public experience
- Programme pages show **Get Latest Tuition Fee** / **Contact a YAZ advisor**.
- University pages no longer display exact programme fees.
- Programme search does not display exact fees.
- YAZ AI must not reveal exact internal fee amounts and instead directs users to an advisor for the latest official fee.

## Internal/admin experience
Fee fields remain available in Supabase and the Admin Dashboard for internal advising, verification and future budget-matching logic.

## Data principle
Internal fee records should still be sourced, dated and kept consistent, but they are not treated as permanent public prices.
