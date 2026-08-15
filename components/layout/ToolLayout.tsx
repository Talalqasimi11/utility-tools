import Link from "next/link";
import { getRelatedTools } from "@/config/tools";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  currentSlug?: string;
  faq?: { question: string; answer: string }[];
}

/**
 * Shared layout wrapper for every tool page.
 * Renders title, description, children (the tool UI), optional FAQ, and related tools.
 * This is a Server Component — the interactive tool UI is passed as children.
 */
export default function ToolLayout({
  title,
  description,
  children,
  currentSlug,
  faq,
}: ToolLayoutProps) {
  const relatedTools = currentSlug ? getRelatedTools(currentSlug) : [];

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Back navigation */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Tools
      </Link>

      {/* Tool header */}
      <h1 className="text-3xl font-bold text-foreground mt-4">{title}</h1>
      <p className="text-lg text-muted mt-2 max-w-2xl">{description}</p>

      {/* Tool interface (Client Component passed as children) */}
      <div className="mt-8">{children}</div>

      {/* FAQ section */}
      {faq && faq.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6">
            {faq.map((item, i) => (
              <div key={i}>
                <dt className="text-sm font-medium text-foreground">
                  {item.question}
                </dt>
                <dd className="text-sm text-muted mt-1">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.url}
                className="border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-primary-light/50 transition-colors"
              >
                <h3 className="text-sm font-medium text-foreground">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted mt-1">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
