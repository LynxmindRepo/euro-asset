// Simple line icons per category (decorative — the category name is always shown next to them).
const paths: Record<string, React.ReactNode> = {
  vehicles: (
    <>
      <path d="M3 16V8a1 1 0 0 1 1-1h9v9" />
      <path d="M13 10h4l3 3v3h-7" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  machinery: (
    <>
      <path d="M3 18h10" />
      <rect x="4" y="12" width="8" height="4" rx="1" />
      <path d="M8 12V9h3" />
      <path d="M12 13l4-7 4 4" />
      <path d="M20 10v3h-3" />
    </>
  ),
  "real-estate": (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V9l7-5 7 5v11" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  inventory: (
    <>
      <rect x="3" y="11" width="8" height="8" />
      <rect x="13" y="11" width="8" height="8" />
      <rect x="8" y="3" width="8" height="8" />
    </>
  ),
  "it-office": (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </>
  ),
  energy: <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
};

export function CategoryIcon({ categoryId, className }: { categoryId: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[categoryId] ?? paths.inventory}
    </svg>
  );
}
