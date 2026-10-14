import type { NextConfig } from "next";

for (const name of Object.keys(process.env)) {
  if (/^NEXT_PUBLIC_.*(?:SECRET|PASSWORD|PRIVATE_KEY|ACCESS_TOKEN|REFRESH_TOKEN|API_KEY)$/i.test(name)) {
    throw new Error(`Secret-like configuration must not be exposed to browsers: ${name}`);
  }
}

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // End-to-end tests build into their own folder (see playwright.config.ts).
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  transpilePackages: ["@noirly-dev/ui"],
  async rewrites() {
    return [
      { source: '/visual-lab/traversal', destination: '/visual-lab/reverse-array' },
      { source: '/visual-lab/insert', destination: '/visual-lab/move-zeroes' },
      { source: '/visual-lab/delete', destination: '/visual-lab/remove-duplicates' },
      { source: '/visual-lab/searching', destination: '/visual-lab/binary-search' },
      { source: '/visual-lab/sorting', destination: '/visual-lab/bubble-sort' },
      { source: '/visual-lab/two-pointer', destination: '/visual-lab/two-sum-sorted' },
      { source: '/visual-lab/prefix-sum', destination: '/visual-lab/max-sum-size-k' },
    ];
  },
};

export default nextConfig;
