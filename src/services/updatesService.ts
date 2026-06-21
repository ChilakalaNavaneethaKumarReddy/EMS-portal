import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { seedUpdates } from "@/data/seed"
import type { Update } from "@/types"

/** Fetch the most recent updates/notifications, newest first. */
export async function getLatestUpdates(limit = 20): Promise<Update[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .order("published_date", { ascending: false })
      .limit(limit)
    if (error) {
      console.warn("[updatesService] Supabase error, falling back to mock data:", error.message)
      return seedUpdates.slice(0, limit)
    }
    return (data as Update[]) ?? []
  }
  return [...seedUpdates]
    .sort((a, b) => b.published_date.localeCompare(a.published_date))
    .slice(0, limit)
}

export async function getTrendingUpdates(limit = 5): Promise<Update[]> {
  const all = await getLatestUpdates(100)
  return all.filter((u) => u.trending).slice(0, limit)
}

export async function addUpdate(update: Omit<Update, "id" | "created_at">): Promise<Update | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("updates").insert(update).select().single()
    if (error) {
      console.error("[updatesService] addUpdate failed:", error.message)
      return null
    }
    return data as Update
  }
  console.warn("[updatesService] Supabase not configured — addUpdate is a no-op in mock mode.")
  return null
}

export async function deleteUpdate(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("updates").delete().eq("id", id)
    return !error
  }
  console.warn("[updatesService] Supabase not configured — deleteUpdate is a no-op in mock mode.")
  return false
}

export async function updateUpdate(id: string, update: Partial<Omit<Update, "id" | "created_at">>): Promise<Update | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("updates").update(update).eq("id", id).select().single()
    if (error) {
      console.error("[updatesService] updateUpdate failed:", error.message)
      return null
    }
    return data as Update
  }
  console.warn("[updatesService] Supabase not configured — updateUpdate is a no-op.")
  return null
}

export async function searchUpdates(query: string): Promise<Update[]> {
  const all = await getLatestUpdates(200)
  const q = query.trim().toLowerCase()
  if (!q) return all
  return all.filter(
    (u) =>
      u.title.toLowerCase().includes(q) ||
      u.summary.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q)
  )
}
