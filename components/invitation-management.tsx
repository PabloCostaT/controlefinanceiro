"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Mail,
  UserPlus,
  Send,
  Copy,
  RefreshCw,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react"
import { useInvitations } from "../hooks/useInvitations"
import { usePermissions } from "../hooks/usePermissions"
import { toast } from "@/hooks/use-toast"

export function InvitationManagement() {
  const {
    invitations,
    createInvitation,
    cancelInvitation,
    resendInvitation,
    getPendingInvitations,
    getExpiredInvitations,
    sendEmail,
  } = useInvitations()

  const { roles, getRoleById } = usePermissions()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newInvitation, setNewInvitation] = useState({
    email: "",
    roleId: "",
    message: "",
    expiresInDays: 7,
  })

  const handleCreateInvitation = async () => {
    if (!newInvitation.email || !newInvitation.roleId) {
      toast({
        title: "Erro",
        description: "Email e função são obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const invitation = createInvitation({
        ...newInvitation,
        invitedBy: "admin-1", // Em um sistema real, seria o ID do usuário logado
      })

      const role = getRoleById(newInvitation.roleId)
      await sendEmail(invitation, role?.name || "Usuário", "Administrador")

      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${newInvitation.email}`,
      })

      setNewInvitation({ email: "", roleId: "", message: "", expiresInDays: 7 })
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar convite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvitation = async (invitationId: string) => {
    setIsLoading(true)
    try {
      resendInvitation(invitationId)
      const invitation = invitations.find((inv) => inv.id === invitationId)
      if (invitation) {
        const role = getRoleById(invitation.roleId)
        await sendEmail(invitation, role?.name || "Usuário", "Administrador")
      }

      toast({
        title: "Convite reenviado!",
        description: "O convite foi reenviado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao reenviar convite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitation(invitationId)
    toast({
      title: "Convite cancelado",
      description: "O convite foi cancelado com sucesso",
    })
  }

  const copyInvitationLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copiado!",
      description: "Link do convite copiado para a área de transferência",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <X className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      accepted: "default",
      expired: "destructive",
      cancelled: "secondary",
    } as const

    const labels = {
      pending: "Pendente",
      accepted: "Aceito",
      expired: "Expirado",
      cancelled: "Cancelado",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const pendingInvitations = getPendingInvitations()
  const expiredInvitations = getExpiredInvitations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Convites</h3>
          <p className="text-sm text-muted-foreground">Envie convites para novos usuários</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Enviar Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Convite</DialogTitle>
              <DialogDescription>Convide um novo usuário para o sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvitation.email}
                  onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                  placeholder="usuario@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={newInvitation.roleId}
                  onValueChange={(value) => setNewInvitation({ ...newInvitation, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expires">Expira em (dias)</Label>
                <Select
                  value={newInvitation.expiresInDays.toString()}
                  onValueChange={(value) =>
                    setNewInvitation({ ...newInvitation, expiresInDays: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={newInvitation.message}
                  onChange={(e) => setNewInvitation({ ...newInvitation, message: e.target.value })}
                  placeholder="Adicione uma mensagem personalizada..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInvitation} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pendentes</p>
                <p className="text-2xl font-bold">{pendingInvitations.length}</p>
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
                <p className="text-2xl font-bold">{invitations.filter((inv) => inv.status === "accepted").length}</p>
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
                <p className="text-2xl font-bold">{expiredInvitations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{invitations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convites Enviados
          </CardTitle>
          <CardDescription>Gerencie todos os convites enviados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => {
                const role = getRoleById(invitation.roleId)
                const isExpired = new Date() > new Date(invitation.expiresAt)

                return (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {invitation.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={role?.color || "bg-gray-100 text-gray-800"}>
                        {role?.name || "Função não encontrada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(isExpired && invitation.status === "pending" ? "expired" : invitation.status)}
                        {getStatusBadge(isExpired && invitation.status === "pending" ? "expired" : invitation.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invitation.invitedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invitation.expiresAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyInvitationLink(invitation.token)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {invitation.status === "pending" && !isExpired && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(invitation.id)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCancelInvitation(invitation.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
