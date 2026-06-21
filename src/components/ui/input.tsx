import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-army-300 bg-white px-3 py-2 text-sm placeholder:text-army-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 disabled:opacity-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50 dark:placeholder:text-army-400",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
