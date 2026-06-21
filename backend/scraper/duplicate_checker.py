class DuplicateChecker:
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.existing_titles = set()
        self.existing_links = set()
        self.load_existing_records()

    def load_existing_records(self):
        try:
            print("[DuplicateChecker] Pre-loading existing records from updates, jobs, and schemes...")
            # Load updates
            resp = self.supabase.table("updates").select("title, link").execute()
            for r in resp.data or []:
                if r.get("title"):
                    self.existing_titles.add(r["title"].strip().lower())
                if r.get("link"):
                    self.existing_links.add(r["link"].strip().lower())

            # Load jobs
            resp = self.supabase.table("jobs").select("title, link").execute()
            for r in resp.data or []:
                if r.get("title"):
                    self.existing_titles.add(r["title"].strip().lower())
                if r.get("link"):
                    self.existing_links.add(r["link"].strip().lower())

            # Load schemes
            resp = self.supabase.table("schemes").select("title, link").execute()
            for r in resp.data or []:
                if r.get("title"):
                    self.existing_titles.add(r["title"].strip().lower())
                if r.get("link"):
                    self.existing_links.add(r["link"].strip().lower())
                
            print(f"[DuplicateChecker] Loaded {len(self.existing_titles)} titles and {len(self.existing_links)} links.")
        except Exception as e:
            print(f"[DuplicateChecker] Warning: Failed to pre-load existing records: {e}")

    def is_duplicate(self, title: str, link: str) -> bool:
        t_clean = title.strip().lower() if title else ""
        l_clean = link.strip().lower() if link else ""
        
        if t_clean and t_clean in self.existing_titles:
            return True
        if l_clean and l_clean in self.existing_links:
            return True
        return False

    def add_record(self, title: str, link: str):
        if title:
            self.existing_titles.add(title.strip().lower())
        if link:
            self.existing_links.add(link.strip().lower())
