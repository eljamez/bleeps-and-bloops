import ProjectsShell from "@/components/projects/ProjectsShell";
import type { Game } from "@/data";
import { games } from "@/data";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return games.map((game: Game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = games.find((game: Game) => game.slug === slug);

  if (!game) {
    notFound();
  }

  return (
    <ProjectsShell
      title={game.title}
      description={game.description}
      path="games"
    >
      {game.component && (
        <Suspense
          fallback={
            <div className="text-gray-500 dark:text-gray-500 flex items-center justify-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          }
        >
          <game.component />
        </Suspense>
      )}
    </ProjectsShell>
  );
}
