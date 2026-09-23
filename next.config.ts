import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "allamericanasphaltpaving.com",
      },
      {
        protocol: "https",
        hostname: "gzcpjwutrzcpiykhwgpy.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/asphalt-paving-company-delray-beach-fl",
        destination: "/asphalt-paving-company-deray-beach-fl",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
