import requests
from bs4 import BeautifulSoup
from datetime import date, timedelta
import urllib3
from supabase_service import insert_job, insert_update

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://dgrindia.gov.in"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def fetch_dgr_jobs() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/job-opportunities", f"{BASE_URL}/vacancies"]
    
    for url in urls:
        try:
            print(f"  Fetching DGR Jobs: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 15:
                    continue
                
                job_keywords = ["vacancy", "recruitment", "job", "post", "security", "supervisor", "officer", "manager"]
                if not any(kw in text.lower() for kw in job_keywords):
                    continue
                    
                if href.startswith("http"):
                    full_url = href
                elif href.startswith("/"):
                    full_url = BASE_URL + href
                else:
                    full_url = f"{BASE_URL}/{href}"
                    
                if any(item["link"] == full_url for item in results):
                    continue
                    
                deadline = (date.today() + timedelta(days=30)).isoformat()
                
                results.append({
                    "title": text[:250],
                    "organization": "Directorate General Resettlement (DGR)",
                    "location": "India (Multiple Locations)",
                    "description": f"Ex-Servicemen recruitment vacancy posted by Directorate General Resettlement: {text}. Check details on the official DGR site to apply.",
                    "deadline": deadline,
                    "link": full_url
                })
        except Exception as e:
            print(f"  [ERROR] Failed to fetch jobs {url}: {e}")
            
    return results[:15]

def fetch_dgr_updates() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/whats-new", f"{BASE_URL}/notifications"]
    
    for url in urls:
        try:
            print(f"  Fetching DGR Updates: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 20:
                    continue
                
                keywords = ["notification", "circular", "training", "course", "resettlement", "welfare", "announcement"]
                if not any(kw in text.lower() for kw in keywords):
                    continue
                    
                if href.startswith("http"):
                    full_url = href
                elif href.startswith("/"):
                    full_url = BASE_URL + href
                else:
                    full_url = f"{BASE_URL}/{href}"
                    
                if any(item["link"] == full_url for item in results):
                    continue
                    
                results.append({
                    "title": text[:250],
                    "summary": f"Latest welfare or resettlement training update from Directorate General Resettlement (DGR): {text[:280]}.",
                    "category": "scheme" if "course" in text.lower() or "training" in text.lower() else "news",
                    "source": "DGR",
                    "link": full_url,
                    "published_date": date.today().isoformat()
                })
        except Exception as e:
            print(f"  [ERROR] Failed to fetch updates {url}: {e}")
            
    return results[:10]

def run() -> dict:
    print("Running DGR Scraper...")
    jobs = fetch_dgr_jobs()
    updates = fetch_dgr_updates()
    
    inserted = 0
    skipped = 0
    errors = 0
    
    for job in jobs:
        try:
            if insert_job(job):
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [ERROR] Error inserting job: {e}")
            errors += 1
            
    for update in updates:
        try:
            if insert_update(update):
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [ERROR] Error inserting update: {e}")
            errors += 1
            
    return {"inserted": inserted, "skipped": skipped, "errors": errors}

if __name__ == "__main__":
    run()
