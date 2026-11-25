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
