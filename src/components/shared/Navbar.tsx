import { Link, NavLink } from "react-router-dom"
import { Menu, Shield, X, LogIn, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
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
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/updates", label: "Updates" },
  { to: "/jobs", label: "Jobs" },
  { to: "/schemes", label: "Schemes" },
  { to: "/echs", label: "ECHS" },
  { to: "/pension", label: "Pension" },
  { to: "/helplines", label: "Helplines" },
  { to: "/about", label: "About" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-army-200/70 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-[#161a12]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-army-700 text-white">
            <Shield className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-army-800 dark:text-army-50">
            Veer Connect
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
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
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
                  <Link to="/profile"><UserIcon className="h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild className="ml-1 hidden sm:inline-flex">
              <Link to="/login"><LogIn className="h-4 w-4" /> Sign in</Link>
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
              {link.label}
            </NavLink>
          ))}
          {!user && (
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-saffron-600">
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
