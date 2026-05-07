"use client"

import { useCallback, useState } from "react"
import { getApiErrorMessage } from "@/lib/api"

export function useApiRequest(defaultErrorMessage = "") {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(defaultErrorMessage)

  const execute = useCallback(
    async <T>(request: () => Promise<T>, options?: { keepError?: boolean }): Promise<T | null> => {
      setLoading(true)
      if (!options?.keepError) {
        setError("")
      }
      try {
        return await request()
      } catch (err) {
        setError(getApiErrorMessage(err))
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { loading, error, setError, execute }
}

