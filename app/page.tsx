"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExpenses } from "@/hooks/useExpenses"
import { useAdmin } from "@/hooks/useAdmin"
import { AddMemberForm } from "@/components/add-member-form"
import { ExpenseList } from "@/components/expense-list"
import { MemberList } from "@/components/member-list"
import { Users, Receipt, FolderOpen, Repeat, Wallet, TrendingUp, Shield, Plus, Settings } from "lucide-react"
import { EnhancedExpenseForm } from "@/components/enhanced-expense-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectManagement } from "@/components/project-management"
import { ProjectSummaryComponent } from "@/components/project-summary"
import { RecurringExpensesManager } from "@/components/recurring-expenses-manager"
import { WalletManagement } from "@/components/wallet-management"
import { FinancialDashboard } from "@/components/financial-dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { AddExpenseForm } from "@/components/add-expense-form"

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

  // Estado para controlar a view atual
  const [currentView, setCurrentView] = useState<
    "main" | "add-expense" | "admin" | "wallet" | "recurring" | "projects" | "expenses" | "members"
  >("main")

  // Renderização da página Nova Despesa (página dedicada)
  if (currentView === "add-expense") {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedExpenseForm
          members={members}
          projects={projects}
          onAddExpense={(expense) => {
            addExpense(expense)
            // Após adicionar, volta para a página principal
            setCurrentView("main")
          }}
          onBack={() => setCurrentView("main")}
        />
      </div>
    )
  }

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel onClose={() => setCurrentView("main")} />
      </div>
    )
  }

  // Renderização de views específicas
  if (currentView === "wallet") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Voltar ao Dashboard
            </Button>
          </div>
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
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Voltar ao Dashboard
            </Button>
          </div>
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
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Voltar ao Dashboard
            </Button>
          </div>
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
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Voltar ao Dashboard
            </Button>
          </div>
          <ExpenseList expenses={expenses} members={members} projects={projects} onRemoveExpense={removeExpense} />
        </div>
      </div>
    )
  }

  if (currentView === "members") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-2 sm:p-4">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Voltar ao Dashboard
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <MemberList members={members} onRemoveMember={removeMember} />
            <AddMemberForm onAddMember={addMember} />
          </div>
        </div>
      </div>
    )
  }

  // Dashboard principal - PÁGINA INICIAL OTIMIZADA
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-2 sm:p-4">
        {/* Header compacto */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Controle Financeiro</h1>
              <p className="text-muted-foreground text-sm">Gerencie suas despesas de forma simples e eficiente</p>
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

        {/* Layout principal em grid - OTIMIZADO PARA CADASTRO */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal - Formulário de despesa em destaque */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Nova Despesa - DESTAQUE PRINCIPAL */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Plus className="h-5 w-5" />
                  Adicionar Nova Despesa
                </CardTitle>
                <CardDescription>
                  Registre rapidamente uma nova despesa - todos os campos essenciais em um só lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddExpenseForm />
              </CardContent>
            </Card>

            {/* Botão para formulário avançado */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setCurrentView("add-expense")}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Formulário Avançado
              </Button>
            </div>

            {/* Despesas recentes - compacto */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Despesas Recentes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("expenses")}
                    className="text-primary hover:text-primary/80"
                  >
                    Ver todas →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 3).map((expense) => {
                    const member = members.find((m) => m.id === expense.memberId)
                    const project = projects.find((p) => p.id === expense.projectId)

                    return (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{expense.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {member?.name} • {expense.category}
                            {project && ` • ${project.name}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(expense.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {expenses.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma despesa registrada ainda</p>
                      <p className="text-xs">Use o formulário acima para adicionar sua primeira despesa</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Resumo e ações rápidas */}
          <div className="space-y-6">
            {/* Resumo financeiro */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Resumo do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalExpenses)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total de Despesas</div>
                  </div>

                  <div className="space-y-2">
                    {expenseSummary.slice(0, 3).map((member) => (
                      <div key={member.memberId} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{member.memberName}</span>
                        <span className="text-muted-foreground">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(member.totalPaid)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações rápidas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("members")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Membros</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("projects")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span className="text-xs">Projetos</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("wallet")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs">Carteiras</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView("recurring")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Repeat className="h-4 w-4" />
                    <span className="text-xs">Recorrentes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status dos membros */}
            {members.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Membros Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {members.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    ))}

                    {members.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        +{members.length - 4} outros membros
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs secundárias - Dashboard avançado */}
        <div className="mt-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard Avançado
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Análises
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              {isServiceEnabled("financial-dashboard") && (
                <FinancialDashboard
                  monthlyFinancialSummary={monthlyFinancialSummary}
                  recurringExpenses={recurringExpenses}
                />
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análises Detalhadas</CardTitle>
                  <CardDescription>Insights sobre seus padrões de gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-muted-foreground">Análises avançadas e gráficos interativos em breve</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>Exporte e visualize relatórios detalhados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-muted-foreground">Relatórios em PDF e Excel em breve</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>Personalize sua experiência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Tema</h4>
                        <p className="text-sm text-muted-foreground">Escolha entre claro e escuro</p>
                      </div>
                      <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Painel Administrativo</h4>
                        <p className="text-sm text-muted-foreground">Gerencie usuários e permissões</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCurrentView("admin")}>
                        Abrir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
