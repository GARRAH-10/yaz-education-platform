# V24.3 — Gemini resilience patch

This patch addresses temporary Gemini API failures such as HTTP 503 UNAVAILABLE and 429 rate limits.

## Changes

- Primary model defaults to `gemini-3.5-flash-lite`.
- Automatic exponential retry for 408/429/500/502/503/504.
- If the initial request still fails, YAZ tries fallback models in order.
- Default fallback order: `gemini-3.5-flash`, then `gemini-3.1-flash-lite`.
- Once a model starts a function-calling turn, the route stays on that same model so Gemini 3 thought signatures remain valid.
- Request timeout prevents the chat from hanging indefinitely.
- Supabase/YAZ verified retrieval remains the final fallback.

Recommended `.env.local`:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-3.5-flash,gemini-3.1-flash-lite
YAZ_AI_WEB_SEARCH=false
```

Keep web search disabled on the Gemini free tier.
