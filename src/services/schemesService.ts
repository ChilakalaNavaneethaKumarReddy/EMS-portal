import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { seedSchemes } from "@/data/seed"
import type { Scheme } from "@/types"

export async function getLatestSchemes(limit = 50): Promise<Scheme[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .order("published_date", { ascending: false })
      .limit(limit)
    if (error) {
      console.warn("[schemesService] Supabase error, falling back to mock data:", error.message)
      return seedSchemes.slice(0, limit)
    }
    return (data as Scheme[]) ?? []
  }
  return [...seedSchemes].sort((a, b) => b.published_date.localeCompare(a.published_date)).slice(0, limit)
}

export async function getSchemeById(id: string): Promise<Scheme | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("schemes").select("*").eq("id", id).single()
    if (error) return null
    return data as Scheme
  }
  return seedSchemes.find((s) => s.id === id) ?? null
}

export async function searchSchemes(query: string, category?: string): Promise<Scheme[]> {
  const all = await getLatestSchemes(200)
  const q = query.trim().toLowerCase()
  return all.filter((s) => {
    if (category && category !== "All" && s.category !== category) return false
    if (!q) return true
    const haystack = `${s.title} ${s.summary} ${s.eligibility} ${s.benefits}`.toLowerCase()
    return haystack.includes(q)
  })
}

export async function addScheme(scheme: Omit<Scheme, "id" | "created_at">): Promise<Scheme | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("schemes").insert(scheme).select().single()
    if (error) {
      console.error("[schemesService] addScheme failed:", error.message)
      return null
    }
    return data as Scheme
  }
  console.warn("[schemesService] Supabase not configured — addScheme is a no-op in mock mode.")
  return null
}

export async function updateScheme(id: string, scheme: Partial<Omit<Scheme, "id" | "created_at">>): Promise<Scheme | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("schemes").update(scheme).eq("id", id).select().single()
    if (error) {
      console.error("[schemesService] updateScheme failed:", error.message)
      return null
    }
    return data as Scheme
  }
  console.warn("[schemesService] Supabase not configured — updateScheme is a no-op.")
  return null
}

export async function deleteScheme(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("schemes").delete().eq("id", id)
    return !error
  }
  console.warn("[schemesService] Supabase not configured — deleteScheme is a no-op in mock mode.")
  return false
}
