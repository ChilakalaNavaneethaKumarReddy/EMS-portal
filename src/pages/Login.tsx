import { useState } from "react"
import { Navigate, Link } from "react-router-dom"
import { Shield, Mail } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function Login() {
  const { user, isConfigured, signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  if (user) return <Navigate to="/profile" replace />

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-army-700 text-white">
          <Shield className="h-6 w-6" />
        </span>
        <h1 className="font-display text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-army-500 dark:text-army-300">
          Browsing works without an account — sign in only if you want bookmarks synced across devices.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {!isConfigured && (
            <p className="rounded-lg bg-saffron-50 px-3 py-2 text-xs text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
              Sign-in isn't connected yet — add your Supabase project credentials to <code>.env</code> to enable it.
              You can still use the whole site as a guest in the meantime.
            </p>
          )}

          <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={!isConfigured}>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-army-400">
            <div className="h-px flex-1 bg-army-200 dark:bg-white/10" /> or <div className="h-px flex-1 bg-army-200 dark:bg-white/10" />
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setStatus("Sending…")
              const { error } = await signInWithEmail(email)
              setStatus(error ?? "Check your email for a sign-in link.")
            }}
            className="space-y-2"
          >
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Button type="submit" className="w-full" disabled={!isConfigured}>
              <Mail className="h-4 w-4" /> Send sign-in link
            </Button>
            {status && <p className="text-xs text-army-500 dark:text-army-300">{status}</p>}
          </form>
        </CardContent>
      </Card>

      <Link to="/" className="mt-6 text-center text-sm text-army-500 hover:text-saffron-600 dark:text-army-400">
        Continue browsing as guest →
      </Link>
    </div>
  )
}
