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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Painel de Administração</h2>
              <p className="text-sm text-muted-foreground">
                Logado como: {currentUser.username} ({currentUser.role})
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Serviços
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Funções
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Convites
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Monitoramento
              </TabsTrigger>
            </TabsList>

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
