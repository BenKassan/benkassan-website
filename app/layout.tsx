import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google'

import { QaFlat } from '@/components/QaFlat'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-jb',
  display: 'swap',
})

const SITE = 'https://benjaminkassan.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Benjamin Kassan — Strategy & applied AI systems',
    template: '%s — Benjamin Kassan',
  },
  description:
    'Strategy consultant and systems builder. AI due diligence and value creation at PwC Strategy&; designer of Radar Autonomy, a decision system for autonomous-fleet depot infrastructure.',
  openGraph: {
    title: 'Benjamin Kassan — Strategy & applied AI systems',
    description:
      'AI due diligence and value creation at PwC Strategy&. Builder of agent-run software systems, including Radar Autonomy.',
    url: SITE,
    siteName: 'Benjamin Kassan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ben_kassan',
  },
  alternates: { canonical: SITE },
}

export const viewport: Viewport = {
  themeColor: '#08090b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrument.variable} ${mono.variable}`}
    >
      <body>
        <QaFlat />
        {children}
      </body>
    </html>
  )
}
