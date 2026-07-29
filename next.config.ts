import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // A stray lockfile in the home directory otherwise wins root inference.
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
