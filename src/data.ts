// Sample data - you can move this to a separate file or database later

import ChessLocator from "./components/games/chess-locator/page";
import CountdownTimer from "./components/tools/countdown-timer/page";

export type Project = {
  slug: string;
  title: string;
  description: string;
  component: React.ComponentType;
};

export type Game = Project;

export type Tool = Project;

export type Experiment = {
  slug: string;
  title: string;
  description: string;
};

export type CodepenItem = {
  slug: string;
  title: string;
  user: string;
};

export type Experience = {
  slug: string;
  title: string;
  description: string;
};

export const games: Game[] = [
  {
    slug: "chess-locator",
    title: "Chess Locator",
    description: "Locate the chess pieces on the board",
    component: ChessLocator,
  },
  //   {
  //     slug: "snake",
  //     title: "Snake Game",
  //     description: "Guide the snake to eat and grow",
  //   },
];

export const tools: Tool[] = [
  {
    slug: "countdown-timer",
    title: "Countdown Timer",
    description: "Create a countdown timer",
    component: CountdownTimer,
  },

  //   {
  //     slug: "json-formatter",
  //     title: "JSON Formatter",
  //     description: "Format and validate JSON data",
  //   },
  //   {
  //     slug: "base64-encoder",
  //     title: "Base64 Encoder",
  //     description: "Encode and decode Base64 strings",
  //   },
];

export const experiments: Experiment[] = [
  //   {
  //     slug: "particle-system",
  //     title: "Particle System",
  //     description: "Interactive particle physics",
  //   },
  //   {
  //     slug: "wave-generator",
  //     title: "Wave Generator",
  //     description: "Create mesmerizing wave patterns",
  //   },
  //   {
  //     slug: "fractal-explorer",
  //     title: "Fractal Explorer",
  //     description: "Explore mathematical fractals",
  //   },
];

export const codepenItems: CodepenItem[] = [
  {
    slug: "ZEbjWdx",
    title: "Super Mario CSS Grid Fader",
    user: "eljamez",
  },
  {
    slug: "dyYJWQz",
    title: "Marquee Infinite Loop",
    user: "eljamez",
  },
];

export const experience: Experience[] = [
  {
    slug: "",
    title: "Work",
    description: "Work",
  },
];
