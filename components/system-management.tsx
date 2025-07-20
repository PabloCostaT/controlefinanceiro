"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  Database,
  Settings,
  Shield,
  Users,
  HardDrive,
  Globe,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Save,
} from "lucide-react"
import { useAdmin } from "../hooks/useAdmin"

export function SystemManagement() {
  const { systemSettings, updateSystemSettings, serviceStats } = useAdmin()
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [isRestoreRunning, setIsRestoreRunning] = useState(false)
  const [backupFile, setBackupFile] = useState<File | null>(null)

  const handleSettingChange = (key: string, value: any) => {
    updateSystemSettings({ [key]: value })
  }

  const handleBackup = async () => {
    setIsBackupRunning(true)
    try {
      // Simular backup
      await new Promise((resolve) => setTimeout(resolve, 3000))
      // Aqui seria implementada a lógica real de backup
      alert("Backup realizado com sucesso!")
    } catch (error) {
      alert("Erro ao realizar backup")
    } finally {
      setIsBackupRunning(false)
    }
  }

  const handleRestore = async () => {
    if (!backupFile) return

    setIsRestoreRunning(true)
    try {
      // Simular restore
      await new Promise((resolve) => setTimeout(resolve, 5000))
      // Aqui seria implementada a lógica real de restore
      alert("Restore realizado com sucesso!")
      setBackupFile(null)
    } catch (error) {
      alert("Erro ao realizar restore")
    } finally {
      setIsRestoreRunning(false)
    }
  }

  const handleClearCache = async () => {
    try {
      // Simular limpeza de cache
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Cache limpo com sucesso!")
    } catch (error) {
      alert("Erro ao limpar cache")
    }
  }

  const handleClearLogs = async () => {
    try {
      // Simular limpeza de logs
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Logs limpos com sucesso!")
    } catch (error) {
      alert("Erro ao limpar logs")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Gerenciamento do Sistema</h3>
        <p className="text-sm text-muted-foreground">Configure as definições globais do sistema</p>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
          <CardDescription>Informações gerais sobre o estado atual do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Sistema Online</p>
                <p className="text-xs text-muted-foreground">Funcionando normalmente</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{serviceStats.activeUsers} Usuários</p>
                <p className="text-xs text-muted-foreground">Ativos no sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <HardDrive className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">85% Disco</p>
                <p className="text-xs text-muted-foreground">Espaço utilizado</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-full">
                <Globe className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">99.9% Uptime</p>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>Configurações básicas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">Bloqueia o acesso de usuários ao sistema</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registrations">Permitir Novos Registros</Label>
                  <p className="text-sm text-muted-foreground">Permite que novos usuários se registrem</p>
                </div>
                <Switch
                  id="registrations"
                  checked={systemSettings.allowNewRegistrations}
                  onCheckedChange={(checked) => handleSettingChange("allowNewRegistrations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Realiza backups automáticos diários</p>
                </div>
                <Switch
                  id="backup"
                  checked={systemSettings.backupEnabled}
                  onCheckedChange={(checked) => handleSettingChange("backupEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-sm text-muted-foreground">Envia notificações por email</p>
                </div>
                <Switch
                  id="notifications"
                  checked={systemSettings.notificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange("notificationsEnabled", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="maxMembers">Máximo de Membros por Família</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={systemSettings.maxMembersPerFamily}
                  onChange={(e) => handleSettingChange("maxMembersPerFamily", Number.parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Limite de membros que podem ser adicionados por família
                </p>
              </div>

              <div>
                <Label htmlFor="retention">Retenção de Dados (dias)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={systemSettings.dataRetentionDays}
                  onChange={(e) => handleSettingChange("dataRetentionDays", Number.parseInt(e.target.value))}
                  min="30"
                  max="3650"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Tempo para manter dados antes da exclusão automática
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup e Restore
          </CardTitle>
          <CardDescription>Gerencie backups e restauração de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Backup do Sistema</h4>
              <p className="text-sm text-muted-foreground">Crie um backup completo de todos os dados do sistema</p>
              <Button onClick={handleBackup} disabled={isBackupRunning} className="w-full">
                {isBackupRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Criando Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Criar Backup
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Restaurar Sistema</h4>
              <p className="text-sm text-muted-foreground">Restaure o sistema a partir de um arquivo de backup</p>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".sql,.zip,.tar.gz"
                  onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!backupFile || isRestoreRunning} className="w-full">
                      {isRestoreRunning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Restaurando...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Restaurar Sistema
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Restauração</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá substituir todos os dados atuais do sistema pelos dados do backup. Esta operação
                        não pode ser desfeita. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRestore}>Sim, Restaurar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manutenção do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manutenção do Sistema
          </CardTitle>
          <CardDescription>Ferramentas de limpeza e otimização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Limpar Cache</h4>
              <p className="text-sm text-muted-foreground mb-4">Remove arquivos temporários e cache do sistema</p>
              <Button variant="outline" onClick={handleClearCache} className="w-full bg-transparent">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Cache
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Limpar Logs</h4>
              <p className="text-sm text-muted-foreground mb-4">Remove logs antigos para liberar espaço em disco</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Logs
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Limpeza de Logs</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá remover todos os logs do sistema. Isso pode dificultar a resolução de problemas
                      futuros. Tem certeza que deseja continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearLogs}>Sim, Limpar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
