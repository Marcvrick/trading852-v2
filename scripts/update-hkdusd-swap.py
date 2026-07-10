#!/usr/bin/env python3
"""Refresh the live HKD/USD Swap Regime tracker in DRAFT/usd-strength-hk-transmission.html.

Run before a build to bake a fresh snapshot:
    python3 scripts/update-hkdusd-swap.py && node build.js

Idempotent: replaces everything between the <!-- HKDUSD:START --> and
<!-- HKDUSD:END --> markers with a freshly computed gauge, sub-signal table, and
history sparkline. Companion to scripts/update-gold-regime.py / update-convexity.py
(same architecture, same .cvx-* CSS classes).

If the article moves from DRAFT/ to publish/analyses/, update PAGE below.

WHAT IT MEASURES
----------------
A composite "HKD/USD swap regime" score in [-1, +1], built from three free,
no-key Yahoo Finance series:

  1. Band position   HKD=X spot within the 7.75-7.85 convertibility band,
                      NOT a 3-month change, an absolute level      weight 0.40
       spot near 7.85 (weak-HKD edge) -> + (swap HKD->USD favorable)
       spot near 7.75 (strong-HKD edge) -> - (swap back to HKD favorable)
       formula: clamp((spot - 7.80) / 0.05)
  2. US short rate    ^IRX (13-week T-bill yield), 3-month change  weight 0.30
       yield rising -> + (carry trade into USD more attractive)
  3. Dollar trend     DXY (DX-Y.NYB), 3-month change                weight 0.30
       dollar strengthening -> + (confirms the swap-to-USD setup)

  composite = 0.40*s_band + 0.30*s_rate + 0.30*s_dxy

REGIME
  composite >= +0.25 -> USD FAVORABLE (green)   swap HKD -> USD looks attractive
  composite <= -0.25 -> HKD FAVORABLE (red)     swap back to HKD looks attractive
  otherwise          -> MIXED SIGNAL  (amber)   drivers disagree, no clean read

Directional, educational signal. NOT investment advice. Geometry (viewBox
720 x 160) mirrors assets/hkdusd-swap.js so the client render matches the bake.
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "DRAFT/usd-strength-hk-transmission.html")
SNAPSHOT = os.path.join(ROOT, "scripts/hkdusd-swap-snapshot.json")

CHART = "https://query1.finance.yahoo.com/v8/finance/chart/"
LB = 63                # ~ 3 months of trading days
W_BAND, W_RATE, W_DXY = 0.40, 0.30, 0.30
BAND_LO, BAND_HI, BAND_MID = 7.75, 7.85, 7.80
BAND_HALF = (BAND_HI - BAND_LO) / 2.0   # 0.05
FULL_RATE = 0.50       # 50bp move in the 13-week yield = full signal
FULL_DXY = 5.0          # 5% DXY move = full signal
POS_TH, NEG_TH = 0.25, -0.25

SW, SH, PT, PB = 720, 160, 14, 14  # sparkline geometry (match assets/hkdusd-swap.js)


def fetch(symbol):
    url = CHART + urllib.parse.quote(symbol) + "?range=1y&interval=1d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    payload = json.load(urllib.request.urlopen(req, timeout=25))
    r = payload["chart"]["result"][0]
    out = {}
    for t, c in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]):
        if c is None:
            continue
        out[datetime.fromtimestamp(t, timezone.utc).strftime("%Y-%m-%d")] = c
    return out


def clamp(v, lo=-1.0, hi=1.0):
    return max(lo, min(hi, v))


def composite_at(spot, irx, dxy, i, days):
    j = i - LB
    s_band = clamp((spot[days[i]] - BAND_MID) / BAND_HALF)
    d_irx = irx[days[i]] - irx[days[j]]
    s_rate = clamp(d_irx / FULL_RATE)
    pct_dxy = (dxy[days[i]] / dxy[days[j]] - 1.0) * 100.0
    s_dxy = clamp(pct_dxy / FULL_DXY)
    comp = W_BAND * s_band + W_RATE * s_rate + W_DXY * s_dxy
    return comp, s_band, s_rate, s_dxy, d_irx, pct_dxy


def regime_of(comp):
    if comp >= POS_TH:
        return "positive", "USD FAVORABLE", "Swap HKD to USD looks attractive"
    if comp <= NEG_TH:
        return "negative", "HKD FAVORABLE", "Swap back to HKD looks attractive"
    return "transition", "MIXED SIGNAL", "Drivers disagree, no clean read"


def main():
    spot = fetch("HKD=X")
    irx = fetch("^IRX")
    dxy = fetch("DX-Y.NYB")

    days = sorted(set(spot) & set(irx) & set(dxy))
    if len(days) < LB + 5:
        raise SystemExit(f"Not enough overlapping sessions ({len(days)}) to compute HKD/USD swap regime.")

    hist, detail = [], None
    for i in range(LB, len(days)):
        detail = composite_at(spot, irx, dxy, i, days)
        hist.append((days[i], detail[0]))

    comp, s_band, s_rate, s_dxy, d_irx, pct_dxy = detail
    cls, label, tagline = regime_of(comp)

    streak = 0
    for _, c in reversed(hist):
        if regime_of(c)[0] == cls:
            streak += 1
        else:
            break
    since_day = hist[-streak][0]
    since_fmt = datetime.strptime(since_day, "%Y-%m-%d").strftime("%-d %b %Y")
    asof = max(days)
    asof_fmt = datetime.strptime(asof, "%Y-%m-%d").strftime("%-d %b %Y")

    plot = hist[-189:] if len(hist) > 189 else hist
    vals = [c for _, c in plot]
    n = len(vals)
    fx = lambda k: round(k / (n - 1) * SW, 1)
    fy = lambda v: round(PT + (1 - (v + 1) / 2) * (SH - PT - PB), 1)
    line = " ".join(f"{fx(k)},{fy(v)}" for k, v in enumerate(vals))
    y_pos, y_neg, y_zero = fy(POS_TH), fy(NEG_TH), fy(0.0)
    start_fmt = datetime.strptime(plot[0][0], "%Y-%m-%d").strftime("%b %Y")
    dot_x, dot_y = fx(n - 1), fy(vals[-1])

    band_pos = "near the 7.85 weak-HKD edge" if s_band > 0.5 else ("near the 7.75 strong-HKD edge" if s_band < -0.5 else "mid-band")
    rate_dir = "yield rising" if d_irx > 0.05 else ("yield falling" if d_irx < -0.05 else "yield flat")
    dxy_dir = "dollar firming" if pct_dxy > 0.5 else ("dollar softening" if pct_dxy < -0.5 else "dollar flat")

    v = dict(
        cls=cls, label=label, tagline=tagline,
        comp=f"{comp:+.2f}", asof=asof_fmt, since=since_fmt, streak=streak,
        spot=f"{spot[asof]:.4f}", band_pos=band_pos, sband=f"{s_band:+.2f}",
        irx=f"{irx[asof]:.2f}", dirx=f"{d_irx:+.2f}", rate_dir=rate_dir, srate=f"{s_rate:+.2f}",
        dxy=f"{dxy[asof]:.1f}", pctdxy=f"{pct_dxy:+.1f}", dxy_dir=dxy_dir, sdxy=f"{s_dxy:+.2f}",
        line=line, ypos=y_pos, yneg=y_neg, yzero=y_zero, dotx=dot_x, doty=dot_y, start=start_fmt,
        yneg_minus_ypos=round(y_neg - y_pos, 1), rest_h=round(SH - y_neg, 1),
    )

    block = """<!-- HKDUSD:START -->
      <div class="hkdusd-gauge hkdusd-gauge--{cls}" data-asof="{asof}">
        <div class="cvx-head">
          <span class="cvx-title">HKD / USD &middot; Swap Regime</span>
          <span class="cvx-asof">as of {asof}</span>
        </div>
        <div class="cvx-regime">
          <span class="cvx-dot"></span>
          <span class="cvx-label">{label}</span>
          <span class="cvx-score">score {comp}</span>
        </div>
        <div class="cvx-tagline">{tagline} &middot; this regime since {since} ({streak} sessions)</div>

        <div class="cvx-signals">
          <div class="cvx-sig">
            <span class="cvx-sig__name">Band position <span class="cvx-sig__sym">HKD=X, 7.75-7.85</span></span>
            <span class="cvx-sig__val">{spot}</span>
            <span class="cvx-sig__sub">{band_pos} &middot; signal {sband}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">US short rate <span class="cvx-sig__sym">^IRX 13W</span></span>
            <span class="cvx-sig__val">{irx}%</span>
            <span class="cvx-sig__sub">{dirx}pp / 3mo &middot; {rate_dir} &middot; signal {srate}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">Dollar trend <span class="cvx-sig__sym">DXY</span></span>
            <span class="cvx-sig__val">{dxy}</span>
            <span class="cvx-sig__sub">{pctdxy}% / 3mo &middot; {dxy_dir} &middot; signal {sdxy}</span>
          </div>
        </div>

        <svg class="cvx-spark" viewBox="0 0 720 160" preserveAspectRatio="none" role="img" aria-label="HKD/USD swap regime composite score, {start} to {asof}, range -1 to +1">
          <rect x="0" y="0" width="720" height="{ypos}" fill="#16a34a" fill-opacity="0.06"/>
          <rect x="0" y="{ypos}" width="720" height="{yneg_minus_ypos}" fill="#d4d4d4" fill-opacity="0.10"/>
          <rect x="0" y="{yneg}" width="720" height="{rest_h}" fill="#dc2626" fill-opacity="0.06"/>
          <line x1="0" y1="{yzero}" x2="720" y2="{yzero}" stroke="#999" stroke-width="0.8" stroke-dasharray="3 3"/>
          <polyline points="{line}" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <circle cx="{dotx}" cy="{doty}" r="3.4" fill="#111"/>
        </svg>
        <div class="cvx-axis"><span>{start}</span><span>composite score &middot; +1 favors USD / &minus;1 favors HKD</span><span>{asof}</span></div>
        <div class="cvx-note">Drivers: HKD=X (band position, 7.75-7.85), &circ;IRX (13-week T-bill, US short rate), DXY (Yahoo Finance). Directional signal, not investment advice. Live-refreshes on load.</div>
      </div>
      <!-- HKDUSD:END -->""".format(**v)

    src = open(PAGE, encoding="utf-8").read()
    pat = re.compile(r"<!-- HKDUSD:START -->.*?<!-- HKDUSD:END -->", re.S)
    if not pat.search(src):
        raise SystemExit("Markers <!-- HKDUSD:START/END --> not found in the target page.")
    open(PAGE, "w", encoding="utf-8").write(pat.sub(lambda _m: block, src))

    json.dump(
        {"asof": asof, "regime": label, "composite": round(comp, 4),
         "s_band": round(s_band, 4), "s_rate": round(s_rate, 4), "s_dxy": round(s_dxy, 4),
         "spot": spot[asof], "irx": irx[asof], "dxy": dxy[asof],
         "dirx_3mo": round(d_irx, 4), "dxy_pct_3mo": round(pct_dxy, 4),
         "streak_sessions": streak, "since": since_day},
        open(SNAPSHOT, "w"), indent=2,
    )

    print(f"HKD/USD swap regime refreshed: {label} (score {comp:+.2f}) as of {asof_fmt} | "
          f"band {s_band:+.2f} rate {s_rate:+.2f} dxy {s_dxy:+.2f} | spot {spot[asof]:.4f} "
          f"({band_pos}) | {n} pts | since {since_fmt} ({streak} sessions)")


if __name__ == "__main__":
    main()
