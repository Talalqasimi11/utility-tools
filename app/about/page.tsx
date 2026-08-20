import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/config/tools";
import ToolIcon from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about PDF Toolboxx and our privacy-first approach to PDF tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 prose prose-slate">
      <h1 className="text-3xl font-bold text-foreground mb-8">About PDF Toolboxx</h1>
      
      <section className="space-y-6 text-muted">
        <p className="text-lg text-foreground">
          PDF Toolboxx is a free, modern suite of browser-based utilities designed to make working with PDF files simple, fast, and completely private.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Our Privacy-First Architecture</h2>
        <p>
          Unlike traditional PDF websites that force you to upload your sensitive documents to their servers, PDF Toolboxx flips the script. 
          <strong> Everything happens directly on your device.</strong>
        </p>
        <p>
          By utilizing modern web technologies like Web Workers and client-side JavaScript, we process your files entirely in your browser&apos;s memory. This means:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your files are never uploaded to the internet.</li>
          <li>No one else can intercept, read, or store your documents.</li>
          <li>Processing is incredibly fast because there is no upload or download wait time.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">Free & Accessible</h2>
        <p>
          We believe basic document utility should be free. There are no paywalls, no subscriptions, and no accounts required to use PDF Toolboxx.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Our Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mt-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.url}
              className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="mt-1">
                <ToolIcon slug={tool.slug} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{tool.name}</h3>
                <p className="text-sm text-muted mt-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
