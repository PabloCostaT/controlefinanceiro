"use client"

import { useState, useCallback, useMemo } from "react"
import type { Permission, Role, User, Invitation } from "@/types/admin"

// Definição completa de permissões
const defaultPermissions: Permission[] = [
  // Read permissions
  {
    id: "read_expenses",
    name: "Ver Despesas",
    description: "Visualizar despesas próprias e da família",
    category: "read",
    resource: "expenses",
  },
  {
    id: "read_projects",
    name: "Ver Projetos",
    description: "Visualizar projetos e suas despesas",
    category: "read",
    resource: "projects",
  },
  {
    id: "read_reports",
    name: "Ver Relatórios",
    description: "Acessar relatórios financeiros",
    category: "read",
    resource: "reports",
  },
  {
    id: "read_members",
    name: "Ver Membros",
    description: "Visualizar lista de membros da família",
    category: "read",
    resource: "members",
  },

  // Write permissions
  {
    id: "write_expenses",
    name: "Gerenciar Despesas",
    description: "Criar, editar e excluir despesas",
    category: "write",
    resource: "expenses",
  },
  {
    id: "write_projects",
    name: "Gerenciar Projetos",
    description: "Criar e gerenciar projetos",
    category: "write",
    resource: "projects",
  },
  {
    id: "write_members",
    name: "Gerenciar Membros",
    description: "Convidar e gerenciar membros",
    category: "write",
    resource: "members",
  },
  {
    id: "write_recurring",
    name: "Despesas Recorrentes",
    description: "Gerenciar despesas recorrentes",
    category: "write",
    resource: "recurring",
  },

  // Admin permissions
  {
    id: "admin_users",
    name: "Administrar Usuários",
    description: "Gerenciar usuários e permissões",
    category: "admin",
    resource: "users",
  },
  {
    id: "admin_roles",
    name: "Administrar Funções",
    description: "Gerenciar funções e permissões",
    category: "admin",
    resource: "roles",
  },
  {
    id: "admin_invitations",
    name: "Gerenciar Convites",
    description: "Enviar e gerenciar convites",
    category: "admin",
    resource: "invitations",
  },

  // System permissions
  {
    id: "system_settings",
    name: "Configurações do Sistema",
    description: "Alterar configurações globais",
    category: "system",
    resource: "settings",
  },
  {
    id: "system_services",
    name: "Gerenciar Serviços",
    description: "Habilitar/desabilitar funcionalidades",
    category: "system",
    resource: "services",
  },
  {
    id: "system_maintenance",
    name: "Modo Manutenção",
    description: "Controlar modo de manutenção",
    category: "system",
    resource: "maintenance",
  },
]

// Definição de funções com hierarquia
const defaultRoles: Role[] = [
  {
    id: "super_admin",
    name: "Super Usuário",
    description: "Acesso total ao sistema com todas as permissões",
    permissions: defaultPermissions.map((p) => p.id), // Todas as permissões
    isSystem: true,
    color: "bg-red-100 text-red-800 border-red-200",
    level: 1,
  },
  {
    id: "admin",
    name: "Administrador",
    description: "Gerencia usuários e configurações, sem acesso ao sistema",
    permissions: [
      "read_expenses",
      "read_projects",
      "read_reports",
      "read_members",
      "write_expenses",
      "write_projects",
      "write_members",
      "write_recurring",
      "admin_users",
      "admin_roles",
      "admin_invitations",
    ],
    isSystem: true,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    level: 2,
  },
  {
    id: "user",
    name: "Usuário",
    description: "Acesso básico às funcionalidades principais",
    permissions: ["read_expenses", "read_projects", "read_reports", "read_members", "write_expenses"],
    isSystem: true,
    color: "bg-green-100 text-green-800 border-green-200",
    level: 3,
  },
]

// Usuários iniciais para demonstração
const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Super Admin",
    email: "super@example.com",
    roleId: "super_admin",
    customPermissions: [],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-20T10:30:00Z",
  },
  {
    id: "user-2",
    name: "João Silva",
    email: "joao@example.com",
    roleId: "admin",
    customPermissions: [],
    isActive: true,
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-19T15:45:00Z",
  },
  {
    id: "user-3",
    name: "Maria Santos",
    email: "maria@example.com",
    roleId: "user",
    customPermissions: ["read_reports"], // Permissão extra
    isActive: true,
    createdAt: "2024-01-03T00:00:00Z",
    lastLogin: "2024-01-18T09:20:00Z",
  },
  {
    id: "user-4",
    name: "Pedro Costa",
    email: "pedro@example.com",
    roleId: "user",
    customPermissions: [],
    isActive: false,
    createdAt: "2024-01-04T00:00:00Z",
  },
]

