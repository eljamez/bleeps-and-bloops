import type { Metadata } from "next";
import { Section, SiteShell, links, wrap } from "../shell";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Day to day",
  description:
    "How Bleeps runs the crew from an issue to a merge: Beep, Buzz, Blip, Echo, Chip, and Bloops.",
  alternates: { canonical: "/using-bleeps" },
};

const jumps = [
  ["#crew", "Crew"],
  ["#issue", "Issue"],
  ["#spec", "Spec"],
  ["#build", "Build"],
  ["#blip", "Blip"],
  ["#review", "Review"],
  ["#merge", "Merge"],
  ["#main", "Main"],
  ["#guardrails", "Guardrails"],
  ["#friction", "Friction"],
  ["#patrol", "Patrol"],
] as const;

const crew = [
  ["Beep", "Plans the work and writes the spec."],
  ["Buzz", "Builds the change in an Orca worktree."],
  ["Blip", "QA lead. Sets up and maintains the tests."],
  ["Echo", "Independent verify. Read-only, and a separate session."],
  ["Chip", "Proactive scout. Files issues for what it finds."],
  ["Bloops", "Merges through a script, then studies the run and improves every agent's skills."],
] as const;

export default function UsingBleepsPage() {
  return (
    <SiteShell current="using">
      <header className={`${wrap} hero page pt-10 pb-4 md:pt-16`}>
        <h1>Day to day</h1>
        <p className="lede">
          After either setup, the work is the same. You steer. Bleeps runs the
          crew from a GitHub issue to a pull request on <code>develop</code>.
          Bloops merges when the gates pass. You promote <code>develop</code>{" "}
          to <code>main</code>. The order is the <a href={links.flow}>flow</a>.
          The blocks are the <a href={links.primitives}>primitives</a>.
        </p>
        <nav aria-label="On this page">
          <ul className="jump">
            {jumps.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Section id="crew" index="01" title="The crew">
        <div className="stack">
          {/* TODO: Keep these jobs aligned with the role files under agents/. Do not invent extra commands. */}
          <p>
            Bleeps is the doer. Bleeps runs this crew and gets the work done.
          </p>
          <dl className="habits">
            {crew.map(([name, job]) => (
              <div className="habit" key={name}>
                <dt>{name}</dt>
                <dd>{job}</dd>
              </div>
            ))}
          </dl>
          <p>
            Scripts first: common work gets a script so nobody does it by hand
            or from scratch. Beep runs <code>scripts/kick-off</code>. Echo
            writes the verdict with <code>scripts/verify</code>. Bloops merges
            with <code>scripts/merge-pr</code> and reflects with{" "}
            <code>scripts/bloops-reflect</code>. Chip runs{" "}
            <code>scripts/bleeps-scout</code>. Tests run through{" "}
            <code>bleeps test</code>.
          </p>
        </div>
      </Section>

      <Section id="issue" index="02" title="File an issue">
        <p>
          A GitHub issue is the ticket. You file it, or Chip files one labelled{" "}
          <code>bleeps:found</code>. Launch an Orca workspace from that issue.
          Orca runs <code>issueCommand</code> from the shared{" "}
          <code>orca.yaml</code>, with the issue number filled in. Whether
          someone grooms the issue first is still open.
        </p>
      </Section>

      <Section id="spec" index="03" title="Spec and tasks">
        <div className="stack">
          <p>
            Beep writes <code>specs/&lt;issue&gt;-&lt;slug&gt;/</code>. The
            folder holds <code>ticket.md</code> and <code>spec.md</code>.{" "}
            <code>spec.md</code> carries a status of draft or approved.{" "}
            <code>design.md</code> is written when the approach is the risky
            part. Then <code>tasks.md</code>, a checklist. The checklist
            includes the tests.
          </p>
        </div>
      </Section>

      <Section id="build" index="04" title="Build and verify">
        <div className="stack">
          <p>
            Buzz builds, tests, and fixes in an isolated Orca worktree, with a
            round limit. The number of rounds is not chosen yet. When the
            change touches a guardrail, the loop pauses for you.
          </p>
          <p>
            Echo then writes <code>verify.md</code>. Echo is read-only, does
            not share Buzz&apos;s or Blip&apos;s session, and does not edit.
            The verdict that continues is “Ready to ship”. Any other verdict
            stops the line before a pull request. <code>verify.md</code>{" "}
            records unit, integration, and end-to-end. End-to-end is not
            applicable only when the project is not a web app.
          </p>
        </div>
      </Section>

      <Section id="blip" index="05" title="Blip">
        <div className="stack">
          <p>
            Blip is the QA lead. Blip sets up and maintains the unit tests, the
            integration tests, and the end-to-end tests, and writes the tests
            for the change. On a web app, end-to-end defaults to Playwright.
            The <a href={links.blip}>role</a> and the onboard, pipeline, and
            coverage skills are in the repo.
          </p>
          <p>
            Green tests are a hard gate before auto-merge. A failing test
            leaves the pull request on its branch. Echo&apos;s verdict, the
            reviews, and guardrail sign-off still have to pass. A missing test
            command fails <code>bleeps test</code>. It is not a skip.
          </p>
        </div>
      </Section>

      <Section id="review" index="06" title="Pull request and review">
        <div className="stack">
          <p>
            The pull request targets <code>develop</code> and the description
            includes the recap: <code>composes</code>, <code>extends</code>, or{" "}
            <code>adds</code>, plus a risk tier. The agent comments on the
            issue.
          </p>
          <p>
            Layered review is CodeRabbit for style and obvious bugs, Devin
            optionally for an end-to-end pass after its noise is calibrated,
            and Claude Code for architecture fit. Grok Bot watches the
            pull-request queue, failing CI, and review nudges. That layer is
            Phase 2. The bot is planned.
          </p>
        </div>
      </Section>

      <Section id="merge" index="07" title="Bloops merges">
        <div className="stack">
          <p>
            Bloops merges into <code>develop</code> through{" "}
            <code>scripts/merge-pr</code>. The gates are green tests, Echo’s
            “Ready to ship”, reviews with no blocking findings, and your
            sign-off when a guardrail was touched. The target is{" "}
            <code>develop</code>. Never <code>main</code>. Label rules can
            still keep a ticket from merging.
          </p>
          <p>
            After a run, Bloops runs <code>scripts/bloops-reflect</code> and
            proposes improvements to skills, scripts, and <code>AGENTS.md</code>.
            Those proposals are issues or pull requests. Bloops does not edit
            those files in place.
          </p>
          <p>
            <code>scripts/merge-pr</code> reports whether the gates passed. It
            does not turn on GitHub auto-merge. Whether that setting is on is
            still an open question. <code>--apply</code> does not merge. High
            risk waits for you.
          </p>
          <p>
            After a real merge, the script asks <code>bleeps health</code> for
            the deployed SHA. <code>scripts/bleeps</code> runs <code>test</code>{" "}
            and <code>typecheck</code> now. <code>health</code> still refuses.
            A green check is not deployed proof.
          </p>
        </div>
      </Section>

      <Section id="main" index="08" title="You promote main">
        <p>
          You merge <code>develop</code> into <code>main</code>. On your
          project, you are the owner. The crew never touches <code>main</code>.
        </p>
      </Section>

      <Section id="guardrails" index="09" title="Guardrails" band>
        <p>
          These five wait for you during the build, and auto-merge stays shut
          when one of them changed without your sign-off. Risk tier{" "}
          <code>high</code> means the diff touches one of them. The same rule
          applies to issues Chip filed.
        </p>
        <ul className="guards">
          <li>Auth</li>
          <li>Billing</li>
          <li>Payments</li>
          <li>Data deletion</li>
          <li>Migrations</li>
        </ul>
        <p className="mt-8">
          <code>scripts/guardrails</code> reports a matching path. Bloops&apos;s
          merge script refuses <code>develop</code> when a guardrail was
          touched without your sign-off.
        </p>
      </Section>

      <Section id="friction" index="10" title="Friction log">
        <div className="stack">
          <p>
            A papercut that will happen again becomes a GitHub issue labeled{" "}
            <code>friction</code>. File what the change left over. Fix a small,
            in-scope papercut in the current change and mention it. Search open{" "}
            <code>friction</code> issues first, and comment on a match instead
            of opening a duplicate.
          </p>
          <p>The issue body names:</p>
          <ul className="tasks">
            <li>What happened.</li>
            <li>What you wanted.</li>
            <li>How to reproduce.</li>
            <li>The cost if it stays.</li>
            <li>What you already looked at.</li>
            <li>Files, when you know them.</li>
          </ul>
          <p>
            Leave out secrets, tokens, and private data. One-off confusion stays
            out of the log.
          </p>
          <p>
            Chip is the sweep. Open <code>friction</code> issues that are not
            labelled <code>friction-skipped</code> join Chip&apos;s queue. Chip
            does not file a second issue for the same gap.{" "}
            <code>friction-skipped</code> holds one issue out until you remove
            the label. Use it when the fix needs your decision. The crew opens
            a normal pull request into <code>develop</code>. Nobody merges that
            work to <code>main</code>.
          </p>
        </div>
      </Section>

      <Section id="patrol" index="11" title="The patrol">
        <div className="stack">
          <p>
            Chip patrols on a schedule. The scans are failing tests, a test
            that fails once and passes on the retry, CI breaks, typecheck
            failures, lint, npm audit advisories, TODO and FIXME debt as one
            issue, coverage gaps, and open friction issues. Chip files{" "}
            <code>bleeps:found</code> for a new finding and starts the same
            pipeline, under the same guardrails. Open friction issues are not
            filed again.
          </p>
          <p>
            The patrol is per project. <code>proactive</code> in{" "}
            <code>orca.project.yaml</code> defaults to on. Set{" "}
            <code>proactive: off</code> and Chip skips that project. Issues
            already open stay open. <code>scout_schedule</code> defaults to
            daily and <code>scout_time</code> defaults to 09:00.{" "}
            <code>scout_cap</code> defaults to 2 open pipelines.
          </p>
          <p>
            The schedule is an Orca automation, not a key inside{" "}
            <code>orca.yaml</code>. After you set <code>scout_provider</code>,
            this prints the command and then creates it:
          </p>
          <pre>
            <code>{`python3 scripts/bleeps-scout schedule
python3 scripts/bleeps-scout schedule --install`}</code>
          </pre>
          <p>
            <code>python3 scripts/bleeps-scout --dry-run</code> prints findings
            and does not file them. The home server is not running that
            automation yet. <code>scout_provider</code> stays unset until you
            choose the agent.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
