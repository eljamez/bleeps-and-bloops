---
name: explore-first
description: Use this skill whenever you're about to investigate unfamiliar code by running several greps, finds, or cats in a row to build a mental model (e.g. "where does X flow from", "how does Y get gated", "find every place that calls Z"). Instead of hand-searching, spawn an Explore subagent to do the legwork and report back a synthesis. Trigger this before starting a multi-step manual search, not after you've already run a few commands — the whole point is to keep raw grep/find/cat output out of the main context window.
---

# Explore First

Manual exploration (grep, find, cat, repeated Read calls) is cheap to run but expensive to keep in context — every match, every file dump, every "let me check one more place" burns tokens that would otherwise be available for actually reasoning about the problem. The fix isn't to explore less, it's to explore in a subagent whose output you only see once it's been distilled into an answer.

## When to use this

Ask yourself before running a search: "am I trying to answer one question, or am I building a map?" If it's a map — tracing a data flow, finding every call site of something, understanding how a feature is wired across files — that's exploration, and it belongs in a subagent. A single targeted grep for a symbol you already expect to find in one place doesn't need this; just use Grep directly.

Signs you should have used this ten minutes ago:
- You've run 3+ greps/finds/cats trying to answer the same underlying question
- You're about to `cat` a file just to see if it's relevant
- You keep saying "let me also check..."

## How to do it

Spawn a subagent (`Explore` if available, otherwise `general-purpose`) with a self-contained prompt:

```
Agent({
  description: "<one-line question>",
  subagent_type: "Explore",
  prompt: "<the question, with explicit scope/constraints>. Report file paths and line numbers. Keep the report under 200-250 words — synthesis, not a transcript."
})
```

Write the prompt like you're briefing a colleague who's never seen the codebase: state the question, the directories or file patterns to search, and what "done" looks like. Ask explicitly for file+line references so you can jump straight to the relevant code afterward, and cap the response length so the agent doesn't hand back a second transcript.

**Example**

Instead of:
```
grep -r "hasPro" src/
grep -r "hasPro" convex/
cat src/app/dashboard/page.tsx
find . -name "*.ts" | xargs grep -l "enable-pro"
```

Do:
```
Agent({
  description: "Survey the Pro-gating surface",
  subagent_type: "Explore",
  prompt: "Across src/** and convex/**, list every place that gates behavior on hasPro or the enable-pro flag. Group findings by: UI hide, route redirect, Convex throw. Report file + line number for each, under 250 words."
})
```

## After the report comes back

Act on the synthesis in the main thread — don't re-open every file the subagent mentioned unless you actually need to edit it. The report is the payoff; re-reading everything defeats the purpose.

If the report reveals the question was underspecified or led somewhere unexpected, it's fine to spawn a follow-up Explore call rather than switching to manual search — the subagent already has momentum and context on the area.
