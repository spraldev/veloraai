"use client"

import { useState, useEffect } from "react"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === "granted") {
      await subscribeToNotifications()
    }
    
    return result === "granted"
  }

  const subscribeToNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })
      
      setSubscription(sub)
      
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      })
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error)
    }
  }

  return {
    permission,
    subscription,
    requestPermission,
    isSupported: "Notification" in window,
  }
}
