# Run Bleeps on the home server

Bleeps runs in [Orca](https://orca.dev). The factory config is [`orca.yaml`](../orca.yaml) at the repository root. The opinion is [0007](decisions/0007-bleeps-is-built-for-orca.md).

## What has to be on the machine

- The home server from [architecture](architecture.md). 8 GB of RAM is the floor. 16 GB is comfortable. James reaches it by SSH from a Mac. The hostname, the OS, and the clone path are not in this repo.
- Orca, from [orca.dev](https://orca.dev) or [stablyai/orca](https://github.com/stablyai/orca). It is MIT-licensed.
- An agent Orca can launch. Claude Code, Grok, or another. Log in once on the server. This repo does not store that login, and `orca.yaml` does not pick the agent.
- `gh auth login` on the server. The token stays there.
- Python 3, for `scripts/bleeps`. `scripts/check-orca` also needs PyYAML: `python3 -m pip install pyyaml`.
- Node, when a project's install command is `npm`.

## Open this repository

1. Clone the repo on the server and open it in Orca.
2. Read `scripts.setup` in `orca.yaml` and approve it. Orca stores a hash and asks again when the script changes. The CLI prints a warning and skips the hook unless you pass `--run-hooks`.
3. Create a worktree with setup enabled. From the CLI: `orca worktree create --run-hooks`.
4. Setup runs `scripts/orca-setup`, which runs `scripts/bleeps install`. In this repo that is `npm ci --prefix site`, from [`orca.project.yaml`](../orca.project.yaml).
5. The agent starts after setup finishes (`setupAgentStartupPolicy: wait-for-setup`).

Orca passes `ORCA_ROOT_PATH`, `ORCA_WORKTREE_PATH`, and `ORCA_WORKSPACE_NAME` into the setup script. `ORCA_WORKTREE_ID` is set when Orca has a workspace id.

## Scout

The scout is not a key in `orca.yaml`. From the primary Orca workspace, after you set `scout_provider` in `orca.project.yaml`:

```bash
python3 scripts/bleeps-scout schedule
python3 scripts/bleeps-scout schedule --install
```

That prints, then creates, an `orca automations create` run. Default is daily at 09:00 in the server's timezone. The precheck skips the run when `proactive` is `off`. A missing `proactive` key means on.

`python3 scripts/bleeps-scout --dry-run` prints findings and does not file them. A real run files `bleeps:found` issues and starts at most `scout_cap` pipelines (default 2) with `orca worktree create --issue`. Guardrail findings still wait for James.

## Blip

Test work is delegated to Blip: [agents/blip/ROLE.md](../agents/blip/ROLE.md). `bleeps test` fails when no test command is configured.

## Start a ticket

Launch a workspace from a GitHub issue. Orca substitutes `{{issue}}` and `{{artifact_url}}` into `issueCommand`. That prompt is the kick-off. It writes the spec folder, builds in the worktree, asks for a fresh `verify.md`, and opens a pull request against `develop`.

`scripts/ship-pr` is a stub. It does not merge. Leave GitHub auto-merge off until that script implements the gates in [ship-pr](ship-pr.md).

## Plug in another project

Orca reads one `orca.yaml` at the project root. It does not merge a second yaml. Symlink the shared file, and commit a small project file the setup script reads:

```bash
ln -s /path/to/bleeps-and-bloops/orca.yaml orca.yaml
cp /path/to/bleeps-and-bloops/examples/orca.project.yaml orca.project.yaml
```

Edit `install`, `test`, and `typecheck`. Commit `orca.project.yaml`. Do not commit secrets.

The setup script follows one symlink to find `scripts/`. A nested symlink is not followed.

`worktree.sharedDirectories` is inside the shared file, so every symlink shares `node_modules` and `site/node_modules` when those directories exist and are gitignored. A project that must not share them copies `orca.yaml` and edits that list.

A checkout-local prompt override is `.orca/issue-command`. Orca prefers it over `issueCommand`. Orca gitignores `.orca`.

Optional: `ln -s /path/to/bleeps-and-bloops/scripts/bleeps bleeps` so the CLI name matches [control CLI](control-cli.md). The hooks call the script by its path in the factory, so the symlink is for people and agents typing `bleeps`.

## What is still open

- The home server itself is not set up by this repo.
- `scripts/ship-pr` refuses to merge.
- `bleeps preview` refuses. `bleeps health` prints `no health URL` when `health_url` is unset, and refuses when one is set, until the deployed-SHA check exists.
- A project with no test command prints `skipped: no test command` and exits 0. Say if a missing command should fail instead.
- CodeRabbit, Devin, and Grok Bot are not started by `orca.yaml`.
- Branch protection and auto-merge are GitHub settings. See [roadmap](roadmap.md) Phase 3.
- The round limit's number is not chosen. The prompt stops to ask James before a third pass on the same finding.
- Orca cannot run a command only for worktrees created from a pull request. [stablyai/orca#6917](https://github.com/stablyai/orca/issues/6917).

## Prove the scripts

From this clone:

```bash
python3 -m pip install pyyaml
python3 scripts/check-orca
```
