import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/privacy",
  `Privacy Policy — ${site.name}`,
  "How FileForge Tools handles data: files are processed in your browser and never uploaded. Read the full privacy policy."
);

export default function PrivacyPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Privacy policy</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: July 2026</p>
      <div className="mt-6 space-y-6 leading-relaxed text-ink-700">
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Your files</h2>
          <p className="mt-2">
            All tools on {site.name} process files locally in your web browser. When you select a
            file, it is read by JavaScript running on your own device. <strong className="text-ink-900">
            Your files are never transmitted to, stored on, or processed by our servers.</strong> When
            you close the page, the browser releases the memory used for processing.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Data we collect</h2>
          <p className="mt-2">
            We do not require accounts and do not collect names, email addresses or file contents.
            Our hosting provider may record standard, short-lived server logs (such as IP address,
            requested page and browser type) for security and operational purposes when pages are
            served.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Cookies and analytics</h2>
          <p className="mt-2">
            The site does not set cookies for its core functionality. We use Vercel Web Analytics
            and Vercel Speed Insights to understand overall traffic and page performance. These
            services are cookieless: they collect anonymous, aggregate data such as page views,
            country-level location, browser type and page load times. They do not use cookies, do
            not track you across other websites, and cannot identify individual visitors. The
            contents of files you process with the tools are never part of any analytics data —
            files stay on your device.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Third-party services</h2>
          <p className="mt-2">
            Static pages and scripts are delivered by our hosting provider (Vercel). No file you
            process with the tools is sent to any third party.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent via the contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
