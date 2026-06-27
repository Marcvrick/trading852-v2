from playwright.sync_api import sync_playwright
import json

SCREENSHOTS_DIR = "/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/screenshots"

def capture_intraday():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Collect console messages and errors
        console_messages = []
        js_errors = []

        page.on("console", lambda msg: console_messages.append({
            "type": msg.type,
            "text": msg.text
        }))
        page.on("pageerror", lambda err: js_errors.append(str(err)))

        # --- Screenshot 1: Initial load ---
        print("Navigating to http://localhost:3000 ...")
        page.goto("http://localhost:3000", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1500)

        page.screenshot(path=f"{SCREENSHOTS_DIR}/intraday_01_initial.png", full_page=False)
        print("Screenshot 1 saved: intraday_01_initial.png")

        # Dump page structure to help locate the Intraday button
        sidebar_html = page.evaluate("""() => {
            // Try to find a left sidebar / nav rail
            const candidates = [
                document.querySelector('nav'),
                document.querySelector('aside'),
                document.querySelector('[class*="sidebar"]'),
                document.querySelector('[class*="rail"]'),
                document.querySelector('[class*="mode"]'),
            ];
            return candidates.map(el => el ? el.outerHTML.slice(0, 2000) : null);
        }""")
        print("Sidebar candidates:", json.dumps(sidebar_html, indent=2)[:3000])

        # Find all buttons/links that mention "Intraday"
        intraday_info = page.evaluate("""() => {
            const all = Array.from(document.querySelectorAll('button, a, [role="tab"], [role="button"], li, span'));
            const matches = all.filter(el => el.textContent.trim().toLowerCase().includes('intraday'));
            return matches.map(el => ({
                tag: el.tagName,
                text: el.textContent.trim().slice(0, 100),
                className: el.className,
                id: el.id,
                outerHTML: el.outerHTML.slice(0, 300)
            }));
        }""")
        print("Intraday elements found:", json.dumps(intraday_info, indent=2))

        # --- Click Intraday ---
        clicked = False
        if intraday_info:
            try:
                # Use locator based on text content
                locator = page.get_by_text("Intraday", exact=True).first
                locator.click(timeout=5000)
                clicked = True
                print("Clicked 'Intraday' via exact text match")
            except Exception as e:
                print(f"Exact match failed: {e}")
                try:
                    locator = page.get_by_text("Intraday").first
                    locator.click(timeout=5000)
                    clicked = True
                    print("Clicked 'Intraday' via partial text match")
                except Exception as e2:
                    print(f"Partial match failed: {e2}")

        if not clicked:
            print("WARNING: Could not find/click Intraday button")

        page.wait_for_timeout(1500)

        # --- Screenshot 2: After click ---
        page.screenshot(path=f"{SCREENSHOTS_DIR}/intraday_02_after_click.png", full_page=False)
        print("Screenshot 2 saved: intraday_02_after_click.png")

        # --- Report console output ---
        print("\n=== CONSOLE MESSAGES ===")
        for msg in console_messages:
            print(f"  [{msg['type'].upper()}] {msg['text']}")

        print("\n=== JS ERRORS ===")
        if js_errors:
            for err in js_errors:
                print(f"  ERROR: {err}")
        else:
            print("  (none)")

        browser.close()

if __name__ == "__main__":
    capture_intraday()
