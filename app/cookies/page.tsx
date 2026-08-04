import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/cookies",
  `Cookie Policy — ${site.name}`,
  "Which cookies and browser storage FileForge Tools uses, why, and how to control them."
);

const UPDATED = "4 August 2026";

export default function CookiePolicyPage() {
  return (
    <div className="container-site max-w-3xl py-12 sm:py-16">
      <h1 className="text-display-sm">Cookie policy</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {UPDATED}</p>

      <div className="prose-site mt-8">
        <p>
          This page explains the cookies and browser storage used on {site.name}. It supplements the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>Cookies we set ourselves</h2>
        <p>
          None. The site&apos;s own functionality does not depend on cookies, and we do not set any
          for identification, sessions or tracking.
        </p>

        <h2>Browser storage we use</h2>
        <p>
          Instead of cookies, a few small preferences are kept in your browser&apos;s{" "}
          <code>localStorage</code>. Unlike cookies, this data is never attached to network requests
          — it stays on your device and we cannot read it.
        </p>
        <ul>
          <li>
            <code>theme</code> — remembers whether you chose light or dark appearance.
          </li>
          <li>
            <code>ff:recent-tools</code> — the last few tools you opened, for quick access.
          </li>
          <li>
            <code>ff:favorites</code> — tools you have starred.
          </li>
        </ul>
        <p>
          Clearing site data in your browser removes all of it. The tools continue to work
          normally without it; you simply lose the shortcuts.
        </p>

        <h2>Third-party cookies</h2>
        <p>
          Advertising on this site is served by Google AdSense, which may set cookies to deliver and
          measure ads and, where permitted, to personalise them. These are set by Google rather than
          by us.
        </p>
        <p>
          Our analytics provider, Vercel Analytics, is cookie-free and does not track visitors
          across sites.
        </p>

        <h2>Consent</h2>
        <p>
          Advertising consent is set to <em>denied</em> by default for everyone, before any
          advertising tag is allowed to load. Google Consent Mode receives that default signal in
          the page head, so personalised advertising storage is not written unless and until you
          accept.
        </p>
        <p>
          Every visitor — not only those in the European Economic Area, the United Kingdom and
          Switzerland — is shown the prompt on their first visit. Declining, dismissing the prompt
          or pressing <kbd>Esc</kbd> all record a rejection; only the explicit
          &ldquo;Accept&rdquo; button grants consent. You can revisit the choice at any time using
          the <strong>Cookie settings</strong> link in the site footer.
        </p>

        <h2>How to control cookies</h2>
        <p>
          Every major browser lets you block or delete cookies, either entirely or per site — look
          for &ldquo;Privacy&rdquo; or &ldquo;Site settings&rdquo;. Blocking cookies will not stop
          any tool on this site from working, since none of the tools depend on them.
        </p>
        <p>
          To opt out of personalised advertising specifically, visit{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Questions</h2>
        <p>
          Contact us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> if anything
          here is unclear.
        </p>
      </div>
    </div>
  );
}
