"use client"

import { useState, useCallback } from "react"
import type { Invitation, EmailTemplate } from "../types/admin"

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "inv-1",
      email: "joao@exemplo.com",
      roleId: "member",
      token: "abc123def456",
      invitedBy: "admin-1",
      invitedAt: "2024-01-15T10:00:00Z",
      expiresAt: "2024-01-22T10:00:00Z",
      status: "pending",
      message: "Bem-vindo à nossa plataforma de gestão familiar!",
    },
    {
      id: "inv-2",
      email: "maria@exemplo.com",
      roleId: "manager",
      token: "xyz789uvw012",
      invitedBy: "admin-1",
      invitedAt: "2024-01-14T15:30:00Z",
      expiresAt: "2024-01-21T15:30:00Z",
      status: "accepted",
      acceptedAt: "2024-01-15T09:15:00Z",
      message: "Você foi convidado para ser gerente do sistema.",
    },
    {
      id: "inv-3",
      email: "pedro@exemplo.com",
      roleId: "viewer",
      token: "expired123",
      invitedBy: "admin-1",
      invitedAt: "2024-01-10T08:00:00Z",
      expiresAt: "2024-01-17T08:00:00Z",
      status: "expired",
      message: "Acesso de visualização para relatórios.",
    },
  ])

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: "invitation",
      name: "Convite de Usuário",
      subject: "Você foi convidado para {{SYSTEM_NAME}}",
      content: `
        <h2>Olá!</h2>
        <p>Você foi convidado por {{INVITED_BY}} para participar do {{SYSTEM_NAME}}.</p>
        <p><strong>Função:</strong> {{ROLE_NAME}}</p>
        {{#if MESSAGE}}
        <p><strong>Mensagem:</strong> {{MESSAGE}}</p>
        {{/if}}
        <p>Para aceitar o convite, clique no link abaixo:</p>
        <a href="{{INVITATION_LINK}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Aceitar Convite
        </a>
        <p><small>Este convite expira em {{EXPIRES_AT}}.</small></p>
        <p><small>Se você não solicitou este convite, pode ignorar este email.</small></p>
      `,
      variables: ["SYSTEM_NAME", "INVITED_BY", "ROLE_NAME", "MESSAGE", "INVITATION_LINK", "EXPIRES_AT"],
    },
  ])

  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const createInvitation = useCallback(
    (data: {
      email: string
      roleId: string
      invitedBy: string
      message?: string
      expiresInDays?: number
    }) => {
      const expiresInDays = data.expiresInDays || 7
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      const invitation: Invitation = {
        id: `inv-${Date.now()}`,
        email: data.email,
        roleId: data.roleId,
        token: generateToken(),
        invitedBy: data.invitedBy,
        invitedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: "pending",
        message: data.message,
      }

      setInvitations((prev) => [invitation, ...prev])
      return invitation
    },
    [],
  )

  const cancelInvitation = useCallback((invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: "cancelled" as const } : inv)),
    )
  }, [])

  const resendInvitation = useCallback((invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.id === invitationId) {
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 7)
          return {
            ...inv,
            token: generateToken(),
            invitedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            status: "pending" as const,
          }
        }
        return inv
      }),
    )
  }, [])

  const acceptInvitation = useCallback(
    (token: string, userData: { name: string; password: string }) => {
      const invitation = invitations.find((inv) => inv.token === token && inv.status === "pending")
      if (!invitation) {
        throw new Error("Convite inválido ou expirado")
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        setInvitations((prev) =>
          prev.map((inv) => (inv.id === invitation.id ? { ...inv, status: "expired" as const } : inv)),
        )
        throw new Error("Convite expirado")
      }

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitation.id
            ? { ...inv, status: "accepted" as const, acceptedAt: new Date().toISOString() }
            : inv,
        ),
      )

      return {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: invitation.email,
        roleId: invitation.roleId,
        customPermissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    },
    [invitations],
  )

  const getInvitationByToken = useCallback(
    (token: string) => {
      return invitations.find((inv) => inv.token === token)
    },
    [invitations],
  )

  const getPendingInvitations = useCallback(() => {
    return invitations.filter((inv) => inv.status === "pending")
  }, [invitations])

  const getExpiredInvitations = useCallback(() => {
    return invitations.filter((inv) => inv.status === "pending" && new Date() > new Date(inv.expiresAt))
  }, [invitations])

  const sendEmail = useCallback(
    async (invitation: Invitation, roleName: string, invitedByName: string) => {
      // Simulação de envio de email
      const template = emailTemplates.find((t) => t.id === "invitation")
      if (!template) throw new Error("Template não encontrado")

      const invitationLink = `${window.location.origin}/convite/${invitation.token}`
      const expiresAt = new Date(invitation.expiresAt).toLocaleDateString("pt-BR")

      const emailContent = template.content
        .replace(/{{SYSTEM_NAME}}/g, "Sistema de Gestão Familiar")
        .replace(/{{INVITED_BY}}/g, invitedByName)
        .replace(/{{ROLE_NAME}}/g, roleName)
        .replace(/{{MESSAGE}}/g, invitation.message || "")
        .replace(/{{INVITATION_LINK}}/g, invitationLink)
        .replace(/{{EXPIRES_AT}}/g, expiresAt)

      // Simular delay de envio
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Email enviado:", {
        to: invitation.email,
        subject: template.subject.replace(/{{SYSTEM_NAME}}/g, "Sistema de Gestão Familiar"),
        content: emailContent,
      })

      return true
    },
    [emailTemplates],
  )

  return {
    invitations,
    emailTemplates,
    createInvitation,
    cancelInvitation,
    resendInvitation,
    acceptInvitation,
    getInvitationByToken,
    getPendingInvitations,
    getExpiredInvitations,
    sendEmail,
  }
}
