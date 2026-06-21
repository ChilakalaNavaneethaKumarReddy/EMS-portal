import requests
from bs4 import BeautifulSoup
from datetime import date
import urllib3
from supabase_service import insert_update

# Disable SSL Warnings for .gov.in sites
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://www.echs.gov.in"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def fetch_echs_updates() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/whatsNew.htm", f"{BASE_URL}/circulars.htm"]
    
    for url in urls:
        try:
            print(f"  Fetching ECHS: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 15:
                    continue
                
                keywords = ["circular", "notification", "order", "policy", "empanelled", 
                            "hospital", "smart card", "polyclinic", "medical", "health"]
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
                    "summary": f"Latest update from ECHS regarding ex-servicemen healthcare services: {text[:280]}. For more details, download the circular from the official ECHS site.",
                    "category": "medical",
                    "source": "ECHS",
                    "link": full_url,
                    "published_date": date.today().isoformat()
                })
        except Exception as e:
            print(f"  [ERROR] Failed to fetch {url}: {e}")
            
    return results[:15]

def run() -> dict:
    print("Running ECHS Scraper...")
    items = fetch_echs_updates()
    inserted = 0
    skipped = 0
    errors = 0
    
    for item in items:
        try:
            if insert_update(item):
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [ERROR] Error inserting update: {e}")
            errors += 1
            
    return {"inserted": inserted, "skipped": skipped, "errors": errors}

if __name__ == "__main__":
    run()
