# Software Factory: Context Pack

Owner: James (lead UI engineer; Bleeps and Bloops / "bb"). This pack holds the
plugins and skills that make up his agentic software-factory workflow, plus a
map of how they fit together. Read this file first, then the files it points to.

Snapshot taken 2026-11-11 from James's synced plugin store. The files here are
verbatim copies, not rewrites.

## The idea

A GitHub issue goes in; a reviewed, verified pull request comes out. A human
reads the spec, reviews the PR, and merges. **Nothing in this pipeline ever
merges a PR.** A human also gets a say before any change that touches auth,
billing, payments, data deletion, or migrations.

## Layout

```
plugins/
  bb/                        Slash-command entry points (thin wrappers)
    commands/sdd-init.md       /bb:sdd-init   - one-time repo bootstrap
    commands/kick-off.md       /bb:kick-off N - issue #N -> open PR
  spec-driven-workflow/      The pipeline itself (one skill per stage)
    skills/spec-driven-setup | specify | plan | tasks | implement | verify | ship
    agents/spec-reviewer.md    read-only independent reviewer
skills/                      Standalone working-habit skills (any task)
  explore-first/             delegate multi-step code searches to an Explore subagent
  delegate-cheap-work/       route mechanical work to Haiku/Sonnet subagents
  verify-before-ship/        check UI changes in a real browser before calling them done
  decompose-hotspot/         propose a file split before editing a file that keeps growing
```

## How the pieces connect

1. `/bb:sdd-init` runs `spec-driven-setup` once per repo. It creates `specs/`
   and writes a `## Spec-driven workflow` section into the repo's `CLAUDE.md`
   (target branch, branch naming, test/lint/typecheck commands, max
   self-correction attempts, guardrails). Every other stage reads that section.
2. `/bb:kick-off <issue>` orchestrates the stages in order:
   `specify` -> `plan` (only if the approach is risky) -> `tasks` ->
   build/review/fix loop -> `ship`.
3. Each ticket gets a folder `specs/<issue>-<slug>/` holding `ticket.md`,
   `spec.md` (frontmatter `status: draft|approved`), optional `design.md`,
   `tasks.md`, and `verify.md`. The verdict line in `verify.md` ("Ready to
   ship" or "Needs work") gates `ship`.
4. Verification is deliberately independent: `spec-driven-verify` hands the
   review to `spec-reviewer`, which has no Write/Edit tools and never shares
   the implementer's context.
5. The four standalone skills are general habits the agents should follow
   while doing any of the above:
   - **explore-first**: 3+ greps to build a mental map means spawn an Explore
     subagent and ask for a synthesis under about 250 words.
   - **delegate-cheap-work**: if success fits in one sentence, send it to a
     `haiku` or `sonnet` subagent with explicit constraints, then skim the diff.
   - **verify-before-ship**: for UI changes, screenshot at about 390px and
     1280px and read the console. Report success only if both look right and
     the console is clean. If no browser tool exists, say the change is unverified.
   - **decompose-hotspot**: before editing a file that keeps attracting
     changes, propose a 3-5 file split and wait for approval. Keep the split
     in its own commit.

## Requirements

- `gh` CLI installed and authenticated (`gh auth login`); the repo has a
  GitHub remote.
- GitHub Issues is the only ticket source in v0.1.0. Linear and Discord
  ingestion are noted as future work (add an ingestion step that still
  produces `specs/<id>/ticket.md` in the same shape).
- The pipeline's review stage references the `engineering:code-review` skill;
  `plan` and `ship` suggest `engineering:architecture`,
  `engineering:system-design`, and `engineering:deploy-checklist`. Those live
  in a separate `engineering` plugin that is not in this pack.

## Known gaps: read before building on this

`bb:kick-off` and `bb/README.md` describe a newer pipeline than the
`spec-driven-workflow` copy in this pack (v0.1.0):

| Referenced by `bb` | Present in this pack? |
|---|---|
| `spec-driven-workflow:spec-driven-loop` skill | **No.** Only `spec-driven-implement` exists. |
| `spec-implementer` agent | **No** |
| `test-reviewer`, `ux-reviewer`, `backend-reviewer` agents | **No.** Only `spec-reviewer` exists. |
| "called from `/bb:kick-off`" mode: spec auto-approved, skill returns instead of stopping | **No.** `specify` always stops at `status: draft`, and `tasks` asks before starting implement. |
| Round limit (default 3) on the build/review/fix loop | **No.** `implement` uses a per-task attempt limit (default 5) instead. |

As synced, `/bb:kick-off` would stop at stage 7. Either the newer
`spec-driven-workflow` (with the loop skill and the four agents) exists
elsewhere, for example on James's machine or in a repo, and should replace the
copy here, or those pieces still need to be written. Confirm with James before
assuming either.

Other small inconsistencies: the plugin author is "James" in `bb` and
"James Hall" in `spec-driven-workflow`; `bb` is v0.2.0 and the workflow is
v0.1.0.

## Related context (not in this pack)

- The workflow's README points to companion notes in James's Life OS Obsidian
  vault: `3-Resources/Agentic Spec-Driven Workflow/`.
- James's repos use a `CLAUDE.md` with concise, imperative coding rules (native
  browser APIs over libraries, WCAG 2.1 AA accessibility as non-negotiable,
  Tailwind over inline styles). Respect the target repo's `CLAUDE.md` over
  anything here.
