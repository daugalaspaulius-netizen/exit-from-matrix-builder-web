export type UserSummary = {
  user_id: string
  username: string
  points: number
  level: number
  status: string
  subscription: boolean
  weekly_points: number
  remaining_to_next_level: number
  photo_url: string
  created_at: string
  referral_link?: string
  email?: string
  referral_invited_count?: number
  referral_points_earned?: number
  treasury_total?: number
  treasury_active_projects?: number
  treasury_completed_projects?: number
}

export type AuthUser = {
  id: string
  user_id: string
  username: string
  points: number
  level: number
  status: string
  emblem: string
}

export type Proposal = {
  id: string
  vote_id: string
  title: string
  description: string
  status: string
  created_at: string
  voting_deadline: string
  quorum_required: number
  quorum_type?: "simple" | "important" | "critical"
  votes_for: number
  votes_against: number
  total_voters: number
  quorum_percentage: number
  participation_percentage?: number
  result_reason_code?: string
  result_explanation?: string
}

export type ForumPost = {
  id?: string
  post_id?: string
  vote_id: string
  author_id: string
  content: string
  created_at: string
  likes?: number
  title?: string
}

export type ApiStatusResponse = {
  status: string
  message?: string
}

export type SystemSummary = {
  users_total: number
  votes_total: number
  votes_open: number
  votes_frozen: number
  votes_closed: number
  proposals_approved_ratio: number
  treasury_total: number
  treasury_buyback: number
  treasury_staking: number
  treasury_community: number
  generated_at: string
}

export type SystemContractEntry = {
  method: string
  path: string
}

export type SystemContracts = Record<string, Record<string, SystemContractEntry>>

export type ErrorCodeInfo = {
  status_code: number
  message: string
}

export type SystemErrorCodesResponse = {
  codes: Record<string, ErrorCodeInfo>
}

export type UiBindingValidationState = {
  valid: boolean
  errors: string[]
  checked_at: string | null
}

export type AuditLogEntry = {
  log_id: string
  user_id: string
  action: string
  details: Record<string, unknown>
  timestamp: string
}

