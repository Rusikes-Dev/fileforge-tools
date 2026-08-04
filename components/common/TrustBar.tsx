import { BoltIcon, GlobeIcon, LockIcon, ShieldCheckIcon } from "./Icon";

const points = [
  {
    Icon: ShieldCheckIcon,
    title: "No uploads, ever",
    body: "Files are read and processed by your own browser. Nothing is transmitted to a server.",
  },
  {
    Icon: BoltIcon,
    title: "Instant results",
    body: "No upload queue and no round-trip, so most conversions finish before a server would have finished receiving the file.",
  },
  {
    Icon: LockIcon,
    title: "Free, no account",
    body: "No sign-up, no email, no watermarks and no trial limits. Close the tab and nothing is retained.",
  },
  {
    Icon: GlobeIcon,
    title: "Works everywhere",
    body: "Runs in any modern browser on Windows, macOS, Linux, Android and iOS. Nothing to install.",
  },
];

/** The site's core promises, shown on the homepage and category hubs. */
export default function TrustBar() {
  return (
    <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {points.map(({ Icon, title, body }) => (
        <li key={title}>
          <span
            aria-hidden
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-accent-100 bg-accent-50 text-accent-700"
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>
        </li>
      ))}
    </ul>
  );
}
