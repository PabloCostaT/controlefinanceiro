"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Receipt } from "lucide-react"
import type { FamilyMember } from "../types/expense"

interface AddExpenseFormProps {
  members: FamilyMember[]
  onAddExpense: (expense: {
    description: string
    amount: number
    date: string
    paidBy: string
    category: string
    splitBetween: string[]
  }) => void
}

const categories = ["Alimentação", "Utilidades", "Transporte", "Saúde", "Educação", "Lazer", "Casa", "Outros"]

export function AddExpenseForm({ members, onAddExpense }: AddExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [paidBy, setPaidBy] = useState("")
  const [category, setCategory] = useState("")
  const [splitBetween, setSplitBetween] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim() && amount && paidBy && category && splitBetween.length > 0) {
      onAddExpense({
        description: description.trim(),
        amount: Number.parseFloat(amount),
        date,
        paidBy,
        category,
        splitBetween,
      })
      setDescription("")
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setPaidBy("")
      setCategory("")
      setSplitBetween([])
    }
  }

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setSplitBetween((prev) => [...prev, memberId])
    } else {
      setSplitBetween((prev) => prev.filter((id) => id !== memberId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Adicionar Despesa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da despesa"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pago por *</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione quem pagou" />
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
              <Label>Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Dividir entre *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={splitBetween.includes(member.id)}
                    onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                  />
                  <Label htmlFor={`member-${member.id}`} className="text-sm">
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Adicionar Despesa
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
