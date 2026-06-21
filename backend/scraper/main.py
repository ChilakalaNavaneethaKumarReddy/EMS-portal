import datetime
import sys
import os

# Ensure the script directory is in the path so imports work correctly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from supabase_service import supabase
import echs_scraper
import dgr_scraper
import ksb_scraper
import sparsh_scraper

def write_log(source: str, inserted: int, skipped: int, errors: int):
    status = "success"
    if errors > 0:
        status = "failed" if inserted == 0 else "partial"
    elif inserted == 0 and skipped > 0:
        status = "success"
        
    message = f"Scraping complete. Inserted {inserted} items, skipped {skipped} duplicates."
    if errors > 0:
        message += f" Encountered {errors} errors."
        
    try:
        # Write to sync_logs
        supabase.table("sync_logs").insert({
            "source": source,
            "items_found": inserted + skipped,
            "items_added": inserted,
            "status": status,
            "message": message,
            "ran_at": datetime.datetime.utcnow().isoformat()
        }).execute()
        
        # Update last_synced_at in data_sources
        supabase.table("data_sources").update({
            "last_synced_at": datetime.datetime.utcnow().isoformat()
        }).eq("name", source).execute()
        
        print(f"  [LOG] Successfully logged results for {source}")
    except Exception as e:
        print(f"  [WARN] Failed to write sync log for {source}: {e}")

def main():
    print("=" * 60)
    print(f"Veer Connect Automated Scraper Runner - {datetime.datetime.now().isoformat()}")
    print("=" * 60)
    
    total_inserted = 0
    total_skipped = 0
    total_errors = 0
    
    # 1. ECHS
    try:
        res = echs_scraper.run()
        write_log("ECHS", res["inserted"], res["skipped"], res["errors"])
        total_inserted += res["inserted"]
        total_skipped += res["skipped"]
        total_errors += res["errors"]
    except Exception as e:
        print(f"[CRITICAL ERROR] ECHS Scraper crashed: {e}")
        write_log("ECHS", 0, 0, 1)
        total_errors += 1
        
    # 2. DGR
    try:
        res = dgr_scraper.run()
        write_log("DGR", res["inserted"], res["skipped"], res["errors"])
        total_inserted += res["inserted"]
        total_skipped += res["skipped"]
        total_errors += res["errors"]
    except Exception as e:
        print(f"[CRITICAL ERROR] DGR Scraper crashed: {e}")
        write_log("DGR", 0, 0, 1)
        total_errors += 1
        
    # 3. KSB
    try:
        res = ksb_scraper.run()
        write_log("KSB", res["inserted"], res["skipped"], res["errors"])
        total_inserted += res["inserted"]
        total_skipped += res["skipped"]
        total_errors += res["errors"]
    except Exception as e:
        print(f"[CRITICAL ERROR] KSB Scraper crashed: {e}")
        write_log("KSB", 0, 0, 1)
        total_errors += 1
        
    # 4. SPARSH
    try:
        res = sparsh_scraper.run()
        write_log("SPARSH", res["inserted"], res["skipped"], res["errors"])
        total_inserted += res["inserted"]
        total_skipped += res["skipped"]
        total_errors += res["errors"]
    except Exception as e:
        print(f"[CRITICAL ERROR] SPARSH Scraper crashed: {e}")
        write_log("SPARSH", 0, 0, 1)
        total_errors += 1
        
    print("=" * 60)
    print("ALL SCRAPERS COMPLETE")
    print(f"Total inserted: {total_inserted}")
    print(f"Total skipped (duplicates): {total_skipped}")
    print(f"Total errors: {total_errors}")
    print("=" * 60)

if __name__ == "__main__":
    main()
