import type { SVGProps } from "react";
import type { ToolCategoryId } from "@/lib/tools/types";

/**
 * A small in-house icon set rather than an icon package.
 *
 * The site only needs ~25 glyphs, and a dependency would ship a runtime plus
 * tree-shaking risk for something that amounts to a few hundred bytes of path
 * data. Every icon here shares one 24x24 viewBox, 1.75 stroke width, round caps
 * and `currentColor`, so sizing and colour are controlled entirely by the
 * parent's `className` and text colour.
 */

export type IconProps = SVGProps<SVGSVGElement> & {
  /** Tailwind size class pair, e.g. "h-4 w-4". Defaults to 16px. */
  className?: string;
};

function Base({ className = "h-4 w-4", children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* --- Category glyphs ------------------------------------------------------ */

export const ImageIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-4.5-4.5L7 20" />
  </Base>
);

export const PdfIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5" />
    <path d="M9 13h6M9 17h4" />
  </Base>
);

export const TextIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h11M4 18h7" />
  </Base>
);

export const CodeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m8 17-5-5 5-5M16 7l5 5-5 5" />
  </Base>
);

/* --- UI glyphs ------------------------------------------------------------ */

export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </Base>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const BoltIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </Base>
);

export const GlobeIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
);

/** Checkmark that draws itself on — used for success confirmations. */
export const AnimatedCheckIcon = ({ className = "h-4 w-4", ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <path d="m4.5 12.5 5 5 10-11" pathLength={1} className="animate-draw-check" />
  </svg>
);

export const CopyIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Base>
);

export const DownloadIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v12M7 11l5 5 5-5" />
    <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
  </Base>
);

export const UploadIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 17V5M7 9l5-5 5 5" />
    <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);

export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Base>
);

export const ArrowUpIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </Base>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </Base>
);

export const StarIcon = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3 2.9 5.9 6.1.9-4.5 4.3 1.1 6.4L12 17.5 6.4 20.5l1.1-6.4L3 9.8l6.1-.9L12 3Z" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Base>
);

export const AlertIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5h.01" />
  </Base>
);

export const InfoIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5h.01" />
  </Base>
);

export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Base>
);

export const MoonIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </Base>
);

export const GithubIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 20 5.8a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.6 0C7.2 1.9 6.1 2.2 6.1 2.2A4.9 4.9 0 0 0 6 5.8a5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
  </Base>
);

export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Base>
);

export const WifiOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 2l20 20" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4-2.6M2 8.8a15 15 0 0 1 4.2-2.8M22 8.8a15 15 0 0 0-9.6-2.9M19 12.9a10 10 0 0 0-2-1.5" />
    <path d="M12 20h.01" />
  </Base>
);

export const SparkleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </Base>
);

/* --- Category mapping ----------------------------------------------------- */

const categoryIcons: Record<ToolCategoryId, (p: IconProps) => JSX.Element> = {
  "image-tools": ImageIcon,
  "pdf-tools": PdfIcon,
  "text-tools": TextIcon,
  "developer-tools": CodeIcon,
};

/** The glyph representing a tool category, used on cards and hub pages. */
export function CategoryIcon({
  category,
  className,
}: {
  category: ToolCategoryId;
  className?: string;
}) {
  const Glyph = categoryIcons[category] ?? CodeIcon;
  return <Glyph className={className} />;
}
