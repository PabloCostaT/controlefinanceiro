"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Receipt, Users, Wallet, Calendar, Settings, LogOut } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export function ResponsiveNav() {
  const [open, setOpen] = useState(false)

  const navItems: NavItem[] = [
    { label: "Início", href: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Despesas", href: "/despesas", icon: <Receipt className="h-5 w-5" /> },
    { label: "Membros", href: "/membros", icon: <Users className="h-5 w-5" /> },
    { label: "Carteira", href: "/carteira", icon: <Wallet className="h-5 w-5" /> },
    { label: "Despesas Fixas", href: "/despesas-fixas", icon: <Calendar className="h-5 w-5" /> },
    { label: "Configurações", href: "/configuracoes", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-16 items-center px-4 border-b bg-background">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Wallet className="h-6 w-6 text-primary" />
          <span>FinançaFamília</span>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 border-b bg-background">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Wallet className="h-6 w-6 text-primary" />
          <span>FinançaFamília</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <Button className="mt-4 gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
