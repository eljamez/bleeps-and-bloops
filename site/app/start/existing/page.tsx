import type { Metadata } from "next";
import { BlipNote, Section, SiteShell, Step, links, wrap } from "../../shell";

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
              <code>main</code> and add labels. GitHub Issues stay the ticket
              source. Issues already in the tracker stay issues.
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
              agents off <code>main</code>. Leave auto-merge off until Phase 3.
              Required checks you already run stay. They are one gate. The
              verify verdict and the deployed SHA are gates of their own, and
              those checks are planned.
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
            <code>proactive</code> defaults to on. Set{" "}
            <code>proactive: off</code> to keep Chip from filing issues here.
            Commit <code>orca.project.yaml</code>. Do not commit secrets.
          </p>
          {/* TODO: The home server is not set up by this repo. Hostname, OS, and clone path are not written. Do not invent them. */}
          <p>
            Installing Orca on a machine is still open. The written steps are
            in the <a href={links.home}>home-server notes</a>. 8&nbsp;GB of RAM
            is the floor. 16&nbsp;GB is comfortable. One worktree per ticket
            keeps this repository from trampling another.
          </p>
          <BlipNote />
        </div>
      </Section>

      <Section id="next" index="03" title="Once setup is done">
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
