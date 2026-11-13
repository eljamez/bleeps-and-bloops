import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ponytail: skip the generated AGENTS.md. This site has no agent runtime.
  agentRules: false,
};

export default nextConfig;
