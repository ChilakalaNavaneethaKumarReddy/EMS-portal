import { Link } from "react-router-dom"
import { Tag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { Badge } from "@/components/ui/badge"
import type { Scheme } from "@/types"

export function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Badge variant="scheme" className="w-fit">
          <Tag className="h-3 w-3" /> {scheme.category}
        </Badge>
        <CardTitle>
          <Link to={`/schemes/${scheme.id}`} className="hover:text-saffron-600">
            {scheme.title}
          </Link>
        </CardTitle>
        <CardDescription>{scheme.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-army-600 dark:text-army-300">
        <p><span className="font-medium text-army-800 dark:text-army-100">Benefits:</span> {scheme.benefits}</p>
      </CardContent>
      <CardFooter className="justify-between border-t border-army-100 pt-3 dark:border-white/10">
        <span className="text-xs text-army-500 dark:text-army-400">
          {scheme.last_date ? `Apply by: ${scheme.last_date}` : "Open / rolling"}
        </span>
        <div className="flex items-center">
          <SaveButton itemId={scheme.id} itemType="scheme" />
          <ShareButton title={scheme.title} url={scheme.link} />
        </div>
      </CardFooter>
    </Card>
  )
}
