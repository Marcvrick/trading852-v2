#!/usr/bin/env python3
"""Refresh the live Gold Regime tracker in publish/analyses/gold-regime.html.

Run before a build to bake a fresh snapshot:
    python3 scripts/update-gold-regime.py && node build.js

Idempotent: replaces everything between the <!-- GOLD:START --> and
<!-- GOLD:END --> markers with a freshly computed gauge, sub-signal table, and
history sparkline. Companion to scripts/update-convexity.py (same architecture).

WHAT IT MEASURES
----------------
A composite "gold regime" score in [-1, +1], built from three free, no-key
Yahoo Finance series, each as a 3-month change:

  1. Real-rate direction  ^TNX (10Y yield), INVERTED   weight 0.30
       yields falling -> + (lower opportunity cost of holding gold)
  2. Dollar direction     DXY (DX-Y.NYB),   INVERTED   weight 0.30
       dollar weakening -> + (cheaper for non-USD buyers)
  3. Gold trend           GC=F (gold futures)          weight 0.40
       price rising -> + (the tape; weighted highest)

  composite = 0.30*s_real + 0.30*s_usd + 0.40*s_trend

REGIME
  composite >= +0.25 -> POSITIVE  (green)   accumulation regime
  composite <= -0.25 -> NEGATIVE  (red)     headwind; correction in force
  otherwise          -> TRANSITION (amber)  drivers and price disagree

Directional, educational signal. NOT investment advice. Geometry (viewBox
720 x 160) mirrors assets/gold-regime.js so the client render matches the bake.
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "publish/analyses/gold-regime.html")
SNAPSHOT = os.path.join(ROOT, "scripts/gold-regime-snapshot.json")

CHART = "https://query1.finance.yahoo.com/v8/finance/chart/"
LB = 63                # ~ 3 months of trading days
W_REAL, W_USD, W_TREND = 0.30, 0.30, 0.40
FULL_REAL = 0.50       # 50bp move in 10Y = full signal
FULL_USD = 5.0         # 5% DXY move = full signal
FULL_TREND = 10.0      # 10% gold move = full signal
POS_TH, NEG_TH = 0.25, -0.25

SW, SH, PT, PB = 720, 160, 14, 14  # sparkline geometry (match assets/gold-regime.js)


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


def composite_at(tnx, dxy, gold, i, days):
    j = i - LB
    d_10y = tnx[days[i]] - tnx[days[j]]
    s_real = clamp(-d_10y / FULL_REAL)
    pct_usd = (dxy[days[i]] / dxy[days[j]] - 1.0) * 100.0
    s_usd = clamp(-pct_usd / FULL_USD)
    pct_gold = (gold[days[i]] / gold[days[j]] - 1.0) * 100.0
    s_trend = clamp(pct_gold / FULL_TREND)
    comp = W_REAL * s_real + W_USD * s_usd + W_TREND * s_trend
    return comp, s_real, s_usd, s_trend, d_10y, pct_usd, pct_gold


def regime_of(comp):
    if comp >= POS_TH:
        return "positive", "POSITIVE", "Accumulation regime"
    if comp <= NEG_TH:
        return "negative", "NEGATIVE", "Headwind &mdash; correction in force"
    return "transition", "TRANSITION", "Drivers and price disagree"


def main():
    tnx = fetch("^TNX")
    dxy = fetch("DX-Y.NYB")
    gold = fetch("GC=F")

    days = sorted(set(tnx) & set(dxy) & set(gold))
    if len(days) < LB + 5:
        raise SystemExit(f"Not enough overlapping sessions ({len(days)}) to compute gold regime.")

    hist, detail = [], None
    for i in range(LB, len(days)):
        detail = composite_at(tnx, dxy, gold, i, days)
        hist.append((days[i], detail[0]))

    comp, s_real, s_usd, s_trend, d_10y, pct_usd, pct_gold = detail
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

    real_dir = "yields easing" if d_10y < -0.05 else ("yields rising" if d_10y > 0.05 else "yields flat")
    usd_dir = "dollar softening" if pct_usd < -0.5 else ("dollar firming" if pct_usd > 0.5 else "dollar flat")
    trend_dir = "uptrend" if pct_gold > 0.5 else ("downtrend" if pct_gold < -0.5 else "flat")

    v = dict(
        cls=cls, label=label, tagline=tagline,
        comp=f"{comp:+.2f}", asof=asof_fmt, since=since_fmt, streak=streak,
        gold=f"{gold[asof]:,.0f}", goldpct=f"{pct_gold:+.1f}", trend_dir=trend_dir, strend=f"{s_trend:+.2f}",
        tnx=f"{tnx[asof]:.2f}", d10y=f"{d_10y:+.2f}", real_dir=real_dir, sreal=f"{s_real:+.2f}",
        dxy=f"{dxy[asof]:.1f}", usdpct=f"{pct_usd:+.1f}", usd_dir=usd_dir, susd=f"{s_usd:+.2f}",
        line=line, ypos=y_pos, yneg=y_neg, yzero=y_zero, dotx=dot_x, doty=dot_y, start=start_fmt,
        yneg_minus_ypos=round(y_neg - y_pos, 1), rest_h=round(SH - y_neg, 1),
    )

    block = """<!-- GOLD:START -->
      <div class="gold-gauge gold-gauge--{cls}" data-asof="{asof}">
        <div class="cvx-head">
          <span class="cvx-title">Gold &middot; Regime</span>
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
            <span class="cvx-sig__name">Real-rate dir <span class="cvx-sig__sym">^TNX 10Y, inv</span></span>
            <span class="cvx-sig__val">{tnx}%</span>
            <span class="cvx-sig__sub">{d10y}pp / 3mo &middot; {real_dir} &middot; signal {sreal}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">Dollar dir <span class="cvx-sig__sym">DXY, inv</span></span>
            <span class="cvx-sig__val">{dxy}</span>
            <span class="cvx-sig__sub">{usdpct}% / 3mo &middot; {usd_dir} &middot; signal {susd}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">Gold trend <span class="cvx-sig__sym">GC=F</span></span>
            <span class="cvx-sig__val">${gold}</span>
            <span class="cvx-sig__sub">{goldpct}% / 3mo &middot; {trend_dir} &middot; signal {strend}</span>
          </div>
        </div>

        <svg class="cvx-spark" viewBox="0 0 720 160" preserveAspectRatio="none" role="img" aria-label="Gold regime composite score, {start} to {asof}, range -1 to +1">
          <rect x="0" y="0" width="720" height="{ypos}" fill="#16a34a" fill-opacity="0.06"/>
          <rect x="0" y="{ypos}" width="720" height="{yneg_minus_ypos}" fill="#d4d4d4" fill-opacity="0.10"/>
          <rect x="0" y="{yneg}" width="720" height="{rest_h}" fill="#dc2626" fill-opacity="0.06"/>
          <line x1="0" y1="{yzero}" x2="720" y2="{yzero}" stroke="#999" stroke-width="0.8" stroke-dasharray="3 3"/>
          <polyline points="{line}" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <circle cx="{dotx}" cy="{doty}" r="3.4" fill="#111"/>
        </svg>
        <div class="cvx-axis"><span>{start}</span><span>composite score &middot; +1 tailwind / &minus;1 headwind</span><span>{asof}</span></div>
        <div class="cvx-note">Drivers: ^TNX (real-rate proxy), DXY, GC=F (Yahoo Finance). Directional signal, not investment advice. Live-refreshes on load.</div>
      </div>
      <!-- GOLD:END -->""".format(**v)

    src = open(PAGE, encoding="utf-8").read()
    pat = re.compile(r"<!-- GOLD:START -->.*?<!-- GOLD:END -->", re.S)
    if not pat.search(src):
        raise SystemExit("Markers <!-- GOLD:START/END --> not found in gold-regime.html")
    open(PAGE, "w", encoding="utf-8").write(pat.sub(lambda _m: block, src))

    json.dump(
        {"asof": asof, "regime": label, "composite": round(comp, 4),
         "s_real": round(s_real, 4), "s_usd": round(s_usd, 4), "s_trend": round(s_trend, 4),
         "gold": gold[asof], "tnx": tnx[asof], "dxy": dxy[asof],
         "gold_pct_3mo": round(pct_gold, 4), "usd_pct_3mo": round(pct_usd, 4), "d10y_3mo": round(d_10y, 4),
         "streak_sessions": streak, "since": since_day},
        open(SNAPSHOT, "w"), indent=2,
    )

    print(f"Gold regime refreshed: {label} (score {comp:+.2f}) as of {asof_fmt} | "
          f"real {s_real:+.2f} usd {s_usd:+.2f} trend {s_trend:+.2f} | gold ${gold[asof]:,.0f} "
          f"({pct_gold:+.1f}%/3mo) | {n} pts | since {since_fmt} ({streak} sessions)")


if __name__ == "__main__":
    main()
