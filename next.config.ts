import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // A stray lockfile in the home directory otherwise wins root inference.
  outputFileTracingRoot: path.join(__dirname),
  // The homepage is the playable map: a static page in public/game.
  async rewrites() {
    return { beforeFiles: [{ source: '/', destination: '/game/index.html' }] }
  },
  // Every old résumé link resolves to the current PDF.
  async redirects() {
    return [
      { source: '/Benjamin_Kassan_Resume_August_2026.pdf', destination: '/Benjamin_Kassan_Resume.pdf', permanent: false },
      { source: '/resume', destination: '/Benjamin_Kassan_Resume.pdf', permanent: false },
      { source: '/resume.pdf', destination: '/Benjamin_Kassan_Resume.pdf', permanent: false },
      { source: '/game', destination: '/', permanent: false },
    ]
  },
}

export default nextConfig
