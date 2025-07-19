"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Calendar, DollarSign, User, Repeat } from "lucide-react"
import type { FamilyMember, Project, RecurringExpense } from "../types/expense"

interface RecurringExpensesFormProps {
  members: FamilyMember[]
  projects: Project[]
  onAddRecurringExpense: (expense: Omit<RecurringExpense, "id" | "createdAt">) => void
}

const categories = [
  { value: "casa", label: "Casa", icon: "🏠" },
  { value: "utilidades", label: "Utilidades", icon: "⚡" },
  { value: "transporte", label: "Transporte", icon: "🚗" },
  { value: "saude", label: "Saúde", icon: "🏥" },
  { value: "educacao", label: "Educação", icon: "📚" },
  { value: "lazer", label: "Lazer", icon: "🎬" },
  { value: "alimentacao", label: "Alimentação", icon: "🍽️" },
  { value: "outros", label: "Outros", icon: "📦" },
]

export function RecurringExpensesForm({ members, projects, onAddRecurringExpense }: RecurringExpensesFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDay: "1",
    responsibleId: "",
    category: "",
    splitBetween: [] as string[],
    projectId: "none",
    isActive: true,
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valor deve ser maior que zero"
    }

    if (!formData.responsibleId) {
      newErrors.responsibleId = "Selecione o responsável"
    }

    if (!formData.category) {
      newErrors.category = "Selecione uma categoria"
    }

    if (formData.splitBetween.length === 0) {
      newErrors.splitBetween = "Selecione pelo menos uma pessoa para dividir"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAddRecurringExpense({
        name: formData.name.trim(),
        amount: Number.parseFloat(formData.amount),
        dueDay: Number.parseInt(formData.dueDay),
        responsibleId: formData.responsibleId,
        category: formData.category,
        splitBetween: formData.splitBetween,
        projectId: formData.projectId === "none" ? undefined : formData.projectId,
        isActive: formData.isActive,
        notes: formData.notes.trim() || undefined,
      })

      // Reset form
      setFormData({
        name: "",
        amount: "",
        dueDay: "1",
        responsibleId: "",
        category: "",
        splitBetween: [],
        projectId: "none",
        isActive: true,
        notes: "",
      })
      setErrors({})
      setShowForm(false)
    }
  }

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, splitBetween: [...prev.splitBetween, memberId] }))
    } else {
      setFormData((prev) => ({ ...prev, splitBetween: prev.splitBetween.filter((id) => id !== memberId) }))
    }
    if (errors.splitBetween) {
      setErrors((prev) => ({ ...prev, splitBetween: "" }))
    }
  }

  const selectAllMembers = () => {
    setFormData((prev) => ({ ...prev, splitBetween: members.map((member) => member.id) }))
    if (errors.splitBetween) {
      setErrors((prev) => ({ ...prev, splitBetween: "" }))
    }
  }

  const clearAllMembers = () => {
    setFormData((prev) => ({ ...prev, splitBetween: [] }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const amountPerPerson =
    formData.splitBetween.length > 0 && formData.amount
      ? Number.parseFloat(formData.amount) / formData.splitBetween.length
      : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Nova Despesa Fixa
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
            {showForm ? (
              "Cancelar"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {showForm && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Despesa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                    }}
                    placeholder="Ex: Aluguel, Conta de Luz, Internet..."
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, amount: e.target.value }))
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }))
                      }}
                      placeholder="0,00"
                      className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <Label htmlFor="dueDay">Dia do Vencimento *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.dueDay}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, dueDay: value }))}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Dia {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Responsável *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.responsibleId}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, responsibleId: value }))
                        if (errors.responsibleId) setErrors((prev) => ({ ...prev, responsibleId: "" }))
                      }}
                    >
                      <SelectTrigger className={`pl-10 ${errors.responsibleId ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Quem é responsável?" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.responsibleId && <p className="text-sm text-red-500 mt-1">{errors.responsibleId}</p>}
                </div>

                <div>
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, category: value }))
                      if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
                    }}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label>Projeto (opcional)</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem projeto</SelectItem>
                      {projects
                        .filter((project) => project.isActive)
                        .map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <span>{project.icon}</span>
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Adicione detalhes sobre esta despesa fixa..."
                  rows={2}
                />
              </div>
            </div>

            {/* Split Between Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Dividir Entre *</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllMembers}>
                    Todos
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllMembers}>
                    Limpar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                      formData.splitBetween.includes(member.id) ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={formData.splitBetween.includes(member.id)}
                      onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`member-${member.id}`} className="font-medium cursor-pointer">
                        {member.name}
                      </Label>
                      {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                    </div>
                    {formData.splitBetween.includes(member.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Incluído
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {errors.splitBetween && <p className="text-sm text-red-500">{errors.splitBetween}</p>}
            </div>

            {/* Calculation Summary */}
            {formData.splitBetween.length > 0 && formData.amount && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between items-center font-medium">
                  <span>Valor por pessoa:</span>
                  <span>{formatCurrency(amountPerPerson)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(Number.parseFloat(formData.amount))} ÷ {formData.splitBetween.length} pessoa(s)
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Despesa ativa</Label>
            </div>

            <Button type="submit" className="w-full">
              <Repeat className="h-4 w-4 mr-2" />
              Criar Despesa Fixa
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
