interface ToolIconProps {
  slug: string;
  className?: string;
}

const TOOL_COLORS: Record<string, string> = {
  "merge-pdf": "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  "split-pdf":
    "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  "compress-pdf":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  "jpg-to-pdf":
    "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  "pdf-to-jpg":
    "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
};

function IconPaths({ slug }: { slug: string }) {
  const common = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (slug) {
    case "merge-pdf":
      // Two overlapping documents with a plus sign
      return (
        <>
          <path {...common} d="M13.5 3H7.5a2 2 0 00-2 2v11a2 2 0 002 2h4" />
          <rect x="10" y="6" width="9" height="12" rx="2" {...common} />
          <path {...common} d="M14.5 10v4m2-2h-4" />
        </>
      );
    case "split-pdf":
      // Document with a dashed cut line
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9 12h6" strokeDasharray="2 2" />
          <path {...common} d="M5.5 12H4m16 0h-1.5" />
        </>
      );
    case "compress-pdf":
      // Inward-pointing arrows (shrink)
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9.5 9l2.5 2 2.5-2" />
          <path {...common} d="M9.5 15l2.5-2 2.5 2" />
        </>
      );
    case "jpg-to-pdf":
      // Image/landscape icon
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" {...common} />
          <circle cx="8" cy="10" r="1.5" {...common} />
          <path {...common} d="M21 17l-4.5-5-3 3-2.5-2L3 19" />
        </>
      );
    case "pdf-to-jpg":
      // Grid of four images
      return (
        <>
          <rect x="3" y="3" width="8" height="8" rx="1.5" {...common} />
          <rect x="13" y="3" width="8" height="8" rx="1.5" {...common} />
          <rect x="3" y="13" width="8" height="8" rx="1.5" {...common} />
          <rect x="13" y="13" width="8" height="8" rx="1.5" {...common} />
        </>
      );
    default:
      return (
        <path
          {...common}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      );
  }
}

/**
 * Renders a tool-specific icon inside a colored rounded container.
 * Each tool slug maps to a distinct icon shape and background color.
 */
export default function ToolIcon({
  slug,
  className = "w-12 h-12",
}: ToolIconProps) {
  const colorClass =
    TOOL_COLORS[slug] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400";

  return (
    <div
      className={`${className} rounded-xl ${colorClass} flex items-center justify-center`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <IconPaths slug={slug} />
      </svg>
    </div>
  );
}
