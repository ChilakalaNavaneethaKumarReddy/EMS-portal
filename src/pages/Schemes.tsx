import { useEffect, useMemo, useState } from "react"
import { FileText } from "lucide-react"
import { getLatestSchemes } from "@/services/schemesService"
import { SchemeCard } from "@/components/shared/SchemeCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Scheme } from "@/types"

export function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestSchemes(100).then((s) => {
      setSchemes(s)
      setLoading(false)
    })
  }, [])

  const categories = useMemo(() => Array.from(new Set(["All", ...schemes.map((s) => s.category)])), [schemes])

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      if (category !== "All" && s.category !== category) return false
      if (query) {
        const q = query.toLowerCase()
        const haystack = `${s.title} ${s.summary} ${s.eligibility} ${s.benefits}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [schemes, query, category])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Welfare schemes</h1>
      <p className="mt-1 text-army-500 dark:text-army-300">
        Central and Telangana / Andhra Pradesh state schemes for ex-servicemen and their families.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, benefit, eligibility…" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-army-400">Loading schemes…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No schemes match your filters"
            message="Try a different search term or category."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
