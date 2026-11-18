# Open questions

- Watch the Orca conditional hooks issue: [stablyai/orca#6917](https://github.com/stablyai/orca/issues/6917). Orca cannot run a hook only when a worktree was created from a pull request.
- Whether there is a grooming or prioritization step before kick-off. See [flow](flow.md).
- The round limit's number is not chosen. The kick-off prompt asks James before a third pass on the same finding.
- Home server hostname, OS, and the path of the clone. See [home server](home-server.md).
- Which agent Orca should launch. `orca.yaml` does not pick one.
- Which repositories to onboard first.
- Secrets stay on the server (`gh` auth, the agent login). They are not in `orca.yaml`.
- Which value to put in `scout_provider`, and which timezone the daily 09:00 scout should use. The automation uses the server clock until a timezone is set.
- The site has no Playwright suite yet. Blip's onboard skill is the path that adds it.
- Whether to turn on GitHub's auto-merge setting. Bloops' script checks the gates and does not flip that setting. See [0010](decisions/0010-bleeps-runs-the-crew-bloops-reflects.md).
- Per-source credentials and names James still has to provide before a live check can pass. The file stores env var names only. See [tickets](tickets.md).
  - GitHub: confirm `gh auth login` or the token env, and `github_repo` when `origin` is not the repo.
  - GitHub Project: owner (user or org), project number, and the Status option names if they are not Todo, In Progress, and Done.
  - Jira: site URL, the email and API token env vars, the project key, and transition names that are not in the alias list.
  - Linear: API key env, team key.
  - Discord: bot token env, channel id, guild id, and whether a ticket is a channel message. Forum posts and threads are not fetched.
- Whether Chip should post a finding to every configured source, or only one primary. Today it posts to each source other than plain GitHub issues. Friction issues are not copied.
- Whether a status name that is not in the alias list should fail the fetch instead of becoming `open`.

## Resolved

- **Merge policy.** Resolved in [0003: Gitflow auto-merge to develop](decisions/0003-gitflow-auto-merge-to-develop.md). Feature PRs from agents target `develop` and may auto-merge once verified safe. Only James merges `develop` into `main`. Agents never touch `main`. Label rules can still restrict which tickets auto-merge.
- **Runtime.** Resolved in [0007: Bleeps is built for Orca](decisions/0007-bleeps-is-built-for-orca.md). The factory config is `orca.yaml`. The 2026-11-11 Claude plugins stay reference, including the `engineering` plugin and any newer `spec-driven-workflow` on a machine. Their ideas map onto Orca keys in that decision.
- **Core `orca.yaml`.** It is at the repository root. Setup installs dependencies. Orca has no verification key. `scripts/orca-verify` runs the checks, and a required GitHub check is what can block a pull request.
- **A missing test command.** [0009](decisions/0009-testing-is-a-gate-blip-owns-tests.md): it fails. It is not a skip.
- **Proactive work.** [0008](decisions/0008-bleeps-is-proactive.md): Chip files issues and starts the pipeline. The friction sweep is Chip.
- **Names.** [0010](decisions/0010-bleeps-runs-the-crew-bloops-reflects.md): Bleeps runs the crew. Bloops merges and reflects. Outputs do not need a name.
- **Ticket sources.** [0012](decisions/0012-one-ticket-many-sources.md): GitHub, GitHub Projects, Jira, Discord, and Linear share `scripts/intake`. GitHub access stays required. Live calls against those APIs are not verified in this repo.
