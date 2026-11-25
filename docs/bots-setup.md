# Set up the crew as Orca bots

Optional. This is part of [Using Bleeps](using-bleeps.md), after the repository has `develop`, the `orca.yaml` symlink, and `orca.project.yaml`. The default runtime stays `issue-command`. Set `runtime: bots` only when this group exists.

[Run the crew as Orca bots](bots.md) is the command reference. `python3 scripts/bots print` prints those commands and does not run them. The paste in step 2 is [bots/bootstrap-prompt.md](../bots/bootstrap-prompt.md). This page includes that file. `python3 scripts/bots check` fails when the two copies differ. `python3 scripts/bots prompt` prints the file.

On this repo the scripts still say James where they escalate to the owner. On your project, you are the owner.

The GitHub settings for the lane are [chore lane setup](chore-lane-setup.md). This page does not repeat them.

## Before the three steps

Orca on the latest version, on the computer `host` names. Claude Code is signed in there. The bot's work counts against that plan. Sign in to Orca before a GitHub or Linear connector. Read [Bot security](https://orca.dev/docs/bots/security) before anyone else can ask a bot.

If the sidebar has no Bots section, turn on Settings → Bots → Enable bots. Bots are on by default.

A bot runs only while that computer is awake and Orca is running. Requests wait up to a day. To keep the group reachable, pair a server you leave on and create the bots on that machine. A paired window cannot create a bot on the server yet. See [where it runs](where-it-runs.md).

## Step 1. Create Bleeps by hand

Bleeps is the only bot you create in the app. It is the one that can see the repositories, the ticket connectors, and, once the others exist, the group. The other bots are proposed from its chat in step 2. Nothing exists until you press Create.

In the sidebar's Bots section, select + (New bot or group), then New bot → Start from scratch. The dialog title is New bot.

