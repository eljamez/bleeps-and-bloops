import { tools } from "@/data";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Tools</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        Practical utilities to make your life easier
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-secondary transition-colors group"
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
              {tool.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
