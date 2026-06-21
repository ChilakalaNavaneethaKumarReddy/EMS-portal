import { Shield, Server, Terminal, Database, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"

export function About() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-10 sm:px-6">
      <section className="text-center space-y-4">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-army-700 text-white shadow-md">
          <Shield className="h-7 w-7 text-saffron-400" />
        </span>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("heroTitle")} 🇮🇳</h1>
        <p className="mx-auto max-w-xl text-army-600 dark:text-army-300">
          {t("aboutSubtitle")}
        </p>
      </section>

      {/* Architecture Section */}
      <section className="space-y-6">
        <h2 className="text-center font-display text-2xl font-bold">{t("aboutSourceTitle")}</h2>
        
        {/* Pipeline Diagram */}
        <div className="grid gap-4 md:grid-cols-4 relative">
          <Card className="z-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm">
            <CardContent className="pt-6 text-center space-y-2">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Globe className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-sm">Government Portals</h3>
              <p className="text-xs text-army-500">Official portals: ECHS, DGR, KSB, SPARSH</p>
            </CardContent>
          </Card>

          <Card className="z-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm">
            <CardContent className="pt-6 text-center space-y-2">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <Terminal className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-sm">Python Scrapers</h3>
              <p className="text-xs text-army-500">Scrapes HTML daily, extracts title, summary, link, date</p>
            </CardContent>
          </Card>

          <Card className="z-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm">
            <CardContent className="pt-6 text-center space-y-2">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Database className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-sm">Supabase Database</h3>
              <p className="text-xs text-army-500">Central tables with security policies & index structures</p>
            </CardContent>
          </Card>

          <Card className="z-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm">
            <CardContent className="pt-6 text-center space-y-2">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300">
                <Server className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-sm">Veer Connect Portal</h3>
              <p className="text-xs text-army-500">Realtime subscription UI renders changes on updates</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Design Goals */}
      <section className="bg-white py-8 rounded-2xl px-6 dark:bg-white/[0.02] border border-army-100 dark:border-white/10">
        <h2 className="font-display text-xl font-bold mb-4">{t("aboutMissionTitle")}</h2>
        <div className="space-y-4 text-sm text-army-600 dark:text-army-300">
          <div>
            <p className="font-bold text-army-800 dark:text-army-100">🚫 No Mandatory Login</p>
            <p>Veterans and senior citizens do not need to register or log in to browse notifications, jobs, or welfare benefits. All information is publicly available by default.</p>
          </div>
          <hr className="border-army-100 dark:border-white/10" />
          <div>
            <p className="font-bold text-army-800 dark:text-army-100">🔒 Admin Restriction</p>
            <p>CRUD capabilities are restricted via Postgres Row Level Security (RLS) to verified administrative accounts only, keeping the public feed secure from malicious modifications.</p>
          </div>
          <hr className="border-army-100 dark:border-white/10" />
          <div>
            <p className="font-bold text-army-800 dark:text-army-100">⚡ Automated & Cached Sync</p>
            <p>GitHub Actions schedules a daily execution of our robust Python BeautifulSoup scrapers, running duplicate validation in memory before storing records safely in Supabase.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
