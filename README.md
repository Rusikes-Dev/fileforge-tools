# FileForge Tools — Free File Converter & Document Tools

A production-ready Next.js website with **38 working, browser-based tools**: image converters and compressors, PDF utilities, text cleanup tools and developer helpers. Every tool processes files **locally in the visitor's browser** — nothing is ever uploaded, so the site needs no backend, no database and no file storage, and runs entirely on free hosting tiers.

## Tools included (38)

| Category | Tools |
|---|---|
| **Image (13)** | JPG↔PNG, WebP↔JPG, PNG→WebP, Image Compressor, Compress JPG, Compress PNG, Image Resizer, Image Cropper, Image Rotator, Image→Base64, Base64→Image |
| **PDF (7)** | JPG→PDF, PNG→PDF, Merge PDF, Split PDF, Extract PDF Pages, Rotate PDF, PDF Page Counter |
| **Text (8)** | Word Counter, Character Counter, Case Converter, Remove Duplicate Lines, Sort Lines, Remove Extra Spaces, Find & Replace, Text Statistics |
| **Developer (10)** | JSON Formatter / Minifier / Validator, CSV↔JSON, URL Encoder/Decoder, Base64 Encoder/Decoder, UUID Generator, Password Generator, QR Code Generator |

There are **no placeholder or "coming soon" tools** — every listed tool works.

## Tech stack

- **Next.js 14 (App Router) + TypeScript (strict)** — static generation for every page
- **Tailwind CSS** — utility-first styling, custom neutral/teal design system
- **pdf-lib** — client-side PDF manipulation (dynamically imported, only on PDF pages)
- **qrcode** — client-side QR generation (dynamically imported)
- Native browser APIs (`canvas`, `createImageBitmap`, Web Crypto) for image processing and generators
- **Vitest** — unit tests for all pure conversion logic

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

Other commands:

```bash
npm run lint    # ESLint (next/core-web-vitals)
npm run test    # Vitest unit tests (tests/)
npm run build   # Production build — statically generates all ~50 pages
npm start       # Serve the production build locally
```

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, Open Graph, sitemap.xml and robots.txt | `http://localhost:3000` |
| `NEXT_PUBLIC_ADS_ENABLED` | Set to `true` to render reserved ad-slot placeholders. Off by default; the layout reserves height to prevent CLS when enabled. | `false` |

## Deploying to Vercel (free tier)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo. Vercel auto-detects Next.js; no build settings need changing.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com` (Production).
4. Deploy. All pages are statically generated at build time, so the site serves from Vercel's CDN with no serverless cost per tool use.
5. (Optional) Add your custom domain under **Settings → Domains** and re-set `NEXT_PUBLIC_SITE_URL` to match, then redeploy.

> **Neon / Render are not needed.** The original architecture allowed for a Postgres database and API backend, but since every Phase 1 tool is browser-side, there is no server component at all. If server-side tools are added later (e.g. video conversion), a Render service can be added without touching this codebase's structure — tool definitions already carry a `processing` field for that purpose.

## Architecture

```
lib/tools/types.ts        # ToolDef / CategoryDef interfaces
lib/tools/data/*.ts       # 38 tool definitions: slug, SEO content, FAQs, aliases, related
lib/tools/registry.ts     # lookups: by slug, by category, popular, related, search index
lib/converters/*.ts       # pure conversion logic (tested), UI-independent
components/tools/*        # client components per tool, lazy-loaded per slug
components/tools/ToolRenderer.tsx  # slug → component map (heavy libs never ship to other pages)
app/[slug]/page.tsx       # one route serves all 38 tools via generateStaticParams
app/{image,pdf,text,developer}-tools/  # category hub pages
app/sitemap.ts, app/robots.ts          # generated from the registry
```

**Adding a tool** means: (1) add a `ToolDef` to the right `lib/tools/data/*.ts` file, (2) build its client component, (3) add one line to the map in `ToolRenderer.tsx`. The page, metadata, sitemap entry, breadcrumbs, JSON-LD, search entry and related-tool links are generated automatically.

## SEO checklist (implemented)

- Unique `<title>`, meta description, H1 and intro per tool — no templated duplicate text
- Root-level tool URLs (`/jpg-to-pdf`), category hubs, `/tools` directory
- Canonical URLs and Open Graph/Twitter tags on every page
- JSON-LD: `WebSite` (home), `BreadcrumbList` + `WebApplication` + `FAQPage` (tool pages)
- `sitemap.xml` and `robots.txt` generated from the registry
- Visible breadcrumbs matching the structured data
- Every tool page: how-to steps, about section, 3+ FAQs, related tools, supported formats
- Fully static output — fast TTFB, no client-side rendering of content

## Security & privacy checklist (implemented)

- No file ever leaves the browser; no upload endpoints exist
- Security headers via `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`
- File validation (type + size limits) before processing; human-readable error messages
- Filenames sanitized before use in download names
- Password/UUID generation uses the Web Crypto API with rejection sampling (no modulo bias)
- No cookies, no tracking, no third-party scripts

## Testing

`tests/` covers the pure logic every tool relies on: page-range parsing (including the exact error messages), text counting/cleanup/sorting, RFC-4180 CSV parsing and JSON↔CSV round-trips, JSON error location and hints, UUID/password generation guarantees, and registry integrity (unique slugs, complete SEO content, no dangling related-tool references).

```bash
npm run test
```

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari ≥ 15). Tools rely on `createImageBitmap`, `canvas.toBlob`, `crypto.getRandomValues` and dynamic `import()` — all broadly supported since 2021.
