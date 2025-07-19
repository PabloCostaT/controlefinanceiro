export interface FamilyMember {
  id: string
  name: string
  email?: string
  walletBalance: number
  monthlyIncome?: number
}

export interface Project {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  color: string
  icon: string
  isActive: boolean
  createdAt: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  paidBy: string
  category: string
  splitBetween: string[]
  projectId?: string
  notes?: string
  fromRecurring?: string
}

export interface RecurringExpense {
  id: string
  name: string
  amount: number
  dueDay: number
  responsibleId: string
  category: string
  splitBetween: string[]
  projectId?: string
  isActive: boolean
  createdAt: string
  notes?: string
}

export interface RecurringPayment {
  id: string
  recurringExpenseId: string
  month: string
  isPaid: boolean
  paidDate?: string
  expenseId?: string
  notes?: string
}

export interface WalletTransaction {
  id: string
  memberId: string
  type: "income" | "expense" | "transfer"
  amount: number
  description: string
  date: string
  category?: string
  relatedExpenseId?: string
}

export interface ExpenseSummary {
  memberId: string
  memberName: string
  totalPaid: number
  totalOwed: number
  balance: number
}

export interface ProjectSummary {
  projectId: string
  projectName: string
  totalExpenses: number
  expenseCount: number
  memberSummaries: ExpenseSummary[]
}

export interface MonthlyFinancialSummary {
  memberId: string
  memberName: string
  walletBalance: number
  monthlyIncome: number
  totalExpenses: number
  recurringExpenses: number
  availableBalance: number
  isBalanceHealthy: boolean
}
