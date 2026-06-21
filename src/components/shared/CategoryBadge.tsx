import { Badge } from "@/components/ui/badge"
import type { UpdateCategory } from "@/types"

const LABELS: Record<string, string> = {
  job: "Job",
  scheme: "Scheme",
  pension: "Pension",
  medical: "Medical",
  news: "News",
  announcement: "Announcement",
}

const VARIANTS: Record<string, "job" | "scheme" | "pension" | "medical" | "news" | "announcement"> = {
  job: "job",
  scheme: "scheme",
  pension: "pension",
  medical: "medical",
  news: "news",
  announcement: "announcement",
}

export function CategoryBadge({ category }: { category: UpdateCategory | string }) {
  return <Badge variant={VARIANTS[category] ?? "neutral"}>{LABELS[category] ?? category}</Badge>
}
