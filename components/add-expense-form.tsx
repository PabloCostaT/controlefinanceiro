"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpenses } from "@/hooks/useExpenses"
import { toast } from "sonner"
import { PlusCircle, DollarSign } from "lucide-react"

export function AddExpenseForm() {
  const { members, projects, addExpense } = useExpenses()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "alimentacao",
    memberId: members.length > 0 ? members[0].id : "",
    projectId: "none",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description.trim() || !formData.amount || !formData.memberId) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    setIsLoading(true)

    try {
      const expense = {
        description: formData.description.trim(),
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
        paidBy: formData.memberId,
        projectId: formData.projectId !== "none" ? formData.projectId : undefined,
        date: new Date().toISOString(),
        splitBetween: [formData.memberId],
      }

      addExpense(expense)

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "alimentacao",
        memberId: members.length > 0 ? members[0].id : "",
        projectId: "none",
      })

      toast.success("Despesa adicionada com sucesso!")
    } catch (error) {
      toast.error("Erro ao adicionar despesa")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "alimentacao", label: "🍽️ Alimentação" },
    { value: "transporte", label: "🚗 Transporte" },
    { value: "saude", label: "🏥 Saúde" },
    { value: "educacao", label: "📚 Educação" },
    { value: "lazer", label: "🎮 Lazer" },
    { value: "casa", label: "🏠 Casa" },
    { value: "outros", label: "📦 Outros" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Linha 1: Descrição e Valor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Descrição *
          </Label>
          <Input
            id="description"
            placeholder="Ex: Almoço no restaurante"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Valor (R$) *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="h-10 pl-10"
              required
            />
          </div>
        </div>
      </div>

      {/* Linha 2: Categoria e Membro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Categoria *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Quem pagou? *</Label>
          <Select value={formData.memberId} onValueChange={(value) => setFormData({ ...formData, memberId: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione o membro" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  👤 {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Linha 3: Projeto (opcional) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Projeto (Opcional)</Label>
        <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Selecione um projeto ou deixe em branco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum projeto</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                📁 {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botão de submit */}
      <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adicionando...
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Despesa
          </>
        )}
      </Button>

      {/* Dicas rápidas */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Dicas rápidas:</p>
        <ul className="space-y-1">
          <li>• Use descrições claras como "Supermercado Extra" ou "Uber para trabalho"</li>
          <li>• Categorize corretamente para relatórios mais precisos</li>
          <li>• Projetos ajudam a organizar gastos específicos (viagens, reformas, etc.)</li>
        </ul>
      </div>
    </form>
  )
}
