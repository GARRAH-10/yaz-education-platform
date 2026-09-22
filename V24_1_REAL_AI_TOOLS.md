# V24.1 — Real conversational YAZ AI

V24.1 upgrades the advisor from keyword-first retrieval to a real conversational OpenAI assistant with YAZ database tools.

## What changed

- Multi-turn conversation context: follow-ups such as `what about UTM?` inherit the previous field/level discussion.
- General education questions can be answered directly by the model without forcing a programme search.
- YAZ-specific programme facts use the `search_yaz_programmes` tool backed by the verified Supabase catalogue.
- University-level facts use `search_yaz_universities`.
- Optional OpenAI `web_search` is available for time-sensitive public information. It is enabled by default and can be disabled with `YAZ_AI_WEB_SEARCH=false`.
- Programme cards distinguish exact matches, specialisation/pathway matches, and broader related options.
- Exact tuition amounts are never exposed publicly.
- If OpenAI is unavailable or the API account has no credit, verified local/Supabase retrieval still works as a fallback.

## Required environment settings

```env
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6-luna
YAZ_AI_WEB_SEARCH=true
```

Never put the OpenAI key in a variable beginning with `NEXT_PUBLIC_`.

## Example conversation

1. `Which universities have Cybersecurity?`
2. `What about UTM?`

The second turn is interpreted in the context of Cybersecurity rather than as an unrelated UTM query.

## Grounding policy

- Specific programme/university catalogue facts must come from YAZ tools.
- Missing YAZ data is described as `not currently verified in the YAZ database`, not as proof that a programme does not exist.
- Related programmes are clearly labelled rather than presented as exact matches.
- Fees are handed off to a human YAZ advisor for latest confirmation.
