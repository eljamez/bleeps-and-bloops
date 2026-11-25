import type { Metadata } from "next";
import system, { joinLabels } from "../../system";
import { BlipNote, ConfigKeys, HostNote, Section, SiteShell, Step, links, wrap } from "../../shell";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Add Bleeps to an existing project",
  description:
    "Keep your repository and add Bleeps: a develop branch, the router, the pull request recap, and the guardrails.",
  alternates: { canonical: "/start/existing" },
};

export default function StartExistingPage() {
  return (
    <SiteShell current="existing">
      <header className={`${wrap} hero page pt-10 pb-4 md:pt-16`}>
        <h1>Add Bleeps to an existing project</h1>
        <p className="lede">
          You keep the repository, its history, and the checks you already
          run. Bleeps adds a <code>develop</code> branch, a short router, and
          the gates. These steps follow <a href={links.using}>Using Bleeps</a>{" "}
          and the <a href={links.primitives}>primitives</a>. Pattern files are
          in <a href={links.repo}>the Bleeps and Bloops repo</a>.
        </p>
      </header>

      <Section id="repo" index="01" title="Add the line to this repo">
        <ol className="flow" aria-label="Setup steps">
          <Step title="Use the repository you administer">
            <p>
              You need admin on the GitHub repository so you can protect{" "}
              <code>main</code> and add labels. GitHub is required. Code, pull
              requests, and CI stay here even when the tickets already live in{" "}
              {joinLabels(
                system.ticketSources
                  .filter((source) => source.id !== "github")
                  .map((source) => source.label),
              )}
              . <code>scripts/intake</code> fetches one of those and mirrors it
              to a GitHub issue so the line can start. Issues you already
              track stay where they are. The setup is in{" "}
              <a href={links.tickets}>Tickets</a>.
            </p>
          </Step>
          <Step title="Add develop beside the branch you ship">
            {/* TODO: 0003 names develop and main. No mapping is written for other branch names. */}
            <p>
              Create <code>develop</code> from the branch you trust if the
              repository does not have it. Leave <code>main</code> named{" "}
              <code>main</code>. Agent pull requests target{" "}
              <code>develop</code>. You merge <code>develop</code> into{" "}
              <code>main</code>. The settled names are those two. A mapping for
              other branch names is not decided.
            </p>
            <p>
              Protect <code>main</code> so the owner is the person who can
              merge into it. Keep the protection you already have, and keep
              agents off <code>main</code>. GitHub auto-merge is still an open
              question. <code>scripts/merge-pr</code> does not turn it on.
              Required checks you already run stay. They are one gate. Echo&apos;s
              verify verdict is another gate, and <code>scripts/merge-pr</code>{" "}
              reads it. The deployed SHA check is not built yet:{" "}
              <code>bleeps health</code> still refuses.
            </p>
          </Step>
          <Step title="Point AGENTS.md at Bleeps">
            <p>
              If the file is new, add the short router: Bleeps runs the crew,
              and links to the flow, the architecture, the decisions, the
              primitives, ship-pr, the friction log, and the control CLI.{" "}
              <a href={links.agents}>This repo&apos;s AGENTS.md</a> is the
              pattern for the links. If you already have agent instructions,
              keep them and add those links. The shared behavior comes from{" "}
              <code>orca.yaml</code>.
            </p>
          </Step>
          <Step title="Add the recap to the pull request template">
            <p>
              If you have no template, copy{" "}
              <a href={links.template}>this one</a>. If you have one, add the
              recap and the risk tier and keep the rest. The class is{" "}
              <code>composes</code>, <code>extends</code>, or{" "}
              <code>adds</code>. <code>high</code> means a guardrail and waits
              for you.
            </p>
          </Step>
          <Step title="Add a friction label">
            <p>
              Create the <code>friction</code> label if you do not have it.
              Use it for papercuts in the{" "}
              <a href={links.friction}>friction log</a> format. Leave the rest
              of the backlog on the labels it already has. Search open{" "}
              <code>friction</code> issues before you file a duplicate.
            </p>
          </Step>
          <Step title="Keep your checks, and name the guardrails">
            <p>
              Your tests stay your tests. <code>scripts/orca-verify</code> runs
              the test and typecheck commands from <code>orca.project.yaml</code>{" "}
              and fails when no test command is set. The checks you already
              run stay until that file points at them. Auth, billing,
              payments, data deletion, and migrations wait for you before they
              change and before they merge. <code>scripts/guardrails</code>{" "}
              reports a touch and does not block a merge by itself.
            </p>
          </Step>
        </ol>
      </Section>

      <Section id="orca" index="02" title="Point this project at Orca">
        <div className="stack">
          <p>
            Bleeps is built for Orca. The shared <code>orca.yaml</code> is the
            factory config. Symlink it, and commit{" "}
            <code>orca.project.yaml</code> copied from{" "}
            <a href={links.example}>the example</a>. Set <code>install</code>,{" "}
            <code>test</code>, and <code>typecheck</code> to the commands this
            repository already runs.
          </p>
          <pre>
            <code>{`ln -s /path/to/bleeps-and-bloops/orca.yaml orca.yaml
cp /path/to/bleeps-and-bloops/examples/orca.project.yaml orca.project.yaml`}</code>
          </pre>
          <p>
            If you set <code>test_unit</code>, <code>test_integration</code>,
            or <code>test_e2e</code>, <code>bleeps test</code> runs those
            instead of the single <code>test</code> command.{" "}
            <code>proactive</code> defaults to {system.defaults.proactive}. Set{" "}
            <code>proactive: off</code> to keep Chip from filing issues here.
            Set <code>ticket_sources</code> to the trackers this project uses: {joinLabels(system.ticketSources.map((source) => source.label))}.
            Credential keys are env var names. Commit{" "}
            <code>orca.project.yaml</code>. Do not commit secrets. On the
            machine that will do the work,{" "}
            <code>python3 scripts/check-ticket-sources</code> fails when GitHub
            access is missing.
          </p>
          <ConfigKeys />
          <HostNote />
          <p>
            One worktree per ticket keeps this repository from trampling
            another.
          </p>
          <BlipNote />
        </div>
      </Section>

      <Section id="bots" index="03" title="Optional: the crew as bots">
        <div className="stack">
          <p>
            <code>runtime</code> defaults to {system.defaults.runtime}. Leave it
            there and Orca starts the crew from <code>issueCommand</code> when
            a workspace launches from a GitHub issue. Set{" "}
            <code>runtime: bots</code> only after the group exists.
          </p>
          <p>
            Create the Bleeps bot in Orca, then paste one prompt that proposes
            the rest of the crew. The steps and the prompt are on{" "}
            <a href="/start/bots">Set up the bots</a>.
          </p>
        </div>
      </Section>

      <Section id="next" index="04" title="Once setup is done">
        <div className="stack">
          <p>
            The day-to-day line is the same as on a new project: an issue, a
            merge to <code>develop</code>, and you promoting <code>main</code>.
            Blip keeps the tests that gate the merge. Bloops is who merges,
            through the script.
          </p>
          <p>
            <a href="/using-bleeps">Day to day with Bleeps</a>
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
