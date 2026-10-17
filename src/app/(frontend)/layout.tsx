import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Caveat, Instrument_Serif, Newsreader } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { getSite } from '@/components/notebook/getSite'
import { SiteFooter } from '@/components/notebook/SiteFooter'
import { SiteHeader } from '@/components/notebook/SiteHeader'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import './notebook.css'
import { getServerSideURL } from '@/utilities/getURL'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-caveat',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-newsreader',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const site = await getSite()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        caveat.variable,
        instrumentSerif.variable,
        newsreader.variable,
      )}
      lang="en"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="nb">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <SiteHeader name={site.name} email={site.email} />
          {children}
          <SiteFooter email={site.email} footerText={site.footerText} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'Portfolio',
  description: 'Hardware, software and 3D — all on one desk.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}