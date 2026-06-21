import { NavLink, Outlet, Link } from "react-router-dom"
import { LayoutDashboard, Briefcase, FileText, Bell, ListChecks, ArrowLeft, Shield, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/sources", label: "Data Sources", icon: Database },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/schemes", label: "Schemes", icon: FileText },
  { to: "/admin/updates", label: "Updates", icon: Bell },
  { to: "/admin/logs", label: "Sync logs", icon: ListChecks },
]

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-army-200/70 bg-white dark:border-white/10 dark:bg-[#13160f] md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-army-200/70 px-5 dark:border-white/10">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-army-700 text-white">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-bold">Admin Console</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-army-600 transition-colors hover:bg-army-100 dark:text-army-300 dark:hover:bg-white/10",
                  isActive && "bg-army-700 text-white hover:bg-army-700 dark:bg-army-600 dark:hover:bg-army-600"
                )
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-army-200/70 p-3 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-army-600 hover:bg-army-100 dark:text-army-300 dark:hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex h-16 items-center justify-between border-b border-army-200/70 px-5 dark:border-white/10 md:justify-end">
          <span className="font-display text-sm font-bold md:hidden">Admin Console</span>
          <ThemeToggle />
        </div>
        <div className="p-5 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
