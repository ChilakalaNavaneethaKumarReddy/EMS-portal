import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard")
    }
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Share" onClick={handleShare}>
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
