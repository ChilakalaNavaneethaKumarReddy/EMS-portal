import type { BookmarkType } from "@/types"

const STORAGE_KEY = "esm-portal:bookmarks"

interface StoredBookmark {
  item_id: string
  item_type: BookmarkType
  saved_at: string
}

function readAll(): StoredBookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredBookmark[]) : []
  } catch {
    return []
  }
}

function writeAll(items: StoredBookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  // Let any listening components (e.g. header bookmark count) know to refresh.
  window.dispatchEvent(new CustomEvent("bookmarks:changed"))
}

export function isBookmarked(itemId: string, itemType: BookmarkType): boolean {
  return readAll().some((b) => b.item_id === itemId && b.item_type === itemType)
}

export function toggleBookmark(itemId: string, itemType: BookmarkType): boolean {
  const all = readAll()
  const exists = all.some((b) => b.item_id === itemId && b.item_type === itemType)
  const next = exists
    ? all.filter((b) => !(b.item_id === itemId && b.item_type === itemType))
    : [...all, { item_id: itemId, item_type: itemType, saved_at: new Date().toISOString() }]
  writeAll(next)
  return !exists // returns new bookmarked state
}

export function getBookmarks(itemType?: BookmarkType): StoredBookmark[] {
  const all = readAll()
  return itemType ? all.filter((b) => b.item_type === itemType) : all
}

export function getBookmarkIds(itemType: BookmarkType): string[] {
  return getBookmarks(itemType).map((b) => b.item_id)
}
