"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"

interface AddMemberFormProps {
  onAddMember: (member: { name: string; email?: string }) => void
}

export function AddMemberForm({ onAddMember }: AddMemberFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddMember({
        name: name.trim(),
        email: email.trim() || undefined,
      })
      setName("")
      setEmail("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Adicionar Membro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do membro"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar Membro
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
