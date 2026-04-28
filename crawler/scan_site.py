from pathlib import Path
import json
from playwright.sync_api import sync_playwright

TARGET_URL = "https://www.wikipedia.org"

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "backend" / "data" / "scans"
OUTPUT_FILE = OUTPUT_DIR / "cookies.json"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def scan_site(url: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print(f"Opening: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)

        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass

        cookies = context.cookies()

        result = {
            "site": url,
            "cookie_count": len(cookies),
            "cookies": cookies
        }

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)

        print(f"Saved {len(cookies)} cookies to {OUTPUT_FILE}")
        browser.close()

if __name__ == "__main__":
    scan_site(TARGET_URL)