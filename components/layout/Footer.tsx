import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} PDF Tools
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
