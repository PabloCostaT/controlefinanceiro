"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Crown,
  Shield,
  User,
  Eye,
  Edit,
  Settings,
  Database,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Lock,
} from "lucide-react"
import { usePermissions } from "../hooks/usePermissions"

export function RoleManagement() {
  const { roles, permissions, users, userStats } = usePermissions()

  const getPermissionIcon = (category: string) => {
    switch (category) {
      case "read":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "write":
        return <Edit className="h-4 w-4 text-green-500" />
      case "admin":
        return <Settings className="h-4 w-4 text-orange-500" />
      case "system":
        return <Database className="h-4 w-4 text-red-500" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case "expenses":
        return <DollarSign className="h-4 w-4" />
      case "projects":
        return <FileText className="h-4 w-4" />
      case "reports":
        return <BarChart3 className="h-4 w-4" />
      case "members":
      case "users":
      case "roles":
      case "invitations":
        return <Users className="h-4 w-4" />
      case "settings":
      case "services":
      case "maintenance":
        return <Settings className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "super_admin":
        return <Crown className="h-6 w-6 text-red-500" />
      case "admin":
        return <Shield className="h-6 w-6 text-blue-500" />
      case "user":
        return <User className="h-6 w-6 text-green-500" />
      default:
        return <User className="h-6 w-6" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "read":
        return "Visualização"
      case "write":
        return "Edição"
      case "admin":
        return "Administração"
      case "system":
        return "Sistema"
      default:
        return "Outros"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "read":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "write":
        return "bg-green-100 text-green-800 border-green-200"
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "system":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Gerenciamento de Funções</h3>
        <p className="text-sm text-muted-foreground">Visualize as funções do sistema e suas permissões</p>
      </div>

      {/* Estatísticas por Função */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userStats.usersByRole.map((stat) => (
          <Card key={stat.role}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.role}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <Badge className={stat.color}>
                  {stat.count} usuário{stat.count !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funções Detalhadas */}
      <div className="space-y-6">
        {roles.map((role) => {
          const rolePermissions = permissions.filter((p) => role.permissions.includes(p.id))
          const permissionsByCategory = rolePermissions.reduce(
            (acc, permission) => {
              if (!acc[permission.category]) {
                acc[permission.category] = []
              }
              acc[permission.category].push(permission)
              return acc
            },
            {} as Record<string, typeof permissions>,
          )

          const coveragePercentage = Math.round((role.permissions.length / permissions.length) * 100)
          const userCount = users.filter((u) => u.roleId === role.id).length

          return (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(role.id)}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        <Badge className={role.color}>Nível {role.level}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{userCount} usuários</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Cobertura:</span>
                      <span className="text-sm font-medium">{coveragePercentage}%</span>
                    </div>
                    <Progress value={coveragePercentage} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">
                      Permissões ({role.permissions.length}/{permissions.length})
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-2">
                            {getPermissionIcon(category)}
                            <Badge className={getCategoryColor(category)}>
                              {getCategoryName(category)} ({categoryPermissions.length})
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                {getResourceIcon(permission.resource)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{permission.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {role.permissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Lock className="h-8 w-8 mx-auto mb-2" />
                      <p>Nenhuma permissão atribuída</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resumo de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(["read", "write", "admin", "system"] as const).map((category) => {
              const categoryPermissions = permissions.filter((p) => p.category === category)

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    {getPermissionIcon(category)}
                    <h4 className="font-medium">{getCategoryName(category)}</h4>
                    <Badge className={getCategoryColor(category)}>{categoryPermissions.length} permissões</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2 p-2 border rounded">
                        {getResourceIcon(permission.resource)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{permission.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {category !== "system" && <Separator className="mt-4" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
