/** @type {import('next').NextConfig} */

/**
 * Content Security Policy.
 *
 * Deliberately scoped to directives that carry real protection without risking
 * breakage that cannot be verified without a browser:
 *
 *  - `object-src 'none'` and `base-uri 'self'` close off two classic XSS
 *    escalation paths (legacy plugin embeds, and <base> tag hijacking that
 *    silently redirects every relative URL on the page).
 *  - `frame-ancestors 'none'` is the modern replacement for X-Frame-Options and
 *    blocks clickjacking.
 *  - `form-action 'self'` stops an injected form posting user input off-site.
 *
 * NOTE: `default-src` is intentionally omitted. It acts as the fallback for
 * script-src, connect-src, img-src, style-src and font-src, so setting it to
 * 'self' would silently block the AdSense tag, Vercel Analytics beacons and the
 * pdf.js blob worker — a change that builds cleanly and only fails in
 * production. Locking those down properly requires an explicit per-directive
 * allowlist validated under Content-Security-Policy-Report-Only first; see the
 * roadmap note in the final report.
 */
const csp = [
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // The tools need none of these. Denying them means a compromised
    // third-party script cannot reach for them either.
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Trailing-slash behaviour must be explicit, otherwise /merge-pdf and
  // /merge-pdf/ can both resolve and split ranking signals between them.
  trailingSlash: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The vendored pdf.js worker is content-addressed by release and never
        // mutates, so it can be cached indefinitely.
        source: "/pdfjs/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // pptxgenjs references Node built-ins (fs/https/http) for its Node build.
      // They're unused in the browser, so strip the node: scheme and stub them
      // out of the client bundle.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        url: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
