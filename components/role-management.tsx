"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Shield, Plus, Edit, Trash2, Users, Lock } from "lucide-react"
import { usePermissions } from "../hooks/usePermissions"
import type { Role } from "../types/admin"

export function RoleManagement() {
  const { permissions, roles, createRole, updateRole, deleteRole, getPermissionsByCategory, getUsersByRole } =
    usePermissions()

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    color: "bg-blue-100 text-blue-800",
  })

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-purple-100 text-purple-800", label: "Roxo" },
    { value: "bg-orange-100 text-orange-800", label: "Laranja" },
    { value: "bg-pink-100 text-pink-800", label: "Rosa" },
    { value: "bg-gray-100 text-gray-800", label: "Cinza" },
  ]

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) return

    createRole({
      ...newRole,
      isSystem: false,
    })

    setNewRole({ name: "", description: "", permissions: [], color: "bg-blue-100 text-blue-800" })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateRole = () => {
    if (!selectedRole) return

    updateRole(selectedRole.id, selectedRole)
    setIsEditDialogOpen(false)
  }

  const handleDeleteRole = (roleId: string) => {
    try {
      deleteRole(roleId)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao excluir função")
    }
  }

  const handleTogglePermission = (permissionId: string, isNewRole = false) => {
    if (isNewRole) {
      const hasPermission = newRole.permissions.includes(permissionId)
      setNewRole({
        ...newRole,
        permissions: hasPermission
          ? newRole.permissions.filter((p) => p !== permissionId)
          : [...newRole.permissions, permissionId],
      })
    } else if (selectedRole) {
      const hasPermission = selectedRole.permissions.includes(permissionId)
      setSelectedRole({
        ...selectedRole,
        permissions: hasPermission
          ? selectedRole.permissions.filter((p) => p !== permissionId)
          : [...selectedRole.permissions, permissionId],
      })
    }
  }

  const getPermissionCount = (role: Role) => {
    return role.permissions.length
  }

  const getUserCount = (roleId: string) => {
    return getUsersByRole(roleId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Funções</h3>
          <p className="text-sm text-muted-foreground">Crie e gerencie funções e suas permissões</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Função
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Função</DialogTitle>
              <DialogDescription>Defina uma nova função com permissões específicas</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Função</Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="Ex: Gerente Financeiro"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Cor</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newRole.color}
                    onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Descreva as responsabilidades desta função"
                />
              </div>

              <div>
                <h4 className="font-medium mb-4">Permissões</h4>
                {(["read", "write", "admin", "system"] as const).map((category) => {
                  const categoryPermissions = getPermissionsByCategory(category)

                  return (
                    <div key={category} className="mb-6">
                      <h5 className="font-medium mb-3 capitalize">
                        {category === "read" && "🔍 Leitura"}
                        {category === "write" && "✏️ Escrita"}
                        {category === "admin" && "⚙️ Administrativas"}
                        {category === "system" && "🔧 Sistema"}
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <span className="font-medium">{permission.name}</span>
                              <p className="text-sm text-muted-foreground">{permission.description}</p>
                            </div>
                            <Checkbox
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={() => handleTogglePermission(permission.id, true)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRole}>Criar Função</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Funções do Sistema
          </CardTitle>
          <CardDescription>{roles.length} funções configuradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Função</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={role.color}>{role.name}</Badge>
                        {role.isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{getUserCount(role.id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPermissionCount(role)} permissões</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "secondary" : "default"}>
                      {role.isSystem ? "Sistema" : "Personalizada"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditDialogOpen(true)
                        }}
                        disabled={role.isSystem}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.isSystem}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Função</DialogTitle>
            <DialogDescription>Modifique as permissões e configurações da função</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome da Função</Label>
                  <Input
                    id="edit-name"
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                    disabled={selectedRole.isSystem}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Cor</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedRole.color}
                    onChange={(e) => setSelectedRole({ ...selectedRole, color: e.target.value })}
                    disabled={selectedRole.isSystem}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                  disabled={selectedRole.isSystem}
                />
              </div>

              <div>
                <h4 className="font-medium mb-4">Permissões</h4>
                {(["read", "write", "admin", "system"] as const).map((category) => {
                  const categoryPermissions = getPermissionsByCategory(category)

                  return (
                    <div key={category} className="mb-6">
                      <h5 className="font-medium mb-3 capitalize">
                        {category === "read" && "🔍 Leitura"}
                        {category === "write" && "✏️ Escrita"}
                        {category === "admin" && "⚙️ Administrativas"}
                        {category === "system" && "🔧 Sistema"}
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <span className="font-medium">{permission.name}</span>
                              <p className="text-sm text-muted-foreground">{permission.description}</p>
                            </div>
                            <Checkbox
                              checked={selectedRole.permissions.includes(permission.id)}
                              onCheckedChange={() => handleTogglePermission(permission.id)}
                              disabled={selectedRole.isSystem}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole} disabled={selectedRole?.isSystem}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
