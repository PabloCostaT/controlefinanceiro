"use client"

import { useCallback, useMemo, useState } from "react"
import type { ServiceConfig, SystemSettings, AdminUser } from "@/types/admin"

/**
 * Serviços iniciais – ajuste conforme necessário.
 */
const defaultServices: ServiceConfig[] = [
  {
    id: "expense-management",
    name: "Despesas",
    description: "Gerenciamento de despesas individuais",
    icon: "💸",
    category: "financial",
    isEnabled: true,
  },
  {
    id: "financial-dashboard",
    name: "Dashboard Financeiro",
    description: "Visão geral das finanças",
    icon: "📊",
    category: "financial",
    isEnabled: true,
  },
  {
    id: "wallet-management",
    name: "Carteira",
    description: "Controle de carteiras e saldos",
    icon: "👛",
    category: "financial",
    isEnabled: false,
  },
  {
    id: "recurring-expenses",
    name: "Despesas Recorrentes",
    description: "Gerencie despesas mensais fixas",
    icon: "🔁",
    category: "financial",
    isEnabled: true,
    dependencies: ["expense-management"],
  },
  {
    id: "project-management",
    name: "Projetos",
    description: "Agrupe despesas por projeto",
    icon: "📁",
    category: "core",
    isEnabled: true,
  },
  {
    id: "member-management",
    name: "Membros",
    description: "Controle de usuários e permissões",
    icon: "👤",
    category: "core",
    isEnabled: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Painel de administração",
    icon: "🛠️",
    category: "advanced",
    isEnabled: true,
  },
]

interface ServiceStats {
  activeUsers: number
  totalFamilies: number
}

export function useAdmin() {
  const [services, setServices] = useState<ServiceConfig[]>(defaultServices)

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxMembersPerFamily: 10,
    dataRetentionDays: 365,
    backupEnabled: true,
    notificationsEnabled: true,
  })

  const [currentUser] = useState<AdminUser>({
    id: "super-1",
    username: "super",
    email: "super@example.com",
    role: "super_admin",
    isActive: true,
    lastLogin: new Date().toISOString(),
  })

  /* ---------- Derivações ---------- */
  const enabledServices = useMemo(() => services.filter((s) => s.isEnabled), [services])
  const disabledServices = useMemo(() => services.filter((s) => !s.isEnabled), [services])

  /* ---------- Estatísticas simuladas (substitua por API real) ---------- */
  const serviceStats: ServiceStats = useMemo(
    () => ({
      activeUsers: 42,
      totalFamilies: 8,
    }),
    [],
  )

  /* ---------- Getters utilitários ---------- */
  const getServicesByCategory = useCallback(
    (category: ServiceConfig["category"]) => services.filter((s) => s.category === category),
    [services],
  )

  const getEnabledServices = useCallback(() => enabledServices, [enabledServices])
  const getDisabledServices = useCallback(() => disabledServices, [disabledServices])

  const getServiceDependents = useCallback(
    (serviceId: string) => services.filter((s) => s.dependencies?.includes(serviceId)),
    [services],
  )

  const canToggleService = useCallback(
    (serviceId: string) => {
      // Super Admin poderia ter restrições extras aqui
      const dependentsActive = getServiceDependents(serviceId).some((d) => d.isEnabled)
      return !dependentsActive
    },
    [getServiceDependents],
  )

  /* ---------- Ações ---------- */
  const toggleService = useCallback((serviceId: string) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, isEnabled: !s.isEnabled } : s)))
  }, [])

  const bulkToggleServices = useCallback((ids: string[], enabled: boolean) => {
    setServices((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, isEnabled: enabled } : s)))
  }, [])

  const updateSystemSettings = useCallback(
    (updates: Partial<SystemSettings>) => setSystemSettings((prev) => ({ ...prev, ...updates })),
    [],
  )

  /* ---------- Função solicitada ---------- */
  const isServiceEnabled = useCallback(
    (serviceId: string) => services.some((s) => s.id === serviceId && s.isEnabled),
    [services],
  )

  return {
    /* dados */
    currentUser,
    systemSettings,
    services,
    serviceStats,

    /* getters utilitários */
    getServicesByCategory,
    getEnabledServices,
    getDisabledServices,
    getServiceDependents,
    canToggleService,

    /* ações */
    toggleService,
    bulkToggleServices,
    updateSystemSettings,

    /* verificador usado pela UI */
    isServiceEnabled,
  }
}
