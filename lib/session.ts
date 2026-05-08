// Session Management
// Handles local storage and session state

const SESSION_KEY_USER_ID = "efm_user_id"
const SESSION_KEY_ACKNOWLEDGED_INCIDENTS = "efm_acknowledged_incidents"

export function setCurrentUserId(userId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY_USER_ID, userId)
  }
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(SESSION_KEY_USER_ID)
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY_USER_ID)
    localStorage.removeItem(SESSION_KEY_ACKNOWLEDGED_INCIDENTS)
  }
}

export function setAcknowledgedIncidentIds(ids: string[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY_ACKNOWLEDGED_INCIDENTS, JSON.stringify(ids))
  }
}

export function getAcknowledgedIncidentIds(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const stored = localStorage.getItem(SESSION_KEY_ACKNOWLEDGED_INCIDENTS)
  return stored ? JSON.parse(stored) : []
}
