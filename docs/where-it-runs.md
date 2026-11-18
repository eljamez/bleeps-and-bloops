# Where it runs

Bleeps runs in [Orca](https://orca.dev). The factory config is [`orca.yaml`](../orca.yaml) at the repository root. The harness opinion is [0007](decisions/0007-bleeps-is-built-for-orca.md). Where that process lives is [0014](decisions/0014-where-it-runs.md).

`host` in `orca.project.yaml` records the choice. Omitted means `local`. The same file, the same scripts, and the same Chip automation run for every value. `host` is not an Orca host id. `scripts/bleeps-scout schedule` does not pass `--host`.

## The choice

| `host` | What it is | While you are away |
| --- | --- | --- |
| `local` | The laptop or desktop you already use. This is the default. | The factory runs only while the computer is on and Orca is running. |
| `cloud` | A VPS you control, with Orca installed. | Leave it on. Chip's schedule fires there. |
| `home` | A machine at home. Optional. | Same as `cloud`. |

Orca does not sell a hosted runner. GitHub Actions can run `scripts/check-orca` and the project's tests. That is CI, a gate on the pull request. Actions cannot launch an Orca worktree, send `issueCommand`, or own Chip's automation.

A per-workspace environment recipe (`environmentRecipes` in `orca.yaml`) boots a disposable sandbox for one worktree. Orca starts that recipe from a process that is already running. A recipe does not schedule Chip and does not replace `host`. This factory sets no recipe. Providers and billing stay yours. See [Ways to run Orca](https://orca.dev/docs/ways-to-run).

8 GB of RAM is the floor on whichever machine runs the agents. 16 GB is comfortable. This repo does not record the hostname, the OS, or the clone path.

## local

Install Orca on the computer you use. Log in an agent once. Run `gh auth login` once. The token stays on that computer.

Register Chip on that same computer, after `scout_provider` is set:

```bash
python3 scripts/bleeps-scout schedule
python3 scripts/bleeps-scout schedule --install
```

The schedule uses that computer's clock unless you set a timezone on the automation.

Orca stores the schedule in its own process. Create currently defaults to one catch-up (`run_once_within_grace`) and a grace of 720 minutes (12 hours). The command above does not pass `--missed-run-grace-minutes`, so Orca's own default applies. After `--install`, `orca automations show` is where that number lives. Change it with `orca automations edit <id> --missed-run-grace-minutes`.

If the computer is asleep, off, or Orca is quit at the scheduled time:

- Wake it inside the grace window and leave it awake. Orca starts one catch-up. It does not replay every missed day. A wake that goes straight back to sleep does not start the run.
- Stay away longer than the window and that occurrence is skipped (`skipped_missed`). The next run is the next scheduled time. A laptop closed from Friday night to Monday morning misses the weekend run when the grace is 12 hours.
- When you are back, run `python3 scripts/bleeps-scout` yourself, or run the automation from Orca (`orca automations run`). That is a new run. It is not the skipped one being replayed.

Tickets are issues on GitHub, plus a copy on any other source the project configured. They are not a queue on the laptop. While the computer is off they stay open. Nothing starts a worktree. The next scout scans the repo as it is then. It files findings that are not already open, and it starts at most `scout_cap` pipelines (open `bleeps:started` issues count against the cap). It does not start tickets you filed yourself. You launch a workspace from the issue when you are back.

## cloud and home

Install Orca on that machine. `orca serve` is the headless form. The desktop app is the other. Log in an agent once. `gh auth login` once. The token stays there.

Reach the machine on a private network. [Tailscale](https://tailscale.com) is the straightforward way: install it on the machine and on the computer you sit at, and pair Orca over the tailnet address (`orca serve --pairing-address <tailscale-hostname>`). Do not open the Orca port on the public internet.

Register Chip on that machine, not on a laptop that sleeps. The automation lives where you run `scripts/bleeps-scout schedule --install`. A laptop that only shows the UI can sleep. The server keeps the sessions. See [Remote Orca Servers](https://orca.dev/docs/remote-servers).

An SSH worktree is a different knob. The laptop's Orca can run agents on a box you already SSH to. The schedule still lives on the Orca process that created the automation. For Chip to run while the laptop sleeps, create the automation on the machine that stays on.

## What has to be on the machine

- Orca, from [orca.dev](https://orca.dev) or [stablyai/orca](https://github.com/stablyai/orca). It is MIT-licensed.
- An agent Orca can launch. Claude Code, Grok, or another. Log in once. This repo does not store that login, and `orca.yaml` does not pick the agent.
- `gh auth login`. The token stays on the machine.
- Python 3, for `scripts/bleeps`. `scripts/check-orca` also needs PyYAML: `python3 -m pip install pyyaml`.
- Node, when a project's install command is `npm`.

## Open the repository

On the machine `host` names:

1. Clone the repo and open it in Orca.
2. Read `scripts.setup` in `orca.yaml` and approve it. Orca stores a hash and asks again when the script changes. The CLI prints a warning and skips the hook unless you pass `--run-hooks`.
3. Create a worktree with setup enabled. From the CLI: `orca worktree create --run-hooks`.
4. Setup runs `scripts/orca-setup`, which runs `scripts/bleeps install`. In this repo that is `npm ci --prefix site`, from [`orca.project.yaml`](../orca.project.yaml).
5. The agent starts after setup finishes (`setupAgentStartupPolicy: wait-for-setup`).

Orca passes `ORCA_ROOT_PATH`, `ORCA_WORKTREE_PATH`, and `ORCA_WORKSPACE_NAME` into the setup script. `ORCA_WORKTREE_ID` is set when Orca has a workspace id.

## Scout

The scout is not a key in `orca.yaml`. From the Orca workspace on the machine `host` names, after you set `scout_provider`:

```bash
python3 scripts/bleeps-scout schedule
python3 scripts/bleeps-scout schedule --install
```

That prints the `host` value, then prints, then creates, an `orca automations create` run. Default schedule is daily at 09:00 in that machine's timezone. The precheck skips the run when `proactive` is `off`. A missing `proactive` key means on. A `host` other than `local`, `cloud`, or `home` fails the schedule command. `actions` fails with it: GitHub Actions is not a machine Orca can schedule on.

`python3 scripts/bleeps-scout --dry-run` prints findings and does not file them. When `ticket_sources` lists another source, the dry run also prints `would post finding to <source>`. A real run files `bleeps:found` issues, posts each new finding to those sources, and starts at most `scout_cap` pipelines (default 2) with `orca worktree create --issue`. A source that fails is skipped. The GitHub issue stays. Open friction issues are not copied. Guardrail findings still wait for the owner.

## Blip

Test work is delegated to Blip: [agents/blip/ROLE.md](../agents/blip/ROLE.md). `bleeps test` fails when no test command is configured. A red suite runs `scripts/fix-loop` in the same run. `fix_rounds` defaults to 2. The next red escalates to the owner with a summary. Gitignore `.bleeps/` so that state is not committed. See [0012](decisions/0012-red-suite-loops.md).

## Start a ticket

Connect the ticket sources in `orca.project.yaml`, then prove the machine can see them:

```bash
python3 scripts/check-ticket-sources
```

That fails when GitHub access is missing, even if the tickets live in Jira, Discord, Linear, or a GitHub Project. `--config-only` checks the file and does not call the network.

Fetch a ticket and mirror it when the source is not GitHub:

```bash
python3 scripts/intake fetch jira PROJ-12 --slug latch
```

Launch a workspace from the GitHub issue that command prints (or from a plain GitHub issue). Orca substitutes `{{issue}}` and `{{artifact_url}}` into `issueCommand`. That prompt is the kick-off. It writes the spec folder, builds in the worktree, asks for a fresh `verify.md`, opens a pull request against `develop`, and links that pull request back with `scripts/intake link-pr`. The source list, the env var names, and what still needs a live credential are in [tickets](tickets.md).

Bloops checks gates with `scripts/merge-pr`. Leave GitHub's auto-merge setting off. That setting is still an open question. See [ship-pr](ship-pr.md).

## Plug in another project

Orca reads one `orca.yaml` at the project root. It does not merge a second yaml. Symlink the shared file, and commit a small project file the setup script reads:

```bash
ln -s /path/to/bleeps-and-bloops/orca.yaml orca.yaml
cp /path/to/bleeps-and-bloops/examples/orca.project.yaml orca.project.yaml
```

Edit `install`, `test`, `typecheck`, and `host`. Commit `orca.project.yaml`. Do not commit secrets.

The setup script follows one symlink to find `scripts/`. A nested symlink is not followed.

`worktree.sharedDirectories` is inside the shared file, so every symlink shares `node_modules` and `site/node_modules` when those directories exist and are gitignored. A project that must not share them copies `orca.yaml` and edits that list.

A checkout-local prompt override is `.orca/issue-command`. Orca prefers it over `issueCommand`. Orca gitignores `.orca`.

Optional: `ln -s /path/to/bleeps-and-bloops/scripts/bleeps bleeps` so the CLI name matches [control CLI](control-cli.md). The hooks call the script by its path in the factory, so the symlink is for people and agents typing `bleeps`.

## What is still open

- This repo does not install Orca, and it does not record a hostname, an OS, or a clone path.
- `scripts/bleeps-scout schedule` does not set a grace. Orca's 12 hour default is what a `local` machine gets. A longer window for a laptop that sleeps all weekend is not chosen.
- `scripts/merge-pr` reports the gates and does not turn on GitHub auto-merge.
- `bleeps preview` refuses. `bleeps health` prints `no health URL` when `health_url` is unset, and refuses when one is set, until the deployed-SHA check exists.
- CodeRabbit, Devin, and Grok Bot are not started by `orca.yaml`.
- Branch protection and auto-merge are GitHub settings. See [roadmap](roadmap.md) Phase 3.
- Orca cannot run a command only for worktrees created from a pull request. [stablyai/orca#6917](https://github.com/stablyai/orca/issues/6917).

## Prove the scripts

From this clone:

```bash
python3 -m pip install pyyaml
python3 scripts/check-orca
```
