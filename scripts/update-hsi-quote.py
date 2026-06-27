#!/usr/bin/env python3
"""Refresh the live HSI quote + 5-year sparkline in publish/analyses/market-thesis.html.

Run before a build to update the snapshot:
    python3 scripts/update-hsi-quote.py && node build.js

Idempotent: finds the existing .hsi-quote block (or inserts a new one above the
page H1) and replaces it with a freshly fetched quote and chart. Data: Yahoo
Finance ^HSI (weekly closes for the chart, daily for the day's change)."""
import json, urllib.request, re, os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "publish/analyses/market-thesis.html")
ANCHOR = "      <h1>Hang Seng Index Research</h1>"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return json.load(urllib.request.urlopen(req, timeout=25))


def series(payload):
    r = payload["chart"]["result"][0]
    pts = [(t, c) for t, c in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]) if c is not None]
    return pts, r["meta"]


weekly, meta = series(fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EHSI?range=5y&interval=1wk"))
daily, _ = series(fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EHSI?range=1mo&interval=1d"))

price = meta["regularMarketPrice"]
mtime = datetime.fromtimestamp(meta["regularMarketTime"], timezone.utc).strftime("%-d %b %Y")
prev = daily[-2][1]
chg = price - prev
pct = chg / prev * 100

closes = [c for _, c in weekly]
closes[-1] = price  # align last weekly point with the live regularMarketPrice
W, H, PT, PB = 720, 150, 12, 12
lo, hi = min(closes), max(closes)
rng = (hi - lo) or 1
n = len(closes)
fx = lambda i: round(i / (n - 1) * W, 1)
fy = lambda c: round(PT + (1 - (c - lo) / rng) * (H - PT - PB), 1)
line = " ".join(f"{fx(i)},{fy(c)}" for i, c in enumerate(closes))
area = f"M0,{H} L" + " L".join(f"{fx(i)},{fy(c)}" for i, c in enumerate(closes)) + f" L{W},{H} Z"
start = datetime.fromtimestamp(weekly[0][0], timezone.utc).strftime("%b %Y")

v = dict(
    price=f"{price:,.2f}", pct=f"{pct:+.2f}", chg=f"{chg:+,.0f}",
    dir="pos" if chg >= 0 else "neg", arrow="&#9650;" if chg >= 0 else "&#9660;",
    mtime=mtime, start=start, lo=f"{lo:,.0f}", hi=f"{hi:,.0f}", line=line, area=area,
)

block = """      <div class="hsi-quote">
        <div class="hsi-quote__head">
          <span class="hsi-quote__label">Hang Seng Index <span class="hsi-quote__ticker">&middot; HSI</span></span>
          <span class="hsi-quote__meta">HKD &middot; close {mtime}</span>
        </div>
        <div class="hsi-quote__row">
          <span class="hsi-quote__value">{price}</span>
          <span class="hsi-quote__chg hsi-quote__chg--{dir}">{arrow} {pct}% <span class="hsi-quote__abs">{chg}</span></span>
        </div>
        <svg class="hsi-quote__spark" viewBox="0 0 720 150" preserveAspectRatio="none" role="img" aria-label="Hang Seng Index five-year weekly close, {start} to {mtime}">
          <defs><linearGradient id="hsiFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000" stop-opacity="0.09"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </linearGradient></defs>
          <path d="{area}" fill="url(#hsiFill)"/>
          <polyline points="{line}" fill="none" stroke="#111" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </svg>
        <div class="hsi-quote__axis"><span>{start}</span><span>5-year &middot; weekly close &middot; range {lo}&ndash;{hi}</span><span>{mtime}</span></div>
      </div>""".format(**v)

src = open(PAGE, encoding="utf-8").read()
pat = re.compile(r'      <div class="hsi-quote">.*?      </div>\n(?=      <h1>Hang Seng Index Research</h1>)', re.S)
if pat.search(src):
    src = pat.sub(lambda m: block + "\n", src)
else:
    src = src.replace(ANCHOR, block + "\n" + ANCHOR, 1)
open(PAGE, "w", encoding="utf-8").write(src)
print(f"HSI quote refreshed: {v['price']} {v['pct']}% close {mtime} | {n} weekly pts | range {v['lo']}-{v['hi']}")
