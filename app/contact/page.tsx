import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the PDF Toolboxx team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20">
      <h1 className="text-3xl font-bold text-foreground mb-4">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question, feedback, or need help with our tools? Reach out to us using the form below.
      </p>

      {/* Placeholder Warning */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-8 text-sm flex gap-3 items-start">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <strong>Note:</strong> This contact form is currently a placeholder UI. It is not connected to a functional backend and messages will not be delivered. Please use <a href="mailto:[INSERT CONTACT EMAIL HERE]" className="underline hover:text-amber-900">[INSERT CONTACT EMAIL HERE]</a> directly instead.
        </div>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Your name"
            disabled
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="you@example.com"
            disabled
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            placeholder="How can we help?"
            disabled
          ></textarea>
        </div>

        <button
          type="button"
          disabled
          className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
        >
          Send Message
        </button>
      </form>
    </main>
  );
}
