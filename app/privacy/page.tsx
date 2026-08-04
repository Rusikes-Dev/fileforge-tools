import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/privacy",
  `Privacy Policy — ${site.name}`,
  "How FileForge Tools handles data: files are processed in your browser and never uploaded. Full detail on analytics, advertising and cookies."
);

const UPDATED = "4 August 2026";

export default function PrivacyPage() {
  return (
    <div className="container-site max-w-3xl py-12 sm:py-16">
      <h1 className="text-display-sm">Privacy policy</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {UPDATED}</p>

      <div className="prose-site mt-8">
        <p>
          This policy explains exactly what happens to your data when you use {site.name}. The short
          version: the files you process never leave your device, but the site does serve
          advertising and measure aggregate traffic, and those third parties are described in full
          below.
        </p>

        <h2>Your files</h2>
        <p>
          Every tool on {site.name} processes files locally in your web browser. When you select a
          file, it is read by JavaScript running on your own device.{" "}
          <strong>
            Your files are never transmitted to, stored on, or processed by our servers.
          </strong>{" "}
          We operate no upload endpoint and no file storage of any kind. When you close the page,
          the browser releases the memory used for processing and nothing persists.
        </p>
        <p>
          You can verify this independently: open your browser&apos;s developer tools, switch to the
          Network tab, and run any tool. No request carrying your file will appear. You can also
          disconnect from the internet after the page has loaded and the tools will continue to
          work.
        </p>

        <h2>Information we collect directly</h2>
        <p>
          We do not require accounts and do not collect names, email addresses, or the contents of
          any file you process. We have no database of users.
        </p>
        <p>
          Our hosting provider records standard, short-lived server logs (such as IP address,
          requested page, referrer and browser type) when a page is served. These are used for
          security and operational purposes only.
        </p>

        <h2>Data stored in your browser</h2>
        <p>
          Some conveniences are stored in your browser&apos;s <code>localStorage</code>. This data
          stays on your device, is never transmitted to us, and can be cleared at any time through
          your browser settings. Specifically:
        </p>
        <ul>
          <li>
            <code>theme</code> — whether you chose the light or dark appearance.
          </li>
          <li>
            <code>ff:recent-tools</code> — the slugs of the last few tools you opened, so the
            homepage can offer shortcuts back to them.
          </li>
          <li>
            <code>ff:favorites</code> — tools you have starred.
          </li>
        </ul>
        <p>
          None of these contain file contents or anything that identifies you.
        </p>

        <h2>Analytics</h2>
        <p>
          We use Vercel Analytics and Vercel Speed Insights to understand aggregate traffic and page
          performance. These services are cookie-free and do not build cross-site profiles of
          visitors. They record page-level events such as which URL was viewed and coarse
          performance timings, not the files you process or anything you type into a tool.
        </p>

        <h2>Advertising</h2>
        <p>
          This site displays advertising supplied by Google AdSense in order to remain free. Google
          and its partners may use cookies or similar technologies to serve ads and to measure their
          performance, and may serve personalised ads based on your prior visits to this and other
          websites.
        </p>
        <p>
          You can opt out of personalised advertising at any time through{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Google Ads Settings
          </a>
          , and you can review how Google handles data from sites that use its services at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Google&apos;s partner sites policy
          </a>
          . Every visitor is shown a consent prompt on their first visit, and advertising consent
          is set to <em>denied</em> by default until a choice is made — we do not wait for a
          regional trigger. You can change your decision at any time using the &ldquo;Cookie
          settings&rdquo; link in the footer.
        </p>
        <p>
          Importantly, advertising scripts run in a separate context from the tools and have no
          access to the files you process — those never exist anywhere other than your own
          browser&apos;s memory.
        </p>

        <h2>Cookies</h2>
        <p>
          The site sets no cookies of its own for core functionality. Cookies present on the site
          come from the advertising provider described above. Our{" "}
          <Link href="/cookies">cookie policy</Link> sets out the categories in more detail and how
          to control them.
        </p>

        <h2>Third-party services</h2>
        <ul>
          <li>
            <strong>Vercel</strong> — hosting, content delivery, analytics and performance
            monitoring.
          </li>
          <li>
            <strong>Google AdSense</strong> — advertising.
          </li>
        </ul>
        <p>
          No file you process with the tools is sent to any of these parties, or to anyone else.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          The site is a general-audience utility and is not directed at children under 13. We do not
          knowingly collect personal information from children.
        </p>

        <h2>Your rights</h2>
        <p>
          Because we do not hold personal data about you, there is generally nothing for us to
          export or erase on request. Data held in your own browser can be cleared through your
          browser settings. For advertising data held by Google, use the Google links above.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If the services used by this site change, this page will be updated and the &ldquo;last
          updated&rdquo; date at the top revised.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>, or via the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
