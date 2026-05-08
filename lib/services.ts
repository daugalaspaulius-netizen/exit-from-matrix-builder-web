// API Service Layer
// All HTTP calls to the backend go through here

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function for API requests
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// System & Admin APIs
export async function getSystemSummary() {
  return apiCall<any>("/system/summary")
}

export async function getSystemContracts() {
  return apiCall<any>("/system/contracts")
}

export async function getSystemErrorCodes() {
  return apiCall<any>("/system/error-codes")
}

export async function getSystemAuditLogs(limit?: number) {
  const params = limit ? `?limit=${limit}` : ""
  return apiCall<any[]>(`/system/audit-logs${params}`)
}

export async function getUiBindingValidation() {
  return apiCall<any>("/system/ui-binding/validation")
}

export async function getUiBindingStatus() {
  return apiCall<any>("/system/ui-binding/status")
}

// User APIs
export async function getUserSummary(userId: string) {
  return apiCall<any>(`/users/${userId}/summary`)
}

export async function getUserRatingHistory(userId: string, limit = 20) {
  return apiCall<any[]>(`/users/${userId}/rating/history?limit=${limit}`)
}

// Rating Activity APIs
export async function getSystemRatingActivity(periodHours = 24) {
  return apiCall<any>(`/system/rating-activity?period_hours=${periodHours}`)
}
