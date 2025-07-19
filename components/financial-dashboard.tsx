"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar, Target } from "lucide-react"
import type { MonthlyFinancialSummary, RecurringExpense } from "../types/expense"

interface FinancialDashboardProps {
  monthlyFinancialSummary: MonthlyFinancialSummary[]
  recurringExpenses: RecurringExpense[]
}

export function FinancialDashboard({ monthlyFinancialSummary, recurringExpenses }: FinancialDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalWalletBalance = monthlyFinancialSummary.reduce((sum, member) => sum + member.walletBalance, 0)
  const totalMonthlyIncome = monthlyFinancialSummary.reduce((sum, member) => sum + member.monthlyIncome, 0)
  const totalRecurringExpenses = recurringExpenses.filter((re) => re.isActive).reduce((sum, re) => sum + re.amount, 0)
  const totalAvailableBalance = monthlyFinancialSummary.reduce((sum, member) => sum + member.availableBalance, 0)

  const healthyMembers = monthlyFinancialSummary.filter((member) => member.isBalanceHealthy).length
  const totalMembers = monthlyFinancialSummary.length

  const getHealthStatus = () => {
    if (healthyMembers === totalMembers) return { status: "healthy", message: "Todas as finanças estão saudáveis" }
    if (healthyMembers === 0) return { status: "critical", message: "Atenção: Todos os membros estão no vermelho" }
    return { status: "warning", message: `${totalMembers - healthyMembers} membro(s) com saldo insuficiente` }
  }

  const healthStatus = getHealthStatus()

  return (
    <div className="space-y-6">
      {/* Financial Health Alert */}
      <Alert
        className={
          healthStatus.status === "critical"
            ? "border-red-500"
            : healthStatus.status === "warning"
              ? "border-yellow-500"
              : "border-green-500"
        }
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{healthStatus.message}</AlertDescription>
      </Alert>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalWalletBalance)}</div>
            <p className="text-xs text-muted-foreground">Soma de todas as carteiras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renda Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalMonthlyIncome)}</div>
            <p className="text-xs text-muted-foreground">Total de entradas mensais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Fixos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRecurringExpenses)}</div>
            <p className="text-xs text-muted-foreground">Despesas fixas mensais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Livre</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalAvailableBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalAvailableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Após despesas fixas</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health by Member */}
      <Card>
        <CardHeader>
          <CardTitle>Saúde Financeira por Membro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyFinancialSummary.map((member) => {
              const expenseRatio = member.monthlyIncome > 0 ? (member.totalExpenses / member.monthlyIncome) * 100 : 0
              const balanceRatio = member.monthlyIncome > 0 ? (member.walletBalance / member.monthlyIncome) * 100 : 0

              return (
                <div key={member.memberId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {member.memberName.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-medium">{member.memberName}</h3>
                      {member.isBalanceHealthy ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Saudável
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Atenção
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(member.availableBalance)}</div>
                      <div className="text-sm text-muted-foreground">Saldo livre</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Carteira</div>
                      <div className="font-medium">{formatCurrency(member.walletBalance)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Renda Mensal</div>
                      <div className="font-medium">{formatCurrency(member.monthlyIncome)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Gastos Fixos</div>
                      <div className="font-medium">{formatCurrency(member.recurringExpenses)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Gastos</div>
                      <div className="font-medium">{formatCurrency(member.totalExpenses)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Comprometimento da Renda</span>
                      <span>{expenseRatio.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={Math.min(expenseRatio, 100)}
                      className={`h-2 ${expenseRatio > 80 ? "bg-red-100" : expenseRatio > 60 ? "bg-yellow-100" : "bg-green-100"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reserva (meses de renda)</span>
                      <span>
                        {member.monthlyIncome > 0 ? (member.walletBalance / member.monthlyIncome).toFixed(1) : "0"}x
                      </span>
                    </div>
                    <Progress
                      value={Math.min(balanceRatio, 300)}
                      max={300}
                      className={`h-2 ${balanceRatio < 100 ? "bg-red-100" : balanceRatio < 200 ? "bg-yellow-100" : "bg-green-100"}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Projeção Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalMonthlyIncome)}</div>
              <div className="text-sm text-muted-foreground">Entradas Previstas</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRecurringExpenses)}</div>
              <div className="text-sm text-muted-foreground">Saídas Fixas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalMonthlyIncome - totalRecurringExpenses)}
              </div>
              <div className="text-sm text-muted-foreground">Sobra Estimada</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
