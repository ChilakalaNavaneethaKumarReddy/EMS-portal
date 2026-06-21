import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Card, CardContent } from "@/components/ui/card"
import type { SyncLog } from "@/types"

const STATUS_ICON = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  partial: <AlertCircle className="h-4 w-4 text-saffron-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
}

export function AdminSyncLogs() {
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from("sync_logs").select("*").order("ran_at", { ascending: false }).limit(30)
        setLogs((data as SyncLog[]) ?? [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold">Sync logs</h1>
      <SupabaseNotice />

      <Card>
        <CardContent className="pt-6 text-sm text-army-600 dark:text-army-300">
          <p>
            Each automation run can write a row to the <code>sync_logs</code> table (see{" "}
            <code>supabase/schema.sql</code>). Until that's connected, the authoritative run history
            lives in your repository's <strong>Actions</strong> tab — open the "Daily content sync"
            workflow there to see every run, what it found, and any errors.
          </p>
        </CardContent>
      </Card>

      {!loading && logs.length === 0 && isSupabaseConfigured && (
        <p className="text-sm text-army-400">No sync log entries yet — they'll appear after the next automation run.</p>
      )}

      <div className="space-y-2.5">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                {STATUS_ICON[log.status]}
                <div>
                  <p className="text-sm font-medium">{log.source}</p>
                  <p className="text-xs text-army-500 dark:text-army-400">{log.message}</p>
                </div>
              </div>
              <div className="text-right text-xs text-army-500 dark:text-army-400">
                <p>{log.items_added} added / {log.items_found} found</p>
                <p>{new Date(log.ran_at).toLocaleString("en-IN")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <a
        href="https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-saffron-600 hover:underline"
      >
        How to view GitHub Actions run history <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
