import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/config/tools";
import ToolIcon from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "All PDF Tools",
  description:
    "Browse all available PDF tools. Merge, split, compress, and convert PDFs online for free.",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-foreground">All PDF Tools</h1>
      <p className="mt-2 text-lg text-muted">Select a tool to get started.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.url}
            className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
          >
            <ToolIcon slug={tool.slug} />
            <h2 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

