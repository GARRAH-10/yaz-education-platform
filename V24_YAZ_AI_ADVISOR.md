# V24 — Grounded YAZ AI Advisor

## Purpose

V24 turns the existing YAZ AI chat into a grounded programme-discovery assistant. Programme and university facts are retrieved from the verified YAZ catalogue first; the language model is used to explain those retrieved facts rather than inventing its own catalogue.

## Request flow

```text
Student question
      ↓
Intent extraction
(field / level / university / location)
      ↓
Verified Supabase programme catalogue
      ↓
Top relevant programme records only
      ↓
OpenAI Responses API
      ↓
Grounded answer + programme cards
      ↓
View programme / Compare / Human advisor
```

## Important safety and data-quality rules

- Public users never receive internal exact tuition amounts.
- If a programme fact is missing, YAZ AI says it is not yet verified.
- The model cannot invent programmes outside the retrieved records.
- The assistant does not label a university/programme as the universal "best" or as a winner.
- Exact fees are handed off to a YAZ human advisor.
- Only a small relevant subset of catalogue records is sent to OpenAI.

## Resilient fallback

The retrieval layer works independently of OpenAI. If:

- `OPENAI_API_KEY` is not configured,
- API credit is exhausted, or
- the OpenAI request temporarily fails,

YAZ AI still returns deterministic matches from Supabase and displays programme cards. This prevents the public advisor from becoming unusable because of an external AI outage.

## Environment

`.env.local` can contain:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.6-luna
```

The OpenAI key is optional for catalogue matching, but required for natural-language AI explanations.

Do not expose `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, admin credentials, or session secrets in screenshots, browser code, or GitHub.

## Test cases

Try:

```text
Bachelor's in Mechanical Engineering
Which universities have Cybersecurity?
Master's in Data Science
UTM Civil Engineering
What are the entry requirements for UCSI Psychology?
How much is the tuition for Mechanical Engineering?
```

Expected behaviour for the tuition question: YAZ AI must not show the internal fee amount; it should direct the student to the advisor for the latest official fee.

## Comparison integration

Programme cards returned inside YAZ AI can be added to the same comparison state used by the Programme Directory. Once two or more are selected, the chat shows a link to the comparison page.
