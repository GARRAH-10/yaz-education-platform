# V24.4 — Context-aware fallback fix

This patch fixes short follow-up questions when Gemini is temporarily unavailable.

## Problem fixed

A conversation such as:

1. `Which universities have Cybersecurity?`
2. `What about UTM?`
3. `What about APU?`

could work on the Gemini turn but fail on a later transient Gemini error. The old retrieval fallback concatenated several historical user turns and could accidentally keep the older university (`UTM`) instead of the newest one (`APU`).

## New behaviour

The fallback now:

1. Parses the **current** message first.
2. Treats current constraints as authoritative.
3. Inherits only missing context (field, level, university, city) from recent user turns, newest first.

So `What about APU?` keeps `APU` while inheriting `Cybersecurity` from the earlier conversation.

This means the conversation remains useful even during a temporary Gemini 503/429 and does not require the student to repeat the full question.
