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
  "remove-pages":
    "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  "extract-pages":
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400",
  "rotate-pdf":
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  "reorder-pdf":
    "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400",
  "watermark-pdf":
    "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

function IconPaths({ slug }: { slug: string }) {
  const common = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (slug) {
    case "merge-pdf":
      return (
        <>
          <path {...common} d="M13.5 3H7.5a2 2 0 00-2 2v11a2 2 0 002 2h4" />
          <rect x="10" y="6" width="9" height="12" rx="2" {...common} />
          <path {...common} d="M14.5 10v4m2-2h-4" />
        </>
      );
    case "split-pdf":
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9 12h6" strokeDasharray="2 2" />
          <path {...common} d="M5.5 12H4m16 0h-1.5" />
        </>
      );
    case "compress-pdf":
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9.5 9l2.5 2 2.5-2" />
          <path {...common} d="M9.5 15l2.5-2 2.5 2" />
        </>
      );
    case "jpg-to-pdf":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" {...common} />
          <circle cx="8" cy="10" r="1.5" {...common} />
          <path {...common} d="M21 17l-4.5-5-3 3-2.5-2L3 19" />
        </>
      );
    case "pdf-to-jpg":
      return (
        <>
          <rect x="3" y="3" width="8" height="8" rx="1.5" {...common} />
          <rect x="13" y="3" width="8" height="8" rx="1.5" {...common} />
          <rect x="3" y="13" width="8" height="8" rx="1.5" {...common} />
          <rect x="13" y="13" width="8" height="8" rx="1.5" {...common} />
        </>
      );
    case "remove-pages":
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9 12h6M9 9h6M9 15h3" />
          <path {...common} d="M16 16l4 4M20 16l-4 4" strokeWidth={2} />
        </>
      );
    case "extract-pages":
      // Document with an out arrow
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M9 12h6M9 9h6M9 15h3" />
          <path {...common} d="M21 16l-3-3m0 0l-3 3m3-3v8" strokeWidth={2} />
        </>
      );
    case "rotate-pdf":
      // Document with a circular rotation arrow
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M12 10.5a3.5 3.5 0 11-3.5 3.5" />
          <path {...common} d="M8.5 14v-2.5h-2.5" />
        </>
      );
    case "reorder-pdf":
      // Two horizontal blocks with up/down arrows
      return (
        <>
          <rect x="4" y="6" width="10" height="4" rx="1" {...common} />
          <rect x="4" y="14" width="10" height="4" rx="1" {...common} />
          <path {...common} d="M17 10l3-3m0 0l3 3m-3-3v10m0 0l-3-3m3 3l3-3" strokeWidth={1.5} />
        </>
      );
    case "watermark-pdf":
      // Document with a stamp/star over it
      return (
        <>
          <rect x="5.5" y="3" width="13" height="18" rx="2" {...common} />
          <path {...common} d="M12 9l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z" fill="currentColor" fillOpacity="0.2" />
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
        aria-hidden="true"
      >
        <IconPaths slug={slug} />
      </svg>
    </div>
  );
}
