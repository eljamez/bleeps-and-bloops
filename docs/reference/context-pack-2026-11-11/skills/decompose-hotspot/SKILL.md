---
name: decompose-hotspot
description: Use this skill when you're about to edit a file that keeps coming back for more changes — a component or module that's been read and edited far more than anything else in the project, where every small change requires re-reading a huge file. Trigger on phrases like "let's tweak the timeline again", "back in this file again", or when you notice (via git log, edit history, or your own recent tool calls) that a single file has an unusually high edit count relative to its neighbors. Propose a decomposition plan before making the requested change, not after.
---

# Decompose Hotspot

Some files become magnets for changes — a big list/table component, a page that owns too much state, a utility module that accreted responsibilities over time. Every visit to one of these costs more than it should: the whole file has to be re-read to hold its context, small changes risk touching unrelated logic, and diffs get harder to review. If a file is already a hotspot, the *next* edit is a good moment to stop and ask whether to split it up before making it bigger.

## When to use this

Signs a file qualifies as a hotspot:
- It has noticeably more edits/reads in recent history than other files in the same area
- You find yourself re-reading the entire file just to make a small, localized change
- It mixes multiple concerns (e.g. a component that owns rendering, data fetching, and formatting logic all at once)
- The user asks for "just one more change" to the same file for the third or fourth time in a session

This doesn't apply to files that are large but cohesive (e.g. a single well-organized state machine) — decomposition should reduce complexity, not just move it around. Use judgment: the goal is smaller files that each fit on one screen and have one clear responsibility, not decomposition for its own sake.

## How to do it

Before making the requested change, propose a plan — don't touch code yet:

1. Read the file end-to-end.
2. Identify natural seams: separate components (e.g. a row vs. a header vs. a tooltip), separate concerns (data-fetching hook vs. presentation), or separate utilities that don't need to live inline.
3. Propose 3-5 new files, each scoped to one responsibility and each small enough to read and edit confidently on its own.
4. Show: the new file tree, what state/props move where, and a one-paragraph rationale for the split.
5. Wait for confirmation before applying it — decomposition changes are invasive and worth a sanity check, especially if the user only asked for a small tweak.

**Example prompt to use for the plan:**

```
Read src/components/ExpenseTimeline.tsx end-to-end.
Propose splitting into 3-5 files (e.g. row, date header, totals header, tooltip).
Show: new file tree, what state moves where, what props each new component takes.
No code changes yet — just the plan.
```

## After the plan is approved

Apply the split as its own change, separate from the feature/fix that was originally requested if possible — a clean "extract components, no behavior change" commit is easier to review than a decomposition bundled with new functionality. Once split, the originally-requested change should be a small, focused diff to just the relevant new file.
