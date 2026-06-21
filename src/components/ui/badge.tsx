import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        job: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
        scheme: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
        pension: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
        medical: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        news: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
        announcement: "bg-army-100 text-army-800 dark:bg-army-500/20 dark:text-army-100",
        neutral: "bg-army-100 text-army-700 dark:bg-white/10 dark:text-army-100",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
