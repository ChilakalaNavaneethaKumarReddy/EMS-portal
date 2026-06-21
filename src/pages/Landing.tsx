import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { 
  Shield, Briefcase, FileText, HeartPulse, Landmark, 
  Search, Bell, ArrowRight, Phone, Info, AlertTriangle, Sparkles 
} from "lucide-react"
import { getLatestUpdates } from "@/services/updatesService"
import { getLatestJobs } from "@/services/jobsService"
import { getLatestSchemes } from "@/services/schemesService"
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Update, Job, Scheme } from "@/types"

export function Landing() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all") // all, updates, jobs, schemes
  const [visibleCount, setVisibleCount] = useState(6)

  // Real-time notification states
  const [realtimeNotification, setRealtimeNotification] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date>(new Date())

  async function loadData() {
    try {
      const [u, j, s] = await Promise.all([
        getLatestUpdates(100),
        getLatestJobs(100),
        getLatestSchemes(100),
      ])
      setUpdates(u)
      setJobs(j)
      setSchemes(s)
    } catch (err) {
      console.error("Failed to load homepage data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Subscribe to real-time updates from Supabase
  useEffect(() => {
    const client = supabase
    if (!isSupabaseConfigured || !client) return

    const handleRealtimeChange = () => {
      loadData()
      setRealtimeNotification(true)
      setLastSynced(new Date())
      // Auto-hide notification after 6 seconds
      setTimeout(() => setRealtimeNotification(false), 6000)
    }

    const updatesChannel = client
      .channel("realtime-landing-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "updates" }, handleRealtimeChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, handleRealtimeChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "schemes" }, handleRealtimeChange)
      .subscribe()

    return () => {
      client.removeChannel(updatesChannel)
    }
  }, [])

  // Search & Filter Logic
  const filteredUpdates = useMemo(() => {
    return updates.filter(u => 
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.summary && u.summary.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [updates, searchQuery])

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.organization && j.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (j.location && j.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [jobs, searchQuery])

  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.eligibility && s.eligibility.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [schemes, searchQuery])

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#162a12] text-white py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,148,30,0.15),transparent_60%)]" />
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-5xl text-center space-y-6 relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-inner">
            <Shield className="h-9 w-9 text-saffron-400" />
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            {t("heroTitle")} <span className="text-saffron-400">🇮🇳</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-army-100 sm:text-xl font-light">
            {t("heroTagline")}
          </p>

          {/* Real-time Indicator Bar */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-4 py-1.5 text-xs text-army-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Real-time Sync Active</span>
            <span className="text-white/40">|</span>
            <span>Last Synced: {lastSynced.toLocaleTimeString("en-IN")}</span>
          </div>
        </div>
      </section>

      {/* Global Real-time Notification Banner */}
      {realtimeNotification && (
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 rounded-xl bg-saffron-50 border border-saffron-200 px-4 py-3 text-sm text-saffron-800 dark:bg-saffron-950/20 dark:border-saffron-900/30 dark:text-saffron-300 shadow-md animate-bounce">
            <Sparkles className="h-5 w-5 text-saffron-600 shrink-0" />
            <p className="font-medium">{t("syncAlert")}</p>
          </div>
        </div>
      )}

      {/* Main Filter / Search Toolbar */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-army-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161a12] md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-army-400" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", key: "filterAll" },
              { id: "updates", key: "filterUpdates" },
              { id: "jobs", key: "filterJobs" },
              { id: "schemes", key: "filterSchemes" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeCategory === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveCategory(tab.id); setVisibleCount(6); }}
              >
                {t(tab.key)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Important Alerts */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-950/40 dark:bg-red-950/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-red-800 dark:text-red-400 text-sm">{t("pensionCardTitle")}</h4>
            <p className="mt-1 text-xs text-red-700 dark:text-red-300/80">
              {t("pensionMockPending")}
            </p>
          </div>
        </div>
      </section>

      {/* Content Feed */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Helper Info Banner explaining English content constraint */}
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-army-50 dark:bg-white/5 p-3 text-xs text-army-500 dark:text-army-400">
          <Info className="h-4 w-4 text-saffron-500 shrink-0" />
          <span>{t("officialDisclaimer")}</span>
        </div>

        {loading ? (
          <p className="text-center text-sm text-army-400">{t("loading")}</p>
        ) : (
          <div className="space-y-12">
            
            {/* 1. Notifications Section */}
            {(activeCategory === "all" || activeCategory === "updates") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-army-600 dark:text-army-300" /> {t("statsUpdates")}
                  </h2>
                  {activeCategory === "all" && (
                    <Button variant="link" size="sm" asChild>
                      <Link to="/updates">{t("viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  )}
                </div>
                {filteredUpdates.length === 0 ? (
                  <p className="text-sm text-army-400">{t("noResults")}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUpdates.slice(0, activeCategory === "all" ? 3 : visibleCount).map((u) => (
                      <Card key={u.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <span className="inline-flex rounded-full bg-army-100 dark:bg-white/10 px-2 py-0.5 text-xs capitalize text-army-800 dark:text-army-300">
                              {t(u.category || "updates")}
                            </span>
                            <span className="text-xs text-army-500">
                              {u.published_date ? new Date(u.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recent"}
                            </span>
                          </div>
                          <CardTitle className="text-base font-bold line-clamp-2">{u.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 text-sm text-army-600 dark:text-army-300">
                          <p className="line-clamp-3">{u.summary || "No summary provided."}</p>
                        </CardContent>
                        <CardFooter className="border-t border-army-100 pt-3 flex justify-between items-center dark:border-white/10 text-xs text-army-500">
                          <span>Source: {u.source || "Official Portal"}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={u.link} target="_blank" rel="noopener noreferrer">{t("readMore")}</a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Job Opportunities Section */}
            {(activeCategory === "all" || activeCategory === "jobs") && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-army-600 dark:text-army-300" /> {t("statsJobs")}
                  </h2>
                  {activeCategory === "all" && (
                    <Button variant="link" size="sm" asChild>
                      <Link to="/jobs">{t("viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  )}
                </div>
                {filteredJobs.length === 0 ? (
                  <p className="text-sm text-army-400">{t("noResults")}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.slice(0, activeCategory === "all" ? 3 : visibleCount).map((j) => (
                      <Card key={j.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-saffron-600">{j.organization || "DGR"}</span>
                            <span className="text-xs text-army-500">
                              Deadline: {j.deadline ? new Date(j.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Rolling"}
                            </span>
                          </div>
                          <CardTitle className="text-base font-bold line-clamp-2">{j.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 text-sm text-army-600 dark:text-army-300">
                          <p className="line-clamp-3 mb-2">{j.description || "No description provided."}</p>
                          <p className="text-xs font-medium text-army-500">Location: {j.location}</p>
                        </CardContent>
                        <CardFooter className="border-t border-army-100 pt-3 flex justify-between items-center dark:border-white/10 text-xs">
                          <span className="text-army-500">Eligible: {j.eligibility || "Ex-Servicemen"}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={j.link} target="_blank" rel="noopener noreferrer">{t("readMore")}</a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Schemes Section */}
            {(activeCategory === "all" || activeCategory === "schemes") && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-army-600 dark:text-army-300" /> {t("statsSchemes")}
                  </h2>
                  {activeCategory === "all" && (
                    <Button variant="link" size="sm" asChild>
                      <Link to="/schemes">{t("viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  )}
                </div>
                {filteredSchemes.length === 0 ? (
                  <p className="text-sm text-army-400">{t("noResults")}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSchemes.slice(0, activeCategory === "all" ? 3 : visibleCount).map((s) => (
                      <Card key={s.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-emerald-600">{s.source || "KSB"}</span>
                            <span className="text-xs text-army-500">{t(s.category || "schemes")}</span>
                          </div>
                          <CardTitle className="text-base font-bold line-clamp-2">{s.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 text-sm text-army-600 dark:text-army-300 space-y-2">
                          <p className="line-clamp-3">{s.description || "Welfare scheme details."}</p>
                          <div className="text-xs text-army-500 space-y-1">
                            <p><strong>Benefits:</strong> {s.benefits ? s.benefits.substring(0, 80) : "Welfare Grant"}...</p>
                            <p><strong>Eligible:</strong> {s.eligibility ? s.eligibility.substring(0, 80) : "Ex-Servicemen"}...</p>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-army-100 pt-3 flex justify-end dark:border-white/10">
                          <Button variant="outline" size="sm" asChild>
                            <a href={s.link} target="_blank" rel="noopener noreferrer">{t("readMore")}</a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls for Specific Tab Views */}
            {activeCategory !== "all" && (
              <div className="flex justify-center pt-4">
                {activeCategory === "updates" && filteredUpdates.length > visibleCount && (
                  <Button onClick={() => setVisibleCount(v => v + 6)}>{t("loadMore")}</Button>
                )}
                {activeCategory === "jobs" && filteredJobs.length > visibleCount && (
                  <Button onClick={() => setVisibleCount(v => v + 6)}>{t("loadMore")}</Button>
                )}
                {activeCategory === "schemes" && filteredSchemes.length > visibleCount && (
                  <Button onClick={() => setVisibleCount(v => v + 6)}>{t("loadMore")}</Button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Access Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-saffron-500" />
          {t("recommendedForYou")}
        </h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          {[
            { label: t("echs"), desc: "Polyclinics & Hospital Lists", to: "/echs", icon: HeartPulse, color: "text-emerald-500" },
            { label: t("pension"), desc: "Life Certificate & OROP Status", to: "/pension", icon: Landmark, color: "text-saffron-500" },
            { label: t("jobs"), desc: "DGR & NCS Resettlement Jobs", to: "/jobs", icon: Briefcase, color: "text-blue-500" },
            { label: t("helplines"), desc: "Welfare Support Contacts", to: "/helplines", icon: Phone, color: "text-purple-500" },
            { label: t("about"), desc: "Automated Data pipeline details", to: "/about", icon: Info, color: "text-teal-500" },
          ].map((item) => (
            <Link key={item.label} to={item.to} className="group">
              <Card className="h-full group-hover:border-saffron-500/50 transition-colors">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-army-50 dark:bg-white/5 group-hover:scale-105 transition-transform ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="font-bold text-xs text-army-800 dark:text-army-100">{item.label}</p>
                  <p className="text-[10px] text-army-400">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
