"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Receipt } from "lucide-react"
import type { Expense, FamilyMember, Project } from "../types/expense"

interface ExpenseListProps {
  expenses: Expense[]
  members: FamilyMember[]
  projects: Project[]
  onRemoveExpense: (id: string) => void
}

export function ExpenseList({ expenses, members, projects, onRemoveExpense }: ExpenseListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getMemberName = (id: string) => {
    return members.find((member) => member.id === id)?.name || "Desconhecido"
  }

  const getSplitNames = (ids: string[]) => {
    return ids.map((id) => getMemberName(id)).join(", ")
  }

  const getProject = (id?: string) => {
    if (!id) return null
    return projects.find((project) => project.id === id)
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma despesa cadastrada ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{expense.description}</h3>
                  <Badge variant="outline">{expense.category}</Badge>
                  {expense.projectId &&
                    (() => {
                      const project = getProject(expense.projectId)
                      return project ? (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{ backgroundColor: `${project.color}20`, color: project.color }}
                        >
                          {project.icon} {project.name}
                        </Badge>
                      ) : null
                    })()}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Valor: {formatCurrency(expense.amount)}</div>
                  <div>Data: {formatDate(expense.date)}</div>
                  <div>Pago por: {getMemberName(expense.paidBy)}</div>
                  <div>Dividido entre: {getSplitNames(expense.splitBetween)}</div>
                  <div>Valor por pessoa: {formatCurrency(expense.amount / expense.splitBetween.length)}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveExpense(expense.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
