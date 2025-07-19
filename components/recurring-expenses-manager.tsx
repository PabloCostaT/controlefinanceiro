"use client"

import { RecurringExpensesForm } from "./recurring-expenses-form"
import { RecurringExpensesCalendar } from "./recurring-expenses-calendar"
import type { RecurringExpense, RecurringPayment, FamilyMember, Project } from "../types/expense"

interface RecurringExpensesManagerProps {
  recurringExpenses: RecurringExpense[]
  recurringPayments: RecurringPayment[]
  members: FamilyMember[]
  projects: Project[]
  onAddRecurringExpense: (expense: Omit<RecurringExpense, "id" | "createdAt">) => void
  onUpdateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void
  onRemoveRecurringExpense: (id: string) => void
  onMarkPayment: (recurringExpenseId: string, month: string, isPaid: boolean) => void
}

export function RecurringExpensesManager({
  recurringExpenses,
  recurringPayments,
  members,
  projects,
  onAddRecurringExpense,
  onUpdateRecurringExpense,
  onRemoveRecurringExpense,
  onMarkPayment,
}: RecurringExpensesManagerProps) {
  return (
    <div className="space-y-6">
      <RecurringExpensesForm members={members} projects={projects} onAddRecurringExpense={onAddRecurringExpense} />

      <RecurringExpensesCalendar
        recurringExpenses={recurringExpenses}
        recurringPayments={recurringPayments}
        members={members}
        projects={projects}
        onMarkPayment={onMarkPayment}
        onUpdateRecurringExpense={onUpdateRecurringExpense}
        onRemoveRecurringExpense={onRemoveRecurringExpense}
      />
    </div>
  )
}
