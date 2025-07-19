"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Receipt, ArrowLeft, Sun, Moon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import type { Member, Project, Expense } from "../types/expense"

interface EnhancedExpenseFormProps {
  members: Member[]
  projects: Project[]
  onAddExpense: (expense: Expense) => void
  onBack: () => void
}

export function EnhancedExpenseForm({ members, projects, onAddExpense, onBack }: EnhancedExpenseFormProps) {
  const { theme, setTheme } = useTheme()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const categories = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Compras",
    "Serviços",
    "Outros",
  ]

  const paymentMethods = ["Dinheiro", "Cartão de Débito", "Cartão de Crédito", "PIX", "Transferência", "Outros"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !amount || !category || selectedMembers.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description,
      amount: Number.parseFloat(amount),
      category,
      date: date.toISOString(),
      memberIds: selectedMembers,
      projectId: selectedProject || undefined,
      notes: notes || undefined,
      paymentMethod: paymentMethod || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onAddExpense(expense)

    // Reset form
    setDescription("")
    setAmount("")
    setCategory("")
    setDate(new Date())
    setSelectedMembers([])
    setSelectedProject("")
    setNotes("")
    setPaymentMethod("")
  }

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const splitAmount = selectedMembers.length > 0 ? (Number.parseFloat(amount) || 0) / selectedMembers.length : 0

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header com botão de tema */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Nova Despesa</h1>
            </div>
          </div>

          {/* Botão de alternância de tema */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Informações da Despesa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm">
                    Descrição *
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Compras no supermercado"
                    className="h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="amount" className="text-sm">
                    Valor (R$) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="h-9"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-sm">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Data *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {projects.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-sm">Projeto (Opcional)</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-sm">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais..."
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Membros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Dividir Entre *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => toggleMemberSelection(member.id)}
                    className={cn(
                      "p-2 rounded-lg border cursor-pointer transition-colors",
                      selectedMembers.includes(member.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{member.name}</span>
                      {selectedMembers.includes(member.id) && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          R$ {splitAmount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedMembers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selecione pelo menos um membro para dividir a despesa
                </p>
              )}
            </CardContent>
          </Card>

          {/* Resumo */}
          {selectedMembers.length > 0 && amount && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor total:</span>
                    <span className="font-medium">R$ {Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividido entre:</span>
                    <span className="font-medium">{selectedMembers.length} pessoa(s)</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Valor por pessoa:</span>
                    <span className="font-bold text-primary">R$ {splitAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Voltar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Adicionar Despesa
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
