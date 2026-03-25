import type { NextConfig } from "next";

const repoBasePath = process.env.NODE_ENV === "production" ? "/euro-asset" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repoBasePath,
  assetPrefix: repoBasePath,
  typedRoutes: false
};

export default nextConfig;
