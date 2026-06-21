"""
Ex-Servicemen Information Portal — daily content sync
=======================================================
Fetches the Press Information Bureau's official "Press Releases" RSS feed
(legitimate syndication, not a scrape of a page meant for browsers),
filters it down to items relevant to ex-servicemen / defence welfare, and
upserts the results into the Supabase `updates` table via the REST API.

Why PIB RSS and not DGR/KSB/ECHS directly: those .gov.in sites disallow
automated access in their robots.txt. PIB's RSS feed is explicitly meant
for syndication, so it's the one source we can reliably automate. The
"Official Resources" links elsewhere in the app point straight at DGR,
KSB, SPARSH and ECHS so the rest stays one click away.

Required environment variables (set as GitHub Actions secrets):
  SUPABASE_URL              e.g. https://xxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY the *service role* key (Project Settings -> API)
                             — NEVER the anon key, and never commit this key.

If these aren't set, the script logs a warning and writes a local
`data/updates.local.json` instead, so you can still test it without a
Supabase project.

Design choices, since this runs unattended on a daily cron:
  - Every network call is wrapped in try/except; one bad source never
    crashes the whole run.
  - We log a row to `sync_logs` at the end (success/partial/failed) so the
    Admin -> Sync Logs page has something real to show.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

import requests

REQUEST_TIMEOUT = 15
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; ESMPortalBot/1.0; personal family project)"}
PIB_RSS_URL = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_CONFIGURED = bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)

LOCAL_FALLBACK_PATH = Path(__file__).resolve().parent.parent / "data" / "updates.local.json"

RELEVANCE_KEYWORDS = [
    "ex-servicemen", "ex serviceman", "veteran", "esm", "sainik",
    "dgr", "resettlement", "echs", "sparsh", "defence pension",
    "armed forces", "kendriya sainik", "rajya sainik", "war widow", "orop",
]

CATEGORY_RULES = [
    ("job", ["job fair", "recruitment", "vacanc", "placement", "employment", "hire"]),
    ("pension", ["pension", "sparsh", "ppo", "life certificate", "orop"]),
    ("medical", ["echs", "health", "hospital", "medical"]),
    ("scheme", ["scheme", "scholarship", "grant", "welfare", "self-employment", "self employment"]),
]


def fetch_pib_items():
    try:
        resp = requests.get(PIB_RSS_URL, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
    except Exception as e:
        print(f"[warn] could not fetch/parse PIB RSS: {e}")
        return []

    items = []
    for item in root.findall(".//item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        description = (item.findtext("description") or "").strip()
        if title and link:
            items.append({"title": title, "link": link, "pubDate": pub_date, "description": description})
    return items


def is_relevant(text):
    lower = text.lower()
    return any(kw in lower for kw in RELEVANCE_KEYWORDS)


def categorize(text):
    lower = text.lower()
    for category, keywords in CATEGORY_RULES:
        if any(kw in lower for kw in keywords):
            return category
    return "news"


def parse_pub_date(pub_date_str):
    for fmt in ["%a, %d %b %Y %H:%M:%S %Z", "%a, %d %b %Y %H:%M:%S %z"]:
        try:
            return datetime.strptime(pub_date_str, fmt).strftime("%Y-%m-%d")
        except Exception:
            continue
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def build_update_rows():
    raw_items = fetch_pib_items()
    rows = []
    for raw in raw_items:
        combined = f"{raw['title']} {raw['description']}"
        if not is_relevant(combined):
            continue
        # Trim the description down to a short, displayable summary.
        summary = raw["description"][:280].strip() or raw["title"]
        rows.append({
            "title": raw["title"],
            "summary": summary,
            "category": categorize(combined),
            "source": "Press Information Bureau",
            "link": raw["link"],
            "published_date": parse_pub_date(raw["pubDate"]),
            "trending": False,
        })
    print(f"[info] {len(raw_items)} PIB items fetched, {len(rows)} relevant to ex-servicemen")
    return rows


def push_to_supabase(rows):
    """Upsert rows into the `updates` table, keyed on the unique `link` column."""
    if not rows:
        return 0, "no new items found"

    url = f"{SUPABASE_URL}/rest/v1/updates?on_conflict=link"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    try:
        resp = requests.post(url, headers=headers, json=rows, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return len(rows), "ok"
    except Exception as e:
        print(f"[error] Supabase upsert failed: {e}")
        return 0, str(e)


def write_log(items_found, items_added, status, message):
    if not SUPABASE_CONFIGURED:
        return
    url = f"{SUPABASE_URL}/rest/v1/sync_logs"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "source": "PIB RSS (Ministry of Defence)",
        "items_found": items_found,
        "items_added": items_added,
        "status": status,
        "message": message,
        "ran_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        requests.post(url, headers=headers, json=payload, timeout=REQUEST_TIMEOUT)
    except Exception as e:
        print(f"[warn] could not write sync_logs entry: {e}")


def write_local_fallback(rows):
    LOCAL_FALLBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {"generated_at": datetime.now(timezone.utc).isoformat(), "items": rows}
    with open(LOCAL_FALLBACK_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"[info] Supabase not configured — wrote {len(rows)} items to {LOCAL_FALLBACK_PATH} instead")


def main():
    rows = build_update_rows()

    if not SUPABASE_CONFIGURED:
        write_local_fallback(rows)
        return

    added, message = push_to_supabase(rows)
    status = "success" if added == len(rows) and rows else ("partial" if added else "failed")
    write_log(items_found=len(rows), items_added=added, status=status, message=message)
    print(f"[info] sync complete: {added}/{len(rows)} items upserted — {message}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[error] sync script failed: {e}", file=sys.stderr)
        # Exit 0 so a transient failure doesn't show as a scary red X every
        # day — the sync_logs / console output is where the real detail is.
        sys.exit(0)
