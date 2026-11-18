import facts from "../system-facts.json";

type Station = {
  kind: "step" | "gate";
  title: string;
  body: string;
  hold?: string;
};

type SystemFacts = {
  crew: { name: string; job: string }[];
  ticketSources: { id: string; label: string }[];
  githubRequired: boolean;
  fixRounds: number;
  scripts: { path: string; who: string }[];
  configKeys: string[];
  defaults: {
    proactive: string;
    scout_cap: string;
    scout_schedule: string;
    scout_time: string;
  };
  pipeline: Station[];
};

const system = facts as SystemFacts;

export function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join("");
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;
}

export function sourceList(): string {
  return joinLabels(system.ticketSources.map((source) => source.label));
}

export function fill(text: string): string {
  return text
    .split("{{fixRounds}}")
    .join(String(system.fixRounds))
    .split("{{sources}}")
    .join(sourceList());
}

export default system;
