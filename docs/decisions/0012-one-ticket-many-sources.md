# 0012: One ticket, many sources

- **Status:** accepted
- **Date:** 2026-11-18

## Context

[0002](0002-rebuild-factory-clean.md) kept GitHub Issues as the first ticket source and left Linear and Discord for an ingestion step that produces the same `ticket.md`. James now wants four places a project can take work from: GitHub Projects and plain GitHub issues, Jira, Discord, and Linear. Each project chooses its own sources. Code, pull requests, and CI stay on GitHub, and Orca's `issueCommand` only starts from a GitHub issue.

## Decision

One normalized ticket, and one intake path: `scripts/intake`. A per-source adapter (`scripts/ticket-github`, `scripts/ticket-github-project`, `scripts/ticket-jira`, `scripts/ticket-discord`, `scripts/ticket-linear`) fetches a ticket and, where the source allows it, posts status and the pull request link. `orca.project.yaml` names the sources and the env vars that hold credentials. The file never holds a secret.

GitHub access is required on every project, including projects whose tickets come from somewhere else. `scripts/check-ticket-sources` fails when that access is missing.

A Jira, Discord, or Linear ticket is mirrored to a GitHub issue labelled `bleeps:intake` so Orca can launch the workspace. The mirror body carries `Source` and `Source-Id`. Chip still files `bleeps:found` on GitHub, because that issue is the launch handle, and also creates the finding on each other configured source. Open friction issues are not copied.

## Consequences

- Kick-off does not grow a second front door. Orca still starts from a GitHub issue.
- Discord has no status field. Status there is a reply. GitHub Project status is the Status field, and only for an issue that is on the project. Jira and Linear status names that are not in the alias list need a live workflow before they can be trusted.
- **Revisit if:** Orca can start a workspace from something other than a GitHub issue, or a project needs a ticket source this set does not cover.
