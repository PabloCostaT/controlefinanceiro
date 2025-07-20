"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Trash2,
  Crown,
  Shield,
  User,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { usePermissions } from "../hooks/usePermissions"
import { toast } from "@/hooks/use-toast"

export function InvitationManagement() {
  const { invitations, roles, currentUser, canInviteRole, createInvitation, cancelInvitation, resendInvitation } =
    usePermissions()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    roleId: "",
    message: "",
  })

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "super_admin":
        return <Crown className="h-4 w-4 text-red-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "user":
        return <User className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aceito
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleCreateInvitation = () => {
    if (!formData.email || !formData.roleId) return

    createInvitation({
      email: formData.email,
      roleId: formData.roleId,
      message: formData.message || undefined,
    })

    setFormData({ email: "", roleId: "", message: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "Convite enviado",
      description: `Convite enviado para ${formData.email}`,
    })
  }

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/convite/${token}`
    navigator.clipboard.writeText(inviteUrl)

    toast({
      title: "Link copiado",
      description: "Link do convite copiado para a área de transferência",
    })
  }

  const handleResendInvitation = (invitationId: string) => {
    resendInvitation(invitationId)

    toast({
      title: "Convite reenviado",
      description: "Um novo convite foi enviado",
    })
  }

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitation(invitationId)

    toast({
      title: "Convite cancelado",
      description: "O convite foi cancelado com sucesso",
    })
  }

  const availableRoles = roles.filter((role) => canInviteRole(currentUser, role.id))

  const invitationStats = {
    total: invitations.length,
    pending: invitations.filter((i) => i.status === "pending").length,
    accepted: invitations.filter((i) => i.status === "accepted").length,
    expired: invitations.filter((i) => i.status === "expired").length,
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Convites</h3>
          <p className="text-sm text-muted-foreground">
            Envie convites para novos usuários e gerencie convites pendentes
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Convite</DialogTitle>
              <DialogDescription>Convide um novo usuário para se juntar ao sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, roleId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role.id)}
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Adicione uma mensagem personalizada ao convite..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInvitation}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{invitationStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{invitationStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Aceitos</p>
                <p className="text-2xl font-bold text-green-600">{invitationStats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Expirados</p>
                <p className="text-2xl font-bold text-red-600">{invitationStats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Convites ({invitations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum convite enviado ainda</p>
                <p className="text-sm">Clique em "Novo Convite" para começar</p>
              </div>
            ) : (
              invitations.map((invitation) => {
                const role = roles.find((r) => r.id === invitation.roleId)
                const expired = isExpired(invitation.expiresAt)
                const canResend = invitation.status === "pending" || invitation.status === "expired"
                const canCancel = invitation.status === "pending"

                return (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{invitation.email}</span>
                        {role && (
                          <div className="flex items-center gap-1">
                            {getRoleIcon(role.id)}
                            <Badge className={role.color}>{role.name}</Badge>
                          </div>
                        )}
                        {getStatusBadge(invitation.status)}
                        {expired && invitation.status === "pending" && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" title="Convite expirado" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Enviado em {new Date(invitation.invitedAt).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expira em {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}
                        </div>
                        {invitation.acceptedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Aceito em {new Date(invitation.acceptedAt).toLocaleDateString("pt-BR")}
                          </div>
                        )}
                      </div>
                      {invitation.message && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <strong>Mensagem:</strong> {invitation.message}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyInviteLink(invitation.token)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`/convite/${invitation.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Abrir Link
                            </a>
                          </DropdownMenuItem>
                          {canResend && (
                            <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reenviar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {canCancel && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancelar Convite</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja cancelar o convite para "{invitation.email}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Não</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancelInvitation(invitation.id)}>
                                    Sim, Cancelar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
