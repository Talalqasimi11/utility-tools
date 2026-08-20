import { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/config/tools";
import ToolIcon from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  }
};

export default function HomePage() {
  return (
    <main>
      {/* Hero section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Free Online PDF Tools
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
          Merge, split, compress, and convert PDF files.
          Simple, fast, and works right in your browser.
        </p>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>
    </main>
  );
}
