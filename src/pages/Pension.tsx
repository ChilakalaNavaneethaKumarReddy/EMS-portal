import { useEffect, useState } from "react"
import { Landmark, ExternalLink, Key, CheckCircle, Clock } from "lucide-react"
import { getLatestUpdates } from "@/services/updatesService"
import { UpdateCard } from "@/components/shared/UpdateCard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Update } from "@/types"

export function Pension() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    getLatestUpdates(100).then((all) => {
      const pensionUpdates = all.filter(
        (u) =>
          u.source?.toLowerCase().includes("sparsh") ||
          u.source?.toLowerCase().includes("pcda") ||
          u.category?.toLowerCase() === "pension" ||
          u.title?.toLowerCase().includes("pension") ||
          u.title?.toLowerCase().includes("sparsh")
      )
      setUpdates(pensionUpdates)
      setLoading(false)
    })
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-900 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Landmark className="h-3.5 w-3.5 text-saffron-300" /> {t("pension")}
          </span>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t("pensionTitle")}
          </h1>
          <p className="text-sm text-saffron-100 sm:text-base">
            {t("pensionSubtitle")}
          </p>
        </div>
      </section>

      {/* Quick Info Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
              <CheckCircle className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">Annual Identification</CardTitle>
              <CardDescription>Life Certificate (DLC / MLC)</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>Perform your mandatory annual identification digitally using the Jeevan Pramaan app, biometric scanner, or OTP flow directly in SPARSH.</p>
            <a
              href="https://sparsh.defencepension.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:underline"
            >
              Submit Life Certificate <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
              <Key className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">SPARSH Migration</CardTitle>
              <CardDescription>Get credentials & PPO status</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>Recently migrated from bank branch to SPARSH? Track your migration status, retrieve login credentials, or view your newly assigned Corrigendum PPO.</p>
            <a
              href="https://sparsh.defencepension.gov.in/?page=trackServiceRequest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:underline"
            >
              Track Migration <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
              <Clock className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">Pension Slips & OROP</CardTitle>
              <CardDescription>Track monthly disbursements</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>Download monthly pension slips, view income tax reports, and verify OROP-2 revision tables and arrear calculation charts.</p>
            <a
              href="https://sparsh.defencepension.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:underline"
            >
              Log in to SPARSH <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Latest Pension Updates */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Landmark className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />
          Pension Circulars, Dearness Relief & OROP Updates
        </h2>
        {loading ? (
          <p className="text-sm text-army-400">{t("loading")}</p>
        ) : updates.length === 0 ? (
          <p className="text-sm text-army-500 dark:text-army-400 rounded-lg border border-dashed border-army-200 p-6 text-center dark:border-white/10">
            No pension-related updates found in the database.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {updates.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
