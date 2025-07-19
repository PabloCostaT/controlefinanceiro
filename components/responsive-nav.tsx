"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Receipt, TrendingUp, Wallet, Repeat, FolderOpen, Users, Shield } from "lucide-react"

interface ResponsiveNavProps {
  currentView: string
  onViewChange: (view: string) => void
  isServiceEnabled: (serviceId: string) => boolean
}

export function ResponsiveNav({ currentView, onViewChange, isServiceEnabled }: ResponsiveNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "add-expense", label: "Nova Despesa", icon: Receipt, serviceId: "expense-management" },
    { id: "main", label: "Dashboard", icon: TrendingUp, serviceId: "financial-dashboard" },
    { id: "wallet", label: "Carteira", icon: Wallet, serviceId: "wallet-management" },
    { id: "recurring", label: "Fixas", icon: Repeat, serviceId: "recurring-expenses" },
    { id: "projects", label: "Projetos", icon: FolderOpen, serviceId: "project-management" },
    { id: "expenses", label: "Despesas", icon: Receipt, serviceId: "expense-management" },
    { id: "members", label: "Membros", icon: Users, serviceId: "member-management" },
    { id: "admin", label: "Admin", icon: Shield, serviceId: "admin" },
  ].filter((item) => item.serviceId === "admin" || isServiceEnabled(item.serviceId))

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h2 className="text-lg sm:text-xl font-bold">💰 Despesas</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="flex items-center gap-2 h-8"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-6">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "default" : "ghost"}
                      onClick={() => handleNavClick(item.id)}
                      className="justify-start gap-3 h-10"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
