---
title: "Industry Bridge Sync to trading852.com"
tags: [trading852, finmc2, automation, industry-bridge, deferred]
category: trading
type: implementation-plan
status: NOT BUILT (parked, decide later)
created: 2026-06-03
---

# Industry Bridge → trading852.com (daily auto-publish)

**Status: parked. Nothing below is built yet.** This note is the turnkey plan if Dany
decides to publish the FinMC_2 "US → HK Industry Bridge" to the public site, refreshed
once each morning. Written 2026-06-03.

## Goal

Publish the US → HK Industry Bridge (sector leadership → correlated HK catch-up
candidates) as a page on [trading852.com](https://trading852.com), updated automatically
every day with no manual step.

## The one hard constraint

trading852.com is a **static** site built by [build.js](build.js) to `dist/` and served by
Vercel from [github.com/Marcvrick/trading852-v2](https://github.com/Marcvrick/trading852-v2).
It **cannot** run the FinMC backend or read the ~6,600 local parquet files. So the Bridge
cannot be computed on the server. The only viable model is a **daily snapshot**: FinMC
computes the Bridge locally each morning (it already does), exports the result into this
repo, and Vercel rebuilds. The public page mirrors the FinMC Bridge, refreshed once a day.

"Live sync" is not possible. "Daily snapshot, automatic" is.

## What already exists (no new infra needed)

- **Daily compute is already running.** launchd agent `com.finmc2.daily-refresh`
  (`~/Library/LaunchAgents/com.finmc2.daily-refresh.plist`) fires ~10:30 local and already
  pre-warms the Bridge via `_prewarm_bridge()` in
  `~/Documents/FinMC_2/backend/daily_refresh.py` (calls
  `monitors.industry_bridge_state(force_refresh=True)`).
- **The computed snapshot lands here every morning:**
  `~/Documents/FinMC_2/backend/decade_data/indrs_bridge_cache.json` (~15 KB, ~21 bridges).
- **The site already has a build-time-JSON + client-fetch precedent**: the Scorecard.
  `build.js` writes `dist/assets/scorecard-recos.json`; `assets/scorecard.js` fetches it and
  renders. The Bridge page copies this exact pattern.
- **CSP already allows it.** [vercel.json](vercel.json) `connect-src 'self'` permits a
  same-origin fetch of `/data/bridge-snapshot.json`; `script-src 'self' 'unsafe-inline'`
  permits `/assets/industry-bridge.js`. No CSP change needed.
- **Clean URL is automatic.** `cleanUrls: true` means `src/industry-bridge.html` serves at
  `/industry-bridge`. No vercel rewrite needed.

## The Bridge JSON shape (source of truth)

Top keys: `us_benchmark`, `hk_benchmark`, `total_bridges`, `signal_counts`, `bridges`,
`generated_at`, `from_cache`.

`signal_counts`: `{catch-up, confirmed, neutral, fading}`.

Each item in `bridges[]`:
`us_industry, us_rs, us_chg_1m, us_chg_3m, hk_industry, hk_rs, hk_chg_1m, hk_chg_3m,
strength ("FORT"|"MODÉRÉ"), divergence (US 3m − HK 3m, pp), div_1m, signal, hk_constituents[]`.

`hk_constituents[]` (the drill-down): `ticker, rs_strength, avg_vol, turnover, above_sma`.

## Three decisions to settle before building

1. **Automated daily push to the LIVE repo.** Auto-update means a cron-driven
   `git commit && git push origin main` each morning, triggering a Vercel production deploy
   unattended. This crosses the standing rules *"never push without explicit ask"* and
   *force-push blocked on main*. Either explicitly opt in to the automated push, or run in
   **commit-local-only** mode (job writes + commits, Dany pushes manually after a glance).
   The script below defaults `PUBLISH = False` (no push) until this is decided.
2. **What gets exposed.** Sector-level rows only (recommended: keeps the actionable
   `hk_constituents` ticker lists private to FinMC), or the full drill-down too. The export
   script below strips `hk_constituents` by default.
3. **Page placement.** Standalone `/industry-bridge` linked in the nav, or an unlinked page
   shared by URL only. (Recommended: standalone, baked static, linked in nav.)

## Implementation · 4 parts

### Part A · export script (FinMC side)

Create `~/Documents/FinMC_2/backend/publish_bridge_to_trading852.py`:

```python
#!/usr/bin/env python3
"""Export the FinMC_2 US->HK bridge snapshot into the trading852-v2 repo.

Reads the already-computed daily bridge cache, strips the private HK constituent
drill-down (decision #2), writes a public snapshot into the site repo, and (only if
PUBLISH) commits + pushes so Vercel redeploys. Idempotent: skips the commit when the
snapshot is byte-identical to what is already committed.
"""
import json, subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

PUBLISH = False  # decision #1: set True to git push to live (else commit-local-only)
KEEP_CONSTITUENTS = False  # decision #2: True to also publish the HK drill-down

FINMC_CACHE = Path.home() / "Documents/FinMC_2/backend/decade_data/indrs_bridge_cache.json"
SITE_REPO   = Path.home() / ("Library/Mobile Documents/com~apple~CloudDocs/MarcOS/"
                             "TRADING/Trading852-v2")
OUT = SITE_REPO / "src/data/bridge-snapshot.json"

SECTOR_KEYS = ("us_industry","us_rs","us_chg_1m","us_chg_3m",
               "hk_industry","hk_rs","hk_chg_1m","hk_chg_3m",
               "strength","divergence","div_1m","signal")

def main():
    raw = json.loads(FINMC_CACHE.read_text())
    def trim(b):
        d = {k: b[k] for k in SECTOR_KEYS if k in b}
        if KEEP_CONSTITUENTS and "hk_constituents" in b:
            d["hk_constituents"] = b["hk_constituents"]
        return d
    public = {
        "us_benchmark":  raw.get("us_benchmark"),
        "hk_benchmark":  raw.get("hk_benchmark"),
        "total_bridges": raw.get("total_bridges"),
        "signal_counts": raw.get("signal_counts"),
        "generated_at":  raw.get("generated_at"),
        "published_at":  datetime.now(ZoneInfo("Asia/Hong_Kong")).isoformat(timespec="seconds"),
        "bridges":       [trim(b) for b in raw.get("bridges", [])],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    new = json.dumps(public, indent=2, ensure_ascii=False)

    # Skip the whole commit if only published_at would change (avoid daily noise
    # when the underlying bridge is unchanged): compare on everything but published_at.
    if OUT.exists():
        old = json.loads(OUT.read_text())
        old.pop("published_at", None)
        cmp = json.loads(new); cmp.pop("published_at", None)
        if old == cmp:
            print("bridge unchanged, skipping commit"); return

    OUT.write_text(new)
    if PUBLISH:
        g = ["git", "-C", str(SITE_REPO)]
        subprocess.run(g + ["add", str(OUT)], check=True)
        subprocess.run(g + ["commit", "-m",
                        f"data: bridge snapshot {public['published_at'][:10]}"], check=True)
        subprocess.run(g + ["push", "origin", "main"], check=True)
        print("pushed to live")
    else:
        print(f"wrote {OUT} (PUBLISH=False, not pushed)")

if __name__ == "__main__":
    main()
```

**iCloud caveat:** the repo lives in iCloud. git works there but can stall if a file is
mid-sync. If pushes flake, point the automation at a non-iCloud clone of the repo instead
(`git clone` into `~/Documents/`), publish there, and let Vercel deploy from GitHub as usual.

### Part B · hook into the existing daily job

In `~/Documents/FinMC_2/backend/daily_refresh.py`, after `_prewarm_bridge()` runs in
`main()`, add a call to the export. Either:

- shell-level (simplest): append to the wrapper
  `~/Library/Application Support/finmc/run_finmc2_daily_refresh.sh`, after the python runner:
  ```bash
  "$PYTHON" "/Users/mc/Documents/FinMC_2/backend/publish_bridge_to_trading852.py"
  ```
- or in-process: import and call it inside `daily_refresh.py` so it shares the log
  (`backend/logs/daily_refresh.log`). Gate with a `--no-publish` flag mirroring `--no-bridge`.

No new launchd agent. The 10:30 agent already runs; this just extends it.

### Part C · site page + data file (this repo)

Mirror the Scorecard pattern (build-time JSON already proven in [build.js](build.js)):

1. **Data file**: `src/data/bridge-snapshot.json`: written by Part A. `build.js` copies any
   non-HTML file under `src/` verbatim to `dist/`, so this lands at `/data/bridge-snapshot.json`.
   (Commit a placeholder `{}` first so the first build does not 404.)
2. **Page source**: `src/industry-bridge.html`: a `<!-- CONFIG {...} -->` block
   (`layout: "static"` or `"article"`, title, canonical `https://trading852.com/industry-bridge`,
   ogTitle, description) plus a body shell: a header, the `signal_counts` chips, an empty
   `<table id="bridge-table">`, a "data through" line, and `<script src="/assets/industry-bridge.js" defer></script>`.
3. **Renderer**: `assets/industry-bridge.js`: `fetch('/data/bridge-snapshot.json')`, then
   build the rows. Reuse the FinMC color/badge semantics (green positive, red negative; never
   invert) and the fan/RS naming conventions. Show `published_at` + `generated_at` as the
   freshness line so the page never implies real-time (US bar = prior close, HK = same day).
4. **Nav link**: add an entry to `src/_partials/navbar.html`.
5. No `vercel.json` change. `cleanUrls` gives `/industry-bridge`; CSP already permits the
   fetch and the inline/self script.

Alternative to client-fetch: bake the table into the HTML at build time by adding a
`generateBridge…()` function in `build.js` (same shape as `generateScorecardData()`) that
reads `src/data/bridge-snapshot.json` and injects rows. Slightly more work, but zero client
JS and better SEO. Pick client-fetch for speed-to-ship, bake-at-build for polish.

### Part D · turn on the push

Once Parts A–C are verified locally (`node build.js`, open `dist/industry-bridge.html`),
flip `PUBLISH = True` in Part A (decision #1). First production deploy happens on the next
10:30 run, or run the script once by hand to publish immediately.

## Freshness honesty (non-negotiable)

The published page must carry the data dates. US bar is the **previous** US close; HK bar is
**same day**. Surface `published_at` and `generated_at` on the page (same spirit as the
"data through" strip added to the FinMC Industries tab on 2026-06-03). Do not imply live data.

## How to disable / roll back

- Stop publishing: set `PUBLISH = False` in Part A (keeps generating locally), or remove the
  call from Part B. The page stays live with its last snapshot.
- Remove the page: delete `src/industry-bridge.html`, `src/data/bridge-snapshot.json`,
  `assets/industry-bridge.js`, and the navbar link; rebuild.

## Related

- FinMC Bridge UI: `~/Documents/FinMC_2/frontend/components/IndustryRSView.tsx`
  (`US → HK Bridge` tab), backend `monitors.industry_bridge_state()`.
- Site build pattern: [build.js](build.js), [vercel.json](vercel.json),
  [src/_partials](src/_partials), [assets](assets).
- Publishing rules: [instructions](instructions) (blog style guide, "what to never write").
