import Link from "next/link";

// Sample data - you can move this to a separate file or database later
const games = [
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic game of X's and O's",
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Test your memory with card matching",
  },
  {
    slug: "snake",
    title: "Snake Game",
    description: "Guide the snake to eat and grow",
  },
];

const tools = [
  {
    slug: "color-picker",
    title: "Color Picker",
    description: "Generate and explore color palettes",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON data",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings",
  },
];

const experiments = [
  {
    slug: "particle-system",
    title: "Particle System",
    description: "Interactive particle physics",
  },
  {
    slug: "wave-generator",
    title: "Wave Generator",
    description: "Create mesmerizing wave patterns",
  },
  {
    slug: "fractal-explorer",
    title: "Fractal Explorer",
    description: "Explore mathematical fractals",
  },
];

interface CardProps {
  title: string;
  description: string;
  href: string;
}

function Card({ title, description, href }: CardProps) {
  return (
    <Link
      href={href}
      className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary transition-colors group"
    >
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Bleeps and Bloops
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Interactive games, useful tools, and creative experiments built with
          React and Next.js
        </p>
      </div>

      {/* Games Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Games</h2>
          <Link
            href="/games"
            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.slug}
              title={game.title}
              description={game.description}
              href={`/games/${game.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Tools</h2>
          <Link
            href="/tools"
            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.slug}
              title={tool.title}
              description={tool.description}
              href={`/tools/${tool.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Experiments Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Experiments</h2>
          <Link
            href="/experiments"
            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <Card
              key={experiment.slug}
              title={experiment.title}
              description={experiment.description}
              href={`/experiments/${experiment.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
