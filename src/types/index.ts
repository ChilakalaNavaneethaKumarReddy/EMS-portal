// Mirrors the Supabase schema in /supabase/schema.sql.
// Keeping these as the single source of truth means mock data,
// service functions, and components all agree on shape.

export type UpdateCategory = "scheme" | "job" | "pension" | "medical" | "news" | "announcement"

export interface Update {
  id: string
  title: string
  summary: string
  category: UpdateCategory
  source: string
  link: string
  published_date: string // ISO date
  created_at: string
  trending?: boolean
}

export interface Job {
  id: string
  title: string
  organization: string
  location: string
  state: string
  eligibility: string
  age_limit?: string
  last_date?: string
  deadline?: string // ISO date
  description: string
  link: string
  created_at: string
}

export interface Scheme {
  id: string
  title: string
  category: string
  eligibility: string
  benefits: string
  documents_required?: string
  summary?: string
  description?: string
  source?: string
  last_date: string | null
  link: string
  published_date: string
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  state: string
  service_branch: string
  created_at: string
}

export type BookmarkType = "job" | "scheme" | "update"

export interface Bookmark {
  id: string
  user_id: string
  item_id: string
  item_type: BookmarkType
  created_at: string
}

export interface SyncLog {
  id: string
  source: string
  items_found: number
  items_added: number
  status: "success" | "partial" | "failed"
  message: string
  ran_at: string
}
