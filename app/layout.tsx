import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { ReactNode } from "react"

export const metadata = {
  title: "Controle Financeiro",
  description: "Gerencie suas despesas em qualquer dispositivo",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
