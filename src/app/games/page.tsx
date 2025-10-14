import { games } from "@/data";
import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Games</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        Classic and original games reimagined for the web
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}`}
            className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary transition-colors group"
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {game.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {game.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
