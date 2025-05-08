/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    BACKEND_URL:
      process.env.BACKEND_URL || "https://cropgain-backend.onrender.com",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
