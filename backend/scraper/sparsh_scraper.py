import requests
from bs4 import BeautifulSoup
from datetime import date
import urllib3
from supabase_service import insert_update

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://sparsh.defencepension.gov.in"
FALLBACK_URLS = ["https://pcda.nic.in", "https://pcdapension.nic.in"]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def fetch_sparsh_updates() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/public/notifications", f"{BASE_URL}/public/circulars"]
    
    for url in urls:
        try:
            print(f"  Fetching SPARSH: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=20, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 15:
                    continue
                
                keywords = ["pension", "circular", "revision", "life certificate", "sparsh", "pcda", "order", "notification"]
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
                    "summary": f"SPARSH Pension update: {text[:280]}. Keep your SPARSH account updated and complete biometric verification on time.",
                    "category": "pension",
                    "source": "SPARSH",
                    "link": full_url,
                    "published_date": date.today().isoformat()
                })
        except Exception as e:
            print(f"  [WARN] SPARSH fetch failed for {url}: {e}")
            
    # Try PCDA fallbacks if SPARSH returns nothing
    if not results:
        print("  SPARSH returned no results, trying PCDA fallback...")
        for base in FALLBACK_URLS:
            try:
                print(f"  Fetching PCDA: {base}")
                resp = requests.get(f"{base}/", headers=HEADERS, timeout=15, verify=False)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.content, "html.parser")
                
                for link in soup.find_all("a", href=True):
                    href = link.get("href", "")
                    text = link.get_text(strip=True)
                    
                    if not text or len(text) < 15:
                        continue
                    
                    keywords = ["pension", "circular", "order", "notification", "revision", "da", "dearness"]
                    if not any(kw in text.lower() for kw in keywords):
                        continue
                        
                    if href.startswith("http"):
                        full_url = href
                    elif href.startswith("/"):
                        full_url = base + href
                    else:
                        full_url = f"{base}/{href}"
                        
                    if any(item["link"] == full_url for item in results):
                        continue
                        
                    results.append({
                        "title": text[:250],
                        "summary": f"Defence Pension update from PCDA: {text[:280]}. Ex-servicemen should review if this circular affects their pension bracket or OROP revisions.",
                        "category": "pension",
                        "source": "PCDA Pension",
                        "link": full_url,
                        "published_date": date.today().isoformat()
                    })
            except Exception as ex:
                print(f"  [ERROR] PCDA fallback failed for {base}: {ex}")
                
    return results[:15]

def run() -> dict:
    print("Running SPARSH Scraper...")
    items = fetch_sparsh_updates()
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
            print(f"  [ERROR] Error inserting pension update: {e}")
            errors += 1
            
    return {"inserted": inserted, "skipped": skipped, "errors": errors}

if __name__ == "__main__":
    run()
