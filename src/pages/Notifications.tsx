import { useEffect, useMemo, useState } from "react"
import { Bell, Circle, CheckCircle2 } from "lucide-react"
import { getLatestUpdates } from "@/services/updatesService"
import { isRead, markAsRead } from "@/services/readStatusService"
import { SearchBar } from "@/components/shared/SearchBar"
import { CategoryBadge } from "@/components/shared/CategoryBadge"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { EmptyState } from "@/components/shared/EmptyState"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Update } from "@/types"

export function Notifications() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [source, setSource] = useState("All")
  const [, forceRerender] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    getLatestUpdates(100).then((u) => {
      setUpdates(u)
      setLoading(false)
    })
  }, [])

  const categories = useMemo(() => Array.from(new Set(["All", ...updates.map((u) => u.category)])), [updates])
  const sources = useMemo(() => Array.from(new Set(["All", ...updates.map((u) => u.source)])), [updates])

  const filtered = useMemo(() => {
    return updates.filter((u) => {
      if (category !== "All" && u.category !== category) return false
      if (source !== "All" && u.source !== source) return false
      if (query) {
        const q = query.toLowerCase()
        if (!`${u.title} ${u.summary}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [updates, query, category, source])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{t("statsUpdates")}</h1>
      <p className="mt-1 text-army-500 dark:text-army-300">All official announcements, in one feed.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder={t("searchPlaceholder")} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="h-10 rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50">
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-army-400">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Bell className="h-8 w-8" />} title={t("noResults")} message="Try a different filter or search term." />
        ) : (
          filtered.map((u) => {
            const read = isRead(u.id)
            return (
              <Card key={u.id} className={read ? "opacity-70" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CategoryBadge category={u.category} />
                    <span className="text-xs text-army-500 dark:text-army-400">
                      {new Date(u.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <CardTitle>{u.title}</CardTitle>
                  <CardDescription>{u.summary}</CardDescription>
                </CardHeader>
                <CardFooter className="justify-between">
                  <span className="text-xs text-army-500 dark:text-army-400">Source: {u.source}</span>
                  <div className="flex items-center">
                    {read ? (
                      <span className="inline-flex items-center gap-1 px-2 text-xs text-army-400"><CheckCircle2 className="h-3.5 w-3.5" /> Read</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Mark as read"
                        onClick={() => { markAsRead(u.id); forceRerender((n) => n + 1) }}
                      >
                        <Circle className="h-4 w-4" />
                      </Button>
                    )}
                    <SaveButton itemId={u.id} itemType="update" />
                    <ShareButton title={u.title} url={u.link} />
                  </div>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
