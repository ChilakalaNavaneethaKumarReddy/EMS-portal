import { Link } from "react-router-dom"
import { Building2, MapPin, CalendarClock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { SaveButton } from "@/components/shared/SaveButton"
import { ShareButton } from "@/components/shared/ShareButton"
import type { Job } from "@/types"

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>
          <Link to={`/jobs/${job.id}`} className="hover:text-saffron-600">
            {job.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> {job.organization}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-army-600 dark:text-army-300">
        <p className="line-clamp-2">{job.description}</p>
        <p className="mt-2 text-xs text-army-500 dark:text-army-400">Eligibility: {job.eligibility}</p>
      </CardContent>
      <CardFooter className="justify-between border-t border-army-100 pt-3 dark:border-white/10">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-army-600 dark:text-army-300">
          <CalendarClock className="h-3.5 w-3.5" /> Last date: {job.last_date}
        </span>
        <div className="flex items-center">
          <SaveButton itemId={job.id} itemType="job" />
          <ShareButton title={job.title} url={job.link} />
        </div>
      </CardFooter>
    </Card>
  )
}
