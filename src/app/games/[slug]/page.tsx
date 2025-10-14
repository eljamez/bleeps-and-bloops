import Link from "next/link";
import { notFound } from "next/navigation";

const games: Record<string, { title: string; description: string }> = {
  "tic-tac-toe": {
    title: "Tic Tac Toe",
    description: "Classic game of X's and O's",
  },
  "memory-match": {
    title: "Memory Match",
    description: "Test your memory with card matching",
  },
  snake: {
    title: "Snake Game",
    description: "Guide the snake to eat and grow",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(games).map((slug) => ({
    slug,
  }));
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = games[slug];

  if (!game) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/games"
        className="inline-flex items-center text-sm text-primary hover:text-primary-hover hover:underline mb-8 transition-colors"
      >
        ← Back to Games
      </Link>

      <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        {game.description}
      </p>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-500 dark:text-gray-500">
          Game component will be implemented here
        </p>
      </div>
    </div>
  );
}
