import { useEffect, useState } from "react"
import { Database, RefreshCw, CheckCircle, XCircle, Link as LinkIcon } from "lucide-react"
import { getDataSources, toggleDataSourceActive, triggerManualSync, type DataSource } from "@/services/dataSourcesService"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function AdminDataSources() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const data = await getDataSources()
    setSources(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const success = await toggleDataSourceActive(id, !currentStatus)
    if (success) {
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
      )
    }
  }

  const handleSync = async (sourceName: string) => {
    setSyncing(sourceName)
    const success = await triggerManualSync(sourceName)
    if (success) {
      await load()
    }
    setSyncing(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Data Sources</h1>
        <p className="text-sm text-army-500 dark:text-army-300">
          Manage and monitor automated web scrapers for ex-servicemen portals.
        </p>
      </div>

      <SupabaseNotice />

      {loading ? (
        <p className="text-sm text-army-400">Loading sources...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sources.map((source) => (
            <Card key={source.id} className={!source.is_active ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-army-600 dark:text-army-300" />
                    {source.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-saffron-600 hover:underline"
                    >
                      {source.url} <LinkIcon className="h-3 w-3" />
                    </a>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-army-500">
                    {source.is_active ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={() => handleToggle(source.id, source.is_active)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-t border-army-100 pt-4 text-sm dark:border-white/15">
                  <div>
                    <p className="text-xs text-army-500 dark:text-army-400">Category</p>
                    <p className="font-medium capitalize">{source.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-army-500 dark:text-army-400">Last Synced</p>
                    <p className="font-medium">
                      {source.last_synced_at
                        ? new Date(source.last_synced_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!source.is_active || syncing === source.name}
                    onClick={() => handleSync(source.name)}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${syncing === source.name ? "animate-spin" : ""}`}
                    />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
