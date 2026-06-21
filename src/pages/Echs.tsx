import { useEffect, useState } from "react"
import { HeartPulse, ExternalLink, ShieldCheck, CreditCard, Hospital } from "lucide-react"
import { getLatestUpdates } from "@/services/updatesService"
import { UpdateCard } from "@/components/shared/UpdateCard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Update } from "@/types"

export function Echs() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    getLatestUpdates(100).then((all) => {
      const echsUpdates = all.filter(
        (u) =>
          u.source?.toLowerCase().includes("echs") ||
          u.category?.toLowerCase() === "medical" ||
          u.title?.toLowerCase().includes("echs")
      )
      setUpdates(echsUpdates)
      setLoading(false)
    })
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-950 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <HeartPulse className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> {t("echs")}
          </span>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t("echsTitle")}
          </h1>
          <p className="text-sm text-emerald-100 sm:text-base">
            {t("echsSubtitle")}
          </p>
        </div>
      </section>

      {/* Quick Info Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CreditCard className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">{t("echsCardTitle")}</CardTitle>
              <CardDescription>Online application & renewal</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>{t("echsCardDesc")}</p>
            <a
              href="https://echs.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              {t("echsPortalBtn")} <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Hospital className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">Empanelled Hospitals</CardTitle>
              <CardDescription>Cashless treatment network</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>Access the live list of empanelled private super-specialty hospitals and diagnostic centres for cashless referrals.</p>
            <a
              href="https://www.echs.gov.in/empanelled_hospitals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              Search Hospitals <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-base font-bold">Emergency Referral</CardTitle>
              <CardDescription>Guidelines & reimbursement</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-army-600 dark:text-army-300 space-y-3 pt-2">
            <p>Learn the standard operating procedure for emergency admissions in non-empanelled hospitals and subsequent medical bill claims.</p>
            <a
              href="https://echs.gov.in/claims"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              View Claims Guide <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Latest ECHS Updates */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Latest ECHS Circulars & Advisories
        </h2>
        {loading ? (
          <p className="text-sm text-army-400">{t("loading")}</p>
        ) : updates.length === 0 ? (
          <p className="text-sm text-army-500 dark:text-army-400 rounded-lg border border-dashed border-army-200 p-6 text-center dark:border-white/10">
            No recent ECHS circulars found in the database. Scrapers will sync official posts daily.
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
