import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Briefcase, FileText, Flame, ArrowRight, Sparkles } from "lucide-react"
import { getLatestUpdates, getTrendingUpdates } from "@/services/updatesService"
import { getLatestJobs } from "@/services/jobsService"
import { getLatestSchemes } from "@/services/schemesService"
import { getBookmarks } from "@/services/bookmarksService"
import { UpdateCard } from "@/components/shared/UpdateCard"
import { JobCard } from "@/components/shared/JobCard"
import { SchemeCard } from "@/components/shared/SchemeCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Update, Job, Scheme } from "@/types"

function SectionHeader({ icon, title, to }: { icon: React.ReactNode; title: string; to: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold">
        {icon} {title}
      </h2>
      <Button variant="link" size="sm" asChild>
        <Link to={to}>
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  )
}

export function Dashboard() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [trending, setTrending] = useState<Update[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const hasSavedItems = getBookmarks().length > 0
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLatestUpdates(6), getTrendingUpdates(3), getLatestJobs(3), getLatestSchemes(3)]).then(
      ([u, t, j, s]) => {
        setUpdates(u)
        setTrending(t)
        setJobs(j)
        setSchemes(s)
        setLoading(false)
      }
    )
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Your dashboard</h1>
        <p className="mt-1 text-army-500 dark:text-army-300">
          Latest notifications, jobs and schemes — refreshed daily from official sources.
        </p>
      </div>

      {trending.length > 0 && (
        <section>
          <SectionHeader icon={<Flame className="h-5 w-5 text-saffron-500" />} title="Trending updates" to="/notifications" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader icon={<Briefcase className="h-5 w-5 text-army-600 dark:text-army-300" />} title="Latest jobs" to="/jobs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={<FileText className="h-5 w-5 text-army-600 dark:text-army-300" />} title="Latest schemes" to="/schemes" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={<Bell className="h-5 w-5 text-army-600 dark:text-army-300" />} title="Recent announcements" to="/notifications" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {updates.map((u) => (
            <UpdateCard key={u.id} update={u} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={<Sparkles className="h-5 w-5 text-saffron-500" />} title="Recommended for you" to="/assistant" />
        {hasSavedItems ? (
          <Card>
            <CardContent className="py-6 text-sm text-army-600 dark:text-army-300">
              Based on what you've saved, you might also want to check the latest pension and
              medical updates — <Link to="/notifications" className="font-medium text-saffron-600 hover:underline">view notifications</Link>.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-sm text-army-600 dark:text-army-300">
              Save a few jobs or schemes (tap the bookmark icon) and recommendations will appear
              here based on what matters to you. Or just ask <Link to="/assistant" className="font-medium text-saffron-600 hover:underline">Veer Assistant</Link> directly.
            </CardContent>
          </Card>
        )}
      </section>

      {loading && <p className="text-center text-sm text-army-400">Loading latest data…</p>}
    </div>
  )
}
