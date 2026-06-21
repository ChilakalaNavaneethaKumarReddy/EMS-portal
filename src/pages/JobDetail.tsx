import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Building2, MapPin, CalendarClock, ExternalLink, Users } from "lucide-react"
import { getJobById } from "@/services/jobsService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Job } from "@/types"

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null | undefined>(undefined)
  const { t } = useLanguage()

  useEffect(() => {
    if (id) getJobById(id).then(setJob)
  }, [id])

  if (job === undefined) return <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-army-400 sm:px-6">{t("loading")}</div>
  if (job === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-army-600 dark:text-army-300">Job not found.</p>
        <Link to="/jobs" className="mt-2 inline-block text-saffron-600 hover:underline">Back to jobs</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-army-500 hover:text-saffron-600 dark:text-army-400">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <h1 className="font-display text-2xl font-bold">{job.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-army-600 dark:text-army-300">
            <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {job.organization}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}, {job.state}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-4 w-4" /> Last date: {job.last_date}</span>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="font-display font-semibold text-army-800 dark:text-army-100">Description</p>
              <p className="mt-1 text-army-600 dark:text-army-300">{job.description}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-army-800 dark:text-army-100 inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Eligibility
              </p>
              <p className="mt-1 text-army-600 dark:text-army-300">{job.eligibility} · Age limit: {job.age_limit}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Button asChild>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                Apply on official site <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <SaveButton itemId={job.id} itemType="job" />
            <ShareButton title={job.title} url={job.link} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
