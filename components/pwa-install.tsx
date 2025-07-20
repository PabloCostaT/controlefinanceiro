"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Smartphone, X, RefreshCw, WifiOff } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"

export function PWAInstall() {
  const { isInstallable, isInstalled, isOnline, hasUpdate, isLoading, error, installPWA, updateSW } = usePWA()

  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Mostrar prompt de instalação após 30 segundos se disponível
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  // Mostrar prompt de atualização
  useEffect(() => {
    if (hasUpdate) {
      setShowUpdatePrompt(true)
    }
  }, [hasUpdate])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await installPWA()
      if (success) {
        setShowInstallPrompt(false)
      }
    } catch (error) {
      console.error("Erro na instalação:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateSW()
      setShowUpdatePrompt(false)
    } catch (error) {
      console.error("Erro na atualização:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Status de conexão
  const ConnectionStatus = () => (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isOnline ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Badge variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    </div>
  )

  // Prompt de instalação
  const InstallPrompt = () => {
    if (!showInstallPrompt || isInstalled || !isInstallable) return null

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-lg border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">Instalar App</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Instale o Controle Financeiro para acesso rápido e funcionamento offline
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleInstall} disabled={isInstalling} className="h-8 text-xs">
                    {isInstalling ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Instalando...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        Instalar
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowInstallPrompt(false)} className="h-8 text-xs">
                    Agora não
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInstallPrompt(false)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prompt de atualização
  const UpdatePrompt = () => {
    if (!showUpdatePrompt) return null

    return (
      <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-blue-900">Atualização Disponível</h3>
                <p className="text-xs text-blue-700 mt-1">Uma nova versão do app está disponível</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Atualizar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowUpdatePrompt(false)}
                    className="h-8 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    Depois
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUpdatePrompt(false)}
                className="h-6 w-6 p-0 flex-shrink-0 text-blue-700 hover:bg-blue-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Não renderizar nada se estiver carregando ou houver erro crítico
  if (isLoading || error) return null

  return (
    <>
      <ConnectionStatus />
      <InstallPrompt />
      <UpdatePrompt />
    </>
  )
}
