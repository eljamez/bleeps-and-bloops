---
name: update-bleeps
description: When the system changes, update the docs, decisions, config, scripts, and site together, then run the site check.
---

# Updating Bleeps and Bloops

Any agent who changes how the system works follows this. A crew member, a script, a ticket source, a config key, or a pipeline step that moves in one place and not the others leaves the site lying.

The public site reads `site/system-facts.json`. `scripts/check-site` derives the same facts from the decision tables, `scripts/ticketlib.py`, `scripts/fix-loop`, `scripts/bleeps-scout`, and `examples/orca.project.yaml`. It fails when they disagree, and when a page stops rendering the file.

## Update together

Touch only the rows this change actually affects.

- A new or renamed crew member: `agents/<name>/ROLE.md`, the table in decision 0010, `orca.yaml` `issueCommand`, `AGENTS.md`, and `site/system-facts.json` `crew`.
- A pipeline change: `docs/flow.md`, `orca.yaml` `issueCommand`, the role skill that runs the step, and `site/system-facts.json` `pipeline`.
- A ticket source: `scripts/ticketlib.py` `SOURCES`, an adapter under `scripts/`, `docs/tickets.md`, decision 0013 if the set changed, the label needle in `scripts/check-site`, and `site/system-facts.json` `ticketSources`. GitHub stays required.
- A crew script: the script under `scripts/`, the "Scripts in place" line in decision 0011, the role that runs it, and `site/system-facts.json` `scripts`.
- A config key: `examples/orca.project.yaml` and `orca.project.yaml` when this repo uses it, `docs/tickets.md` or `docs/using-bleeps.md` for the key's meaning, and `site/system-facts.json` `configKeys`. `health_url` and `preview` stay off the site until the commands run. Credential keys stay env var names. Never put a secret in the yaml or on the site.
- A default (`fix_rounds`, `proactive`, `scout_cap`, `scout_schedule`, `scout_time`): the `project.get` default in the script, then `site/system-facts.json`. Do not hardcode the number in a page.
- A decision that changes an old one: the next number, and mark the old record superseded. Do not renumber.

## Site copy

The site is how a person uses this on their own project. Say "you" for the owner. Keep the GitHub link. Do not tell anyone to run `bb:kick-off`. Do not put a game controller on the page. Do not name Kent C. Dodds or any other person as the model for the system.

## Checklist

- [ ] The decision, the flow, and the doc that owns the topic match the change.
- [ ] `orca.yaml` and the project yaml match, when the prompt or a key changed.
- [ ] The script exists, is executable, and decision 0011 lists it when the crew runs it.
- [ ] The role and its skill name the script.
- [ ] `site/system-facts.json` matches, and the pages still render it.
- [ ] `python3 scripts/check-site` exits 0.
- [ ] `python3 scripts/check-orca` exits 0.

`scripts/check-orca` runs the site check. Bloops runs it again from `scripts/bloops-reflect` and before a merge. A failure is not Ready to ship.
