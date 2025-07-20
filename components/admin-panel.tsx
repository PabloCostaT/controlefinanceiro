"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Activity, AlertTriangle, Settings, Users, UserCog, Mail } from "lucide-react"
import { useAdmin } from "../hooks/useAdmin"
import { ServiceManagement } from "./service-management"
import { UserManagement } from "./user-management"
import { RoleManagement } from "./role-management"
import { InvitationManagement } from "./invitation-management"

interface AdminPanelProps {
  onClose: () => void
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { currentUser, systemSettings } = useAdmin()
  const [activeTab, setActiveTab] = useState("services")

  return (
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
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100%-70px)] sm:max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
              <TabsList className="w-max sm:w-full grid grid-flow-col sm:grid-cols-5 auto-cols-max sm:auto-cols-fr gap-2 sm:gap-0">
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
