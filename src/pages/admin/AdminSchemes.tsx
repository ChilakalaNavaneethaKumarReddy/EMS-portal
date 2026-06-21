import { useEffect, useState } from "react"
import { Trash2, Plus, Edit } from "lucide-react"
import { getLatestSchemes, addScheme, deleteScheme, updateScheme } from "@/services/schemesService"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Scheme } from "@/types"

const EMPTY: Omit<Scheme, "id" | "created_at"> = {
  title: "",
  category: "Welfare",
  eligibility: "",
  benefits: "",
  documents_required: "",
  summary: "",
  last_date: "",
  link: "",
  published_date: "",
}

export function AdminSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null)

  function load() {
    getLatestSchemes(500).then(setSchemes)
  }
  useEffect(load, [])

  const handleEditClick = (scheme: Scheme) => {
    setEditingScheme(scheme)
    setForm({
      title: scheme.title,
      category: scheme.category || "Welfare",
      eligibility: scheme.eligibility || "",
      benefits: scheme.benefits || "",
      documents_required: scheme.documents_required || "",
      summary: scheme.summary || "",
      last_date: scheme.last_date ? new Date(scheme.last_date).toISOString().split("T")[0] : "",
      link: scheme.link || "",
      published_date: scheme.published_date ? new Date(scheme.published_date).toISOString().split("T")[0] : "",
    })
    setOpen(true)
  }

  const handleClose = () => {
    setForm(EMPTY)
    setEditingScheme(null)
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage schemes</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingScheme(null); setForm(EMPTY); setOpen(true); }}><Plus className="h-4 w-4" /> Add scheme</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingScheme ? "Edit scheme" : "Add a new scheme"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-3 pr-1"
              onSubmit={async (e) => {
                e.preventDefault()
                const payload = {
                  ...form,
                  last_date: form.last_date || null,
                  published_date: form.published_date || new Date().toISOString().split("T")[0],
                }
                
                if (editingScheme) {
                  await updateScheme(editingScheme.id, payload)
                } else {
                  await addScheme(payload)
                }
                handleClose()
                load()
              }}
            >
              {(Object.keys(EMPTY) as (keyof typeof EMPTY)[]).map((key) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">{key.replace(/_/g, " ")}</Label>
                  {key === "summary" || key === "eligibility" || key === "benefits" || key === "documents_required" ? (
                    <textarea
                      id={key}
                      required={(key as string) !== "last_date" && (key as string) !== "published_date"}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Input
                      id={key}
                      type={key === "last_date" || key === "published_date" ? "date" : "text"}
                      required={(key as string) !== "last_date" && (key as string) !== "published_date"}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full">Save scheme</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SupabaseNotice />

      <div className="space-y-2.5">
        {schemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{scheme.title}</p>
                <p className="truncate text-xs text-army-500 dark:text-army-400">{scheme.category} · {scheme.source || "Government"}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit scheme"
                  onClick={() => handleEditClick(scheme)}
                >
                  <Edit className="h-4 w-4 text-army-600 dark:text-army-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete scheme"
                  onClick={async () => {
                    await deleteScheme(scheme.id)
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
