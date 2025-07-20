"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Shield, Activity, AlertTriangle, Settings, Users, UserCog, Mail, Database, Save, X } from "lucide-react"
import { useAdmin } from "../hooks/useAdmin"
import { ServiceManagement } from "./service-management"
import { UserManagement } from "./user-management"
import { RoleManagement } from "./role-management"
import { InvitationManagement } from "./invitation-management"
import { SystemManagement } from "./system-management"

interface AdminPanelProps {
  onClose: () => void
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { currentUser, systemSettings } = useAdmin()
  const [activeTab, setActiveTab] = useState("services")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Simular dados originais para comparação
  const [originalData, setOriginalData] = useState({
    systemSettings,
    users: [],
    services: [],
  })

  // Detectar mudanças
  useEffect(() => {
    // Aqui você compararia os dados atuais com os originais
    // Por simplicidade, vou simular a detecção de mudanças
    const hasChanges = JSON.stringify(systemSettings) !== JSON.stringify(originalData.systemSettings)
    setHasUnsavedChanges(hasChanges)
  }, [systemSettings, originalData])

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirmation(true)
    } else {
      onClose()
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Atualizar dados originais após salvar
      setOriginalData({
        systemSettings,
        users: [],
        services: [],
      })

      setHasUnsavedChanges(false)

      // Mostrar feedback de sucesso
      alert("Alterações salvas com sucesso!")
    } catch (error) {
      alert("Erro ao salvar alterações")
    } finally {
      setIsSaving(false)
    }
  }

  const handleForceClose = () => {
    setShowExitConfirmation(false)
    onClose()
  }

  const handleSaveAndClose = async () => {
    await handleSaveChanges()
    setShowExitConfirmation(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-background rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-7xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Painel de Administração</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Logado como: {currentUser.username} ({currentUser.role})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              )}
              <Button variant="outline" onClick={handleClose}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="px-4 sm:px-6 pt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Você tem alterações não salvas.</span>
                  <Button size="sm" onClick={handleSaveChanges} disabled={isSaving} className="ml-4">
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? "Salvando..." : "Salvar Agora"}
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100%-70px)] sm:max-h-[calc(90vh-120px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
                <TabsList className="w-max sm:w-full grid grid-flow-col sm:grid-cols-6 auto-cols-max sm:auto-cols-fr gap-2 sm:gap-0">
                  <TabsTrigger value="services" className="flex items-center gap-2 whitespace-nowrap">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Serviços</span>
                    <span className="sm:hidden">Serv.</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2 whitespace-nowrap">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Usuários</span>
                    <span className="sm:hidden">Usu.</span>
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2 whitespace-nowrap">
                    <UserCog className="h-4 w-4" />
                    <span className="hidden sm:inline">Funções</span>
                    <span className="sm:hidden">Fun.</span>
                  </TabsTrigger>
                  <TabsTrigger value="invitations" className="flex items-center gap-2 whitespace-nowrap">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Convites</span>
                    <span className="sm:hidden">Conv.</span>
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center gap-2 whitespace-nowrap">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Sistema</span>
                    <span className="sm:hidden">Sist.</span>
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="flex items-center gap-2 whitespace-nowrap">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Monitoramento</span>
                    <span className="sm:hidden">Monit.</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="services" className="mt-6">
                <ServiceManagement />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <UserManagement />
              </TabsContent>

              <TabsContent value="roles" className="mt-6">
                <RoleManagement />
              </TabsContent>

              <TabsContent value="invitations" className="mt-6">
                <InvitationManagement />
              </TabsContent>

              <TabsContent value="system" className="mt-6">
                <SystemManagement />
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Status do Sistema</h3>
                    <p className="text-sm text-muted-foreground">Monitore a saúde e performance do sistema</p>
                  </div>

                  {systemSettings.maintenanceMode && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        O sistema está em modo de manutenção. Os usuários não conseguem acessar a aplicação.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Conteúdo de monitoramento seria implementado aqui */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg">
                      <h4 className="font-semibold mb-2">Usuários Online</h4>
                      <p className="text-2xl font-bold text-green-600">24</p>
                      <p className="text-sm text-muted-foreground">Ativos agora</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                      <h4 className="font-semibold mb-2">Uso de CPU</h4>
                      <p className="text-2xl font-bold text-blue-600">45%</p>
                      <p className="text-sm text-muted-foreground">Média última hora</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                      <h4 className="font-semibold mb-2">Uso de Memória</h4>
                      <p className="text-2xl font-bold text-orange-600">68%</p>
                      <p className="text-sm text-muted-foreground">8GB de 12GB</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialog de Confirmação de Saída */}
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas no painel de administração. O que deseja fazer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowExitConfirmation(false)}>Continuar Editando</AlertDialogCancel>
            <Button variant="outline" onClick={handleForceClose} className="w-full sm:w-auto bg-transparent">
              Sair sem Salvar
            </Button>
            <AlertDialogAction onClick={handleSaveAndClose} disabled={isSaving} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar e Sair"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
