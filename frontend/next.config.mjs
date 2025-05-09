/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    unoptimized: true,
    domains: ["via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables that should be available at build time
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  },
  // Configure for static export
  output: "export",
  distDir: "build",
  trailingSlash: true,
  basePath: "",
  assetPrefix: "/",

  // Disable image optimization warnings in development
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
