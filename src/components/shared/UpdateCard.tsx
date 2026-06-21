import { ExternalLink, Flame } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CategoryBadge } from "@/components/shared/CategoryBadge"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { Button } from "@/components/ui/button"
import type { Update } from "@/types"

export function UpdateCard({ update }: { update: Update }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CategoryBadge category={update.category} />
            {update.trending && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 dark:text-saffron-400">
                <Flame className="h-3.5 w-3.5" /> Trending
              </span>
            )}
          </div>
          <span className="text-xs text-army-500 dark:text-army-400">
            {new Date(update.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <CardTitle>{update.title}</CardTitle>
        <CardDescription>{update.summary}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <span className="text-xs text-army-500 dark:text-army-400">Source: {update.source}</span>
        <div className="flex items-center">
          <SaveButton itemId={update.id} itemType="update" />
          <ShareButton title={update.title} url={update.link} />
          <Button variant="link" size="sm" asChild>
            <a href={update.link} target="_blank" rel="noopener noreferrer">
              Read more <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
