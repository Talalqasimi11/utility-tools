import { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/config/tools";
import ToolIcon from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "All Free PDF Tools Directory | PDF Toolboxx",
  description: "Browse our complete directory of free online PDF tools. Merge, split, compress, watermark, and organize your PDF files with 100% local browser privacy.",
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: "All Free PDF Tools Directory | PDF Toolboxx",
    description: "Browse our complete directory of free online PDF tools. Merge, split, compress, watermark, and organize your PDF files with 100% local browser privacy.",
    url: "/tools",
    type: "website",
  }
};

export default function ToolsPage() {
  const organizationTools = tools.filter(t => ['merge-pdf', 'split-pdf', 'remove-pages', 'extract-pages', 'rotate-pdf', 'reorder-pdf'].includes(t.slug));
  const conversionTools = tools.filter(t => ['jpg-to-pdf', 'pdf-to-jpg'].includes(t.slug));
  const otherTools = tools.filter(t => ['watermark-pdf', 'compress-pdf'].includes(t.slug));

  const renderGrid = (toolList: typeof tools) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {toolList.map((tool) => (
        <Link
          key={tool.slug}
          href={tool.url}
          className="group bg-background border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
        >
          <ToolIcon slug={tool.slug} />
          <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{tool.description}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">All PDF Tools</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Explore our complete directory of free PDF tools. Every tool listed here processes your files securely on your own device.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">PDF Organization</h2>
        {renderGrid(organizationTools)}
      </section>

      <section className="bg-muted/10 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">PDF Conversion</h2>
          {renderGrid(conversionTools)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Utility & Optimization</h2>
        {renderGrid(otherTools)}
      </section>
    </main>
  );
}
