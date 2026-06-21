import { useState } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isBookmarked, toggleBookmark } from "@/services/bookmarksService"
import type { BookmarkType } from "@/types"
import { cn } from "@/lib/utils"

export function SaveButton({ itemId, itemType }: { itemId: string; itemType: BookmarkType }) {
  const [saved, setSaved] = useState(() => isBookmarked(itemId, itemType))

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={saved ? "Remove bookmark" : "Save"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSaved(toggleBookmark(itemId, itemType))
      }}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-saffron-500 text-saffron-500")} />
    </Button>
  )
}
