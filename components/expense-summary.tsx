"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"
import type { ExpenseSummary as ExpenseSummaryType } from "@/types/expense"

interface ExpenseSummaryProps {
  expenseSummary: ExpenseSummaryType[]
  totalExpenses: number
}

export function ExpenseSummary({ expenseSummary, totalExpenses }: ExpenseSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600"
    if (balance < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (balance < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <DollarSign className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          <CardDescription>Visão geral dos gastos e divisões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalExpenses)}</div>
              <div className="text-sm text-muted-foreground">Total de Despesas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{expenseSummary.length}</div>
              <div className="text-sm text-muted-foreground">Membros Ativos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalExpenses / (expenseSummary.length || 1))}
              </div>
              <div className="text-sm text-muted-foreground">Média por Membro</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo por Membro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumo por Membro
          </CardTitle>
          <CardDescription>Quanto cada membro gastou e deve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseSummary.map((member) => {
              const participationPercentage = totalExpenses > 0 ? (member.totalPaid / totalExpenses) * 100 : 0

              return (
                <div key={member.memberId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {member.memberName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.memberName}</h3>
                        <p className="text-sm text-muted-foreground">{participationPercentage.toFixed(1)}% do total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${getBalanceColor(member.balance)}`}>
                        {getBalanceIcon(member.balance)}
                        <span className="font-semibold">{formatCurrency(Math.abs(member.balance))}</span>
                      </div>
                      <Badge variant={member.balance >= 0 ? "default" : "destructive"} className="text-xs">
                        {member.balance >= 0 ? "A receber" : "A pagar"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Pago</div>
                      <div className="font-semibold text-green-600">{formatCurrency(member.totalPaid)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Devido</div>
                      <div className="font-semibold text-blue-600">{formatCurrency(member.totalOwed)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Participação nos gastos</span>
                      <span>{participationPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={participationPercentage} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>

          {expenseSummary.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
              <p className="text-sm">Adicione membros para ver o resumo financeiro</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Export com alias para compatibilidade
export { ExpenseSummary as ExpenseSummaryComponent }
