# Ex-Servicemen Information Portal

A web app for Indian ex-servicemen and their families to view government
schemes, job opportunities, pension updates, ECHS notifications and
defence-related announcements in one place — with a search-based "Veer
Assistant", saved bookmarks, dark mode, and an admin console.

**Read this whole file before deploying** — the "Honest limitations" section
near the bottom explains exactly what works out of the box vs. what needs
your own (free) cloud accounts.

## Tech stack

React 19 + Vite + TypeScript · Tailwind CSS v4 · shadcn-style components
(hand-written, Radix-based) · TanStack Query · React Router v7 · Supabase
(Postgres + Auth) · Recharts-ready · Lucide icons

## 1. Run it locally right now (no setup required)

```bash
cd esm-portal-app
npm install
npm run dev
```

Open the printed `localhost` URL. The whole app works immediately on
**local mock data** (real DGR/KSB/SPARSH/ECHS content, not placeholder
text) — no Supabase project needed yet. Browse jobs, schemes, notifications,
bookmark things, toggle dark mode, ask Veer Assistant questions.

## 2. Connect a real backend (Supabase) — optional, ~20 minutes

This step is what turns "demo with mock data" into "real, persistent,
multi-device app with login and an editable admin console."

1. Create a free project at [supabase.com](https://supabase.com)
2. In your new project: **SQL Editor → New query** → paste the entire
   contents of `supabase/schema.sql` from this repo → **Run**
3. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key**
4. In this project, copy `.env.example` to `.env` and paste them in:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Restart `npm run dev` — the app now reads/writes real data automatically.
   No code changes needed; every service function in `src/services/` checks
   for these credentials and switches over by itself.
6. **To enable Google sign-in:** Supabase Dashboard → Authentication →
   Providers → Google → follow their guide to create Google OAuth
   credentials (this requires a free Google Cloud project on your end).
7. **To make yourself an admin** (so the Admin console add/edit/delete
   actually saves): sign in once through the app, then in the SQL Editor run:
   ```sql
   update profiles set is_admin = true where email = 'your-email@example.com';
   ```

## 3. Turn on the daily automation — optional

`scraper/scrape_and_push.py` fetches PIB's official press-release RSS feed
daily, filters it for ex-servicemen topics, and writes new items straight
into your Supabase `updates` table.

1. Push this repo to GitHub
2. Repo **Settings → Secrets and variables → Actions** → add two secrets:
   - `SUPABASE_URL` — same value as your `.env`
   - `SUPABASE_SERVICE_ROLE_KEY` — from Project Settings → API (the
     **service role** key, not the anon key — this one bypasses Row Level
     Security on purpose, so the automation can write. **Never put this key
     in `.env` or anywhere in the frontend code** — it only belongs in
     GitHub Secrets.)
3. The workflow `.github/workflows/sync.yml` runs daily at 8:30 AM IST.
   Trigger it manually anytime from the **Actions** tab → "Daily content
   sync" → **Run workflow**.

## 4. Deploy to Vercel — optional, ~5 minutes

1. Push this repo to GitHub (if you haven't already)
2. [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Framework preset: Vite (auto-detected)
4. Add the same two environment variables from your `.env` under
   **Settings → Environment Variables**
5. Deploy. Vercel gives you a live URL immediately.

## Honest limitations (please read)

- **Most official `.gov.in` sites block automated scraping** via
  robots.txt (DGR, KSB, ECHS, state Sainik Welfare Boards all do this).
  The daily automation only pulls from PIB's official RSS feed — a
  legitimate syndication feed — filtered by keyword. It will **not** catch
  everything posted on those other sites. The "Official Resources" links
  throughout the app point straight at DGR/KSB/SPARSH/ECHS so users can
  always check those directly.
- **Veer Assistant is a local keyword search**, not an LLM, so it costs
  nothing to run and works with zero configuration — but it won't handle
  open-ended conversation well. `src/lib/veerAssistant.ts` is written so
  you can swap `answerQuestion()` for a real LLM API call later (ideally
  from a Supabase Edge Function, so an API key never reaches the browser).
- **Auth, RLS, and the admin console are real and production-grade**, but
  inert until you create a Supabase project and paste in credentials —
  nobody can create that account on your behalf, including me.
- **Google sign-in** specifically needs you to also set up a Google Cloud
  OAuth client — Supabase's docs walk through this, it's a one-time ~10
  minute setup.
- The production JS bundle is ~210KB gzipped — fine for an MVP, but if
  this grows, look into route-based code-splitting with `React.lazy()`.

## Project structure

```
src/
  components/ui/      shadcn-style primitives (Button, Card, Dialog, ...)
  components/shared/   app-specific components (JobCard, Navbar, ...)
  pages/                one file per route
  pages/admin/          admin console pages
  layouts/              MainLayout (public site), AdminLayout (sidebar)
  services/             data layer — Supabase-first, mock-data fallback
  contexts/             Theme + Auth React contexts
  lib/                  supabaseClient, cn() utility, Veer Assistant logic
  types/                shared TypeScript interfaces (mirrors schema.sql)
  data/seed.ts           real mock data used when Supabase isn't connected
supabase/schema.sql     run this once in your Supabase SQL editor
scraper/                the daily automation script + its GitHub workflow
```

## Useful commands

```bash
npm run dev      # local dev server
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build locally
npm run lint     # ESLint
```
