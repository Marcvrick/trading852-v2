from playwright.sync_api import sync_playwright
import sys
import json

def capture_full(url, output_path, viewport_width=1920, viewport_height=1080, user_agent=None):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        kwargs = {'viewport': {'width': viewport_width, 'height': viewport_height}}
        if user_agent:
            kwargs['user_agent'] = user_agent
        page = browser.new_page(**kwargs)
        page.goto(url, wait_until='networkidle', timeout=30000)
        page.wait_for_timeout(2000)
        page.screenshot(path=output_path, full_page=True)

        # Extract SEO data
        seo = page.evaluate("""() => {
            const h1s = [...document.querySelectorAll('h1')].map(e => e.innerText.trim());
            const h2s = [...document.querySelectorAll('h2')].map(e => e.innerText.trim());
            const title = document.title;
            const desc = document.querySelector('meta[name="description"]')?.content || '';
            const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
            const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
            const ogDesc = document.querySelector('meta[property="og:description"]')?.content || '';
            const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
            const viewport = document.querySelector('meta[name="viewport"]')?.content || '';
            const robots = document.querySelector('meta[name="robots"]')?.content || '';
            const imgsMissingAlt = [...document.querySelectorAll('img')].filter(i => !i.alt || i.alt.trim() === '').length;
            const totalImgs = document.querySelectorAll('img').length;
            const links = [...document.querySelectorAll('a')].length;
            const lang = document.documentElement.lang || '';
            const structuredData = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent);
            const navEl = document.querySelector('nav');
            const hamburger = document.querySelector('[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"], [id*="hamburger"], button[aria-label*="menu"], button[aria-label*="Menu"]');
            return {
                title, desc, canonical, ogTitle, ogDesc, ogImage, viewport, robots,
                h1s, h2s, imgsMissingAlt, totalImgs, links, lang, structuredData,
                hasNav: !!navEl, hasHamburger: !!hamburger
            };
        }""")
        browser.close()
        print(json.dumps(seo, indent=2))
        print(f"SCREENSHOT_SAVED: {output_path}")

if __name__ == '__main__':
    url = sys.argv[1]
    output = sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 1080
    ua = sys.argv[5] if len(sys.argv) > 5 else None
    capture_full(url, output, width, height, ua)
