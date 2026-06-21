import { useEffect, useState } from "react"
import { Trash2, Plus, Edit } from "lucide-react"
import { getLatestJobs, addJob, deleteJob, updateJob } from "@/services/jobsService"
import { SupabaseNotice } from "@/components/shared/SupabaseNotice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Job } from "@/types"

const EMPTY = {
  title: "",
  organization: "",
  location: "",
  state: "All States",
  eligibility: "Ex-Servicemen",
  description: "",
  deadline: "",
  link: "",
}

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  function load() {
    getLatestJobs(500).then(setJobs)
  }
  useEffect(load, [])

  const handleEditClick = (job: Job) => {
    setEditingJob(job)
    setForm({
      title: job.title,
      organization: job.organization || "",
      location: job.location || "",
      state: job.state || "All States",
      eligibility: job.eligibility || "Ex-Servicemen",
      description: job.description || "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
      link: job.link || "",
    })
    setOpen(true)
  }

  const handleClose = () => {
    setForm(EMPTY)
    setEditingJob(null)
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage jobs</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingJob(null); setForm(EMPTY); setOpen(true); }}><Plus className="h-4 w-4" /> Add job</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit job" : "Add a new job"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                // Map form values
                const payload = {
                  ...form,
                  // If deadline is empty, fallback to today
                  deadline: form.deadline || new Date().toISOString().split("T")[0],
                }
                
                if (editingJob) {
                  await updateJob(editingJob.id, payload)
                } else {
                  await addJob(payload)
                }
                handleClose()
                load()
              }}
            >
              {(Object.keys(EMPTY) as (keyof typeof EMPTY)[]).map((key) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">{key.replace(/_/g, " ")}</Label>
                  {key === "description" ? (
                    <textarea
                      id={key}
                      required
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Input
                      id={key}
                      type={key === "deadline" ? "date" : "text"}
                      required
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full">Save job</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SupabaseNotice />

      <div className="space-y-2.5">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{job.title}</p>
                <p className="truncate text-xs text-army-500 dark:text-army-400">
                  {job.organization} · {job.location} · Deadline {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Rolling"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit job"
                  onClick={() => handleEditClick(job)}
                >
                  <Edit className="h-4 w-4 text-army-600 dark:text-army-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete job"
                  onClick={async () => {
                    await deleteJob(job.id)
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
