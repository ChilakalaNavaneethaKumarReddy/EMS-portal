import requests
from bs4 import BeautifulSoup
from datetime import date
import urllib3
from supabase_service import insert_scheme, insert_update

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://ksb.gov.in"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def fetch_ksb_schemes() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/welfare-schemes.htm", f"{BASE_URL}/financial-assistance.htm", f"{BASE_URL}/scholarships.htm"]
    
    for url in urls:
        try:
            print(f"  Fetching KSB Schemes: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 15:
                    continue
                
                scheme_keywords = ["scheme", "scholarship", "grant", "financial", "assistance", "fund", "benefit"]
                if not any(kw in text.lower() for kw in scheme_keywords):
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
                    "description": f"Welfare scheme or financial assistance option offered by Kendriya Sainik Board: {text}. Applications are generally routed through Zilla and Rajya Sainik Boards.",
                    "eligibility": "Ex-Servicemen and their dependents, PBOR/officers as per KSB guidelines.",
                    "benefits": "Financial aid, grants or educational scholarships directly disbursed to beneficiary accounts.",
                    "source": "KSB",
                    "link": full_url
                })
        except Exception as e:
            print(f"  [ERROR] Failed to fetch schemes {url}: {e}")
            
    return results[:15]

def fetch_ksb_updates() -> list[dict]:
    results = []
    urls = [f"{BASE_URL}/", f"{BASE_URL}/notifications.htm", f"{BASE_URL}/whatsNew.htm"]
    
    for url in urls:
        try:
            print(f"  Fetching KSB Updates: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            for link in soup.find_all("a", href=True):
                href = link.get("href", "")
                text = link.get_text(strip=True)
                
                if not text or len(text) < 20:
                    continue
                
                keywords = ["notification", "circular", "order", "notice", "announcement", "sainik"]
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
                    "summary": f"Latest administrative notification or circular from Kendriya Sainik Board (KSB): {text[:280]}.",
                    "category": "scheme",
                    "source": "KSB",
                    "link": full_url,
                    "published_date": date.today().isoformat()
                })
        except Exception as e:
            print(f"  [ERROR] Failed to fetch updates {url}: {e}")
            
    return results[:10]

def run() -> dict:
    print("Running KSB Scraper...")
    schemes = fetch_ksb_schemes()
    updates = fetch_ksb_updates()
    
    inserted = 0
    skipped = 0
    errors = 0
    
    for scheme in schemes:
        try:
            if insert_scheme(scheme):
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [ERROR] Error inserting scheme: {e}")
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
