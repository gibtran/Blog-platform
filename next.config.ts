import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["cloudinary"],
  images: {
    remotePatterns:[
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
