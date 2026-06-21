import { useEffect, useState } from "react"
import { Trash2, Plus, Edit } from "lucide-react"
import { getLatestUpdates, addUpdate, deleteUpdate, updateUpdate } from "@/services/updatesService"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Update, UpdateCategory } from "@/types"

const CATEGORIES: UpdateCategory[] = ["scheme", "job", "pension", "medical", "news", "announcement"]

const EMPTY: Omit<Update, "id" | "created_at"> = {
  title: "", summary: "", category: "news", source: "", link: "", published_date: "",
}

export function AdminUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null)

  function load() {
    getLatestUpdates(500).then(setUpdates)
  }
  useEffect(load, [])

  const handleEditClick = (update: Update) => {
    setEditingUpdate(update)
    setForm({
      title: update.title,
      summary: update.summary,
      category: update.category,
      source: update.source,
      link: update.link,
      published_date: update.published_date ? new Date(update.published_date).toISOString().split("T")[0] : "",
    })
    setOpen(true)
  }

  const handleClose = () => {
    setForm(EMPTY)
    setEditingUpdate(null)
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage updates</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingUpdate(null); setForm(EMPTY); setOpen(true); }}>
              <Plus className="h-4 w-4" /> Add update
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUpdate ? "Edit update" : "Add a new update"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                if (editingUpdate) {
                  await updateUpdate(editingUpdate.id, form)
                } else {
                  await addUpdate(form)
                }
                handleClose()
                load()
              }}
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Input id="summary" required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="h-10 w-full rounded-lg border border-army-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-army-50"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as UpdateCategory })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Input id="source" required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="link">Link</Label>
                <Input id="link" required value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="published_date">Published date</Label>
                <Input id="published_date" type="date" required value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Save update</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SupabaseNotice />

      <div className="space-y-2.5">
        {updates.map((update) => (
          <Card key={update.id}>
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{update.title}</p>
                <p className="truncate text-xs text-army-500 dark:text-army-400">{update.category} · {update.source}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit update"
                  onClick={() => handleEditClick(update)}
                >
                  <Edit className="h-4 w-4 text-army-600 dark:text-army-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete update"
                  onClick={async () => {
                    await deleteUpdate(update.id)
                    load()
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
