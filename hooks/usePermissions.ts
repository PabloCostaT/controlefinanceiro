"use client"

import { useState, useCallback } from "react"
import type { Permission, Role, User } from "../types/admin"

export function usePermissions() {
  const [permissions] = useState<Permission[]>([
    // Permissões de Leitura
    {
      id: "read_expenses",
      name: "Ver Despesas",
      description: "Visualizar despesas da família",
      category: "read",
      resource: "expenses",
    },
    {
      id: "read_members",
      name: "Ver Membros",
      description: "Visualizar membros da família",
      category: "read",
      resource: "members",
    },
    {
      id: "read_projects",
      name: "Ver Projetos",
      description: "Visualizar projetos e eventos",
      category: "read",
      resource: "projects",
    },
    {
      id: "read_wallet",
      name: "Ver Carteira",
      description: "Visualizar saldo e transações",
      category: "read",
      resource: "wallet",
    },
    {
      id: "read_recurring",
      name: "Ver Despesas Fixas",
      description: "Visualizar despesas recorrentes",
      category: "read",
      resource: "recurring",
    },
    {
      id: "read_reports",
      name: "Ver Relatórios",
      description: "Visualizar relatórios financeiros",
      category: "read",
      resource: "reports",
    },

    // Permissões de Escrita
    {
      id: "write_expenses",
      name: "Gerenciar Despesas",
      description: "Adicionar, editar e excluir despesas",
      category: "write",
      resource: "expenses",
    },
    {
      id: "write_members",
      name: "Gerenciar Membros",
      description: "Adicionar, editar e remover membros",
      category: "write",
      resource: "members",
    },
    {
      id: "write_projects",
      name: "Gerenciar Projetos",
      description: "Criar e gerenciar projetos",
      category: "write",
      resource: "projects",
    },
    {
      id: "write_wallet",
      name: "Gerenciar Carteira",
      description: "Gerenciar saldo e transações",
      category: "write",
      resource: "wallet",
    },
    {
      id: "write_recurring",
      name: "Gerenciar Despesas Fixas",
      description: "Configurar despesas recorrentes",
      category: "write",
      resource: "recurring",
    },

    // Permissões Administrativas
    {
      id: "admin_users",
      name: "Gerenciar Usuários",
      description: "Criar, editar e excluir usuários",
      category: "admin",
      resource: "users",
    },
    {
      id: "admin_roles",
      name: "Gerenciar Funções",
      description: "Criar e editar funções e permissões",
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
    {
      id: "admin_settings",
      name: "Configurações",
      description: "Alterar configurações do sistema",
      category: "admin",
      resource: "settings",
    },
    {
      id: "admin_backup",
      name: "Backup e Restauração",
      description: "Gerenciar backups do sistema",
      category: "admin",
      resource: "backup",
    },

    // Permissões de Sistema
    {
      id: "system_maintenance",
      name: "Modo Manutenção",
      description: "Ativar/desativar modo manutenção",
      category: "system",
      resource: "maintenance",
    },
    {
      id: "system_services",
      name: "Gerenciar Serviços",
      description: "Habilitar/desabilitar serviços",
      category: "system",
      resource: "services",
    },
    {
      id: "system_logs",
      name: "Ver Logs",
      description: "Visualizar logs do sistema",
      category: "system",
      resource: "logs",
    },
    {
      id: "system_monitoring",
      name: "Monitoramento",
      description: "Acessar métricas e monitoramento",
      category: "system",
      resource: "monitoring",
    },
  ])

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "super_admin",
      name: "Super Administrador",
      description: "Acesso total ao sistema",
      permissions: permissions.map((p) => p.id),
      isSystem: true,
      color: "bg-red-100 text-red-800",
    },
    {
      id: "admin",
      name: "Administrador",
      description: "Acesso administrativo completo",
      permissions: [
        "read_expenses",
        "read_members",
        "read_projects",
        "read_wallet",
        "read_recurring",
        "read_reports",
        "write_expenses",
        "write_members",
        "write_projects",
        "write_wallet",
        "write_recurring",
        "admin_users",
        "admin_invitations",
        "admin_settings",
        "admin_backup",
      ],
      isSystem: true,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: "manager",
      name: "Gerente",
      description: "Gerenciamento de despesas e membros",
      permissions: [
        "read_expenses",
        "read_members",
        "read_projects",
        "read_wallet",
        "read_recurring",
        "read_reports",
        "write_expenses",
        "write_members",
        "write_projects",
        "write_recurring",
      ],
      isSystem: false,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "member",
      name: "Membro",
      description: "Acesso básico para membros da família",
      permissions: [
        "read_expenses",
        "read_members",
        "read_projects",
        "read_wallet",
        "read_recurring",
        "write_expenses",
      ],
      isSystem: false,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "viewer",
      name: "Visualizador",
      description: "Apenas visualização",
      permissions: ["read_expenses", "read_members", "read_projects", "read_wallet", "read_recurring"],
      isSystem: false,
      color: "bg-gray-100 text-gray-800",
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      name: "João Silva",
      email: "joao@exemplo.com",
      roleId: "admin",
      customPermissions: ["system_logs"],
      isActive: true,
      createdAt: "2024-01-10T10:00:00Z",
      lastLogin: "2024-01-18T14:30:00Z",
    },
    {
      id: "user-2",
      name: "Maria Santos",
      email: "maria@exemplo.com",
      roleId: "manager",
      customPermissions: [],
      isActive: true,
      createdAt: "2024-01-12T09:15:00Z",
      lastLogin: "2024-01-17T16:45:00Z",
    },
    {
      id: "user-3",
      name: "Pedro Costa",
      email: "pedro@exemplo.com",
      roleId: "member",
      customPermissions: ["read_reports"],
      isActive: false,
      createdAt: "2024-01-15T11:20:00Z",
    },
  ])

  const createUser = useCallback((userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setUsers((prev) => [newUser, ...prev])
    return newUser
  }, [])

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)))
  }, [])

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }, [])

  const createRole = useCallback((roleData: Omit<Role, "id">) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
    }
    setRoles((prev) => [newRole, ...prev])
    return newRole
  }, [])

  const updateRole = useCallback((roleId: string, updates: Partial<Role>) => {
    setRoles((prev) => prev.map((role) => (role.id === roleId ? { ...role, ...updates } : role)))
  }, [])

  const deleteRole = useCallback(
    (roleId: string) => {
      // Verificar se há usuários usando esta função
      const usersWithRole = users.filter((user) => user.roleId === roleId)
      if (usersWithRole.length > 0) {
        throw new Error(
          `Não é possível excluir a função. ${usersWithRole.length} usuário(s) ainda estão usando esta função.`,
        )
      }

      setRoles((prev) => prev.filter((role) => role.id !== roleId))
    },
    [users],
  )

  const getRoleById = useCallback(
    (roleId: string) => {
      return roles.find((role) => role.id === roleId)
    },
    [roles],
  )

  const getUserPermissions = useCallback(
    (user: User): string[] => {
      const role = getRoleById(user.roleId)
      const rolePermissions = role?.permissions || []
      return [...new Set([...rolePermissions, ...user.customPermissions])]
    },
    [getRoleById],
  )

  const getPermissionsByCategory = useCallback(
    (category: Permission["category"]) => {
      return permissions.filter((permission) => permission.category === category)
    },
    [permissions],
  )

  const getUsersByRole = useCallback(
    (roleId: string) => {
      return users.filter((user) => user.roleId === roleId)
    },
    [users],
  )

  const hasPermission = useCallback(
    (user: User, permissionId: string): boolean => {
      const userPermissions = getUserPermissions(user)
      return userPermissions.includes(permissionId)
    },
    [getUserPermissions],
  )

  return {
    permissions,
    roles,
    users,
    createUser,
    updateUser,
    deleteUser,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getUserPermissions,
    getPermissionsByCategory,
    getUsersByRole,
    hasPermission,
  }
}
