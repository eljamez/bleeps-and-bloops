import Link from "next/link";

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

export default function ExperimentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Experiments</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        Creative explorations of web technologies
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Link
            key={experiment.slug}
            href={`/experiments/${experiment.slug}`}
            className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary transition-colors group"
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {experiment.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {experiment.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
