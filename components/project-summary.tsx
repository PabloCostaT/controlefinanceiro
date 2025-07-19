"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, FolderOpen, Receipt } from "lucide-react"
import type { ProjectSummary, Project } from "../types/expense"

interface ProjectSummaryProps {
  projectSummaries: ProjectSummary[]
  projects: Project[]
}

export function ProjectSummaryComponent({ projectSummaries, projects }: ProjectSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId)
  }

  const totalAcrossProjects = projectSummaries.reduce((sum, project) => sum + project.totalExpenses, 0)

  if (projectSummaries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum projeto com despesas ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(totalAcrossProjects)}</div>
          <p className="text-muted-foreground">Total gasto em {projectSummaries.length} projeto(s)</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {projectSummaries.map((summary) => {
          const project = getProject(summary.projectId)
          if (!project) return null

          const progressPercentage = totalAcrossProjects > 0 ? (summary.totalExpenses / totalAcrossProjects) * 100 : 0

          return (
            <Card key={summary.projectId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${project.color}20`, color: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{summary.projectName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Receipt className="h-3 w-3 mr-1" />
                          {summary.expenseCount} despesa(s)
                        </Badge>
                        <Badge variant={project.isActive ? "default" : "secondary"} className="text-xs">
                          {project.isActive ? "Ativo" : "Finalizado"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: project.color }}>
                      {formatCurrency(summary.totalExpenses)}
                    </div>
                    <div className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% do total</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Participação no total</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Resumo por Membro:</h4>
                    {summary.memberSummaries
                      .filter((member) => member.totalPaid > 0 || member.totalOwed > 0)
                      .map((member) => (
                        <div
                          key={member.memberId}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium">{member.memberName}</h5>
                            <div className="text-sm text-muted-foreground">
                              Pagou: {formatCurrency(member.totalPaid)} • Deve: {formatCurrency(member.totalOwed)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.balance >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant={member.balance >= 0 ? "default" : "destructive"} className="text-xs">
                              {member.balance >= 0 ? "Recebe" : "Deve"} {formatCurrency(Math.abs(member.balance))}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
