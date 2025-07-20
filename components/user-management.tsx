"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, UserPlus, Edit, Trash2, Shield, Eye, Calendar, Mail, Lock, Unlock, Search, Filter } from "lucide-react"
import { usePermissions } from "../hooks/usePermissions"
import type { User } from "../types/admin"

export function UserManagement() {
  const {
    permissions,
    roles,
    users,
    createUser,
    updateUser,
    deleteUser,
    getUserPermissions,
    getPermissionsByCategory,
    getRoleById,
    getUsersByRole,
  } = usePermissions()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    roleId: "",
    isActive: true,
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.roleId) return

    createUser({
      ...newUser,
      customPermissions: [],
    })

    setNewUser({ name: "", email: "", roleId: "", isActive: true })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!selectedUser) return
    updateUser(selectedUser.id, updates)
    setSelectedUser({ ...selectedUser, ...updates })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(userId)
    }
  }

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    updateUser(userId, { isActive })
  }

  const handleBulkAction = (action: string, userIds: string[]) => {
    switch (action) {
      case "activate":
        userIds.forEach((id) => updateUser(id, { isActive: true }))
        break
      case "deactivate":
        userIds.forEach((id) => updateUser(id, { isActive: false }))
        break
      case "delete":
        if (confirm(`Tem certeza que deseja excluir ${userIds.length} usuários?`)) {
          userIds.forEach((id) => deleteUser(id))
        }
        break
    }
  }

  const handleToggleCustomPermission = (permissionId: string) => {
    if (!selectedUser) return

    const currentCustomPermissions = selectedUser.customPermissions || []
    const hasPermission = currentCustomPermissions.includes(permissionId)

    const newCustomPermissions = hasPermission
      ? currentCustomPermissions.filter((p) => p !== permissionId)
      : [...currentCustomPermissions, permissionId]

    handleUpdateUser({ customPermissions: newCustomPermissions })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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

  const getEffectivePermissions = (user: User): string[] => {
    const role = getRoleById(user.roleId)
    const rolePermissions = role?.permissions || []
    return [...new Set([...rolePermissions, ...(user.customPermissions || [])])]
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.roleId === filterRole
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
          <p className="text-sm text-muted-foreground">Gerencie usuários e suas permissões</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select value={newUser.roleId} onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
                />
                <Label htmlFor="active">Usuário ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Criar Usuário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários do Sistema
          </CardTitle>
          <CardDescription>
            {users.filter((u) => u.isActive).length} usuários ativos de {users.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = getRoleById(user.roleId)
                  const effectivePermissions = getEffectivePermissions(user)

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={role?.color || "bg-gray-100 text-gray-800"}>
                          {role?.name || "Função não encontrada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                          >
                            {user.isActive ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.lastLogin)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{effectivePermissions.length} permissões</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsPermissionsDialogOpen(true)
                            }}
                          >
                            <Shield className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.roleId === "super_admin"}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Altere as informações do usuário</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Função</Label>
                <Select
                  value={selectedUser.roleId}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={selectedUser.isActive}
                  onCheckedChange={(checked) => setSelectedUser({ ...selectedUser, isActive: checked })}
                />
                <Label htmlFor="edit-active">Usuário ativo</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedUser) {
                  handleUpdateUser(selectedUser)
                  setIsEditDialogOpen(false)
                }
              }}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Permissões */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Permissões</DialogTitle>
            <DialogDescription>Gerencie as permissões específicas para {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar>
                  <AvatarFallback>{getUserInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <Badge className={getRoleById(selectedUser.roleId)?.color || "bg-gray-100 text-gray-800"}>
                    {getRoleById(selectedUser.roleId)?.name}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Permissões da Função</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Estas permissões são herdadas da função atribuída ao usuário
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(getRoleById(selectedUser.roleId)?.permissions || []).map((permissionId) => {
                    const permission = permissions.find((p) => p.id === permissionId)
                    if (!permission) return null

                    return (
                      <div key={permissionId} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <Eye className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-green-800">{permission.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Permissões Personalizadas</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione permissões específicas para este usuário além das da função
                </p>

                {(["read", "write", "admin", "system"] as const).map((category) => {
                  const categoryPermissions = getPermissionsByCategory(category)
                  const rolePermissions = getRoleById(selectedUser.roleId)?.permissions || []

                  return (
                    <div key={category} className="mb-6">
                      <h5 className="font-medium mb-3 capitalize">
                        {category === "read" && "🔍 Leitura"}
                        {category === "write" && "✏️ Escrita"}
                        {category === "admin" && "⚙️ Administrativas"}
                        {category === "system" && "🔧 Sistema"}
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => {
                          const hasFromRole = rolePermissions.includes(permission.id)
                          const hasCustom = selectedUser.customPermissions?.includes(permission.id) || false

                          return (
                            <div key={permission.id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{permission.name}</span>
                                  {hasFromRole && (
                                    <Badge variant="outline" className="text-xs">
                                      Da função
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{permission.description}</p>
                              </div>
                              <Checkbox
                                checked={hasCustom}
                                onCheckedChange={() => handleToggleCustomPermission(permission.id)}
                                disabled={hasFromRole}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPermissionsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
