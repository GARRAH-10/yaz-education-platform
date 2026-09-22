# V24.6 — Faster YAZ AI + Better Short Queries

## What changed

- Added a fast local/Supabase route for clear catalogue questions such as `SE in APU`, `what about UTM?`, and `Which universities have Cybersecurity?`.
- Added common abbreviations including `SE`, `SWE`, `CS`, and `cybersec`.
- Short aliases are now matched as complete tokens so `SE` cannot accidentally match a longer word such as `please`.
- Reduced Gemini history/tool rounds and shortened retry timing to improve response latency.
- Limited automatic model failover to the primary model plus one fallback instead of waiting through several slow model chains.
- General questions still go to Gemini; YAZ catalogue questions use verified catalogue data directly when the request is already clear.
- The chat continues to show an immediate typing indicator while a response is being prepared.

## Why this architecture is faster

A question such as `SE in APU` does not need an LLM to determine what to query. V24.6 resolves the abbreviation, searches the verified YAZ catalogue directly, and returns programme cards. Gemini remains responsible for general-purpose questions, explanations, ambiguous questions and natural conversation.

## No database migration

No Supabase migration is required for V24.6. Copy the existing `.env.local`, then run `npm install` and `npm run dev`.
