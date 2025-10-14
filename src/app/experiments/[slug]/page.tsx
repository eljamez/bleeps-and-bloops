import Link from "next/link";
import { notFound } from "next/navigation";

const experiments: Record<string, { title: string; description: string }> = {
  "particle-system": {
    title: "Particle System",
    description: "Interactive particle physics",
  },
  "wave-generator": {
    title: "Wave Generator",
    description: "Create mesmerizing wave patterns",
  },
  "fractal-explorer": {
    title: "Fractal Explorer",
    description: "Explore mathematical fractals",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(experiments).map((slug) => ({
    slug,
  }));
}

export default async function ExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const experiment = experiments[slug];

  if (!experiment) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/experiments"
        className="inline-flex items-center text-sm text-primary hover:text-primary-hover hover:underline mb-8 transition-colors"
      >
        ← Back to Experiments
      </Link>

      <h1 className="text-4xl font-bold mb-4">{experiment.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        {experiment.description}
      </p>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-500 dark:text-gray-500">
          Experiment component will be implemented here
        </p>
      </div>
    </div>
  );
}
