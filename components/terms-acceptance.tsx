"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Shield, Eye, Users, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface TermsAcceptanceProps {
  onAcceptanceChange: (accepted: boolean) => void
  accepted: boolean
  required?: boolean
}

export function TermsAcceptance({ onAcceptanceChange, accepted, required = true }: TermsAcceptanceProps) {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const termsHighlights = [
    {
      icon: <Users className="h-4 w-4" />,
      title: "Controle Familiar",
      description: "Gerencie despesas e divida custos entre membros da família",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Segurança",
      description: "Seus dados financeiros são protegidos com criptografia",
    },
    {
      icon: <Eye className="h-4 w-4" />,
      title: "Transparência",
      description: "Relatórios claros sobre gastos e divisões",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Responsabilidades",
      description: "Uso adequado da plataforma e veracidade dos dados",
    },
  ]

  const privacyHighlights = [
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Proteção LGPD",
      description: "Conformidade total com a Lei Geral de Proteção de Dados",
    },
    {
      icon: <Eye className="h-4 w-4" />,
      title: "Seus Direitos",
      description: "Acesso, correção, exclusão e portabilidade dos seus dados",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Não Vendemos",
      description: "Seus dados nunca são vendidos para terceiros",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Transparência",
      description: "Informações claras sobre coleta e uso de dados",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Resumo dos Documentos */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-800">
              <FileText className="mr-2 h-4 w-4" />
              Termos de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {termsHighlights.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="text-blue-600 mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-xs font-medium text-blue-800">{item.title}</p>
                  <p className="text-xs text-blue-600">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-800">
              <Shield className="mr-2 h-4 w-4" />
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {privacyHighlights.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="text-green-600 mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-xs font-medium text-green-800">{item.title}</p>
                  <p className="text-xs text-green-600">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Checkbox de Aceitação */}
      <Card
        className={`border-2 ${accepted ? "border-green-200 bg-green-50" : required ? "border-red-200 bg-red-50" : "border-gray-200"}`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms-acceptance" checked={accepted} onCheckedChange={onAcceptanceChange} className="mt-1" />
            <div className="space-y-2 flex-1">
              <label
                htmlFor="terms-acceptance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Aceito os documentos legais {required && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-muted-foreground">
                Li e concordo com os{" "}
                <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800">
                      Termos de Uso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Resumo dos Termos de Uso
                      </DialogTitle>
                      <DialogDescription>Principais pontos dos nossos termos de uso</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4">
                        {termsHighlights.map((item, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center">
                                {item.icon}
                                <span className="ml-2">{item.title}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                        <div className="pt-4">
                          <Link href="/termos" target="_blank">
                            <Button variant="outline" className="w-full bg-transparent">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver Termos Completos
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>{" "}
                e a{" "}
                <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-xs text-green-600 hover:text-green-800">
                      Política de Privacidade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Resumo da Política de Privacidade
                      </DialogTitle>
                      <DialogDescription>Como protegemos e tratamos seus dados pessoais</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4">
                        {privacyHighlights.map((item, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center">
                                {item.icon}
                                <span className="ml-2">{item.title}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                        <div className="pt-4">
                          <Link href="/privacidade" target="_blank">
                            <Button variant="outline" className="w-full bg-transparent">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver Política Completa
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </p>

              {accepted && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">Documentos aceitos com sucesso!</AlertDescription>
                </Alert>
              )}

              {required && !accepted && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    É necessário aceitar os termos para continuar.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Diretos */}
      <div className="flex justify-center space-x-4 text-xs">
        <Link href="/termos" target="_blank" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FileText className="mr-1 h-3 w-3" />
          Termos Completos
        </Link>
        <Link href="/privacidade" target="_blank" className="text-green-600 hover:text-green-800 flex items-center">
          <Shield className="mr-1 h-3 w-3" />
          Privacidade Completa
        </Link>
      </div>
    </div>
  )
}
