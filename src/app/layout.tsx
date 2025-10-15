import '@/styles/globals.css'
// import '@/styles/webview-compat-enhanced.css'

import type { Metadata, Viewport } from 'next'
import { type ReactNode } from 'react'

import { Suspense } from 'react'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { ThemeInitializer } from '@/components/theme-initializer'
import { WebViewStatus } from '@/components/webview-status'

export const metadata: Metadata = {
  title: {
    default: 'Kuji - Random Decision Maker',
    template: '%s · Kuji',
  },
  description:
    'Interactive decision-making app that helps you make choices through a fun, lottery-style experience. Create multiple decision lists, customize probabilities, and reveal your fate by scratching cards.',
  applicationName: 'Kuji',
  keywords: ['utilities', 'productivity', 'lifestyle', 'entertainment', 'personalization'],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    {
      name: 'Pedro Bueno',
      url: 'https://github.com/pedrol2b',
    },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kuji',
    startupImage: [
      {
        url: '/icon-512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/icon-192.png'],
    apple: ['/apple-touch-icon.png'],
  },
  openGraph: {
    type: 'website',
    siteName: 'Kuji',
    title: 'Kuji - Random Decision Maker',
    description:
      'Interactive decision-making app that helps you make choices through a fun, lottery-style experience. Create multiple decision lists, customize probabilities, and reveal your fate by scratching cards.',
    url: '/',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Kuji app icon',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuji - Random Decision Maker',
    description:
      'Interactive decision-making app that helps you make choices through a fun, lottery-style experience. Create multiple decision lists, customize probabilities, and reveal your fate by scratching cards.',
    images: ['/icon-512.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning dir="ltr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Kuji" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kuji" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeInitializer />
        <WebViewStatus />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
