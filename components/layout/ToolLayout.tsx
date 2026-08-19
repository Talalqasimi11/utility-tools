import Link from "next/link";
import { getRelatedTools } from "@/config/tools";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  currentSlug?: string;
  faq?: { question: string; answer: string }[];
  howTo?: { step: string; description: string }[];
}

export default function ToolLayout({
  title,
  description,
  children,
  currentSlug,
  faq,
  howTo,
}: ToolLayoutProps) {
  const relatedTools = currentSlug ? getRelatedTools(currentSlug) : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": title,
        "description": description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  if (howTo && howTo.length > 0) {
    jsonLd["@graph"].push({
      "@type": "HowTo",
      "name": `How to ${title}`,
      "description": description,
      "step": howTo.map((h, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": h.step,
        "text": h.description
      }))
    });
  }

  if (faq && faq.length > 0) {
    jsonLd["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": faq.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Tools
      </Link>

      <h1 className="text-3xl font-bold text-foreground mt-4">{title}</h1>
      <p className="text-lg text-muted mt-2 max-w-2xl">{description}</p>

      <div className="mt-8">{children}</div>

      {howTo && howTo.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            How to {title}
          </h2>
          <div className="space-y-4">
            {howTo.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{item.step}</h3>
                  <p className="text-sm text-muted mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
