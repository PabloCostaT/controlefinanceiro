"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Users,
  Activity,
  Zap,
  Lock,
} from "lucide-react"
import { useAdmin } from "../hooks/useAdmin"
import type { ServiceConfig } from "../types/admin"

export function ServiceManagement() {
  const {
    services,
    serviceStats,
    toggleService,
    bulkToggleServices,
    getServicesByCategory,
    getEnabledServices,
    getDisabledServices,
    getServiceDependents,
    canToggleService,
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false)

  const getCategoryIcon = (category: ServiceConfig["category"]) => {
    switch (category) {
      case "core":
        return "🔧"
      case "financial":
        return "💰"
      case "reporting":
        return "📊"
      case "advanced":
        return "⚡"
      default:
        return "📦"
    }
  }

  const getCategoryColor = (category: ServiceConfig["category"]) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "financial":
        return "bg-green-100 text-green-800 border-green-200"
      case "reporting":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "advanced":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryName = (category: ServiceConfig["category"]) => {
    switch (category) {
      case "core":
        return "Funcionalidades Principais"
      case "financial":
        return "Gestão Financeira"
      case "reporting":
        return "Relatórios"
      case "advanced":
        return "Recursos Avançados"
      default:
        return "Outros"
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (!service || !canToggleService(serviceId)) return

    const dependents = getServiceDependents(serviceId)

    // Se estiver desabilitando e há dependentes
    if (service.isEnabled && dependents.length > 0) {
      const enabledDependents = dependents.filter((d) => d.isEnabled)
      if (enabledDependents.length > 0) {
        // Será tratado pelo AlertDialog
        return
      }
    }

    // Se estiver habilitando, verificar dependências
    if (!service.isEnabled && service.dependencies) {
      const missingDeps = service.dependencies.filter((depId) => {
        const depService = services.find((s) => s.id === depId)
        return !depService?.isEnabled
      })

      if (missingDeps.length > 0) {
        const missingNames = missingDeps
          .map((depId) => {
            const depService = services.find((s) => s.id === depId)
            return depService?.name || depId
          })
          .join(", ")
        alert(`Para habilitar este serviço, primeiro habilite: ${missingNames}`)
        return
      }
    }

    toggleService(serviceId)
  }

  const handleBulkToggle = (enabled: boolean) => {
    if (selectedServices.length === 0) return

    const validServices = selectedServices.filter((id) => canToggleService(id))
    bulkToggleServices(validServices, enabled)
    setSelectedServices([])
  }

  const handleSelectService = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, serviceId])
    } else {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableServices = filteredServices.filter((s) => canToggleService(s.id)).map((s) => s.id)
      setSelectedServices(selectableServices)
    } else {
      setSelectedServices([])
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesStatus = !showOnlyEnabled || service.isEnabled

    return matchesSearch && matchesCategory && matchesStatus
  })

  const enabledCount = getEnabledServices().length
  const disabledCount = getDisabledServices().length
  const totalCount = services.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Serviços</h3>
          <p className="text-sm text-muted-foreground">Controle as funcionalidades disponíveis no sistema</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedServices.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>
                <ToggleRight className="h-4 w-4 mr-1" />
                Habilitar ({selectedServices.length})
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkToggle(false)}>
                <ToggleLeft className="h-4 w-4 mr-1" />
                Desabilitar ({selectedServices.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Serviços Ativos</p>
                <p className="text-2xl font-bold text-green-600">{enabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Desabilitados</p>
                <p className="text-2xl font-bold text-red-600">{disabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Usuários Ativos</p>
                <p className="text-2xl font-bold">{serviceStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Famílias</p>
                <p className="text-2xl font-bold">{serviceStats.totalFamilies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Taxa de Uso</p>
                <p className="text-2xl font-bold">{Math.round((enabledCount / totalCount) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="core">Principais</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="reporting">Relatórios</SelectItem>
                  <SelectItem value="advanced">Avançados</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="show-enabled" checked={showOnlyEnabled} onCheckedChange={setShowOnlyEnabled} />
                <label htmlFor="show-enabled" className="text-sm font-medium">
                  Apenas ativos
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Serviços por Categoria */}
      {(["core", "financial", "reporting", "advanced"] as const).map((category) => {
        const categoryServices = filteredServices.filter((service) => service.category === category)
        if (categoryServices.length === 0) return null

        const categoryEnabledCount = categoryServices.filter((s) => s.isEnabled).length

        return (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <span>{getCategoryName(category)}</span>
                  <Badge className={getCategoryColor(category)}>
                    {categoryEnabledCount}/{categoryServices.length} ativos
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={categoryServices.every((s) => selectedServices.includes(s.id))}
                    onCheckedChange={(checked) => {
                      const serviceIds = categoryServices.filter((s) => canToggleService(s.id)).map((s) => s.id)
                      if (checked) {
                        setSelectedServices((prev) => [...new Set([...prev, ...serviceIds])])
                      } else {
                        setSelectedServices((prev) => prev.filter((id) => !serviceIds.includes(id)))
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Selecionar todos</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryServices.map((service) => {
                  const dependents = getServiceDependents(service.id)
                  const canToggle = canToggleService(service.id)

                  return (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked) => handleSelectService(service.id, checked)}
                          disabled={!canToggle}
                        />
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{service.name}</h4>
                            {service.isEnabled ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            {!canToggle && <Lock className="h-4 w-4 text-gray-400" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>

                          {/* Dependências */}
                          {service.dependencies && (
                            <div className="flex items-center gap-1 mt-2">
                              <Info className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600">
                                Depende de:{" "}
                                {service.dependencies
                                  .map((depId) => {
                                    const depService = services.find((s) => s.id === depId)
                                    return depService?.name || depId
                                  })
                                  .join(", ")}
                              </span>
                            </div>
                          )}

                          {/* Dependentes */}
                          {dependents.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">
                                Usado por: {dependents.map((d) => d.name).join(", ")}
                              </span>
                            </div>
                          )}

                          {/* Permissões necessárias */}
                          {service.requiredPermissions && service.requiredPermissions.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex flex-wrap gap-1">
                                {service.requiredPermissions.map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {service.isEnabled && dependents.some((d) => d.isEnabled) ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Switch checked={service.isEnabled} disabled={!canToggle} />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Desabilitação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Desabilitar "{service.name}" também desabilitará os seguintes serviços dependentes:
                                  <br />
                                  <br />
                                  <strong>
                                    {dependents
                                      .filter((d) => d.isEnabled)
                                      .map((d) => d.name)
                                      .join(", ")}
                                  </strong>
                                  <br />
                                  <br />
                                  Deseja continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toggleService(service.id)}>
                                  Desabilitar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Switch
                            checked={service.isEnabled}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                            disabled={!canToggle}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhum serviço encontrado com os filtros aplicados.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
