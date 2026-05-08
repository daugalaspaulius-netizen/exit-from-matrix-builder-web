// API Service Layer
// All HTTP calls to the backend go through here
// Returns { data: T } wrapper to match existing page consumption patterns

import type { AuditLogEntry, RatingHistoryEntry } from "@/types/api"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function for API requests - returns wrapped response
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T }> {
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

  const data = await response.json()
  return { data }
}

// Helper to map audit log entries to RatingHistoryEntry format
function mapAuditToRatingHistory(entry: AuditLogEntry): RatingHistoryEntry {
  const details = entry.details as Record<string, unknown> || {}
  return {
    target_username: (details.target_username as string) ?? (details.target_id as string) ?? "Unknown",
    rating_score: (details.score as number) || 0,
    context: (details.context as string) || undefined,
    comment: (details.comment as string) || undefined,
    created_at: entry.timestamp,
  }
}

// Auth APIs
export async function loginUser(email: string, password: string) {
  return apiCall<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(email: string, password: string, username: string) {
  return apiCall<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  })
}

export async function requestPasswordReset(email: string) {
  return apiCall<any>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
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
  return apiCall<AuditLogEntry[]>(`/system/audit-logs${params}`)
}

export async function getUiBindingValidation() {
  return apiCall<any>("/system/ui-binding/validate")
}

export async function getUiBindingStatus() {
  return apiCall<any>("/system/ui-binding/status")
}

// User APIs
export async function getUserSummary(userId: string) {
  return apiCall<any>(`/users/${userId}/summary`)
}

export async function getUserRatingHistory(userId: string, limit = 20) {
  const response = await apiCall<AuditLogEntry[]>(`/users/${userId}/rating/history?limit=${limit}`)
  // Map audit log entries to rating history format
  return {
    data: response.data.map(mapAuditToRatingHistory),
  }
}

// Rating Activity APIs
export async function getSystemRatingActivity(periodHours = 24) {
  return apiCall<any>(`/system/rating-activity?period_hours=${periodHours}`)
}

// Forum APIs
export async function listForumPosts(limit?: number) {
  const params = limit ? `?limit=${limit}` : ""
  return apiCall<any[]>(`/forum/posts${params}`)
}

export async function createForumPost(voteId: string | null, userId: string, content: string) {
  return apiCall<any>("/forum/posts", {
    method: "POST",
    body: JSON.stringify({ vote_id: voteId, author_id: userId, content }),
  })
}

// Voting APIs
export async function listProposals(limit?: number) {
  const params = limit ? `?limit=${limit}` : ""
  return apiCall<any[]>(`/proposals${params}`)
}

export async function createProposal(userId: string, title: string, description: string, quorumType: string) {
  return apiCall<any>("/proposals", {
    method: "POST",
    body: JSON.stringify({ author_id: userId, title, description, quorum_type: quorumType }),
  })
}

export async function voteProposal(proposalId: string, userId: string, voteFor: boolean) {
  return apiCall<any>(`/proposals/${proposalId}/vote?user_id=${userId}`, {
    method: "POST",
    body: JSON.stringify({ vote_for: voteFor }),
  })
}
