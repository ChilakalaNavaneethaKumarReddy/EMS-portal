import { Link, NavLink } from "react-router-dom"
import { Menu, Shield, X, LogIn, LogOut, User as UserIcon, LayoutDashboard, Globe } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage, type Language } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/", key: "home" },
  { to: "/updates", key: "updates" },
  { to: "/jobs", key: "jobs" },
  { to: "/schemes", key: "schemes" },
  { to: "/echs", key: "echs" },
  { to: "/pension", key: "pension" },
  { to: "/helplines", key: "helplines" },
  { to: "/about", key: "about" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "te", label: "తెలుగు" },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-army-200/70 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-[#161a12]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-army-700 text-white">
            <Shield className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-army-800 dark:text-army-50">
            {t("heroTitle")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-army-600 transition-colors hover:bg-army-100 hover:text-army-900 dark:text-army-200 dark:hover:bg-white/10 dark:hover:text-white",
                  isActive && "bg-army-100 text-army-900 dark:bg-white/10 dark:text-white"
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Language Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-army-700 dark:text-army-200" aria-label="Change language">
                <Globe className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-semibold text-army-500 dark:text-army-400">Change Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "cursor-pointer font-medium",
                    language === lang.code && "text-saffron-600 dark:text-saffron-400 font-bold"
                  )}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full" aria-label="Profile menu">
                  <Avatar>
                    <AvatarFallback>{(user.email ?? "U")[0]!.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile"><UserIcon className="h-4 w-4" /> {t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> {t("admin")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" /> {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild className="ml-1 hidden sm:inline-flex">
              <Link to="/login"><LogIn className="h-4 w-4" /> {t("signIn")}</Link>
            </Button>
          )}

          <button
            className="ml-1 rounded-md p-2 text-army-700 dark:text-army-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-army-200/70 px-4 py-3 dark:border-white/10 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-army-600 dark:text-army-200",
                  isActive && "bg-army-100 text-army-900 dark:bg-white/10 dark:text-white"
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
          {!user && (
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-saffron-600">
              {t("signIn")}
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
