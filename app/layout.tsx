import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Controle Financeiro Familiar",
  description: "Sistema completo para gerenciamento de despesas e receitas familiares",
  keywords: ["finanças", "despesas", "receitas", "controle", "família"],
  authors: [{ name: "Controle Financeiro Team" }],
  creator: "Controle Financeiro Team",
  publisher: "Controle Financeiro Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://controle-financeiro.vercel.app"),
  openGraph: {
    title: "Controle Financeiro Familiar",
    description: "Sistema completo para gerenciamento de despesas e receitas familiares",
    url: "https://controle-financeiro.vercel.app",
    siteName: "Controle Financeiro",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Controle Financeiro Familiar",
    description: "Sistema completo para gerenciamento de despesas e receitas familiares",
  },
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
