import ProjectsShell from "@/components/projects/ProjectsShell";
import { tools } from "@/data";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;

  const tool = tools.find((tool) => tool.slug === slug);

  return (
    <ProjectsShell
      title={tool?.title || ""}
      description={tool?.description || ""}
      path="tools"
    >
      {tool?.component && (
        <Suspense
          fallback={
            <div className="text-gray-500 dark:text-gray-500 flex items-center justify-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          }
        >
          <tool.component />
        </Suspense>
      )}
    </ProjectsShell>
  );
}
