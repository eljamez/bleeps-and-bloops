import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { CopyPrompt } from "../../copy-prompt";
import system from "../../system";
import { Section, SiteShell, Step, links, wrap } from "../../shell";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Set up the bots",
  description:
    "Create the Bleeps bot in Orca, paste one prompt to add the rest of the crew, then finish the checks only you can turn on.",
  alternates: { canonical: "/start/bots" },
};

const prompt = readFileSync(join(process.cwd(), "..", "bots", "bootstrap-prompt.md"), "utf8");

export default function StartBotsPage() {
  return (
    <SiteShell current="bots">
      <header className={`${wrap} hero page pt-10 pb-4 md:pt-16`}>
        <h1>Set up the bots</h1>
        <p className="lede">
          Optional. Do this after <a href="/start/new">a new project</a> or{" "}
          <a href="/start/existing">an existing one</a> already has{" "}
          <code>develop</code>, the <code>orca.yaml</code> symlink, and{" "}
          <code>orca.project.yaml</code>. <code>runtime</code> defaults to{" "}
          {system.defaults.runtime}. Set <code>runtime: bots</code> only when
          the group exists. The same steps are in{" "}
          <a href={links.botsSetup}>the setup notes</a>. The command list is{" "}
          <a href={links.bots}>how to run the crew as bots</a>.{" "}
          <code>python3 scripts/bots print</code> prints that list and does not
          run it.
        </p>
      </header>

      <Section id="bleeps" index="01" title="Create Bleeps by hand">
        <ol className="flow" aria-label="Create the Bleeps bot">
          <Step title="Open New bot">
            <p>
              In the sidebar&apos;s Bots section, select + (New bot or group),
              then New bot, then Start from scratch. The dialog title is New
              bot. If the sidebar has no Bots section, turn on Settings, Bots,
              Enable bots.
            </p>
          </Step>
          <Step title="Fill the dialog">
            <ul className="tasks">
              <li>
                Name: <code>Bleeps</code>. There is no Handle field. You mention
                this bot as <code>@Bleeps</code>.
              </li>
              <li>
                Who it is and what it does: Coordinates the crew in one group
                and does not do their jobs. The field&apos;s accessible name is
                Identity.
              </li>
              <li>
                Computer: the machine <code>host</code> names. Select Change to
                pick another. The agent is Claude Code, the provider{" "}
                <code>claude</code> in <code>orca.yaml</code>.
              </li>
              <li>
                Model: <code>orca.yaml</code> has no Bleeps row. Leave the model
                shown beside Claude Code. Worker models come later from{" "}
                <code>python3 scripts/providers show &lt;role&gt;</code>.
              </li>
            </ul>
            <p>
              Select Create. The Folder line is the bot&apos;s folder on that
              computer, where <code>SOUL.md</code> lives. It is not the git
              repository.
            </p>
          </Step>
          <Step title="Give Bleeps the project, the tickets, and a soul">
            <p>
              Open the bot&apos;s settings. Permissions: Ask for approval. A new
              bot starts at Full access, and there is no command that changes
              it. Skills, Link a project: the checkout that contains{" "}
              <code>.agents/skills</code> and <code>bots/</code>, and the
              repository the crew will edit when that is a different one. Soul:
              replace <code>SOUL.md</code> with <code>bots/bleeps/SOUL.md</code>.
            </p>
            <p>
              Connectors: sign in to Orca, then Add a connector, GitHub, Connect
              GitHub, Install the Orca app, Turn on for your bot. Or from this
              bot&apos;s chat, <code>orca bot connectors --offer github</code>.
              Connect Linear the same way only when <code>ticket_sources</code>{" "}
              includes <code>linear</code>. Jira, Discord, and a GitHub Project
              stay on <code>scripts/intake</code>. Leave Look around on. The
              group waits until the other bots exist.
            </p>
          </Step>
        </ol>
      </Section>

      <Section id="prompt" index="02" title="Paste one prompt">
        <div className="stack">
          <p>
            Open Bleeps so you are in its Home chat, not a group room. Paste
            this prompt. It is <code>bots/bootstrap-prompt.md</code>, the same
            file the setup notes include. <code>python3 scripts/bots prompt</code>{" "}
            prints it. <code>python3 scripts/bots check</code> fails when the
            notes and the file disagree.
          </p>
          <p>
            The prompt reads <code>orca.yaml</code> and{" "}
            <code>orca.project.yaml</code>, then uses{" "}
            <code>python3 scripts/bots print</code>. It proposes each other bot
            with <code>orca bot create --offer</code> and waits until you press
            Create bot. Echo stays a fresh Claude Code worker, not a bot. Zap
            is included only when <code>zap</code> is on. You create the group
            when it asks: New group, name Bleeps, members in handoff order.
          </p>
          <CopyPrompt text={prompt} />
          <pre>
            <code className="whitespace-pre-wrap">{prompt}</code>
          </pre>
        </div>
      </Section>

      <Section id="check" index="03" title="Check, then what only you can turn on">
        <div className="stack">
          <p>
            <code>python3 scripts/bots check</code> has to print <code>ok</code>.
            Then set <code>runtime: bots</code>. These stay in your hands. The
            clicks for the lane are the{" "}
            <a href={links.lane}>chore lane setup</a>.
          </p>
          <ul className="tasks">
            <li>
              Chore lane: branch protection on <code>develop</code>, the{" "}
              <code>merge-gate</code> check, Allow auto-merge, the GitHub App
              secrets, and <code>BLEEPS_AUTOMERGE</code> set to <code>on</code>.
              The workflow merges a pass. A bot does not.
            </li>
            <li>
              Renovate: install the Renovate GitHub App, from that same page.
              Its own automerge stays off.
            </li>
            <li>
              <code>review_external</code> defaults to {system.defaults.review_external}.
              That installs nothing. Set <code>coderabbit</code> or{" "}
              <code>copilot</code> only when that reviewer is installed.
            </li>
            <li>
              Enable the automations the prompt saved disabled, after{" "}
              <code>orca automations trigger-options</code> lists the event.
            </li>
          </ul>
          <p>
            To pause one bot, turn Active off in its settings. Pause one
            automation in its panel. To stop every bot, turn off Settings, Bots,
            Enable bots. Delete bot removes one. Set{" "}
            <code>BLEEPS_AUTOMERGE</code> to anything other than <code>on</code>{" "}
            to stop the lane, or add <code>bleeps:hold</code> to one pull
            request. No single kill command is documented.
          </p>
          <p>
            The New bot dialog has no Handle field and no separate model field.
            The model names inside the Agent submenu are not listed here.
            Permission mode is not on that dialog, and no bot command sets it.
            No command creates a group.
          </p>
          <p>
            <a href="/using-bleeps">Day to day with Bleeps</a>
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
