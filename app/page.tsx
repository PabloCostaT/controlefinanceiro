"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExpenses } from "../hooks/useExpenses"
import { useAdmin } from "../hooks/useAdmin"
import { AddMemberForm } from "../components/add-member-form"
import { ExpenseList } from "../components/expense-list"
import { MemberList } from "../components/member-list"
import { Users, Receipt, FolderOpen, Repeat, Wallet, TrendingUp, Shield } from "lucide-react"
import { useState } from "react"
import { EnhancedExpenseForm } from "../components/enhanced-expense-form"
import { Button } from "@/components/ui/button"
import { ProjectManagement } from "../components/project-management"
import { ProjectSummaryComponent } from "../components/project-summary"
import { RecurringExpensesManager } from "../components/recurring-expenses-manager"
import { WalletManagement } from "../components/wallet-management"
import { FinancialDashboard } from "../components/financial-dashboard"
import { AdminPanel } from "../components/admin-panel"
import { ThemeToggle } from "../components/theme-toggle"

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

  const { isServiceEnabled } = useAdmin()

  // Página inicial agora é "add-expense"
  const [currentView, setCurrentView] = useState<
    "main" | "add-expense" | "admin" | "wallet" | "recurring" | "projects" | "expenses" | "members"
  >("add-expense")

  const handleViewChange = (view: string) => {
    setCurrentView(view as any)
  }

  // Renderização da página Nova Despesa (página inicial) - Layout compacto
  if (currentView === "add-expense") {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedExpenseForm
          members={members}
          projects={projects}
          onAddExpense={(expense) => {
            addExpense(expense)
            // Após adicionar, permanece na mesma página para facilitar múltiplas adições
          }}
          onBack={() => setCurrentView("main")}
        />
      </div>
    )
  }

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel onClose={() => setCurrentView("add-expense")} />
      </div>
    )
  }

  // Renderização de views específicas com layout compacto
  if (currentView === "wallet") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <WalletManagement
            members={members}
            walletTransactions={walletTransactions}
            onUpdateMember={updateMember}
            onAddTransaction={addWalletTransaction}
          />
        </div>
      </div>
    )
  }

  if (currentView === "recurring") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
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
        </div>
      </div>
    )
  }

  if (currentView === "projects") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <div className="space-y-4">
            <ProjectSummaryComponent projectSummaries={projectSummaries} projects={projects} />
            <ProjectManagement
              projects={projects}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onRemoveProject={removeProject}
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "expenses") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <ExpenseList expenses={expenses} members={members} projects={projects} onRemoveExpense={removeExpense} />
        </div>
      </div>
    )
  }

  if (currentView === "members") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <MemberList members={members} onRemoveMember={removeMember} />
            <AddMemberForm onAddMember={addMember} />
          </div>
        </div>
      </div>
    )
  }

  // Dashboard principal com layout compacto
  const availableTabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, serviceId: "financial-dashboard" },
    { id: "wallet", label: "Carteira", icon: Wallet, serviceId: "wallet-management" },
    { id: "recurring", label: "Fixas", icon: Repeat, serviceId: "recurring-expenses" },
    { id: "projects", label: "Projetos", icon: FolderOpen, serviceId: "project-management" },
    { id: "expenses", label: "Despesas", icon: Receipt, serviceId: "expense-management" },
    { id: "members", label: "Membros", icon: Users, serviceId: "member-management" },
  ].filter((tab) => isServiceEnabled(tab.serviceId))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">Dashboard Financeiro</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Visão geral das suas finanças familiares</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("admin")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Botão de acesso rápido para Nova Despesa - mais compacto */}
        <div className="mb-4 flex justify-center">
          <Button onClick={() => setCurrentView("add-expense")} className="bg-primary hover:bg-primary/90">
            <Receipt className="h-4 w-4 mr-2" />
            Nova Despesa
          </Button>
        </div>

        <Tabs defaultValue={availableTabs[0]?.id || "dashboard"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 h-8 sm:h-10">
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs sm:text-sm px-2">
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {isServiceEnabled("financial-dashboard") && (
            <TabsContent value="dashboard" className="mt-4">
              <FinancialDashboard
                monthlyFinancialSummary={monthlyFinancialSummary}
                recurringExpenses={recurringExpenses}
              />
            </TabsContent>
          )}

          {isServiceEnabled("wallet-management") && (
            <TabsContent value="wallet" className="mt-4">
              <WalletManagement
                members={members}
                walletTransactions={walletTransactions}
                onUpdateMember={updateMember}
                onAddTransaction={addWalletTransaction}
              />
            </TabsContent>
          )}

          {isServiceEnabled("recurring-expenses") && (
            <TabsContent value="recurring" className="mt-4">
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
          )}

          {isServiceEnabled("project-management") && (
            <TabsContent value="projects" className="mt-4">
              <div className="space-y-4">
                <ProjectSummaryComponent projectSummaries={projectSummaries} projects={projects} />
                <ProjectManagement
                  projects={projects}
                  onAddProject={addProject}
                  onUpdateProject={updateProject}
                  onRemoveProject={removeProject}
                />
              </div>
            </TabsContent>
          )}

          {isServiceEnabled("expense-management") && (
            <TabsContent value="expenses" className="mt-4">
              <ExpenseList expenses={expenses} members={members} projects={projects} onRemoveExpense={removeExpense} />
            </TabsContent>
          )}

          {isServiceEnabled("member-management") && (
            <TabsContent value="members" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <MemberList members={members} onRemoveMember={removeMember} />
                <AddMemberForm onAddMember={addMember} />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