// Convites iniciais para demonstração
const defaultInvitations: Invitation[] = [
  {
    id: "inv-1",
    email: "ana@example.com",
    roleId: "admin",
    token: "abc123def456",
    invitedBy: "user-1",
    invitedAt: "2024-01-15T10:00:00Z",
    expiresAt: "2024-01-22T10:00:00Z",
    status: "pending",
    message: "Bem-vinda à equipe de administração!",
  },
  {
    id: "inv-2",
    email: "carlos@example.com",
    roleId: "user",
    token: "xyz789uvw012",
    invitedBy: "user-2",
    invitedAt: "2024-01-10T14:30:00Z",
    expiresAt: "2024-01-17T14:30:00Z",
    status: "expired",
  },
]

export function usePermissions() {
  const [permissions] = useState<Permission[]>(defaultPermissions)
  const [roles] = useState<Role[]>(defaultRoles)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [invitations, setInvitations] = useState<Invitation[]>(defaultInvitations)

  // Current user simulation (would come from auth context)
  const [currentUser] = useState<User>(defaultUsers[0]) // Super Admin

  // Utility functions
  const getRoleById = useCallback(
    (roleId: string) => {
      return roles.find((role) => role.id === roleId)
    },
    [roles],
  )

  const getUserPermissions = useCallback(
    (user: User) => {
      const role = getRoleById(user.roleId)
      if (!role) return []

      const rolePermissions = role.permissions
      const customPermissions = user.customPermissions || []

      return [...new Set([...rolePermissions, ...customPermissions])]
    },
    [getRoleById],
  )

  const hasPermission = useCallback(
    (user: User, permissionId: string) => {
      const userPermissions = getUserPermissions(user)
      return userPermissions.includes(permissionId)
    },
    [getUserPermissions],
  )

  const canManageUser = useCallback(
    (manager: User, target: User) => {
      const managerRole = getRoleById(manager.roleId)
      const targetRole = getRoleById(target.roleId)

      if (!managerRole || !targetRole) return false

      // Super admin can manage everyone except other super admins
      if (managerRole.level === 1) {
        return targetRole.level > 1
      }

      // Admin can manage users only
      if (managerRole.level === 2) {
        return targetRole.level > 2
      }

      // Users can't manage anyone
      return false
    },
    [getRoleById],
  )

  const canInviteRole = useCallback(
    (inviter: User, roleId: string) => {
      const inviterRole = getRoleById(inviter.roleId)
      const targetRole = getRoleById(roleId)

      if (!inviterRole || !targetRole) return false

      // Super admin can invite admin and user
      if (inviterRole.level === 1) {
        return targetRole.level > 1
      }

      // Admin can invite users only
      if (inviterRole.level === 2) {
        return targetRole.level > 2
      }

      // Users can't invite anyone
      return false
    },
    [getRoleById],
  )

  // User management functions
  const createUser = useCallback((userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    setUsers((prev) => [...prev, newUser])
    return newUser
  }, [])

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)))
  }, [])

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }, [])

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }, [])

  // Invitation management functions
  const createInvitation = useCallback(
    (invitationData: {
      email: string
      roleId: string
      message?: string
    }) => {
      const newInvitation: Invitation = {
        id: `inv-${Date.now()}`,
        email: invitationData.email,
        roleId: invitationData.roleId,
        token: Math.random().toString(36).substring(2, 15),
        invitedBy: currentUser.id,
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: "pending",
        message: invitationData.message,
      }

      setInvitations((prev) => [...prev, newInvitation])
      return newInvitation
    },
    [currentUser.id],
  )

  const cancelInvitation = useCallback((invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: "cancelled" as const } : inv)),
    )
  }, [])

  const resendInvitation = useCallback((invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              token: Math.random().toString(36).substring(2, 15),
              invitedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: "pending" as const,
            }
          : inv,
      ),
    )
  }, [])

  // Statistics
  const userStats = useMemo(() => {
    const activeUsers = users.filter((u) => u.isActive).length
    const inactiveUsers = users.filter((u) => !u.isActive).length
    const pendingInvitations = invitations.filter((i) => i.status === "pending").length

    const usersByRole = roles.map((role) => ({
      role: role.name,
      count: users.filter((u) => u.roleId === role.id).length,
      color: role.color,
    }))

    return {
      total: users.length,
      active: activeUsers,
      inactive: inactiveUsers,
      pendingInvitations,
      usersByRole,
    }
  }, [users, invitations, roles])

  return {
    // Data
    permissions,
    roles,
    users,
    invitations,
    currentUser,
    userStats,

    // Utility functions
    getRoleById,
    getUserPermissions,
    hasPermission,
    canManageUser,
    canInviteRole,

    // User management
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,

    // Invitation management
    createInvitation,
    cancelInvitation,
    resendInvitation,
  }
}
