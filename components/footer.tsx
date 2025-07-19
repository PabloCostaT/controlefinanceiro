import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Controle de Despesas Familiares</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie e divida as despesas da casa entre os membros da família de forma simples e organizada.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 Controle de Despesas Familiares. Todos os direitos reservados.
            </p>
          </div>

          {/* Links Legais */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ajuda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">
                  Status do Sistema
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Informações Adicionais */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <div className="mb-2 md:mb-0">
            <span>Versão 1.0.0 • Última atualização: {new Date().toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Desenvolvido com ❤️ para famílias</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
