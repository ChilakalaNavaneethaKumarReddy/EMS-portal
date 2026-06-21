import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string
  value: string | number
  icon: ReactNode
  accent?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent ? "bg-saffron-500/15 text-saffron-600 dark:text-saffron-400" : "bg-army-100 text-army-700 dark:bg-white/10 dark:text-army-100"
          )}
        >
          {icon}
        </div>
        <div>
          <p className="font-display text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-army-500 dark:text-army-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
