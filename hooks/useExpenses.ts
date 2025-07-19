"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  FamilyMember,
  Expense,
  ExpenseSummary,
  Project,
  ProjectSummary,
  RecurringExpense,
  RecurringPayment,
  WalletTransaction,
  MonthlyFinancialSummary,
} from "../types/expense"

export function useExpenses() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "1", name: "João", email: "joao@email.com", walletBalance: 2500.0, monthlyIncome: 4000.0 },
    { id: "2", name: "Maria", email: "maria@email.com", walletBalance: 1800.0, monthlyIncome: 3500.0 },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Viagem para Praia",
      description: "Férias de verão na praia",
      startDate: "2024-01-15",
      endDate: "2024-01-22",
      color: "#3B82F6",
      icon: "🏖️",
      isActive: true,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Festa de Aniversário",
      description: "Aniversário da Maria",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      color: "#EF4444",
      icon: "🎉",
      isActive: false,
      createdAt: "2024-01-05",
    },
  ])

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: "1",
      name: "Aluguel",
      amount: 1200.0,
      dueDay: 10,
      responsibleId: "1",
      category: "Casa",
      splitBetween: ["1", "2"],
      isActive: true,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Conta de Luz",
      amount: 180.0,
      dueDay: 15,
      responsibleId: "2",
      category: "Utilidades",
      splitBetween: ["1", "2"],
      isActive: true,
      createdAt: "2024-01-01",
    },
  ])

  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([
    {
      id: "1",
      recurringExpenseId: "1",
      month: "2024-01",
      isPaid: true,
      paidDate: "2024-01-10",
    },
    {
      id: "2",
      recurringExpenseId: "2",
      month: "2024-01",
      isPaid: false,
    },
  ])

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: "1",
      memberId: "1",
      type: "income",
      amount: 4000.0,
      description: "Salário Janeiro",
      date: "2024-01-01",
      category: "Salário",
    },
    {
      id: "2",
      memberId: "2",
      type: "income",
      amount: 3500.0,
      description: "Salário Janeiro",
      date: "2024-01-01",
      category: "Salário",
    },
  ])

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Supermercado",
      amount: 250.0,
      date: "2024-01-15",
      paidBy: "1",
      category: "Alimentação",
      splitBetween: ["1", "2"],
      projectId: "1",
    },
    {
      id: "2",
      description: "Conta de Luz",
      amount: 180.5,
      date: "2024-01-10",
      paidBy: "2",
      category: "Utilidades",
      splitBetween: ["1", "2"],
    },
    {
      id: "3",
      description: "Hotel na Praia",
      amount: 800.0,
      date: "2024-01-16",
      paidBy: "1",
      category: "Hospedagem",
      splitBetween: ["1", "2"],
      projectId: "1",
    },
  ])

  const addMember = useCallback((member: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
    }
    setMembers((prev) => [...prev, newMember])
  }, [])

  const updateMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updates } : member)))
  }, [])

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
    setExpenses((prev) => prev.filter((expense) => expense.paidBy !== id))
  }, [])

  const addWalletTransaction = useCallback((transaction: Omit<WalletTransaction, "id">) => {
    const newTransaction: WalletTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setWalletTransactions((prev) => [...prev, newTransaction])

    // Atualizar saldo do membro
    setMembers((prev) =>
      prev.map((member) => {
        if (member.id === transaction.memberId) {
          const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount
          return { ...member, walletBalance: member.walletBalance + balanceChange }
        }
        return member
      }),
    )
  }, [])

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setProjects((prev) => [...prev, newProject])
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }, [])

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
    setExpenses((prev) =>
      prev.map((expense) => (expense.projectId === id ? { ...expense, projectId: undefined } : expense)),
    )
  }, [])

  const addRecurringExpense = useCallback((recurringExpense: Omit<RecurringExpense, "id" | "createdAt">) => {
    const newRecurringExpense: RecurringExpense = {
      ...recurringExpense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setRecurringExpenses((prev) => [...prev, newRecurringExpense])
  }, [])

  const updateRecurringExpense = useCallback((id: string, updates: Partial<RecurringExpense>) => {
    setRecurringExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense)))
  }, [])

  const removeRecurringExpense = useCallback((id: string) => {
    setRecurringExpenses((prev) => prev.filter((expense) => expense.id !== id))
    setRecurringPayments((prev) => prev.filter((payment) => payment.recurringExpenseId !== id))
  }, [])

  const markRecurringPayment = useCallback(
    (recurringExpenseId: string, month: string, isPaid: boolean) => {
      const paymentId = `${recurringExpenseId}-${month}`

      if (isPaid) {
        const recurringExpense = recurringExpenses.find((re) => re.id === recurringExpenseId)
        if (recurringExpense) {
          const newExpense: Expense = {
            id: Date.now().toString(),
            description: recurringExpense.name,
            amount: recurringExpense.amount,
            date: new Date().toISOString().split("T")[0],
            paidBy: recurringExpense.responsibleId,
            category: recurringExpense.category,
            splitBetween: recurringExpense.splitBetween,
            projectId: recurringExpense.projectId,
            fromRecurring: recurringExpenseId,
            notes: `Despesa fixa: ${recurringExpense.name}`,
          }
          setExpenses((prev) => [...prev, newExpense])

          // Adicionar transação na carteira
          addWalletTransaction({
            memberId: recurringExpense.responsibleId,
            type: "expense",
            amount: recurringExpense.amount,
            description: `Pagamento: ${recurringExpense.name}`,
            date: new Date().toISOString().split("T")[0],
            category: recurringExpense.category,
            relatedExpenseId: newExpense.id,
          })

          setRecurringPayments((prev) => {
            const existingPayment = prev.find((p) => p.recurringExpenseId === recurringExpenseId && p.month === month)
            if (existingPayment) {
              return prev.map((p) =>
                p.id === existingPayment.id
                  ? { ...p, isPaid: true, paidDate: new Date().toISOString().split("T")[0], expenseId: newExpense.id }
                  : p,
              )
            } else {
              return [
                ...prev,
                {
                  id: paymentId,
                  recurringExpenseId,
                  month,
                  isPaid: true,
                  paidDate: new Date().toISOString().split("T")[0],
                  expenseId: newExpense.id,
                },
              ]
            }
          })
        }
      } else {
        const payment = recurringPayments.find((p) => p.recurringExpenseId === recurringExpenseId && p.month === month)
        if (payment?.expenseId) {
          setExpenses((prev) => prev.filter((e) => e.id !== payment.expenseId))
          // Remover transação da carteira
          setWalletTransactions((prev) => prev.filter((t) => t.relatedExpenseId !== payment.expenseId))
          // Restaurar saldo
          const recurringExpense = recurringExpenses.find((re) => re.id === recurringExpenseId)
          if (recurringExpense) {
            setMembers((prev) =>
              prev.map((member) =>
                member.id === recurringExpense.responsibleId
                  ? { ...member, walletBalance: member.walletBalance + recurringExpense.amount }
                  : member,
              ),
            )
          }
        }

        setRecurringPayments((prev) => {
          const existingPayment = prev.find((p) => p.recurringExpenseId === recurringExpenseId && p.month === month)
          if (existingPayment) {
            return prev.map((p) =>
              p.id === existingPayment.id ? { ...p, isPaid: false, paidDate: undefined, expenseId: undefined } : p,
            )
          } else {
            return [
              ...prev,
              {
                id: paymentId,
                recurringExpenseId,
                month,
                isPaid: false,
              },
            ]
          }
        })
      }
    },
    [recurringExpenses, recurringPayments, addWalletTransaction],
  )

  const addExpense = useCallback(
    (expense: Omit<Expense, "id">) => {
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
      }
      setExpenses((prev) => [...prev, newExpense])

      // Adicionar transação na carteira
      addWalletTransaction({
        memberId: expense.paidBy,
        type: "expense",
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        category: expense.category,
        relatedExpenseId: newExpense.id,
      })
    },
    [addWalletTransaction],
  )

  const removeExpense = useCallback(
    (id: string) => {
      const expense = expenses.find((e) => e.id === id)
      if (expense) {
        // Restaurar saldo na carteira
        setMembers((prev) =>
          prev.map((member) =>
            member.id === expense.paidBy ? { ...member, walletBalance: member.walletBalance + expense.amount } : member,
          ),
        )
        // Remover transação da carteira
        setWalletTransactions((prev) => prev.filter((t) => t.relatedExpenseId !== id))
      }
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    },
    [expenses],
  )

  const expenseSummary = useMemo((): ExpenseSummary[] => {
    return members.map((member) => {
      const totalPaid = expenses
        .filter((expense) => expense.paidBy === member.id)
        .reduce((sum, expense) => sum + expense.amount, 0)

      const totalOwed = expenses
        .filter((expense) => expense.splitBetween.includes(member.id))
        .reduce((sum, expense) => sum + expense.amount / expense.splitBetween.length, 0)

      return {
        memberId: member.id,
        memberName: member.name,
        totalPaid,
        totalOwed,
        balance: totalPaid - totalOwed,
      }
    })
  }, [members, expenses])

  const monthlyFinancialSummary = useMemo((): MonthlyFinancialSummary[] => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    return members.map((member) => {
      // Despesas do mês atual
      const monthlyExpenses = expenses
        .filter((expense) => expense.paidBy === member.id && expense.date.startsWith(currentMonth))
        .reduce((sum, expense) => sum + expense.amount, 0)

      // Despesas fixas do mês
      const memberRecurringExpenses = recurringExpenses
        .filter((re) => re.responsibleId === member.id && re.isActive)
        .reduce((sum, re) => sum + re.amount, 0)

      const totalExpenses = monthlyExpenses + memberRecurringExpenses
      const availableBalance = member.walletBalance - totalExpenses
      const isBalanceHealthy = availableBalance >= 0

      return {
        memberId: member.id,
        memberName: member.name,
        walletBalance: member.walletBalance,
        monthlyIncome: member.monthlyIncome || 0,
        totalExpenses,
        recurringExpenses: memberRecurringExpenses,
        availableBalance,
        isBalanceHealthy,
      }
    })
  }, [members, expenses, recurringExpenses])

  const projectSummaries = useMemo((): ProjectSummary[] => {
    return projects.map((project) => {
      const projectExpenses = expenses.filter((expense) => expense.projectId === project.id)
      const totalExpenses = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      const memberSummaries = members.map((member) => {
        const totalPaid = projectExpenses
          .filter((expense) => expense.paidBy === member.id)
          .reduce((sum, expense) => sum + expense.amount, 0)

        const totalOwed = projectExpenses
          .filter((expense) => expense.splitBetween.includes(member.id))
          .reduce((sum, expense) => sum + expense.amount / expense.splitBetween.length, 0)

        return {
          memberId: member.id,
          memberName: member.name,
          totalPaid,
          totalOwed,
          balance: totalPaid - totalOwed,
        }
      })

      return {
        projectId: project.id,
        projectName: project.name,
        totalExpenses,
        expenseCount: projectExpenses.length,
        memberSummaries,
      }
    })
  }, [projects, expenses, members])

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  return {
    members,
    projects,
    expenses,
    recurringExpenses,
    recurringPayments,
    walletTransactions,
    expenseSummary,
    projectSummaries,
    monthlyFinancialSummary,
    totalExpenses,
    addMember,
    updateMember,
    removeMember,
    addWalletTransaction,
    addProject,
    updateProject,
    removeProject,
    addRecurringExpense,
    updateRecurringExpense,
    removeRecurringExpense,
    markRecurringPayment,
    addExpense,
    removeExpense,
  }
}
