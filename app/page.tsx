import { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/config/tools";
import ToolIcon from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "Free Online PDF Tools | PDF Toolboxx",
  description: "Free online PDF tools to merge, split, compress, and convert PDF files. All processing happens locally in your browser for total privacy.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Free Online PDF Tools | PDF Toolboxx",
    description: "Free online PDF tools to merge, split, compress, and convert PDF files. All processing happens locally in your browser for total privacy.",
    url: "/",
    type: "website",
  }
};

export default function HomePage() {
  const popularTools = tools.filter(t => ['merge-pdf', 'compress-pdf', 'pdf-to-jpg'].includes(t.slug));
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-6">
          Free Online PDF Tools
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Welcome to PDF Toolboxx. We offer a comprehensive suite of completely free, 
          highly secure PDF utilities. Unlike other services, all of our tools process your 
          sensitive documents directly inside your web browser. Your files are never uploaded to any cloud server.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">Popular PDF Tools</h2>
        {renderGrid(popularTools)}
      </section>

      <section className="bg-muted/10 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">PDF Organization</h2>
          <p className="text-muted mb-8 max-w-3xl">
            Everything you need to arrange and organize your PDF files. Combine multiple documents into one, extract the exact pages you need, remove unwanted content, and correct the orientation of your pages.
          </p>
          {renderGrid(organizationTools)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-2">PDF Conversion</h2>
        <p className="text-muted mb-8 max-w-3xl">
          Quickly convert your documents to and from PDF format without losing quality. Turn image formats like JPG into standardized PDF documents instantly.
        </p>
        {renderGrid(conversionTools)}
      </section>

      <section className="bg-muted/10 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Other PDF Tools</h2>
          <p className="text-muted mb-8 max-w-3xl">
            Optimize your files for email by reducing their file size, or securely stamp your documents with custom text watermarks to protect your intellectual property.
          </p>
          {renderGrid(otherTools)}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Why use PDF Toolboxx?</h2>
        <p className="text-muted leading-relaxed mb-6">
          We built PDF Toolboxx because we were tired of tools that force you to upload your private, confidential documents to random servers just to merge or split pages. We leverage modern web technologies (like WebAssembly and Service Workers) to bring heavy desktop-level PDF processing directly to your browser.
        </p>
        <p className="text-muted leading-relaxed">
          The moment you drop a file onto our site, it stays on your device. You get lightning-fast speeds and 100% guaranteed data privacy.
        </p>
      </section>
    </main>
  );
}
