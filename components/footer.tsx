import Link from "next/link"
import { Wallet } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-lg mb-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span>FinançaFamília</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Simplifique o controle financeiro da sua família com nossa plataforma intuitiva de gerenciamento de
              despesas.
            </p>
          </div>

          {/* Links Legais */}
          <div className="space-y-3">
            <h3 className="font-medium">Legal</h3>
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

          {/* Links de Suporte */}
          <div className="space-y-3">
            <h3 className="font-medium">Suporte</h3>
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

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {currentYear} FinançaFamília. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">Versão 1.0.0 | Atualizado em 19/07/2024</p>
        </div>
      </div>
    </footer>
  )
}
