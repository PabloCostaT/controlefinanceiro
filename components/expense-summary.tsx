"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { ExpenseSummary } from "../types/expense"

interface ExpenseSummaryProps {
  summary: ExpenseSummary[]
  totalExpenses: number
}

export function ExpenseSummaryComponent({ summary, totalExpenses }: ExpenseSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total de Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo por Membro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.map((member) => (
              <div key={member.memberId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{member.memberName}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Pagou: {formatCurrency(member.totalPaid)}</div>
                    <div>Deve: {formatCurrency(member.totalOwed)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {member.balance >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={member.balance >= 0 ? "default" : "destructive"}>
                      {member.balance >= 0 ? "Recebe" : "Deve"} {formatCurrency(Math.abs(member.balance))}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
