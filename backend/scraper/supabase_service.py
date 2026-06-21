import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import date
from duplicate_checker import DuplicateChecker

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    # Try looking for a local .env file in parent directories
    parent_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
    if os.path.exists(parent_env):
        load_dotenv(parent_env)
        SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
        SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment or .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
duplicate_checker = DuplicateChecker(supabase)

def _today_str() -> str:
    return date.today().isoformat()

def insert_update(item: dict) -> bool:
    title = item.get("title", "").strip()
    link = item.get("link", "").strip()

    if not title:
        return False

    if duplicate_checker.is_duplicate(title, link):
        print(f"  [SKIP] Duplicate update: {title[:50]}")
        return False

    record = {
        "title": title,
        "summary": item.get("summary", "") or "Latest update details.",
        "category": item.get("category", "news") or "news",
        "source": item.get("source", "Official Source") or "Official Source",
        "link": link,
        "published_date": item.get("published_date", _today_str()) or _today_str(),
    }
    try:
        supabase.table("updates").insert(record).execute()
        duplicate_checker.add_record(title, link)
        print(f"  [OK] Inserted update: {title[:50]}")
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to insert update '{title[:50]}': {e}")
        return False

def insert_job(item: dict) -> bool:
    title = item.get("title", "").strip()
    link = item.get("link", "").strip()

    if not title:
        return False

    if duplicate_checker.is_duplicate(title, link):
        print(f"  [SKIP] Duplicate job: {title[:50]}")
        return False

    # Ensure last_date parses as date or fallback to default date representation
    deadline_str = item.get("deadline", item.get("last_date", _today_str()))
    if not deadline_str or deadline_str.lower() == "rolling":
        deadline_str = _today_str()

    record = {
        "title": title,
        "organization": item.get("organization", "Directorate General Resettlement (DGR)") or "Directorate General Resettlement (DGR)",
        "location": item.get("location", "India") or "India",
        "state": item.get("state", "All States") or "All States",
        "eligibility": item.get("eligibility", "Ex-Servicemen") or "Ex-Servicemen",
        "description": item.get("description", "") or "No description provided.",
        "deadline": deadline_str,
        "link": link,
    }
    try:
        supabase.table("jobs").insert(record).execute()
        duplicate_checker.add_record(title, link)
        print(f"  [OK] Inserted job: {title[:50]}")
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to insert job '{title[:50]}': {e}")
        return False

def insert_scheme(item: dict) -> bool:
    title = item.get("title", "").strip()
    link = item.get("link", "").strip()

    if not title:
        return False

    if duplicate_checker.is_duplicate(title, link):
        print(f"  [SKIP] Duplicate scheme: {title[:50]}")
        return False

    record = {
        "title": title,
        "description": item.get("description", "") or "No description provided.",
        "eligibility": item.get("eligibility", "Ex-Servicemen") or "Ex-Servicemen",
        "benefits": item.get("benefits", "Welfare assistance") or "Welfare assistance",
        "source": item.get("source", "Government") or "Government",
        "category": item.get("category", "Welfare") or "Welfare",
        "link": link,
        "published_date": item.get("published_date", _today_str()) or _today_str(),
    }
    try:
        supabase.table("schemes").insert(record).execute()
        duplicate_checker.add_record(title, link)
        print(f"  [OK] Inserted scheme: {title[:50]}")
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to insert scheme '{title[:50]}': {e}")
        return False
