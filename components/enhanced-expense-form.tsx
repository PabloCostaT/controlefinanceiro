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
import { ArrowLeft, Receipt, Calculator, Users, Calendar, Tag, DollarSign } from "lucide-react"
import type { FamilyMember, Project } from "../types/expense"

interface EnhancedExpenseFormProps {
  members: FamilyMember[]
  projects: Project[]
  onAddExpense: (expense: {
    description: string
    amount: number
    date: string
    paidBy: string
    category: string
    splitBetween: string[]
    projectId?: string
    notes?: string
  }) => void
  onBack: () => void
}

const categories = [
  { value: "alimentacao", label: "Alimentação", icon: "🍽️" },
  { value: "utilidades", label: "Utilidades", icon: "⚡" },
  { value: "transporte", label: "Transporte", icon: "🚗" },
  { value: "saude", label: "Saúde", icon: "🏥" },
  { value: "educacao", label: "Educação", icon: "📚" },
  { value: "lazer", label: "Lazer", icon: "🎬" },
  { value: "casa", label: "Casa", icon: "🏠" },
  { value: "roupas", label: "Roupas", icon: "👕" },
  { value: "outros", label: "Outros", icon: "📦" },
]

export function EnhancedExpenseForm({ members, projects, onAddExpense, onBack }: EnhancedExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [paidBy, setPaidBy] = useState("")
  const [category, setCategory] = useState("")
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [projectId, setProjectId] = useState("none")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Valor deve ser maior que zero"
    }

    if (!paidBy) {
      newErrors.paidBy = "Selecione quem pagou"
    }

    if (!category) {
      newErrors.category = "Selecione uma categoria"
    }

    if (splitBetween.length === 0) {
      newErrors.splitBetween = "Selecione pelo menos uma pessoa para dividir"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAddExpense({
        description: description.trim(),
        amount: Number.parseFloat(amount),
        date,
        paidBy,
        category,
        splitBetween,
        projectId: projectId === "none" ? undefined : projectId,
        notes: notes.trim() || undefined,
      })

      // Reset form
      setDescription("")
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setPaidBy("")
      setCategory("")
      setSplitBetween([])
      setProjectId("none")
      setNotes("")
      setErrors({})
    }
  }

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setSplitBetween((prev) => [...prev, memberId])
    } else {
      setSplitBetween((prev) => prev.filter((id) => id !== memberId))
    }
    // Clear error when user makes a selection
    if (errors.splitBetween) {
      setErrors((prev) => ({ ...prev, splitBetween: "" }))
    }
  }

  const selectAllMembers = () => {
    setSplitBetween(members.map((member) => member.id))
    if (errors.splitBetween) {
      setErrors((prev) => ({ ...prev, splitBetween: "" }))
    }
  }

  const clearAllMembers = () => {
    setSplitBetween([])
  }

  const amountPerPerson = splitBetween.length > 0 && amount ? Number.parseFloat(amount) / splitBetween.length : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-2 sm:p-4 max-w-4xl">
        {/* Header compacto com título menor */}
        <div className="mb-4">
          <Button variant="ghost" onClick={onBack} className="mb-2 p-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 flex items-center justify-center gap-2">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
              Nova Despesa
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Adicione uma nova despesa e divida entre os membros da família
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas - Layout mais compacto */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Tag className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm">
                    Descrição da Despesa *
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                    }}
                    placeholder="Ex: Supermercado, Conta de luz..."
                    className={`h-9 ${errors.description ? "border-red-500" : ""}`}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm">
                    Valor (R$) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }))
                      }}
                      placeholder="0,00"
                      className={`pl-8 h-9 ${errors.amount ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <Label htmlFor="date" className="text-sm">
                    Data *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento e Categoria - Layout compacto */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Pagamento e Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm">Quem pagou? *</Label>
                  <Select
                    value={paidBy}
                    onValueChange={(value) => {
                      setPaidBy(value)
                      if (errors.paidBy) setErrors((prev) => ({ ...prev, paidBy: "" }))
                    }}
                  >
                    <SelectTrigger className={`h-9 ${errors.paidBy ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paidBy && <p className="text-xs text-red-500 mt-1">{errors.paidBy}</p>}
                </div>

                <div>
                  <Label className="text-sm">Categoria *</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value)
                      if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
                    }}
                  >
                    <SelectTrigger className={`h-9 ${errors.category ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Categoria" />
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
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label className="text-sm">Projeto (opcional)</Label>
                  <Select value={projectId} onValueChange={(value) => setProjectId(value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Projeto" />
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
            </CardContent>
          </Card>

          {/* Dividir Entre Membros - Layout compacto */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4" />
                Dividir Entre
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllMembers}
                  className="h-7 text-xs bg-transparent"
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllMembers}
                  className="h-7 text-xs bg-transparent"
                >
                  Limpar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center space-x-2 p-2 border rounded-lg transition-colors ${
                      splitBetween.includes(member.id) ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={splitBetween.includes(member.id)}
                      onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`member-${member.id}`} className="text-sm font-medium cursor-pointer">
                        {member.name}
                      </Label>
                    </div>
                    {splitBetween.includes(member.id) && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {errors.splitBetween && <p className="text-xs text-red-500">{errors.splitBetween}</p>}
            </CardContent>
          </Card>

          {/* Observações - Compacto */}
          <Card>
            <CardContent className="pt-4">
              <Label htmlFor="notes" className="text-sm">
                Observações (opcional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes adicionais..."
                rows={2}
                className="mt-1"
              />
            </CardContent>
          </Card>

          {/* Resumo do Rateio - Compacto */}
          {splitBetween.length > 0 && amount && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calculator className="h-4 w-4" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-sm">Total:</span>
                    <span>{formatCurrency(Number.parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Por pessoa ({splitBetween.length}):</span>
                    <span className="font-medium">{formatCurrency(amountPerPerson)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de Ação - Compactos */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-10 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-10">
              <Receipt className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
