import { useEffect, useMemo, useState } from "react"
import { Briefcase } from "lucide-react"
import { getLatestJobs } from "@/services/jobsService"
import { JobCard } from "@/components/shared/JobCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { EmptyState } from "@/components/shared/EmptyState"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Job } from "@/types"

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [query, setQuery] = useState("")
  const [state, setState] = useState("All States")
  const [sort, setSort] = useState<"latest" | "deadline">("latest")
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    getLatestJobs(100).then((j) => {
      setJobs(j)
      setLoading(false)
    })
  }, [])

  const stateOptions = useMemo(() => Array.from(new Set(["All States", ...jobs.map((j) => j.state)])), [jobs])

  const filtered = useMemo(() => {
    let result = jobs.filter((j) => {
      if (state !== "All States" && j.state !== state) return false
      if (query) {
        const q = query.toLowerCase()
        const haystack = `${j.title} ${j.organization} ${j.description} ${j.eligibility}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    if (sort === "latest") {
      result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at))
    } else {
      result = [...result].sort((a, b) => (a.deadline || a.last_date || "").localeCompare(b.deadline || b.last_date || ""))
    }
    return result
  }, [jobs, query, state, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{t("statsJobs")}</h1>
      <p className="mt-1 text-army-500 dark:text-army-300">
        Openings sourced from DGR, NCS and official job fairs.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder={t("searchPlaceholder")} />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50"
        >
          {stateOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "latest" | "deadline")}
          className="h-10 rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50"
        >
          <option value="latest">Sort: Latest</option>
          <option value="deadline">Sort: Deadline</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-army-400">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-8 w-8" />}
            title={t("noResults")}
            message="Try clearing the search or switching the state filter."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
