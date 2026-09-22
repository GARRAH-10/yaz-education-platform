# V24.5 — General AI Mode

YAZ AI now answers general harmless questions directly through Gemini instead of redirecting unrelated questions back to study planning.

Verified YAZ facts remain tool-grounded:
- university/programme facts -> Supabase/YAZ tools
- general questions -> Gemini directly
- current public facts -> optional web grounding when enabled
- tuition amounts remain hidden publicly

If Gemini is temporarily unavailable, the fallback no longer pretends that a general question is a failed programme search. It clearly states that general AI is temporarily unavailable while verified YAZ search remains available.

Environment variables:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-3.5-flash,gemini-3.1-flash-lite
YAZ_AI_WEB_SEARCH=false
```
