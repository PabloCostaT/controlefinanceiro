"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExpenses } from "../hooks/useExpenses"
import { AddMemberForm } from "../components/add-member-form"
import { ExpenseList } from "../components/expense-list"
import { MemberList } from "../components/member-list"
import { Users, Receipt, FolderOpen, Repeat, Wallet, TrendingUp } from "lucide-react"
import { useState } from "react"
import { EnhancedExpenseForm } from "../components/enhanced-expense-form"
import { Button } from "@/components/ui/button"
import { ProjectManagement } from "../components/project-management"
import { ProjectSummaryComponent } from "../components/project-summary"
import { RecurringExpensesManager } from "../components/recurring-expenses-manager"
import { WalletManagement } from "../components/wallet-management"
import { FinancialDashboard } from "../components/financial-dashboard"

export default function ExpenseTracker() {
  const {
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
  } = useExpenses()

  const [currentView, setCurrentView] = useState<"main" | "add-expense">("main")

  if (currentView === "add-expense") {
    return (
      <EnhancedExpenseForm
        members={members}
        projects={projects}
        onAddExpense={(expense) => {
          addExpense(expense)
          setCurrentView("main")
        }}
        onBack={() => setCurrentView("main")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Controle de Despesas Familiares</h1>
          <p className="text-muted-foreground">Gerencie e divida as despesas da casa entre os membros da família</p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button onClick={() => setCurrentView("add-expense")} size="lg" className="bg-primary hover:bg-primary/90">
            <Receipt className="h-5 w-5 mr-2" />
            Nova Despesa
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Carteira
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Fixas
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Despesas
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Membros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <FinancialDashboard
              monthlyFinancialSummary={monthlyFinancialSummary}
              recurringExpenses={recurringExpenses}
            />
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <WalletManagement
              members={members}
              walletTransactions={walletTransactions}
              onUpdateMember={updateMember}
              onAddTransaction={addWalletTransaction}
            />
          </TabsContent>

          <TabsContent value="recurring" className="mt-6">
            <RecurringExpensesManager
              recurringExpenses={recurringExpenses}
              recurringPayments={recurringPayments}
              members={members}
              projects={projects}
              onAddRecurringExpense={addRecurringExpense}
              onUpdateRecurringExpense={updateRecurringExpense}
              onRemoveRecurringExpense={removeRecurringExpense}
              onMarkPayment={markRecurringPayment}
            />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="space-y-6">
              <ProjectSummaryComponent projectSummaries={projectSummaries} projects={projects} />
              <ProjectManagement
                projects={projects}
                onAddProject={addProject}
                onUpdateProject={updateProject}
                onRemoveProject={removeProject}
              />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpenseList expenses={expenses} members={members} projects={projects} onRemoveExpense={removeExpense} />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <MemberList members={members} onRemoveMember={removeMember} />
              <AddMemberForm onAddMember={addMember} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
