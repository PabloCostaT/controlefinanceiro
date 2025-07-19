"use client"

import { Heart, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo e Descrição */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Controle Familiar</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie as finanças da sua família de forma simples e organizada.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-3">
            <h4 className="font-medium">Links Rápidos</h4>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Nova Despesa
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Dashboard
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Relatórios
              </Button>
            </div>
          </div>

          {/* Suporte */}
          <div className="space-y-3">
            <h4 className="font-medium">Suporte</h4>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <Mail className="h-3 w-3 mr-2" />
                Contato
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <Phone className="h-3 w-3 mr-2" />
                Ajuda
              </Button>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-medium">Legal</h4>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Privacidade
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Termos de Uso
              </Button>
            </div>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t mt-6 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} Controle Familiar. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>para famílias</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
