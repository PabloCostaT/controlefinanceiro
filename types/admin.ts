export interface Permission {
  id: string
  name: string
  description: string
  category: "read" | "write" | "admin" | "system"
  resource: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  color: string
}

export interface User {
  id: string
  name: string
  email: string
  roleId: string
  customPermissions: string[]
  isActive: boolean
  createdAt: string
  lastLogin?: string
  avatar?: string
}

export interface Invitation {
  id: string
  email: string
  roleId: string
  token: string
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: "pending" | "accepted" | "expired" | "cancelled"
  acceptedAt?: string
  message?: string
}

export interface ServiceConfig {
  id: string
  name: string
  description: string
  isEnabled: boolean
  icon: string
  category: "core" | "financial" | "reporting" | "advanced"
  dependencies?: string[]
  requiredPermissions: string[]
}

export interface AdminUser {
  id: string
  username: string
  email: string
  role: "super_admin" | "admin"
  lastLogin?: string
  isActive: boolean
}

export interface SystemSettings {
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  maxMembersPerFamily: number
  dataRetentionDays: number
  backupEnabled: boolean
  notificationsEnabled: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
}
