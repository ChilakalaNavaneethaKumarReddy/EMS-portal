import { useEffect, useState } from "react"
import { Briefcase, FileText, Bell, RefreshCw, Clock, Database } from "lucide-react"
import { getLatestJobs } from "@/services/jobsService"
import { getLatestSchemes } from "@/services/schemesService"
import { getLatestUpdates } from "@/services/updatesService"
import { getDataSources, type DataSource } from "@/services/dataSourcesService"
import { StatCard } from "@/components/shared/StatCard"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Job, Scheme, Update } from "@/types"

export function AdminOverview() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [sources, setSources] = useState<DataSource[]>([])
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    const [j, s, u, src] = await Promise.all([
      getLatestJobs(500),
      getLatestSchemes(500),
      getLatestUpdates(500),
      getDataSources(),
    ])
    setJobs(j)
    setSchemes(s)
    setUpdates(u)
    setSources(src)
  }

  useEffect(() => {
    load()
  }, [])

  // Find the latest synchronization time from all data sources
  const lastSyncDates = sources
    .map((s) => s.last_synced_at)
    .filter(Boolean) as string[]
    
  const lastSync = lastSyncDates.length > 0
    ? lastSyncDates.sort().at(-1)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <p className="text-sm text-army-500 dark:text-army-300">Snapshot of everything in the portal.</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            setRefreshing(true)
            await load()
            setRefreshing(false)
          }}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh data
        </Button>
      </div>

      <SupabaseNotice />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Notifications" value={updates.length} icon={<Bell className="h-5 w-5" />} />
        <StatCard label="Jobs" value={jobs.length} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label="Schemes" value={schemes.length} icon={<FileText className="h-5 w-5" />} accent />
        <StatCard label="Data Sources" value={sources.length} icon={<Database className="h-5 w-5" />} />
        <StatCard
          label="Last Sync"
          value={lastSync ? new Date(lastSync).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-army-600 dark:text-army-300">
          <p className="font-display font-semibold text-army-800 dark:text-army-100">How automation works</p>
          <p className="mt-1.5">
            A scheduled GitHub Action runs daily, fetches new items from official sources (ECHS, DGR, KSB, SPARSH), 
            and pushes them into the <code>updates</code>, <code>jobs</code> and <code>schemes</code> tables via the Supabase REST API. 
            This dashboard simply reads whatever is currently in those tables — see <code>backend/scraper/main.py</code> in the 
            project for the automation script, and the Sync Logs page for run history.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
