---
name: delegate-cheap-work
description: Use this skill before doing mechanical, low-judgment work yourself — adding JSDoc/docstrings, fixing lint errors, scaffolding boilerplate tests, renaming variables, reformatting JSON, writing straightforward CRUD, or any task where you can describe "success" in one sentence. Route it to a Sonnet or Haiku subagent instead of doing it inline on the current (likely Opus) model. Trigger this proactively whenever a task is purely mechanical, even if the user didn't ask for delegation explicitly.
---

# Delegate Cheap Work

Not every task needs the model currently running the main conversation. If a task is mechanical enough that you could describe the entire success criterion in one sentence, it doesn't need deep reasoning — it needs correct execution. Running that on a heavier/more expensive model wastes budget that's better spent on design decisions, debugging, and code review, and it also burns main-thread context on work whose *process* nobody needs to see, only its *result*.

## How to tell if something qualifies

Ask: "if I described this task to a junior engineer in one sentence, would they get it right without follow-up questions?" If yes, it's a delegation candidate. Examples:
- Add JSDoc/docstrings to exported functions in a directory
- Fix all lint/type errors in a file or directory, without changing behavior
- Scaffold unit test boilerplate for existing functions
- Rewrite a doc/README section for clarity
- Convert data from one format to another (JSON → CSV, etc.)
- Apply a mechanical rename across files

Not a fit: anything requiring architectural judgment, ambiguous requirements, debugging a subtle bug, or work where "correct" depends on taste rather than a checkable rule.

## How to delegate

Spawn a subagent with an explicit `model` override:

```
Agent({
  description: "<short task description>",
  subagent_type: "general-purpose",
  model: "haiku",
  prompt: "<self-contained task with explicit success criteria and constraints>"
})
```

Use `model: "haiku"` for the most mechanical, deterministic tasks (formatting, boilerplate, simple find/replace). Use `model: "sonnet"` for things that need a bit more judgment but still don't require your full reasoning depth (test scaffolding that has to actually make sense, doc rewrites that need to read well, small self-contained features).

Always state constraints explicitly — "don't change behavior," "don't touch files outside src/lib," "match the existing code style" — since the subagent has no memory of the conventions you've built up in this conversation.

**Example**

```
Agent({
  description: "Add missing JSDoc",
  subagent_type: "general-purpose",
  model: "haiku",
  prompt: "Add JSDoc comments to every exported function in src/lib/*.ts that doesn't already have one. Document params, return type, and a one-line summary. Do not change any function logic or signatures."
})
```

## What to do with the result

Skim the diff before accepting it — delegation isn't a trust-fall. For anything touching shared code paths, do a quick review pass yourself once the subagent reports back, same as you would review a junior engineer's PR.
