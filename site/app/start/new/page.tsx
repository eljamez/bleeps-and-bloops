import type { Metadata } from "next";
import system, { sourceList } from "../../system";
import { BlipNote, ConfigKeys, HostNote, Section, SiteShell, Step, links, wrap } from "../../shell";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Start a new project",
  description:
    "Create a repository and shape it for Bleeps: develop, a short AGENTS.md, the pull request recap, and the guardrails.",
  alternates: { canonical: "/start/new" },
};

export default function StartNewPage() {
  return (
    <SiteShell current="new">
      <header className={`${wrap} hero page pt-10 pb-4 md:pt-16`}>
        <h1>Start a new project</h1>
        <p className="lede">
          Create the GitHub repository, then shape it so a ticket can land on{" "}
          <code>develop</code>. These steps follow{" "}
          <a href={links.using}>Using Bleeps</a> and the{" "}
          <a href={links.primitives}>primitives</a>. The scripts that run a
          ticket, including <code>scripts/kick-off</code>,{" "}
          <code>scripts/intake</code>, <code>scripts/fix-loop</code>, and{" "}
          <code>scripts/merge-pr</code>, are in{" "}
          <a href={links.repo}>the Bleeps and Bloops repo</a>. You choose the
          machine Orca runs on. The default is the computer in front of you.
        </p>
      </header>

      <Section id="repo" index="01" title="Shape the repository">
        <ol className="flow" aria-label="Setup steps">
          <Step title="Create the repository">
            <p>
              Create a GitHub repository you administer. GitHub is required.
              Code, pull requests, and CI live there, whichever tracker the
              tickets come from. A project then picks its ticket sources in{" "}
              <code>orca.project.yaml</code>:{" "}
              {sourceList()}.
              The setup is in <a href={links.tickets}>Tickets</a>.
            </p>
          </Step>
          <Step title="Add develop, and protect main">
            <p>
              Create a <code>develop</code> branch. Protect <code>main</code>{" "}
              so you, the owner, are the person who can merge into it. Agent
              pull requests target <code>develop</code>. GitHub auto-merge is
              still an open question. Bloops uses <code>scripts/merge-pr</code>,
              which does not turn that setting on.
            </p>
          </Step>
          <Step title="Add a short AGENTS.md">
            <p>
              Put a router at the root. A few lines and links. Name Bleeps as
              the doer that runs the crew, and point at the flow, the
              architecture, the decisions, the primitives, ship-pr, the
              friction log, and the control CLI.{" "}
              <a href={links.agents}>This repo&apos;s AGENTS.md</a> is the
              pattern. Detail lives on the linked page.
            </p>
          </Step>
          <Step title="Add the pull request template">
            <p>
              Copy <a href={links.template}>the pull request template</a>. The
              recap classifies the change as <code>composes</code>,{" "}
              <code>extends</code>, or <code>adds</code>. Roll up to the
              highest class. The risk tier is separate. <code>high</code> means
              the diff touches a guardrail and waits for you.
            </p>
          </Step>
          <Step title="Add a friction label">
            <p>
              Papercuts are GitHub issues labeled <code>friction</code>, in the
              format in the <a href={links.friction}>friction log</a>. They are
              not files in the tree. Search open <code>friction</code> issues
              before you file a duplicate.
            </p>
          </Step>
          <Step title="Treat five areas as sign-off">
            <p>
              Auth, billing, payments, data deletion, and migrations wait for
              you before they change and before they merge. The list is
              decided. <code>scripts/guardrails</code> reports a touch. It does
              not block a merge by itself.
            </p>
          </Step>
        </ol>
      </Section>

      <Section id="orca" index="02" title="Point the project at Orca">
        <div className="stack">
          <p>
            Bleeps is built for Orca, the MIT-licensed harness. Orca runs an
            agent in an isolated worktree per ticket. The shared{" "}
            <code>orca.yaml</code> is the factory config. Symlink it, and
            commit <code>orca.project.yaml</code> copied from{" "}
            <a href={links.example}>the example</a>.
          </p>
          <pre>
            <code>{`ln -s /path/to/bleeps-and-bloops/orca.yaml orca.yaml
cp /path/to/bleeps-and-bloops/examples/orca.project.yaml orca.project.yaml`}</code>
          </pre>
          <p>
            Set <code>install</code>, <code>test</code>, and{" "}
            <code>typecheck</code>. <code>proactive</code> defaults to {system.defaults.proactive}, so Chip files issues. Set{" "}
            <code>proactive: off</code> to keep this project out of the patrol.
            Set <code>ticket_sources</code> to the trackers this project uses.
            Credential keys are env var names. Commit{" "}
            <code>orca.project.yaml</code>. Do not commit secrets. On the
            machine that will do the work,{" "}
            <code>python3 scripts/check-ticket-sources</code> fails when GitHub
            access is missing.
          </p>
          <ConfigKeys />
          <HostNote />
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
            Filing issues, the line to a merge on <code>develop</code>,
            guardrails, the friction log, and Chip&apos;s patrol are the same
            from here. Blip keeps the tests that gate the merge. Bloops is who
            merges, through the script.
          </p>
          <p>
            <a href="/using-bleeps">Day to day with Bleeps</a>
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
