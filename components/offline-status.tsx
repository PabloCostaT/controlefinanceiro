"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)
  const [pendingSync, setPendingSync] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowOfflineAlert(true)
      } else if (!isOnline && online) {
        // Voltou online
        setShowOfflineAlert(false)
        setPendingSync(true)

        // Simular sincronização
        setTimeout(() => {
          setPendingSync(false)
        }, 2000)
      }
    }

    // Event listeners
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Verificação inicial
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [isOnline])

  // Status indicator no canto superior direito
  const StatusIndicator = () => (
    <div className="fixed top-4 right-4 z-40">
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className={`transition-all duration-300 ${
          isOnline && !pendingSync ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {pendingSync ? (
          <>
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Sincronizando...
          </>
        ) : isOnline ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </>
        )}
      </Badge>
    </div>
  )

  // Alert de modo offline
  const OfflineAlert = () => {
    if (!showOfflineAlert) return null

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Alert className="border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Modo Offline</strong>
            <br />
            Você está offline. Suas alterações serão sincronizadas quando a conexão for restaurada.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <StatusIndicator />
      <OfflineAlert />
    </>
  )
}
