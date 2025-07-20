import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstall } from "@/components/pwa-install"
import { OfflineStatus } from "@/components/offline-status"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Controle Financeiro",
    template: "%s | Controle Financeiro",
  },
  description: "Sistema completo de controle de despesas e receitas familiares com funcionamento offline",
  keywords: ["controle financeiro", "despesas", "receitas", "orçamento", "família", "PWA"],
  authors: [{ name: "Controle Financeiro Team" }],
  creator: "Controle Financeiro",
  publisher: "Controle Financeiro",

  // PWA
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Controle Financeiro",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://controle-financeiro.vercel.app",
    siteName: "Controle Financeiro",
    title: "Controle Financeiro - Gerencie suas finanças familiares",
    description: "Sistema completo de controle de despesas e receitas familiares com funcionamento offline",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Controle Financeiro",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Controle Financeiro",
    description: "Sistema completo de controle de despesas e receitas familiares",
    images: ["/icons/icon-512x512.png"],
  },

  // Other
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  // Verification
  verification: {
    google: "google-site-verification-code",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Icons */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />

        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Controle Financeiro" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Microsoft specific */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Mobile specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" type="image/png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="finance-app-theme"
        >
          <OfflineStatus />
          {children}
          <PWAInstall />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
