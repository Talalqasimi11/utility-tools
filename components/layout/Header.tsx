import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Link
          href="/"
          className="text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          PDF Tools
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/tools"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
