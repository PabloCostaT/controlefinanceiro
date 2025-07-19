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
import { Footer } from "../components/footer"
import { ResponsiveNav } from "@/components/responsive-nav"

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

  const [currentView, setCurrentView] = useState<"main" | "add-expense" | "admin">("main")

  if (currentView === "add-expense") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ResponsiveNav />
        <div className="flex-1">
          <EnhancedExpenseForm
            members={members}
            projects={projects}
            onAddExpense={(expense) => {
              addExpense(expense)
              setCurrentView("main")
            }}
            onBack={() => setCurrentView("main")}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ResponsiveNav />
        <div className="flex-1">
          <AdminPanel onClose={() => setCurrentView("main")} />
        </div>
        <Footer />
      </div>
    )
  }

  // Filtrar abas baseado nos serviços habilitados
  const availableTabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, serviceId: "financial-dashboard" },
    { id: "wallet", label: "Carteira", icon: Wallet, serviceId: "wallet-management" },
    { id: "recurring", label: "Fixas", icon: Repeat, serviceId: "recurring-expenses" },
    { id: "projects", label: "Projetos", icon: FolderOpen, serviceId: "project-management" },
    { id: "expenses", label: "Despesas", icon: Receipt, serviceId: "expense-management" },
    { id: "members", label: "Membros", icon: Users, serviceId: "member-management" },
  ].filter((tab) => isServiceEnabled(tab.serviceId))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ResponsiveNav />
      <div className="flex-1">
        <div className="container mx-auto p-4">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2">Controle de Despesas Familiares</h1>
                <p className="text-muted-foreground">
                  Gerencie e divida as despesas da casa entre os membros da família
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("admin")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </div>
          </div>

          {isServiceEnabled("expense-management") && (
            <div className="mb-6 flex justify-center">
              <Button
                onClick={() => setCurrentView("add-expense")}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Receipt className="h-5 w-5 mr-2" />
                Nova Despesa
              </Button>
            </div>
          )}

          <Tabs defaultValue={availableTabs[0]?.id || "dashboard"} className="w-full">
            <TabsList className={`grid w-full grid-cols-${availableTabs.length}`}>
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {isServiceEnabled("financial-dashboard") && (
              <TabsContent value="dashboard" className="mt-6">
                <FinancialDashboard
                  monthlyFinancialSummary={monthlyFinancialSummary}
                  recurringExpenses={recurringExpenses}
                />
              </TabsContent>
            )}

            {isServiceEnabled("wallet-management") && (
              <TabsContent value="wallet" className="mt-6">
                <WalletManagement
                  members={members}
                  walletTransactions={walletTransactions}
                  onUpdateMember={updateMember}
                  onAddTransaction={addWalletTransaction}
                />
              </TabsContent>
            )}

            {isServiceEnabled("recurring-expenses") && (
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
            )}

            {isServiceEnabled("project-management") && (
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
            )}

            {isServiceEnabled("expense-management") && (
              <TabsContent value="expenses" className="mt-6">
                <ExpenseList
                  expenses={expenses}
                  members={members}
                  projects={projects}
                  onRemoveExpense={removeExpense}
                />
              </TabsContent>
            )}

            {isServiceEnabled("member-management") && (
              <TabsContent value="members" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <MemberList members={members} onRemoveMember={removeMember} />
                  <AddMemberForm onAddMember={addMember} />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
