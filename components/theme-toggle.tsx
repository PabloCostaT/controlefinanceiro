"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Alternar tema" disabled>
        <Sun className="size-5" />
      </Button>
    )
  }

  const isDark = theme === "dark"
  return (
    <Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      <span className="sr-only">Alternar Tema</span>
    </Button>
  )
}
