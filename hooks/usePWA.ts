"use client"

import { useState, useEffect, useCallback } from "react"

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  hasUpdate: boolean
  isLoading: boolean
  error: string | null
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    hasUpdate: false,
    isLoading: true,
    error: null,
  })

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Registrar Service Worker
  const registerSW = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setState((prev) => ({ ...prev, isLoading: false, error: "Service Worker não suportado" }))
      return
    }

    try {
      const reg = await navigator.serviceWorker.register("/sw", {
        scope: "/",
        updateViaCache: "none",
      })

      setRegistration(reg)

      // Verificar atualizações
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setState((prev) => ({ ...prev, hasUpdate: true }))
            }
          })
        }
      })

      // Verificar se já está controlado
      if (navigator.serviceWorker.controller) {
        setState((prev) => ({ ...prev, isInstalled: true }))
      }

      setState((prev) => ({ ...prev, isLoading: false, error: null }))
      console.log("Service Worker registrado com sucesso")
    } catch (error) {
      console.error("Erro ao registrar Service Worker:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }))
    }
  }, [])

  // Instalar PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }))
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error("Erro ao instalar PWA:", error)
      return false
    }
  }, [deferredPrompt])

  // Atualizar Service Worker
  const updateSW = useCallback(async () => {
    if (!registration) return

    try {
      await registration.update()
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" })
        window.location.reload()
      }
    } catch (error) {
      console.error("Erro ao atualizar Service Worker:", error)
    }
  }, [registration])

  // Verificar status online/offline
  const updateOnlineStatus = useCallback(() => {
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Registrar Service Worker
    registerSW()

    // Event listeners
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      setState((prev) => ({ ...prev, isInstallable: true }))
    }

    const handleAppInstalled = () => {
      setState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }))
      setDeferredPrompt(null)
    }

    // Verificar se já está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
        setState((prev) => ({ ...prev, isInstalled: true }))
      }
    }

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Verificações iniciais
    checkIfInstalled()
    updateOnlineStatus()

    // Cleanup
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [registerSW, updateOnlineStatus])

  return {
    ...state,
    installPWA,
    updateSW,
    registration,
  }
}
