"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react"
import type { RecurringExpense, RecurringPayment, FamilyMember, Project } from "../types/expense"

interface RecurringExpensesCalendarProps {
  recurringExpenses: RecurringExpense[]
  recurringPayments: RecurringPayment[]
  members: FamilyMember[]
  projects: Project[]
  onMarkPayment: (recurringExpenseId: string, month: string, isPaid: boolean) => void
  onUpdateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void
  onRemoveRecurringExpense: (id: string) => void
}

export function RecurringExpensesCalendar({
  recurringExpenses,
  recurringPayments,
  members,
  projects,
  onMarkPayment,
  onUpdateRecurringExpense,
  onRemoveRecurringExpense,
}: RecurringExpensesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getMemberName = (id: string) => {
    return members.find((member) => member.id === id)?.name || "Desconhecido"
  }

  const getProject = (id?: string) => {
    if (!id) return null
    return projects.find((project) => project.id === id)
  }

  const getCurrentMonth = () => {
    return currentDate.toISOString().slice(0, 7) // formato: "2024-01"
  }

  const getMonthName = () => {
    return currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getPaymentStatus = (recurringExpenseId: string, month: string) => {
    return recurringPayments.find(
      (payment) => payment.recurringExpenseId === recurringExpenseId && payment.month === month,
    )
  }

  const isOverdue = (dueDay: number, month: string) => {
    const today = new Date()
    const dueDate = new Date(`${month}-${dueDay.toString().padStart(2, "0")}`)
    return today > dueDate
  }

  const activeRecurringExpenses = recurringExpenses.filter((expense) => expense.isActive)
  const currentMonth = getCurrentMonth()

  const totalMonthlyAmount = activeRecurringExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const paidAmount = activeRecurringExpenses
    .filter((expense) => {
      const payment = getPaymentStatus(expense.id, currentMonth)
      return payment?.isPaid
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const pendingCount = activeRecurringExpenses.filter((expense) => {
    const payment = getPaymentStatus(expense.id, currentMonth)
    return !payment?.isPaid
  }).length

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda de Despesas Fixas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 bg-muted rounded-md font-medium min-w-[200px] text-center">
                {getMonthName()}
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalMonthlyAmount)}</div>
              <div className="text-sm text-muted-foreground">Total do Mês</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
              <div className="text-sm text-muted-foreground">Já Pago</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {activeRecurringExpenses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma despesa fixa cadastrada ainda.</p>
            </CardContent>
          </Card>
        ) : (
          activeRecurringExpenses
            .sort((a, b) => a.dueDay - b.dueDay)
            .map((expense) => {
              const payment = getPaymentStatus(expense.id, currentMonth)
              const isPaid = payment?.isPaid || false
              const overdue = !isPaid && isOverdue(expense.dueDay, currentMonth)
              const project = getProject(expense.projectId)

              return (
                <Card
                  key={expense.id}
                  className={`transition-all ${isPaid ? "bg-green-50 border-green-200" : overdue ? "bg-red-50 border-red-200" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Checkbox
                          checked={isPaid}
                          onCheckedChange={(checked) => onMarkPayment(expense.id, currentMonth, checked as boolean)}
                          className="scale-125"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{expense.name}</h3>
                            <Badge variant="outline">{expense.category}</Badge>
                            {project && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: `${project.color}20`, color: project.color }}
                              >
                                {project.icon} {project.name}
                              </Badge>
                            )}
                            {isPaid && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pago
                              </Badge>
                            )}
                            {overdue && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Atrasado
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Valor:</span> {formatCurrency(expense.amount)}
                            </div>
                            <div>
                              <span className="font-medium">Vencimento:</span> Dia {expense.dueDay}
                            </div>
                            <div>
                              <span className="font-medium">Responsável:</span> {getMemberName(expense.responsibleId)}
                            </div>
                            <div>
                              <span className="font-medium">Por pessoa:</span>{" "}
                              {formatCurrency(expense.amount / expense.splitBetween.length)}
                            </div>
                          </div>

                          {expense.notes && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium">Obs:</span> {expense.notes}
                            </div>
                          )}

                          {payment?.paidDate && (
                            <div className="mt-2 text-sm text-green-600">
                              <span className="font-medium">Pago em:</span>{" "}
                              {new Date(payment.paidDate).toLocaleDateString("pt-BR")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Aqui você pode implementar a edição
                            console.log("Edit expense:", expense.id)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onRemoveRecurringExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
        )}
      </div>
    </div>
  )
}
