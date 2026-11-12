---
name: verify-before-ship
description: Use this skill before declaring a frontend change done, before merging/shipping a UI-facing PR, or whenever you're about to say something like "this should work" or "that should fix it" about a visual or interactive change. Drives an actual browser check — via Playwright or Claude Preview MCP if available — instead of relying on reading the code and assuming it renders correctly. Trigger this any time the user asks to "verify", "check", or "make sure it works" for anything UI-related, and proactively before marking a frontend task complete even if not asked.
---

# Verify Before Ship

Reading code and running a type-checker tells you the code is *plausible*, not that it *works*. For anything UI-facing — layout, responsive behavior, an interaction, an error state — the only real verification is looking at the rendered page and checking the console for errors. If Playwright or a preview/browser MCP is available, use it before calling a frontend change done; don't let "the diff looks right" stand in for "I looked at it."

## When to use this

- Before marking any frontend task complete, whenever a browser tool (Playwright, Claude Preview, Chrome MCP) is available
- Before merging/shipping a PR that touches UI, layout, or client-side behavior
- Any time the user asks you to "verify," "check," or "make sure it works" for something visual
- After fixing a bug that manifested visually (layout break, console error, broken interaction) — the fix isn't confirmed until you've seen it *not* happen anymore

## How to do it

1. Start the dev server / preview for the relevant route if it isn't already running.
2. Navigate to the affected page or component.
3. Take screenshots at more than one viewport width — at minimum a mobile width (~390px) and a desktop width (~1280px). UI bugs love to hide at the width nobody checked.
4. Read the browser console log for errors or warnings introduced by the change.
5. Only report success if: the screenshots show the expected UI at both widths, and the console is clean (or only shows pre-existing/expected messages).

**Example prompt to use:**

```
Start the dev server and open /dashboard in Claude Preview (or Playwright).
Screenshot the affected component at 390px and 1280px widths.
Read the console logs for errors.
Only report SUCCESS if both screenshots show the expected UI and the console is clean.
```

## What to do when it fails

If the screenshot doesn't match expectations or the console has new errors, treat that as the real result — go fix the actual problem rather than re-describing what the code was supposed to do. Don't report success and let the user discover the real state later; a caught issue here is far cheaper than one caught after merge.

If no browser tool is available in the current environment, say so explicitly rather than silently skipping verification — the user should know the change is unverified, not assume it was checked.
