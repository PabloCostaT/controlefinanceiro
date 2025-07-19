"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TermsAcceptance } from "@/components/terms-acceptance"
import { CheckCircle, XCircle, Clock, Mail, User, Shield, AlertTriangle, Loader2 } from "lucide-react"

interface InviteData {
  id: string
  email: string
  role: string
  invitedBy: string
  expiresAt: string
  status: "pending" | "accepted" | "expired" | "cancelled"
  message?: string
}

export default function ConvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  })

  // Simular carregamento do convite
  useEffect(() => {
    const loadInvite = async () => {
      setLoading(true)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular dados do convite baseado no token
      const mockInvite: InviteData = {
        id: token,
        email: "usuario@exemplo.com",
        role: "Membro",
        invitedBy: "João Silva",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        message: "Bem-vindo à nossa família! Você foi convidado para gerenciar nossas despesas juntos.",
      }

      // Simular diferentes estados baseado no token
      if (token === "expired") {
        mockInvite.status = "expired"
        mockInvite.expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      } else if (token === "cancelled") {
        mockInvite.status = "cancelled"
      } else if (token === "accepted") {
        mockInvite.status = "accepted"
      }

      setInvite(mockInvite)
      setLoading(false)
    }

    if (token) {
      loadInvite()
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      setError("Você deve aceitar os termos de uso para continuar")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Simular criação da conta
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular sucesso
      router.push("/login?message=Conta criada com sucesso! Faça login para continuar.")
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "accepted":
        return "Aceito"
      case "expired":
        return "Expirado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Pendente"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">Verificando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-900">Convite Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-700 mb-4">O link do convite é inválido ou não foi encontrado.</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estados não-pendentes
  if (invite.status !== "pending") {
    const isExpired = invite.status === "expired"
    const isCancelled = invite.status === "cancelled"
    const isAccepted = invite.status === "accepted"

    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isExpired
            ? "from-red-50 to-pink-100"
            : isCancelled
              ? "from-gray-50 to-slate-100"
              : "from-green-50 to-emerald-100"
        } flex items-center justify-center`}
      >
        <Card
          className={`w-full max-w-md ${
            isExpired ? "border-red-200" : isCancelled ? "border-gray-200" : "border-green-200"
          }`}
        >
          <CardHeader className="text-center">
            {getStatusIcon(invite.status)}
            <CardTitle className={isExpired ? "text-red-900" : isCancelled ? "text-gray-900" : "text-green-900"}>
              {isExpired ? "Convite Expirado" : isCancelled ? "Convite Cancelado" : "Convite Já Aceito"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className={`mb-4 ${isExpired ? "text-red-700" : isCancelled ? "text-gray-700" : "text-green-700"}`}>
              {isExpired
                ? "Este convite expirou e não pode mais ser usado."
                : isCancelled
                  ? "Este convite foi cancelado pelo administrador."
                  : "Este convite já foi aceito anteriormente."}
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              {isAccepted ? "Fazer Login" : "Voltar ao Início"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado pendente - mostrar formulário
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Você foi convidado!</h1>
          <p className="text-slate-600">Complete seu cadastro para começar a usar a plataforma</p>
        </div>

        {/* Informações do Convite */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="h-5 w-5" />
              Detalhes do Convite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Email:</span>
              <span className="font-medium text-blue-900">{invite.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Função:</span>
              <Badge variant="secondary">{invite.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Convidado por:</span>
              <span className="font-medium text-blue-900">{invite.invitedBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Status:</span>
              <Badge className={getStatusColor(invite.status)}>
                {getStatusIcon(invite.status)}
                <span className="ml-1">{getStatusText(invite.status)}</span>
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Expira em:</span>
              <span className="font-medium text-blue-900">
                {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {invite.message && (
              <div className="pt-2 border-t border-blue-200">
                <p className="text-blue-800 italic">"{invite.message}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Cadastro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Complete seu Cadastro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={invite.email} disabled className="bg-gray-50" />
                <p className="text-xs text-slate-500 mt-1">
                  Este email foi definido no convite e não pode ser alterado
                </p>
              </div>

              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Crie uma senha segura"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              {/* Aceitação dos Termos */}
              <div className="pt-4 border-t">
                <TermsAcceptance onAccept={setTermsAccepted} required={true} showFullTerms={true} />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={submitting || !termsAccepted}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando Conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Seus dados estão seguros</h3>
                <p className="text-green-700 text-sm">
                  Utilizamos criptografia avançada e seguimos as melhores práticas de segurança para proteger suas
                  informações pessoais e financeiras.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
