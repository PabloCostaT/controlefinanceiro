"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Calendar, Trash2, Edit, FolderOpen } from "lucide-react"
import type { Project } from "../types/expense"

interface ProjectManagementProps {
  projects: Project[]
  onAddProject: (project: Omit<Project, "id" | "createdAt">) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => void
  onRemoveProject: (id: string) => void
}

const projectIcons = ["🏖️", "🎉", "🏠", "🚗", "✈️", "🍽️", "🎬", "🏥", "📚", "🛍️", "🎯", "💼"]
const projectColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export function ProjectManagement({
  projects,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
}: ProjectManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    color: projectColors[0],
    icon: projectIcons[0],
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      color: projectColors[0],
      icon: projectIcons[0],
      isActive: true,
    })
    setEditingProject(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      if (editingProject) {
        onUpdateProject(editingProject.id, formData)
      } else {
        onAddProject(formData)
      }
      resetForm()
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      color: project.color,
      icon: project.icon,
      isActive: project.isActive,
    })
    setEditingProject(project)
    setShowForm(true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projetos</h2>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome do Projeto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Viagem para Paris, Festa de Casamento..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o projeto..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Ícone</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {projectIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                      className={`p-2 text-2xl border rounded-lg hover:bg-muted transition-colors ${
                        formData.icon === icon ? "border-primary bg-primary/10" : ""
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Cor</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {projectColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        formData.color === color ? "border-gray-800 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Projeto ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProject ? "Atualizar" : "Criar"} Projeto
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum projeto criado ainda.</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${project.color}20`, color: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge variant={project.isActive ? "default" : "secondary"}>
                          {project.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {project.description && <p className="text-muted-foreground mb-3">{project.description}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {project.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(project.startDate)}
                              {project.endDate && ` - ${formatDate(project.endDate)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRemoveProject(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
