import { BoltIcon, GlobeIcon, LockIcon, ShieldCheckIcon } from "./Icon";

const points = [
  {
    Icon: ShieldCheckIcon,
    cat: "image-tools",
    title: "No uploads, ever",
    body: "Files are read and processed by your own browser. Nothing is transmitted to a server.",
  },
  {
    Icon: BoltIcon,
    cat: "pdf-tools",
    title: "Instant results",
    body: "No upload queue and no round-trip, so most conversions finish before a server would have finished receiving the file.",
  },
  {
    Icon: LockIcon,
    cat: "text-tools",
    title: "Free, no account",
    body: "No sign-up, no email, no watermarks and no trial limits. Close the tab and nothing is retained.",
  },
  {
    Icon: GlobeIcon,
    cat: "developer-tools",
    title: "Works everywhere",
    body: "Runs in any modern browser on Windows, macOS, Linux, Android and iOS. Nothing to install.",
  },
] as const;

/** The site's core promises, shown on the homepage and category hubs. */
export default function TrustBar() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {points.map(({ Icon, cat, title, body }) => (
        <li
          key={title}
          data-cat={cat}
          className="card-interactive flex flex-col"
        >
          <span aria-hidden className="tile mb-4">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-base font-bold text-ink-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
        </li>
      ))}
    </ul>
  );
}
