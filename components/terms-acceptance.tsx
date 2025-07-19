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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield, Users, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface TermsAcceptanceProps {
  onAccept: (accepted: boolean) => void
  required?: boolean
  showFullTerms?: boolean
}

export function TermsAcceptance({ onAccept, required = true, showFullTerms = false }: TermsAcceptanceProps) {
  const [accepted, setAccepted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAcceptanceChange = (checked: boolean) => {
    setAccepted(checked)
    onAccept(checked)
  }

  const termsHighlights = [
    {
      icon: Users,
      title: "Uso Familiar",
      description: "Plataforma destinada ao uso pessoal e familiar para gestão de despesas",
    },
    {
      icon: Shield,
      title: "Proteção de Dados",
      description: "Seus dados são protegidos conforme a LGPD e nunca compartilhados sem consentimento",
    },
    {
      icon: FileText,
      title: "Gratuito",
      description: "Serviço gratuito com funcionalidades completas para gestão financeira familiar",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Resumo dos Termos */}
      {showFullTerms && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Principais Pontos dos Termos</h3>
            </div>
            <div className="grid gap-3">
              {termsHighlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">{item.title}</p>
                    <p className="text-blue-700 text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checkbox de Aceitação */}
      <div className="flex items-start space-x-3">
        <Checkbox id="terms-acceptance" checked={accepted} onCheckedChange={handleAcceptanceChange} className="mt-1" />
        <div className="space-y-2">
          <label
            htmlFor="terms-acceptance"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {required && <span className="text-red-500">* </span>}
            Li e concordo com os{" "}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                  Termos de Uso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Termos de Uso
                  </DialogTitle>
                  <DialogDescription>
                    Leia atentamente os termos e condições de uso da nossa plataforma
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6">
                    {/* Resumo Executivo */}
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Resumo Executivo</h3>
                        </div>
                        <p className="text-blue-800 text-sm mb-3">
                          Este documento estabelece os termos para uso da nossa plataforma de gestão de despesas
                          familiares.
                        </p>
                        <div className="grid gap-2">
                          {termsHighlights.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <item.icon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-800">
                                {item.title}: {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seções Principais */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">1. Aceitação dos Termos</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          Ao usar nossa plataforma, você concorda com estes termos e declara que:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
                          <li>Tem pelo menos 18 anos ou autorização dos responsáveis</li>
                          <li>Fornecerá informações verdadeiras e atualizadas</li>
                          <li>Usará a plataforma de forma legal e responsável</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">2. Descrição do Serviço</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          Nossa plataforma oferece ferramentas gratuitas para:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
                          <li>Registro e categorização de despesas</li>
                          <li>Gestão de membros da família</li>
                          <li>Controle de carteiras e contas</li>
                          <li>Relatórios e análises financeiras</li>
                          <li>Despesas recorrentes e projetos</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">3. Privacidade e Proteção de Dados</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Seus dados estão protegidos</span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-green-700 space-y-1 ml-4">
                            <li>Coletamos apenas dados necessários para o serviço</li>
                            <li>Nunca vendemos ou compartilhamos com terceiros</li>
                            <li>Você pode acessar, corrigir ou excluir seus dados</li>
                            <li>Cumprimos integralmente a LGPD</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">4. Responsabilidades</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-1">✓ Suas Responsabilidades:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
                              <li>Manter credenciais seguras</li>
                              <li>Usar apenas para fins legítimos</li>
                              <li>Manter informações atualizadas</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-700 mb-1">✓ Nossas Responsabilidades:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
                              <li>Manter a plataforma funcionando</li>
                              <li>Proteger seus dados</li>
                              <li>Fornecer suporte quando necessário</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">5. Modificações</h3>
                        <p className="text-sm text-slate-600">
                          Podemos modificar estes termos com aviso prévio de 30 dias. Você será notificado por email e
                          através da plataforma.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-slate-600 mb-2">Para ver os termos completos e detalhados:</p>
                      <Link href="/termos" target="_blank">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Termos Completos
                        </Button>
                      </Link>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      handleAcceptanceChange(true)
                      setDialogOpen(false)
                    }}
                    disabled={accepted}
                  >
                    {accepted ? "Já Aceito" : "Aceitar Termos"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>{" "}
            e{" "}
            <Link href="/privacidade" className="text-blue-600 underline">
              Política de Privacidade
            </Link>
          </label>

          {required && !accepted && (
            <p className="text-xs text-red-500">É necessário aceitar os termos para continuar</p>
          )}
        </div>
      </div>

      {/* Link para termos completos */}
      <div className="text-xs text-slate-500">
        <Link href="/termos" target="_blank" className="flex items-center gap-1 hover:text-slate-700">
          <ExternalLink className="h-3 w-3" />
          Ver termos completos em nova aba
        </Link>
      </div>
    </div>
  )
}
