import type { NextConfig } from "next";

/**
 * Conservative security headers. No Content-Security-Policy is set here because the site uses
 * inlined Next.js runtime chunks and JSON-LD; a CSP needs nonce plumbing and staging verification,
 * not a blind switch-on. Everything below is safe to apply to every response.
 */
const isProduction = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // HSTS only in production: on localhost it would poison the browser for other local projects.
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/wiki/Special:FilePath/**",
      },
    ],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920],
  },
  experimental: {
    serverActions: {
      // Document uploads are capped at 10 MB by MAX_UPLOAD_BYTES; the framework default of 1 MB
      // would reject a legitimate PDF before the application's own validation ever ran.
      bodySizeLimit: "12mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin-preview", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
    ];
  },
};

export default nextConfig;
