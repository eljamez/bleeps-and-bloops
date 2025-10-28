import { tools } from "@/data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;

  const tool = tools.find((tool) => tool.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/tools"
        className="inline-flex items-center text-sm text-secondary hover:text-secondary-hover hover:underline mb-8 transition-colors"
      >
        ← Back to Tools
      </Link>

      <h1 className="text-4xl font-bold mb-4">{tool?.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        {tool?.description}
      </p>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
        {tool?.component && <tool.component />}
      </div>
    </div>
  );
}
