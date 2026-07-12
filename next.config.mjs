/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
      // onnxruntime-web (pulled in by @imgly/background-removal) ships a
      // broken "type" field in its package.json, which makes webpack guess
      // the wrong module format for some of its .js/.mjs bundles. Forcing
      // content-based detection avoids "import.meta"/"export" parse errors.
      config.module.rules.push({
        test: /onnxruntime-web/,
        type: "javascript/auto",
      });
      config.module.rules.push({
        test: /\.wasm$/,
        type: "asset/resource",
      });
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
