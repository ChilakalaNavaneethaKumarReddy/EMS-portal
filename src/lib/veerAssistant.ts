import { getLatestJobs } from "@/services/jobsService"
import { getLatestSchemes } from "@/services/schemesService"
import { getLatestUpdates } from "@/services/updatesService"
import type { Job, Scheme, Update } from "@/types"

export interface AssistantResult {
  answer: string
  jobs: Job[]
  schemes: Scheme[]
  updates: Update[]
}

const STATE_NAMES = ["telangana", "andhra pradesh", "delhi", "punjab", "haryana", "maharashtra"]
const TOPIC_KEYWORDS: Record<string, string[]> = {
  pension: ["pension", "sparsh", "ppo", "orop", "dearness relief"],
  medical: ["echs", "medical", "health", "hospital"],
  scheme: ["scheme", "grant", "scholarship", "welfare", "benefit"],
  job: ["job", "jobs", "vacancy", "vacancies", "employment", "recruitment", "hire", "placement"],
}

/**
 * This is a deliberately simple, local, keyword-driven assistant — it works
 * immediately with zero configuration and no API costs. To upgrade it to a
 * true LLM-powered assistant later, replace `answerQuestion` with a call to
 * an Anthropic/OpenAI API (ideally from a Supabase Edge Function, so the API
 * key never reaches the browser) and keep this function as a graceful fallback.
 */
export async function answerQuestion(question: string): Promise<AssistantResult> {
  const q = question.toLowerCase()

  const [jobs, schemes, updates] = await Promise.all([
    getLatestJobs(200),
    getLatestSchemes(200),
    getLatestUpdates(200),
  ])

  const matchedState = STATE_NAMES.find((s) => q.includes(s))
  const wantsJobs = TOPIC_KEYWORDS.job.some((k) => q.includes(k))
  const wantsSchemes = TOPIC_KEYWORDS.scheme.some((k) => q.includes(k))
  const wantsPension = TOPIC_KEYWORDS.pension.some((k) => q.includes(k))
  const wantsMedical = TOPIC_KEYWORDS.medical.some((k) => q.includes(k))

  const words = q.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 3)

  function scoreText(text: string) {
    const lower = text.toLowerCase()
    return words.reduce((score, w) => (lower.includes(w) ? score + 1 : score), 0)
  }

  let matchedJobs: Job[] = []
  let matchedSchemes: Scheme[] = []
  let matchedUpdates: Update[] = []

  if (wantsJobs || matchedState) {
    matchedJobs = jobs
      .filter((j) => !matchedState || j.state.toLowerCase().includes(matchedState))
      .map((j) => ({ job: j, score: scoreText(`${j.title} ${j.organization} ${j.description}`) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.job)
  }

  if (wantsSchemes) {
    matchedSchemes = schemes
      .map((s) => ({ scheme: s, score: scoreText(`${s.title} ${s.summary} ${s.benefits}`) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.scheme)
  }

  if (wantsPension) {
    matchedUpdates.push(...updates.filter((u) => u.category === "pension").slice(0, 4))
  }
  if (wantsMedical) {
    matchedUpdates.push(...updates.filter((u) => u.category === "medical").slice(0, 4))
  }

  // Fallback: if nothing matched a specific intent, do a general keyword search across everything
  if (!wantsJobs && !wantsSchemes && !wantsPension && !wantsMedical && !matchedState) {
    matchedJobs = jobs.map((j) => ({ j, score: scoreText(`${j.title} ${j.description}`) })).sort((a, b) => b.score - a.score).filter((x) => x.score > 0).slice(0, 2).map((x) => x.j)
    matchedSchemes = schemes.map((s) => ({ s, score: scoreText(`${s.title} ${s.summary}`) })).sort((a, b) => b.score - a.score).filter((x) => x.score > 0).slice(0, 2).map((x) => x.s)
    matchedUpdates = updates.map((u) => ({ u, score: scoreText(`${u.title} ${u.summary}`) })).sort((a, b) => b.score - a.score).filter((x) => x.score > 0).slice(0, 2).map((x) => x.u)
  }

  const totalResults = matchedJobs.length + matchedSchemes.length + matchedUpdates.length

  let answer: string
  if (totalResults === 0) {
    answer =
      "I couldn't find a close match in jobs, schemes or notifications for that. Try asking about a specific topic — \"jobs in Telangana\", \"ECHS updates\", or \"pension scheme\" — or browse the Jobs and Schemes pages directly."
  } else if (matchedState && wantsJobs) {
    answer = `Here's what I found for ex-servicemen jobs in ${matchedState.replace(/\b\w/g, (c) => c.toUpperCase())}:`
  } else if (wantsPension) {
    answer = "Here are the latest pension-related updates:"
  } else if (wantsMedical) {
    answer = "Here are the latest ECHS / medical updates:"
  } else if (wantsSchemes) {
    answer = "Here are the welfare schemes that best match your question:"
  } else if (wantsJobs) {
    answer = "Here are the closest job matches I found:"
  } else {
    answer = "Here's what I found that's related to your question:"
  }

  return { answer, jobs: matchedJobs, schemes: matchedSchemes, updates: matchedUpdates }
}

export const SUGGESTED_QUESTIONS = [
  "Any jobs for ex-servicemen in Telangana?",
  "Show latest pension updates",
  "Explain ECHS medical benefits",
  "What education schemes are available?",
]
