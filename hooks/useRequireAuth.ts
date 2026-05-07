"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getCurrentUserId } from "@/lib/session"

export function useRequireAuth() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) {
      router.push("/auth/login")
      return
    }
    setUserId(currentUserId)
    setIsCheckingAuth(false)
  }, [router])

  return { userId, isCheckingAuth }
}

