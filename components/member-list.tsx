"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Users } from "lucide-react"
import type { FamilyMember } from "../types/expense"

interface MemberListProps {
  members: FamilyMember[]
  onRemoveMember: (id: string) => void
}

export function MemberList({ members, onRemoveMember }: MemberListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum membro cadastrado ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros da Família</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  {member.email && <p className="text-sm text-muted-foreground">{member.email}</p>}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveMember(member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
