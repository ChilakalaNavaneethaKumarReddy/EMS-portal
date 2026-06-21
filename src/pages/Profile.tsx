import { useEffect, useState } from "react"
import { User as UserIcon, Moon, Briefcase, FileText, Bell, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { getBookmarkIds } from "@/services/bookmarksService"
import { getLatestJobs } from "@/services/jobsService"
import { getLatestSchemes } from "@/services/schemesService"
import { getLatestUpdates } from "@/services/updatesService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/shared/JobCard"
import { SchemeCard } from "@/components/shared/SchemeCard"
import { UpdateCard } from "@/components/shared/UpdateCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Link } from "react-router-dom"
import type { Job, Scheme, Update } from "@/types"

export function Profile() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([])
  const [savedUpdates, setSavedUpdates] = useState<Update[]>([])

  useEffect(() => {
    const jobIds = getBookmarkIds("job")
    const schemeIds = getBookmarkIds("scheme")
    const updateIds = getBookmarkIds("update")

    getLatestJobs(200).then((jobs) => setSavedJobs(jobs.filter((j) => jobIds.includes(j.id))))
    getLatestSchemes(200).then((schemes) => setSavedSchemes(schemes.filter((s) => schemeIds.includes(s.id))))
    getLatestUpdates(200).then((updates) => setSavedUpdates(updates.filter((u) => updateIds.includes(u.id))))
  }, [])

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{user ? (user.email ?? "U")[0]!.toUpperCase() : <UserIcon className="h-6 w-6" />}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-xl font-bold">{user?.email ?? "Guest"}</h1>
          <p className="text-sm text-army-500 dark:text-army-300">
            {user ? "Signed in" : "Browsing as guest — saved items live on this device only"}
          </p>
        </div>
        {!user && (
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/login"><LogIn className="h-4 w-4" /> Sign in</Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Moon className="h-4 w-4" /> Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between border-t border-army-100 pt-4 dark:border-white/10">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-army-500 dark:text-army-400">Easier on the eyes in low light</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Briefcase className="h-4 w-4" /> Saved jobs</h2>
        {savedJobs.length === 0 ? (
          <EmptyState icon={<Briefcase className="h-7 w-7" />} title="No saved jobs yet" message="Tap the bookmark icon on any job to save it here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">{savedJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><FileText className="h-4 w-4" /> Saved schemes</h2>
        {savedSchemes.length === 0 ? (
          <EmptyState icon={<FileText className="h-7 w-7" />} title="No saved schemes yet" message="Tap the bookmark icon on any scheme to save it here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">{savedSchemes.map((s) => <SchemeCard key={s.id} scheme={s} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Bell className="h-4 w-4" /> Saved notifications</h2>
        {savedUpdates.length === 0 ? (
          <EmptyState icon={<Bell className="h-7 w-7" />} title="No saved notifications yet" message="Tap the bookmark icon on any notification to save it here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">{savedUpdates.map((u) => <UpdateCard key={u.id} update={u} />)}</div>
        )}
      </section>
    </div>
  )
}