| What you see | What to enter |
| --- | --- |
| Name | `Bleeps` |
| Picture | The picture control sits beside Name. The [quickstart](https://orca.dev/docs/bots) says to give it a name and a picture. |
| Who it is and what it does | `Coordinates the crew in one group and does not do their jobs.` The field's accessible name is Identity. This sentence is the `--purpose` line `python3 scripts/bots print` shows for bleeps, and it becomes the first line of `SOUL.md`. |
| Computer | The computer `host` names. The label is Computer. Select Change to pick another. A bot stays on the computer you pick. |
| Agent | Claude Code. That is the menu name for the provider `claude` in `orca.yaml`. Select Change on the same row if another agent is showing. |
| Model | `orca.yaml` `providers` has no Bleeps row. Bleeps coordinates. It does not take a worker model. The Agent row shows the selected model beside Claude Code. Leave that model. Worker models are set later, from `python3 scripts/providers show <role>`, on `orca orchestration worker-start`. |
| Handle | The New bot dialog has no Handle field. The name is what you mention with `@Bleeps`. After a connector is on, that bot's How to ask line shows the short name. Linear's label is `bot:` plus that short name. |
| Folder | The Folder line is the bot's folder on that computer, where `SOUL.md` lives. It is not the git repository. |

Select Create.

Then, on Bleeps, set the things the dialog does not ask for. Open the bot's settings. The same pages are under Settings → Bots.

- Permissions. Switch off Full access. Choose Ask for approval. Orca's default chat permission is Full access, so a new bot starts there. There is no CLI flag for the mode. Accept edits is for a worker session that writes the repository, not for Bleeps' own chat. Whoever asks the bot can approve. Leave Who can ask as only you.
- Agent and model. Confirm the agent is Claude Code. Do not pin a model in memory.
- Skills → Link a project. Link the checkout that contains `.agents/skills` and `bots/`. If the project the crew will edit is a different repository, link that one too. Search projects filters the list. `orca repo list` shows the projects Orca already knows. There is no CLI flag for the link. Orca reads `.agents/skills`, and if that folder has any skill it does not also read `.claude/skills`.
- Soul. Replace the bot's `SOUL.md` with `bots/bleeps/SOUL.md` from this repo. The purpose you typed is only the first line.
- Connectors. Sign in to Orca first. Open Connectors, Add a connector, GitHub, then Connect GitHub. Select Install the Orca app on the repositories this bot may work in, then Turn on for your bot. From the bot's own chat, `orca bot connectors --offer github` shows a Connect card instead. Nothing connects until you finish it. If `ticket_sources` includes `linear`, connect Linear the same way (`orca bot connectors --offer linear`). Jira, Discord, and a GitHub Project stay on `scripts/intake`. They are not bot connectors. Slack and Google stay off unless you want them.
- Look around. Leave it on. The default is every 4 hours from 8 AM to 8 PM on weekdays. Memory upkeep can stay at its default.
- Triggers. None on the create dialog. The `bleeps:go` automation is in the prompt, and it is saved disabled until `orca automations trigger-options --bot bleeps` lists `github.labeled`.

The group comes in step 2, after the other bots exist. A group needs its members first.

## Step 2. Paste one prompt into Bleeps

Open Bleeps in the sidebar so you are in its Home chat, not a group room. A room does not show the Create bot card. Paste this whole prompt. It is the file `bots/bootstrap-prompt.md`.

<!-- bootstrap-prompt:start -->
```text
You are setting up the rest of the Bleeps and Bloops crew as Orca bots in this checkout. I already created the Bleeps bot by hand. Do not create a second Bleeps. Do not build a feature. Do not merge. Do not edit product code. Do not edit a skill in place.

Read orca.yaml and orca.project.yaml. The commands to run are whatever this prints, and nothing else:

python3 scripts/bots print

That output is the source of truth. If a flag is not in that output, do not invent it. Where a printed command names a person, that person is the owner of this checkout. Do not edit the scripts to rename them.

Echo is a fresh Claude Code worker for each verify, not a bot and not a member of the group. Do not create an Echo bot. Do not add Echo to the group. When a verify is needed later, start Echo with the echo line from that print output (orca orchestration worker-start), a new worktree, read-only on product code. verify.md names the writer and the verifier.

Zap joins only when orca.project.yaml sets zap: on. If zap is off or missing, skip every Zap line in the print output.

Create these bots, one at a time, from this chat (Bleeps' Home), not from a group room. A room does not show the card. For each name in the print output except bleeps, and except zap when zap is off:

1. Run that bot's orca bot create --offer line from the print output. The card creates nothing until I press Create bot. Stop and wait for me to press it. Then go on.
2. Open that bot's settings, Soul, and replace SOUL.md with bots/<name>/SOUL.md from this checkout. --purpose is only the first line. The file is also SOUL.md in the bot's folder (the Folder line on the bot).
3. Permissions: Ask for approval. Do not leave Full access. There is no CLI flag for the mode. Accept edits is for a worker session that writes the repository, not for this bot's own chat. Approve for me is not the setting.
4. Agent: Claude Code. The provider in orca.yaml is claude. The model for a worker is whatever python3 scripts/providers show <role> prints. Pass that model on the worker-start line from the print output. Do not store a model in the bot's memory.
5. Skills: Link a project. Link this checkout, so chats load .agents/skills. If the project the crew will edit is a different repository, link that one too. orca repo list shows the projects Orca knows. There is no CLI flag for the link.
6. From that bot's own chat, run orca bot connectors --offer github and wait while I finish the Connect card. If ticket_sources includes linear, also run orca bot connectors --offer linear. Do not connect Slack, Google, or a webhook unless I ask. Jira, Discord, and a GitHub Project are ticket sources the scripts read. They are not values of orca bot connectors --offer.

After the bots exist, run the look-around lines from the print output, each from that bot's chat. Leave Look around on for Bleeps and Chip. Turn it off for the others.

Create the automations in the print output. Replace <owner/repo> with this project's GitHub repository. Before each bot's automations, run orca automations trigger-options --bot <name>. Save every automation with --disabled. Do not enable them. If trigger-options does not list an event the print output uses, leave that automation disabled and put it on the checklist. Do not invent an event name. Skip Zap's automation unless zap is on. Do not send the handoff lines during setup. Keep them for later runs.

The group has no create command. Tell me to do this in the app, then wait until I say the group exists:

In the sidebar's Bots section, select + (New bot or group), then New group. Name: Bleeps. Members, in this order: bleeps, beep, buzz, blip, chip, ping, boop, bloops. Add zap only when zap is on. Do not add Echo. Names have to be distinct. At least one member lives on the computer that hosts the group. If a bot is on another computer, the dialog allows it only from a paired computer. Post from the hosting computer's window.

When I say the group exists, run python3 scripts/bots check and paste the result.

Then report this checklist, one line each, done or still waiting:

- Each bot: offered, created, or skipped (Zap, Echo)
- SOUL.md replaced from bots/<name>/SOUL.md
- Permissions set to Ask for approval
- Agent is Claude Code, and the worker model is the providers show line
- Project linked under Skills
- GitHub connected, and Linear only if ticket_sources includes linear
- Look around matches the print output
- Automations saved disabled
- Group exists with the members above
- python3 scripts/bots check
- runtime in orca.project.yaml is still issue-command until I set bots. Tell me to set runtime: bots. Do not edit the file unless I ask.

Still mine, not yours:

- The chore lane GitHub App, secrets, and repository settings in docs/chore-lane-setup.md. The workflow merges a pass. You do not.
- Renovate, from that same page. review_external stays none unless orca.project.yaml says coderabbit or copilot. none installs nothing.
- Enabling the automations after trigger-options lists the events.
- Pausing: turn Active off on a bot, pause an automation in its panel, or turn off Settings, Bots, Enable bots. Delete bot removes one bot. Setting the repository variable BLEEPS_AUTOMERGE to anything but on stops the lane. The label bleeps:hold stops one pull request.

Rules you keep while you do this and after:

- No feature without an explicit ticket. Chip and Boop file bleeps:found and stop. scripts/classify-pr is the check. scripts/chore-lane refuses a feature.
- A merge happens only when I ask, through scripts/merge-pr, or when the chore lane workflow merges a pass from scripts/chore-lane. Never main. Nothing merges while the suite is red.
- Echo verifies independently. Echo does not share the writer's chat.
- Do not start a second crew from issueCommand while this group is the runtime.
- Pull requests target develop.
```
<!-- bootstrap-prompt:end -->

Press Create bot on each card. The offer creates nothing until you do. `orca bot create` without `--offer` refuses: a bot cannot create a bot.

When the prompt asks for the group: Bots, + (New bot or group), New group. Name: Bleeps. The placeholder is Name your group. Members: bleeps, beep, buzz, blip, chip, ping, boop, bloops. Zap only if `zap: on`. Echo is not a member. Select Create. At least one member has to live on the computer that hosts the group. If a member is on another computer, the dialog says groups can add bots only from paired computers. Otherwise it says bots in a group must be on the same computer. Post from the hosting computer's window.

After you tell Bleeps the group exists, it runs `python3 scripts/bots check` and reports the checklist. Set `runtime: bots` in `orca.project.yaml` when that check is ok. Until then the default `issue-command` still starts a crew from a GitHub issue.

## Step 3. Check, then the settings only you can turn on

`python3 scripts/bots check` has to print `ok`. A miss is a soul, a skill link, or a command on [the bots page](bots.md) that drifted.

These stay manual. The lane page has the clicks. Do not ask a bot to create the GitHub App or the secrets.

1. Chore lane. Follow [chore lane setup](chore-lane-setup.md) in order: branch protection on `develop`, the `merge-gate` check, Allow auto-merge, the GitHub App (`BLEEPS_APP_ID`, `BLEEPS_APP_PRIVATE_KEY`), the variable `BLEEPS_AUTOMERGE` set to `on`, and the `bleeps:hold` label. Until those exist, `scripts/chore-lane` can pass and the workflow still skips. The workflow merges. Bloops does not.
2. Renovate. Install the Renovate GitHub App, from that same page. `renovate.json` requests patch and lockfile updates only. Renovate's own automerge stays off.
3. `review_external`. The default is `none`, which installs nothing. Set `coderabbit` or `copilot` in `orca.project.yaml` only when that reviewer is installed. Ping gathers those findings only then. It still posts one summary and does not approve or merge.
4. Enable the automations you saved disabled, after `orca automations trigger-options --bot <name>` lists the event. Your own GitHub login does not start a label or a comment. Someone else applies `bleeps:go`. A pull request you open wakes Ping only on the rule that says `from=me`.
5. Labels the crew uses, if the repository does not have them: `bleeps:go`, `bleeps:found`, `bleeps:ready`, `bleeps:hold`, `friction`.

## Pause or stop

- One bot: in its settings, turn Active off. That pauses it. Delete bot… removes it.
- One automation: pause it in the bot's panel.
- Every bot: Settings → Bots → Enable bots, off. That hides them and stops new messages and new automation runs. Folders, memory, and chats stay.
- The lane: set `BLEEPS_AUTOMERGE` to anything other than `on`, or add `bleeps:hold` to one pull request.

No single kill command showed up in the bot CLI or the docs. Use the switches above.

## What the labels do not show

Checked against the [bots quickstart](https://orca.dev/docs/bots), [security](https://orca.dev/docs/bots/security), [use cases](https://orca.dev/docs/bots/use-cases), [connectors](https://orca.dev/docs/bots/connectors), the [1.4.265 changelog](https://orca.dev/changelog/1-4-265), and the Orca app strings those pages name.

- The New bot dialog has no Handle field, and no model field of its own. The model is the one shown on the Agent row. The later settings page is titled Agent and model. The names inside that model submenu are not listed here.
- Permission mode is not on the create dialog, and the bot CLI has no flag for it.
- No command creates a group. `orca bot create` without `--offer` does not create a bot either.
