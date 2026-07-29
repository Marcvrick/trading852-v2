#!/usr/bin/env python3
"""Generate a 1200x630 social cover per article, so X/LinkedIn link cards show a
real headline instead of the shared white placeholder.

    python3 scripts/make_og.py              # only missing covers
    python3 scripts/make_og.py --force      # rebuild all
    python3 scripts/make_og.py 9973-chery   # one slug

Writes assets/og/{slug}.png. build.js picks those up automatically.
"""
import base64
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ANALYSES = ROOT / "publish" / "analyses"
OUT = ROOT / "assets" / "og"


def font_uri(weight):
    # Inlined: file:// fonts are blocked from the about:blank origin set_content uses.
    raw = (ROOT / "fonts" / f"space-grotesk-latin-{weight}-normal.woff2").read_bytes()
    return f"data:font/woff2;base64,{base64.b64encode(raw).decode()}"


FONT = font_uri(700)
FONT_REG = font_uri(400)

CONFIG_RE = re.compile(r"<!--\s*CONFIG\s*(\{.*?\})\s*-->", re.S)


def read_config(path):
    m = CONFIG_RE.search(path.read_text(encoding="utf-8"))
    return json.loads(m.group(1)) if m else {}


def headline_size(title):
    # ponytail: char-count ramp instead of real text measurement. Titles run
    # 40-110 chars; if one overflows, add a step rather than a layout engine.
    n = len(title)
    if n <= 45:
        return 92
    if n <= 70:
        return 74
    if n <= 95:
        return 62
    return 52


def template(cfg):
    title = cfg.get("ogTitle") or cfg.get("title") or "Trading852"
    eyebrow = (cfg.get("articleSection") or "Analysis").upper()
    context = cfg.get("contextLine") or ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: SG; src: url("{FONT}") format("woff2"); font-weight: 700; }}
@font-face {{ font-family: SG; src: url("{FONT_REG}") format("woff2"); font-weight: 400; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  width: 1200px; height: 630px; background: #000; color: #fff;
  font-family: SG, Helvetica, Arial, sans-serif;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 68px 72px; -webkit-font-smoothing: antialiased;
}}
.main {{ flex: 1; display: flex; flex-direction: column; justify-content: center; }}
.eyebrow {{ font-size: 21px; font-weight: 700; letter-spacing: .18em; color: #5b6478; }}
.rule {{ width: 64px; height: 4px; background: #56d49f; margin: 22px 0 30px; }}
h1 {{ font-size: {headline_size(title)}px; font-weight: 700; line-height: 1.08; letter-spacing: -.02em; }}
.context {{ font-size: 26px; font-weight: 400; color: #d6d5db; margin-top: 26px; line-height: 1.35; }}
footer {{ display: flex; justify-content: space-between; align-items: baseline;
  font-size: 20px; font-weight: 700; letter-spacing: .1em; color: #5b6478;
  border-top: 1px solid #2a2a30; padding-top: 22px; }}
footer .brand {{ color: #fff; }}
</style></head><body>
<div class="main">
  <div class="eyebrow">{eyebrow}</div>
  <div class="rule"></div>
  <h1>{title}</h1>
  {f'<div class="context">{context}</div>' if context else ''}
</div>
<footer><span class="brand">TRADING852</span><span>HKEX RESEARCH</span></footer>
</body></html>"""


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)

    targets = []
    for f in sorted(ANALYSES.glob("*.html")):
        slug = f.stem
        if args and slug not in args:
            continue
        if not force and (OUT / f"{slug}.png").exists():
            continue
        targets.append((slug, read_config(f)))

    if not targets:
        print("Nothing to generate (use --force to rebuild).")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        for slug, cfg in targets:
            page.set_content(template(cfg), wait_until="networkidle")
            page.screenshot(path=str(OUT / f"{slug}.png"))
            print(f"  {slug}.png")
        browser.close()
    print(f"Generated {len(targets)} covers -> assets/og/")


if __name__ == "__main__":
    main()
