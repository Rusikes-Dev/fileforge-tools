import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { GithubIcon, MailIcon } from "@/components/common/Icon";

export const metadata: Metadata = pageMetadata(
  "/contact",
  `Contact — ${site.name}`,
  "Report a bug, suggest a tool, or ask a question about FileForge Tools."
);

export default function ContactPage() {
  return (
    <div className="container-site max-w-3xl py-12 sm:py-16">
      <h1 className="text-display-sm">Contact</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-700">
        Found a bug, have a question, or want to suggest a new tool? We read every message.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${site.contactEmail}`}
          className="card-interactive group flex flex-col gap-2"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-700 group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
          >
            <MailIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="font-semibold text-ink-900">Email</span>
          {/* Sourced from lib/site.ts so the address can never drift out of sync
              between the footer, this page and structured data. */}
          <span className="break-all text-sm text-accent-700">{site.contactEmail}</span>
        </a>

        <a
          href={site.author.github}
          target="_blank"
          rel="noopener noreferrer"
          className="card-interactive group flex flex-col gap-2"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-700 group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="font-semibold text-ink-900">GitHub</span>
          <span className="text-sm text-ink-500">
            Open an issue or browse the code behind the tools.
          </span>
        </a>
      </div>

      <div className="prose-site mt-10">
        <h2>What to include</h2>
        <p>
          To help us reproduce a problem quickly, please mention the name of the tool you were
          using, your browser and operating system, and the steps that led to the issue. If a file
          failed to convert, the file type and approximate size is useful.
        </p>
        <p>
          <strong>Please do not attach confidential files.</strong> We never need your actual
          document to investigate — a description of its type and size is enough, and because the
          tools run entirely in your browser we have no way to inspect your file regardless.
        </p>

        <h2>Suggesting a tool</h2>
        <p>
          Tool suggestions are welcome. The main constraint is that anything we add has to run
          fully in the browser without a server, so we can keep the no-upload promise. If you
          describe the task you are trying to complete rather than the specific implementation, we
          can usually find an approach that fits.
        </p>

        <h2>Response time</h2>
        <p>
          This site is maintained by one person alongside other work, so replies typically take a
          few days. Bug reports affecting a tool&apos;s correctness are prioritised.
        </p>

        <h2>Other pages</h2>
        <p>
          You may also want to read the <Link href="/about">about page</Link> for how the site is
          built, the <Link href="/privacy">privacy policy</Link> for how data is handled, or the{" "}
          <Link href="/terms">terms of use</Link>.
        </p>
      </div>
    </div>
  );
}
