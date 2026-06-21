import { AlertTriangle } from "lucide-react"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

export function SupabaseNotice() {
  if (isSupabaseConfigured) return null
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-saffron-300 bg-saffron-50 px-4 py-3 text-sm text-saffron-800 dark:border-saffron-500/30 dark:bg-saffron-500/10 dark:text-saffron-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        Showing local mock data. Add your Supabase project URL and anon key to <code>.env</code> to make
        adds/edits/deletes here actually persist.
      </span>
    </div>
  )
}
