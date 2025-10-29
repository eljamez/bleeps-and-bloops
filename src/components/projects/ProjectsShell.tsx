import Link from "next/link";

export default function ProjectsShell({
  title,
  description,
  children,
  path,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  path: string;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <Link
        href={`/${path}`}
        className="inline-flex absolute top-4 left-8 items-center text-sm text-primary hover:text-primary-hover hover:underline mb-8 transition-colors"
      >
        ← Back to {path.charAt(0).toUpperCase() + path.slice(1)}
      </Link>

      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        {description}
      </p>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg text-center">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 to-pink-900 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
