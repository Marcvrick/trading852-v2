#!/usr/bin/env python3
"""Refresh the live Rate Convexity Regime tracker in publish/analyses/rate-convexity.html.

Run before a build to bake a fresh snapshot:
    python3 scripts/update-convexity.py && node build.js

Idempotent: replaces everything between the <!-- CONVEXITY:START --> and
<!-- CONVEXITY:END --> markers with a freshly computed gauge, sub-signal table,
and history sparkline. If the markers are missing the script exits with an error.

WHAT IT MEASURES
----------------
A composite "rate convexity regime" score in [-1, +1] for HK financials, built
from three free, no-key Yahoo Finance series (HK is pegged to USD under the
Linked Exchange Rate System, so US short rates ARE the HK rate driver):

  1. Short-rate trajectory   ^IRX  (13-week T-bill)   weight 0.25
       falling rates  -> + (cuts = convexity tailwind for financials)
  2. Yield-curve slope trend ^TNX - ^IRX (10Y - 3M)   weight 0.25
       steepening     -> + (wider net interest margin for banks)
  3. HK financials rel. str. ^HSNF / ^HSI             weight 0.50
       outperforming  -> + (the market's own verdict; weighted highest)

  composite = 0.25*s_rate + 0.25*s_curve + 0.50*s_rs

REGIME
  composite >= +0.25 -> POSITIVE  (green)   tailwind for long HK financials
  composite <= -0.25 -> NEGATIVE  (red)     headwind; fighting convexity
  otherwise          -> TRANSITION (amber)  regime unclear

This is a directional, educational signal. NOT investment advice.

Geometry (viewBox 720 x 160) mirrors assets/convexity.js so the client-rendered
sparkline matches the server-baked fallback exactly.
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "publish/analyses/rate-convexity.html")
SNAPSHOT = os.path.join(ROOT, "scripts/convexity-snapshot.json")

CHART = "https://query1.finance.yahoo.com/v8/finance/chart/"
LB = 63                # lookback ~ 3 months of trading days
W_RATE, W_CURVE, W_RS = 0.25, 0.25, 0.50
FULL_RATE = 0.50       # 50bp move in short rate = full signal
FULL_CURVE = 0.50      # 50bp move in slope = full signal
FULL_RS = 5.0          # 5% relative move = full signal
POS_TH, NEG_TH = 0.25, -0.25

# Sparkline geometry (must match assets/convexity.js).
SW, SH, PT, PB, PL, PR = 720, 160, 14, 14, 0, 0


def fetch(symbol):
    url = CHART + urllib.parse.quote(symbol) + "?range=1y&interval=1d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    payload = json.load(urllib.request.urlopen(req, timeout=25))
    r = payload["chart"]["result"][0]
    ts = r["timestamp"]
    closes = r["indicators"]["quote"][0]["close"]
    out = {}
    for t, c in zip(ts, closes):
        if c is None:
            continue
        day = datetime.fromtimestamp(t, timezone.utc).strftime("%Y-%m-%d")
        out[day] = c
    return out, r["meta"]


def clamp(v, lo=-1.0, hi=1.0):
    return max(lo, min(hi, v))


def composite_at(irx, tnx, hsnf, hsi, i, days):
    """Composite score using a 63-session lookback ending at index i."""
    j = i - LB
    d_rate = irx[days[i]] - irx[days[j]]
    s_rate = clamp(-d_rate / FULL_RATE)
    slope_now = tnx[days[i]] - irx[days[i]]
    slope_prev = tnx[days[j]] - irx[days[j]]
    s_curve = clamp((slope_now - slope_prev) / FULL_CURVE)
    ratio_now = hsnf[days[i]] / hsi[days[i]]
    ratio_prev = hsnf[days[j]] / hsi[days[j]]
    pct_rs = (ratio_now / ratio_prev - 1.0) * 100.0
    s_rs = clamp(pct_rs / FULL_RS)
    comp = W_RATE * s_rate + W_CURVE * s_curve + W_RS * s_rs
    return comp, s_rate, s_curve, s_rs, slope_now, d_rate, pct_rs


def regime_of(comp):
    if comp >= POS_TH:
        return "positive", "POSITIVE", "Tailwind for HK financials"
    if comp <= NEG_TH:
        return "negative", "NEGATIVE", "Headwind &mdash; fighting convexity"
    return "transition", "TRANSITION", "Regime unclear"


def main():
    irx, m_irx = fetch("^IRX")
    tnx, _ = fetch("^TNX")
    hsnf, _ = fetch("^HSNF")
    hsi, m_hsi = fetch("^HSI")

    days = sorted(set(irx) & set(tnx) & set(hsnf) & set(hsi))
    if len(days) < LB + 5:
        raise SystemExit(f"Not enough overlapping sessions ({len(days)}) to compute convexity.")

    hist = []  # (day, comp)
    detail = None
    for i in range(LB, len(days)):
        comp, s_rate, s_curve, s_rs, slope_now, d_rate, pct_rs = composite_at(irx, tnx, hsnf, hsi, i, days)
        hist.append((days[i], comp))
        detail = (comp, s_rate, s_curve, s_rs, slope_now, d_rate, pct_rs)

    comp, s_rate, s_curve, s_rs, slope_now, d_rate, pct_rs = detail
    cls, label, tagline = regime_of(comp)

    # Days in current regime: count trailing sessions sharing the regime bucket.
    streak = 0
    for _, c in reversed(hist):
        rc, _, _ = regime_of(c)
        if rc == cls:
            streak += 1
        else:
            break
    since_day = hist[-streak][0] if streak <= len(hist) else hist[0][0]
    since_fmt = datetime.strptime(since_day, "%Y-%m-%d").strftime("%-d %b %Y")
    asof = max(days)
    asof_fmt = datetime.strptime(asof, "%Y-%m-%d").strftime("%-d %b %Y")

    # ---- Sparkline of the composite score (-1 bottom .. +1 top) -------------
    plot = hist[-189:] if len(hist) > 189 else hist  # ~9 months
    vals = [c for _, c in plot]
    n = len(vals)
    fx = lambda k: round(PL + k / (n - 1) * (SW - PL - PR), 1)
    fy = lambda v: round(PT + (1 - (v + 1) / 2) * (SH - PT - PB), 1)
    line = " ".join(f"{fx(k)},{fy(v)}" for k, v in enumerate(vals))
    y_pos = fy(POS_TH)
    y_neg = fy(NEG_TH)
    y_zero = fy(0.0)
    start_fmt = datetime.strptime(plot[0][0], "%Y-%m-%d").strftime("%b %Y")
    dot_x, dot_y = fx(n - 1), fy(vals[-1])

    short_dir = "easing" if d_rate < -0.05 else ("tightening" if d_rate > 0.05 else "steady")
    curve_dir = "steepening" if s_curve > 0.1 else ("flattening" if s_curve < -0.1 else "flat")
    rs_dir = "outperforming" if pct_rs > 0.5 else ("lagging" if pct_rs < -0.5 else "tracking")

    v = dict(
        cls=cls, label=label, tagline=tagline,
        comp=f"{comp:+.2f}", asof=asof_fmt, since=since_fmt, streak=streak,
        irx=f"{irx[asof]:.2f}", drate=f"{d_rate:+.2f}", short_dir=short_dir,
        slope=f"{slope_now:+.2f}", scurve=f"{s_curve:+.2f}", curve_dir=curve_dir,
        rs=f"{pct_rs:+.1f}", srs=f"{s_rs:+.2f}", rs_dir=rs_dir,
        srate=f"{s_rate:+.2f}",
        line=line, ypos=y_pos, yneg=y_neg, yzero=y_zero,
        dotx=dot_x, doty=dot_y, start=start_fmt,
    )

    block = """<!-- CONVEXITY:START -->
      <div class="convexity-gauge convexity-gauge--{cls}" data-asof="{asof}">
        <div class="cvx-head">
          <span class="cvx-title">HK Financials &middot; Rate Convexity Regime</span>
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
            <span class="cvx-sig__name">Short rate <span class="cvx-sig__sym">^IRX 13w</span></span>
            <span class="cvx-sig__val">{irx}%</span>
            <span class="cvx-sig__sub">{drate}pp / 3mo &middot; {short_dir} &middot; signal {srate}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">Curve slope <span class="cvx-sig__sym">10Y &minus; 3M</span></span>
            <span class="cvx-sig__val">{slope}pp</span>
            <span class="cvx-sig__sub">{curve_dir} &middot; signal {scurve}</span>
          </div>
          <div class="cvx-sig">
            <span class="cvx-sig__name">HK financials vs HSI <span class="cvx-sig__sym">^HSNF / ^HSI</span></span>
            <span class="cvx-sig__val">{rs}%</span>
            <span class="cvx-sig__sub">3mo relative &middot; {rs_dir} &middot; signal {srs}</span>
          </div>
        </div>

        <svg class="cvx-spark" viewBox="0 0 720 160" preserveAspectRatio="none" role="img" aria-label="Rate convexity composite score, {start} to {asof}, range -1 to +1">
          <rect x="0" y="0" width="720" height="{ypos}" fill="#16a34a" fill-opacity="0.06"/>
          <rect x="0" y="{ypos}" width="720" height="{yneg_minus_ypos}" fill="#d4d4d4" fill-opacity="0.10"/>
          <rect x="0" y="{yneg}" width="720" height="{rest_h}" fill="#dc2626" fill-opacity="0.06"/>
          <line x1="0" y1="{yzero}" x2="720" y2="{yzero}" stroke="#999" stroke-width="0.8" stroke-dasharray="3 3"/>
          <polyline points="{line}" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
          <circle cx="{dotx}" cy="{doty}" r="3.4" fill="#111"/>
        </svg>
        <div class="cvx-axis"><span>{start}</span><span>composite score &middot; +1 tailwind / &minus;1 headwind</span><span>{asof}</span></div>
        <div class="cvx-note">Pegged-rate model: ^IRX, ^TNX, ^HSNF, ^HSI (Yahoo Finance). Directional signal, not investment advice. Live-refreshes on load.</div>
      </div>
      <!-- CONVEXITY:END -->"""

    block = block.format(
        yneg_minus_ypos=round(y_neg - y_pos, 1),
        rest_h=round(SH - y_neg, 1),
        **v,
    )

    src = open(PAGE, encoding="utf-8").read()
    pat = re.compile(r"<!-- CONVEXITY:START -->.*?<!-- CONVEXITY:END -->", re.S)
    if not pat.search(src):
        raise SystemExit("Markers <!-- CONVEXITY:START/END --> not found in rate-convexity.html")
    src = pat.sub(lambda _m: block, src)
    open(PAGE, "w", encoding="utf-8").write(src)

    json.dump(
        {"asof": asof, "regime": label, "composite": round(comp, 4),
         "s_rate": round(s_rate, 4), "s_curve": round(s_curve, 4), "s_rs": round(s_rs, 4),
         "irx": irx[asof], "slope": round(slope_now, 4), "rs_pct_3mo": round(pct_rs, 4),
         "streak_sessions": streak, "since": since_day},
        open(SNAPSHOT, "w"), indent=2,
    )

    print(f"Convexity refreshed: {label} (score {comp:+.2f}) as of {asof_fmt} | "
          f"rate {s_rate:+.2f} curve {s_curve:+.2f} rs {s_rs:+.2f} | {n} plotted pts | "
          f"regime since {since_fmt} ({streak} sessions)")


if __name__ == "__main__":
    main()
