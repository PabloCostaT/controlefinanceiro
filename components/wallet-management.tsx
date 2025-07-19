"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Wallet, TrendingUp, TrendingDown, DollarSign, Edit } from "lucide-react"
import type { FamilyMember, WalletTransaction } from "../types/expense"

interface WalletManagementProps {
  members: FamilyMember[]
  walletTransactions: WalletTransaction[]
  onUpdateMember: (id: string, updates: Partial<FamilyMember>) => void
  onAddTransaction: (transaction: Omit<WalletTransaction, "id">) => void
}

export function WalletManagement({
  members,
  walletTransactions,
  onUpdateMember,
  onAddTransaction,
}: WalletManagementProps) {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [transactionForm, setTransactionForm] = useState({
    memberId: "",
    type: "income" as "income" | "expense",
    amount: "",
    description: "",
    category: "",
  })
  const [memberForm, setMemberForm] = useState({
    walletBalance: "",
    monthlyIncome: "",
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transactionForm.memberId && transactionForm.amount && transactionForm.description) {
      onAddTransaction({
        memberId: transactionForm.memberId,
        type: transactionForm.type,
        amount: Number.parseFloat(transactionForm.amount),
        description: transactionForm.description,
        date: new Date().toISOString().split("T")[0],
        category: transactionForm.category || undefined,
      })

      setTransactionForm({
        memberId: "",
        type: "income",
        amount: "",
        description: "",
        category: "",
      })
      setShowTransactionForm(false)
    }
  }

  const handleMemberUpdate = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (member && memberForm.walletBalance && memberForm.monthlyIncome) {
      onUpdateMember(memberId, {
        walletBalance: Number.parseFloat(memberForm.walletBalance),
        monthlyIncome: Number.parseFloat(memberForm.monthlyIncome),
      })
      setEditingMember(null)
      setMemberForm({ walletBalance: "", monthlyIncome: "" })
    }
  }

  const startEditingMember = (member: FamilyMember) => {
    setEditingMember(member.id)
    setMemberForm({
      walletBalance: member.walletBalance.toString(),
      monthlyIncome: member.monthlyIncome?.toString() || "",
    })
  }

  const getRecentTransactions = (memberId: string, limit = 5) => {
    return walletTransactions
      .filter((t) => t.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  const totalWalletBalance = members.reduce((sum, member) => sum + member.walletBalance, 0)
  const totalMonthlyIncome = members.reduce((sum, member) => sum + (member.monthlyIncome || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Controle de Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalWalletBalance)}</div>
              <div className="text-sm text-muted-foreground">Saldo Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalMonthlyIncome)}</div>
              <div className="text-sm text-muted-foreground">Renda Mensal</div>
            </div>
            <div className="text-center">
              <Button onClick={() => setShowTransactionForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form */}
      {showTransactionForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Membro *</Label>
                  <Select
                    value={transactionForm.memberId}
                    onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, memberId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o membro" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo *</Label>
                  <Select
                    value={transactionForm.type}
                    onValueChange={(value: "income" | "expense") =>
                      setTransactionForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Entrada
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Saída
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Salário, Freelance, Compras..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a transação..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {transactionForm.type === "income" ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Entrada
                    </>
                  ) : (
                    <>
                      <Minus className="h-4 w-4 mr-2" />
                      Registrar Saída
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members Wallets */}
      <div className="grid gap-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  {member.name}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={() => startEditingMember(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingMember === member.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="walletBalance">Saldo Atual (R$)</Label>
                      <Input
                        id="walletBalance"
                        type="number"
                        step="0.01"
                        value={memberForm.walletBalance}
                        onChange={(e) => setMemberForm((prev) => ({ ...prev, walletBalance: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        step="0.01"
                        value={memberForm.monthlyIncome}
                        onChange={(e) => setMemberForm((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleMemberUpdate(member.id)} className="flex-1">
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setEditingMember(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(member.walletBalance)}</div>
                      <div className="text-sm text-muted-foreground">Saldo Atual</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(member.monthlyIncome || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Renda Mensal</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Transações Recentes</h4>
                    <div className="space-y-2">
                      {getRecentTransactions(member.id).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <div className="text-sm font-medium">{transaction.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString("pt-BR")}
                                {transaction.category && ` • ${transaction.category}`}
                              </div>
                            </div>
                          </div>
                          <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </Badge>
                        </div>
                      ))}
                      {getRecentTransactions(member.id).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhuma transação ainda</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
