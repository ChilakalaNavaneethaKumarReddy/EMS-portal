import { useRef, useState, useEffect } from "react"
import { Bot, Send, User as UserIcon } from "lucide-react"
import { answerQuestion, SUGGESTED_QUESTIONS, type AssistantResult } from "@/lib/veerAssistant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { JobCard } from "@/components/shared/JobCard"
import { SchemeCard } from "@/components/shared/SchemeCard"
import { UpdateCard } from "@/components/shared/UpdateCard"
import { useLanguage } from "@/contexts/LanguageContext"

interface Message {
  role: "user" | "assistant"
  text: string
  result?: AssistantResult
}

export function AIAssistant() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message dynamically on language load/change
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: t("aiDefaultResponse"),
      },
    ])
  }, [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, thinking])

  async function ask(text: string) {
    if (!text.trim() || thinking) return
    setMessages((m) => [...m, { role: "user", text }])
    setInput("")
    setThinking(true)
    const result = await answerQuestion(text)
    setMessages((m) => [...m, { role: "assistant", text: result.answer, result }])
    setThinking(false)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="flex items-center gap-3 border-b border-army-200/70 pb-4 dark:border-white/10">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-army-700 text-white">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold">{t("aiTitle")}</h1>
          <p className="text-xs text-army-500 dark:text-army-400">{t("aiSubtitle")}</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 py-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "assistant" ? "bg-army-700 text-white" : "bg-saffron-500 text-army-900"
              }`}
            >
              {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
            </span>
            <div className={`max-w-[85%] ${m.role === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "assistant"
                    ? "bg-army-100 text-army-900 dark:bg-white/10 dark:text-army-50"
                    : "bg-army-700 text-white"
                }`}
              >
                {m.text}
              </div>

              {m.result && (m.result.jobs.length > 0 || m.result.schemes.length > 0 || m.result.updates.length > 0) && (
                <div className="mt-3 grid gap-3 text-left sm:grid-cols-2">
                  {m.result.jobs.map((j) => <JobCard key={j.id} job={j} />)}
                  {m.result.schemes.map((s) => <SchemeCard key={s.id} scheme={s} />)}
                  {m.result.updates.map((u) => <UpdateCard key={u.id} update={u} />)}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-army-700 text-white">
              <Bot className="h-4 w-4" />
            </span>
            <div className="inline-block rounded-2xl bg-army-100 px-4 py-2.5 text-sm text-army-500 dark:bg-white/10 dark:text-army-300">
              Searching…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap gap-2 pt-5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="rounded-full border border-army-300 px-3 py-1.5 text-xs font-medium text-army-600 hover:bg-army-100 dark:border-white/15 dark:text-army-200 dark:hover:bg-white/10"
              >
                {q}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="flex items-center gap-2 border-t border-army-200/70 pt-4 dark:border-white/10"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("aiInputPlaceholder")}
        />
        <Button type="submit" size="icon" disabled={thinking}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
