import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { seedJobs } from "@/data/seed"
import type { Job } from "@/types"

export interface JobFilters {
  state?: string
  organization?: string
  query?: string
}

export async function getLatestJobs(limit = 50): Promise<Job[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) {
      console.warn("[jobsService] Supabase error, falling back to mock data:", error.message)
      return seedJobs.slice(0, limit)
    }
    return (data as Job[]) ?? []
  }
  return [...seedJobs].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit)
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single()
    if (error) return null
    return data as Job
  }
  return seedJobs.find((j) => j.id === id) ?? null
}

export async function filterJobs(filters: JobFilters): Promise<Job[]> {
  const all = await getLatestJobs(200)
  return all.filter((job) => {
    if (filters.state && filters.state !== "All States" && job.state !== filters.state) return false
    if (filters.organization && !job.organization.toLowerCase().includes(filters.organization.toLowerCase())) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${job.title} ${job.organization} ${job.description} ${job.eligibility}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export async function addJob(job: Omit<Job, "id" | "created_at">): Promise<Job | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("jobs").insert(job).select().single()
    if (error) {
      console.error("[jobsService] addJob failed:", error.message)
      return null
    }
    return data as Job
  }
  console.warn("[jobsService] Supabase not configured — addJob is a no-op in mock mode.")
  return null
}

export async function updateJob(id: string, job: Partial<Omit<Job, "id" | "created_at">>): Promise<Job | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("jobs").update(job).eq("id", id).select().single()
    if (error) {
      console.error("[jobsService] updateJob failed:", error.message)
      return null
    }
    return data as Job
  }
  console.warn("[jobsService] Supabase not configured — updateJob is a no-op.")
  return null
}

export async function deleteJob(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("jobs").delete().eq("id", id)
    return !error
  }
  console.warn("[jobsService] Supabase not configured — deleteJob is a no-op in mock mode.")
  return false
}
