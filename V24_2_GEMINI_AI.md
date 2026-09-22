# V24.2 — Gemini-powered YAZ AI

V24.2 replaces the paid OpenAI dependency used by V24.1 with the Google Gemini API while preserving the verified Supabase/YAZ retrieval architecture.

## Architecture

```text
Student message
   ↓
Gemini conversational model
   ↓
Needs YAZ catalogue facts?
   ├─ Yes → search_yaz_programmes / search_yaz_universities → Supabase/YAZ catalogue
   └─ No  → answer general study question directly
   ↓
Natural answer + verified programme cards
```

For optional time-sensitive public questions, the model can call `search_current_web`. The server then makes a separate Gemini request using Google Search grounding. This is disabled by default.

## Environment variables

Add these to `.env.local`:

```env
GEMINI_API_KEY=your_server_side_gemini_key
GEMINI_MODEL=gemini-2.5-flash
YAZ_AI_WEB_SEARCH=false
```

Do **not** prefix the Gemini key with `NEXT_PUBLIC_`.

The existing Supabase/admin variables are still required.

## Important behavior

- Multi-turn context is preserved through the chat history supplied by the browser.
- Specific YAZ university/programme claims should be checked through the YAZ tools.
- General study questions can be answered directly by Gemini.
- Follow-ups such as `What about UTM?` inherit the earlier topic when appropriate.
- Exact tuition values are not disclosed publicly.
- If Gemini is unavailable, the API falls back to verified deterministic YAZ/Supabase retrieval instead of failing completely.
- The chat header now shows whether Gemini is connected or whether the advisor is in verified-search fallback mode.

## Recommended test conversation

1. `What is the difference between Computer Science and Software Engineering?`
2. `Which universities have Cybersecurity?`
3. `What about UTM?`
4. `What about APU?`
5. `How much is Mechanical Engineering at UCSI?`

The first question should receive a normal conceptual AI answer. The programme/university questions should use YAZ data. The fee question must not expose an exact tuition number.

## Optional current-web grounding

To enable the server-side current-information tool:

```env
YAZ_AI_WEB_SEARCH=true
```

Keep it disabled if you do not need real-time web information. The main conversational Gemini + Supabase integration works without it.
