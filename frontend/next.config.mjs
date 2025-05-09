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
  }, // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://cropgain-backend.onrender.com",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://cropgain-backend.onrender.com",
    NODE_ENV: process.env.NODE_ENV || "production",
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
