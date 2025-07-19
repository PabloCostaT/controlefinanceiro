"use client"

import { useState, useCallback } from "react"
import type { ServiceConfig, AdminUser, SystemSettings } from "../types/admin"

export function useAdmin() {
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: "admin-1",
    username: "admin",
    email: "admin@sistema.com",
    role: "super_admin",
    lastLogin: new Date().toISOString(),
    isActive: true,
  })

  const [services, setServices] = useState<ServiceConfig[]>([
    {
      id: "expense-management",
      name: "Gerenciamento de Despesas",
      description: "Funcionalidade principal para adicionar e gerenciar despesas familiares",
      isEnabled: true,
      icon: "💰",
      category: "core",
      requiredPermissions: ["expenses.read", "expenses.write"],
    },
    {
      id: "member-management",
      name: "Gerenciamento de Membros",
      description: "Adicionar e gerenciar membros da família com controle de acesso",
      isEnabled: true,
      icon: "👥",
      category: "core",
      requiredPermissions: ["members.read", "members.write"],
    },
    {
      id: "project-management",
      name: "Gerenciamento de Projetos",
      description: "Organizar despesas por projetos como viagens, eventos e reformas",
      isEnabled: true,
      icon: "📁",
      category: "core",
      requiredPermissions: ["projects.read", "projects.write"],
    },
    {
      id: "recurring-expenses",
      name: "Despesas Fixas",
      description: "Agenda e controle de despesas recorrentes mensais como contas e assinaturas",
      isEnabled: true,
      icon: "🔄",
      category: "financial",
      requiredPermissions: ["recurring.read", "recurring.write"],
    },
    {
      id: "wallet-management",
      name: "Gerenciamento de Carteira",
      description: "Controle de saldo, transações financeiras e múltiplas contas",
      isEnabled: true,
      icon: "💳",
      category: "financial",
      requiredPermissions: ["wallet.read", "wallet.write"],
    },
    {
      id: "financial-dashboard",
      name: "Dashboard Financeiro",
      description: "Visão geral da saúde financeira da família com gráficos e métricas",
      isEnabled: true,
      icon: "📊",
      category: "financial",
      dependencies: ["wallet-management"],
      requiredPermissions: ["dashboard.read"],
    },
    {
      id: "expense-reports",
      name: "Relatórios de Despesas",
      description: "Relatórios detalhados e análises de gastos com filtros avançados",
      isEnabled: false,
      icon: "📈",
      category: "reporting",
      requiredPermissions: ["reports.read", "reports.export"],
    },
    {
      id: "budget-planning",
      name: "Planejamento de Orçamento",
      description: "Definir e acompanhar orçamentos mensais com alertas automáticos",
      isEnabled: false,
      icon: "🎯",
      category: "advanced",
      requiredPermissions: ["budget.read", "budget.write"],
    },
    {
      id: "notifications",
      name: "Sistema de Notificações",
      description: "Alertas e lembretes automáticos por email e push notifications",
      isEnabled: false,
      icon: "🔔",
      category: "advanced",
      requiredPermissions: ["notifications.manage"],
    },
    {
      id: "data-export",
      name: "Exportação de Dados",
      description: "Exportar dados em diferentes formatos (PDF, Excel, CSV)",
      isEnabled: false,
      icon: "📤",
      category: "reporting",
      dependencies: ["expense-reports"],
      requiredPermissions: ["data.export"],
    },
    {
      id: "backup-restore",
      name: "Backup e Restauração",
      description: "Sistema de backup automático dos dados com restauração pontual",
      isEnabled: false,
      icon: "💾",
      category: "advanced",
      requiredPermissions: ["system.backup"],
    },
    {
      id: "api-access",
      name: "Acesso à API",
      description: "Interface de programação para integrações externas",
      isEnabled: false,
      icon: "🔌",
      category: "advanced",
      requiredPermissions: ["api.access"],
    },
    {
      id: "multi-currency",
      name: "Múltiplas Moedas",
      description: "Suporte a diferentes moedas com conversão automática",
      isEnabled: false,
      icon: "💱",
      category: "financial",
      dependencies: ["wallet-management"],
      requiredPermissions: ["currency.manage"],
    },
    {
      id: "mobile-app",
      name: "Aplicativo Mobile",
      description: "Acesso via aplicativo móvel iOS e Android",
      isEnabled: false,
      icon: "📱",
      category: "advanced",
      requiredPermissions: ["mobile.access"],
    },
  ])

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxMembersPerFamily: 10,
    dataRetentionDays: 365,
    backupEnabled: true,
    notificationsEnabled: false,
  })

  const [serviceStats, setServiceStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalFamilies: 156,
    totalExpenses: 8934,
    totalProjects: 234,
  })

  const toggleService = useCallback((serviceId: string) => {
    setServices((prev) => {
      const service = prev.find((s) => s.id === serviceId)
      if (!service) return prev

      const newEnabled = !service.isEnabled

      // Se estiver desabilitando, verificar dependências
      if (!newEnabled) {
        const dependentServices = prev.filter((s) => s.dependencies?.includes(serviceId) && s.isEnabled)
        if (dependentServices.length > 0) {
          // Desabilitar serviços dependentes também
          return prev.map((s) => {
            if (s.dependencies?.includes(serviceId)) {
              return { ...s, isEnabled: false }
            }
            return s.id === serviceId ? { ...s, isEnabled: newEnabled } : s
          })
        }
      }

      // Se estiver habilitando, verificar se dependências estão ativas
      if (newEnabled && service.dependencies) {
        const missingDependencies = service.dependencies.filter((depId) => {
          const depService = prev.find((s) => s.id === depId)
          return !depService?.isEnabled
        })

        if (missingDependencies.length > 0) {
          // Não permitir habilitar se dependências não estão ativas
          return prev
        }
      }

      return prev.map((s) => (s.id === serviceId ? { ...s, isEnabled: newEnabled } : s))
    })
  }, [])

  const bulkToggleServices = useCallback((serviceIds: string[], enabled: boolean) => {
    setServices((prev) =>
      prev.map((service) => (serviceIds.includes(service.id) ? { ...service, isEnabled: enabled } : service)),
    )
  }, [])

  const updateSystemSettings = useCallback((updates: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const getServicesByCategory = useCallback(
    (category: ServiceConfig["category"]) => {
      return services.filter((service) => service.category === category)
    },
    [services],
  )

  const getEnabledServices = useCallback(() => {
    return services.filter((service) => service.isEnabled)
  }, [services])

  const getDisabledServices = useCallback(() => {
    return services.filter((service) => !service.isEnabled)
  }, [services])

  const isServiceEnabled = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId)
      return service?.isEnabled || false
    },
    [services],
  )

  const getServiceDependents = useCallback(
    (serviceId: string) => {
      return services.filter((service) => service.dependencies?.includes(serviceId))
    },
    [services],
  )

  const canToggleService = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId)
      if (!service) return false

      // Serviços core essenciais não podem ser desabilitados
      if (service.category === "core" && ["expense-management", "member-management"].includes(serviceId)) {
        return false
      }

      return true
    },
    [services],
  )

  return {
    currentUser,
    services,
    systemSettings,
    serviceStats,
    toggleService,
    bulkToggleServices,
    updateSystemSettings,
    getServicesByCategory,
    getEnabledServices,
    getDisabledServices,
    isServiceEnabled,
    getServiceDependents,
    canToggleService,
  }
}
