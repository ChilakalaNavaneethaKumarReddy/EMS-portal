import type { ReactNode } from "react"

export function EmptyState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-army-300 px-6 py-14 text-center dark:border-white/15">
      <div className="text-army-400 dark:text-army-500">{icon}</div>
      <p className="font-display text-base font-semibold text-army-700 dark:text-army-100">{title}</p>
      <p className="max-w-sm text-sm text-army-500 dark:text-army-400">{message}</p>
    </div>
  )
}
