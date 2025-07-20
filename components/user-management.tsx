"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Users, UserPlus, Trash2, Edit, Shield } from "lucide-react"
import { ResponsiveTable } from "./responsive-table"
import type { User as UserType, Role } from "../types/admin"

interface UserManagementProps {
  users: UserType[]
  roles: Role[]
  onAddUser: (user: Omit<UserType, "id" | "createdAt" | "lastLogin">) => void
  onUpdateUser: (id: string, updates: Partial<UserType>) => void
  onRemoveUser: (id: string) => void
}

export function UserManagement({ users, roles, onAddUser, onUpdateUser, onRemoveUser }: UserManagementProps) {
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    roleId: "",
    isActive: true,
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.roleId) {
      onAddUser(newUser)
      setNewUser({ name: "", email: "", roleId: "", isActive: true })
      setIsAddingUser(false)
    }
  }

  const handleUpdateUser = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        roleId: editingUser.roleId,
        isActive: editingUser.isActive,
      })
      setEditingUser(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || "Sem função"
  }

  const columns = [
    {
      key: "name",
      label: "Nome",
      priority: "high" as const,
      render: (value: string, user: UserType) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "roleId",
      label: "Função",
      priority: "high" as const,
      render: (value: string) => <Badge variant="secondary">{getRoleName(value)}</Badge>,
    },
    {
      key: "isActive",
      label: "Status",
      priority: "medium" as const,
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>{value ? "Ativo" : "Inativo"}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Criado em",
      priority: "low" as const,
      render: (value: string) => formatDate(value),
    },
    {
      key: "lastLogin",
      label: "Último acesso",
      priority: "low" as const,
      render: (value: string | null) => (value ? formatDate(value) : "Nunca"),
    },
    {
      key: "actions",
      label: "Ações",
      priority: "high" as const,
      render: (_: any, user: UserType) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover usuário</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover o usuário {user.name}? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemoveUser(user.id)}>Remover</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciamento de Usuários
            </CardTitle>
            <Button onClick={() => setIsAddingUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTable data={users} columns={columns} keyField="id" emptyMessage="Nenhum usuário encontrado" />
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      {isAddingUser && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Função</Label>
                <Select value={newUser.roleId} onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Adicionar</Button>
              <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Função</Label>
                <Select
                  value={editingUser.roleId}
                  onValueChange={(value) => setEditingUser({ ...editingUser, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingUser.isActive ? "true" : "false"}
                  onValueChange={(value) => setEditingUser({ ...editingUser, isActive: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateUser}>Salvar</Button>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
