import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ExternalLink, FileCheck2, Gift, Tag } from "lucide-react"
import { getSchemeById } from "@/services/schemesService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Scheme } from "@/types"

export function SchemeDetail() {
  const { id } = useParams<{ id: string }>()
  const [scheme, setScheme] = useState<Scheme | null | undefined>(undefined)
  const { t } = useLanguage()

  useEffect(() => {
    if (id) getSchemeById(id).then(setScheme)
  }, [id])

  if (scheme === undefined) return <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-army-400 sm:px-6">{t("loading")}</div>
  if (scheme === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-army-600 dark:text-army-300">Scheme not found.</p>
        <Link to="/schemes" className="mt-2 inline-block text-saffron-600 hover:underline">Back to schemes</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/schemes" className="inline-flex items-center gap-1 text-sm text-army-500 hover:text-saffron-600 dark:text-army-400">
        <ArrowLeft className="h-4 w-4" /> Back to schemes
      </Link>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <Badge variant="scheme" className="w-fit"><Tag className="h-3 w-3" /> {t(scheme.category || "schemes")}</Badge>
          <h1 className="mt-3 font-display text-2xl font-bold">{scheme.title}</h1>
          <p className="mt-2 text-sm text-army-600 dark:text-army-300">{scheme.summary}</p>

          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="font-display font-semibold text-army-800 dark:text-army-100">Eligibility</p>
              <p className="mt-1 text-army-600 dark:text-army-300">{scheme.eligibility}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-army-800 dark:text-army-100 inline-flex items-center gap-1.5">
                <Gift className="h-4 w-4" /> Benefits
              </p>
              <p className="mt-1 text-army-600 dark:text-army-300">{scheme.benefits}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-army-800 dark:text-army-100 inline-flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4" /> Documents required
              </p>
              <p className="mt-1 text-army-600 dark:text-army-300">{scheme.documents_required}</p>
            </div>
            {scheme.last_date && (
              <div>
                <p className="font-display font-semibold text-army-800 dark:text-army-100">Last date to apply</p>
                <p className="mt-1 text-army-600 dark:text-army-300">{scheme.last_date}</p>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Button asChild>
              <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                View on official site <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <SaveButton itemId={scheme.id} itemType="scheme" />
            <ShareButton title={scheme.title} url={scheme.link} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
