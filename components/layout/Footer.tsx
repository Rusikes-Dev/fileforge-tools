import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  {
    heading: "Tools",
    links: [
      { name: "All tools", href: "/tools" },
      { name: "Image tools", href: "/image-tools" },
      { name: "PDF tools", href: "/pdf-tools" },
      { name: "Text tools", href: "/text-tools" },
      { name: "Developer tools", href: "/developer-tools" },
    ],
  },
  {
    heading: "Popular",
    links: [
      { name: "JPG to PDF", href: "/jpg-to-pdf" },
      { name: "Merge PDF", href: "/merge-pdf" },
      { name: "Image compressor", href: "/image-compressor" },
      { name: "Word counter", href: "/word-counter" },
      { name: "JSON formatter", href: "/json-formatter" },
    ],
  },
  {
    heading: "Site",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy policy", href: "/privacy" },
      { name: "Terms of use", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-50">
      <div className="container-site grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-semibold">{site.shortName}</p>
          <p className="mt-2 max-w-xs text-sm text-ink-500">
            Free file conversion and document utilities that run in your browser. Your files stay
            on your device.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="text-sm font-semibold text-ink-900">{col.heading}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-500 hover:text-ink-900">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-100">
        <p className="container-site py-4 text-xs text-ink-500">
          © {new Date().getFullYear()} {site.name}. All tools are free to use.
        </p>
      </div>
    </footer>
  );
}
