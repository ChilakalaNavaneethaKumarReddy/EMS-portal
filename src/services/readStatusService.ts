const STORAGE_KEY = "esm-portal:read-updates"

function readAll(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function isRead(updateId: string): boolean {
  return readAll().includes(updateId)
}

export function markAsRead(updateId: string) {
  const all = readAll()
  if (!all.includes(updateId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, updateId]))
  }
}
