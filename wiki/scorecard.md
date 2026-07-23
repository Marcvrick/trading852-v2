---
title: "Trading852 v2, Scorecard"
tags: [trading852, wiki, scorecard]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-07-23
---

# Trading852 v2, Scorecard

Part of the [Trading852 wiki](index.md).

## Scorecard: live performance tracker

Public accountability page at [trading852.com/scorecard](https://trading852.com/scorecard). 100% client-side, zero backend.

**Data flow**:
1. **Positions are auto-generated at build time.** `build.js` (`generateScorecardData()`) scans `publish/analyses/` and registers every article whose hero carries an HK ticker (`NNNN.HK`) **and** a verdict, then writes `dist/assets/scorecard-recos.json` (ticker, company, eyebrow, slug, `issueDate`). There is **no hand-maintained list**: publishing a stock article registers it automatically.
2. On page load, [assets/scorecard.js](../assets/scorecard.js) fetches that JSON, then each ticker hits the [yahoo-proxy Cloudflare worker](https://yahoo-proxy.marccharnal.workers.dev/) for 3-mo daily OHLC.
3. Script computes entry = first close strictly after the entry date, scans intraday lows for the stop, renders the table.
4. Same `scorecard.js` powers the homepage strip teaser (`<div id="scorecard-strip">`).

**Entry price rule**: weekday pub → first close strictly after `pubDate` (uses `ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → opening price of the next trading day (Monday open). The "open" label appears in the Entry column for weekend publications.

**Last price**: `meta.regularMarketPrice` from the Yahoo Finance response is used as the primary source (always current, no OHLC lag). Falls back to the close array scan only if the meta field is absent or pre-entry. This prevents thinly traded HK stocks (e.g. 0113.HK) from showing a stale entry-day close in the Last column.

> **Source the price tile and any OHLC-derived counter from the same session.** Yahoo's daily array carries the latest session as a trailing slot whose `close` is still `null` while `meta.regularMarketPrice` already holds it, so `meta` leads the array by one bar. A tile that reads `meta` and a counter that walks the close array will silently disagree by a session. Either read everything from `meta`, or backfill the array's latest slot from `meta` (and `meta.regularMarketVolume`) before deriving anything. This was the SPY 747 "days since the cycle high" bug (Jun 19, 2026): price tile showed the new day, counter stayed a day behind.

**Stop-loss rule (trailing, one-way ratchet, all picks)**: the stop tightens as the position appreciates and never loosens.

| Peak gain since entry | Stop level | Locked return if hit |
|---|---|---|
| < +5 % | entry × 0.90 | −10 % |
| ≥ +5 % | entry × 0.95 | −5 % |
| ≥ +10 % | entry × 1.00 (breakeven) | 0 % |

A stop fires when the intraday low ≤ the active stop level for that bar. Once a tighter tier activates, the stop never reverts even if the peak recedes. Stopped rows are highlighted in light red (`sc-row-stopped`, `#fdf3f3`) with a "Stopped" badge next to the ticker, exit date under the Last column, and the locked return in the % cell with a small uppercase "Stopped" label underneath. The locked return still feeds the average.

**Post-stop live price**: once a position is stopped, the % column stays frozen at the locked tier (no re-entry, no recovery if the stock bounces back above entry). The live last close keeps refreshing and is shown as a small `now: XX.XX` line under the entry price, right-aligned in the Entry column. It is colored **green when the live price is at/above the stop level and red when below it** (`.sc-now-pos` / `.sc-now-neg`), so a glance shows whether the stop was vindicated. It is informational only: it never feeds `pct` or the average. Wired in `fetchOne` (preserves `currentPrice` separately from `last`) and rendered in `renderTable` via `.sc-now`.

**Benchmark**: 2800.HK (Tracker Fund / HSI) is always pinned to the bottom of the table, grey background (`sc-row-benchmark`). It is not a stock pick, it is the market reference since the April 10 inaugural issue (the HSI is tracked through the Tracker Fund ETF from that date). Do not reorder it. **The trailing-stop ratchet does not apply to the benchmark**: `fetchOne` skips the stop scan entirely when `rec.isBenchmark` is set, so the row never shows a Stopped badge and only displays the raw index return since the Apr-10 entry. **The benchmark is also excluded from the average return and from the winners/losers tally**, it is a reference line only, not a contributor to the headline number.

**Average return**: simple arithmetic mean of every line's `pct`, benchmark excluded. Each pick counts equally. Computed in both `renderStrip` (homepage teaser) and `renderTable` (`/scorecard`) by filtering on `!r.isBenchmark` before summing.

**What counts as a position (automatic)**: any `publish/analyses/*.html` whose hero has both a `meta-ticker` matching `NNNN.HK` and a `meta-verdict`. The SPY/HSI market-thesis pages and the sector hubs have no stock ticker, so they are excluded automatically. ticker / eyebrow (sector + ` · Monitor` when the verdict is MONITOR) / slug are read from the article; entry date defaults to `pubDate`.

**Overrides**: curated short names and the Apr-10 inaugural issue dates live in the `SCORECARD_OVERRIDES` map in `build.js`. A single article can also override via CONFIG: `scorecardName` (display name) and `scorecardEntryDate` (`YYYY-MM-DD`, when the issue/entry date differs from `pubDate`). The 2800.HK Tracker Fund benchmark is a fixed entry (`SCORECARD_BENCHMARK` in `build.js`), not derived from an article.

> **Weekend publish with a Monday byline → `scorecardEntryDate` is mandatory, not optional.** `pubDate` doubles as both the displayed byline date and the input to `scorecard.js`'s `isWeekendPub` check (`getUTCDay()` on `pubDate`). If an article is committed on a Saturday/Sunday but given the following Monday as its editorial `pubDate`, the weekend branch never fires — the code sees a weekday and falls into the same-day-close case (Monday's own bar is timestamped after `pubDate`'s UTC midnight, so it wrongly qualifies as "first close strictly after"), showing Monday's *close* as entry instead of Monday's *open*. Always set `scorecardEntryDate` to the true weekend calendar date in that case. Caught and fixed for 0027-galaxy (entry 31.00 → 31.60) on Jul 14, 2026 — see [log.md](log.md#jul-14-2026-galaxy-0027hk-scorecard-entry-date-bug-fixed).

**Article and scorecard entry are inseparable, by construction**: positions are derived from the articles themselves, so a scorecard row cannot exist without its published article.

**To add a pick**: just publish the stock article with the standard hero (`meta-ticker` + `meta-verdict`). The next `node build.js` registers it automatically (Vercel runs `build.js` on deploy, so commit and push is enough). Set `scorecardName` in CONFIG only if you want a shorter display name than the schema `about.name`.

## Partial exits — the "Reduced" state

When a pick reaches a published target and part of the position is trimmed, the row enters a **Reduced** state: the banked gain is frozen into the row's `%` so a round-trip cannot give it back, protecting the portfolio's lead over the HSI benchmark in a drawdown. This is the one hand-maintained layer on the scorecard — positions themselves stay auto-generated from articles, but a discretionary trim is a real event the article cannot derive.

**Data source**: `scorecard-exits.json` at the repo root, keyed by ticker, one `exits[]` entry per trim:

```json
{ "0300.HK": { "exits": [ { "fraction": 0.667, "fillPrice": 94.30, "fillDate": "2026-07-20", "label": "Target 1 (Base 95)" } ] } }
```

`build.js` reads it once at module load (missing or invalid file = no Reduced state on any pick) and attaches `reduced` to the matching pick in `scorecard-recos.json`. The benchmark and untouched picks are unchanged.

**Blended `%`** (`scorecard.js`, replacing the single-line pct):

- Realized leg: `Σ fractionᵢ × (fillPriceᵢ − entry) / entry`, frozen at the trim fill.
- Live leg: `(1 − Σfraction) × livePct`, where `livePct` is the normal entry→last return, or `lockedPct` if the remainder has been stopped.
- Row `pct = realizedPctSum + remFrac × remPct`.

Worked example (0300.HK, entry 89.70, 2/3 trimmed @94.30): realized leg = 0.667 × +5.13% = **+3.42% banked**. If the live third round-trips to entry (livePct 0%), the row holds at +3.42%. The gain is locked.

**Ratchet interaction**: the trailing-stop scan still runs on the full price history. A Reduced pick can also be Stopped (the remainder got stopped out); then the live leg takes `lockedPct` while the realized leg stays frozen at the fill. Both badges render on the ticker.

**Average**: the portfolio mean (`!isBenchmark`) reads each row's blended `pct`, so banked gains hold the average — and the "Portfolio vs HSI" alpha — through a drawdown. Reduced picks count as winners/losers by their blended `pct`.

**v1 simplification**: the realized leg is capital return only. Dividends that went ex-div on the sold shares before the trim are not credited to the realized leg (the live leg keeps its ex-div adjustment). Immaterial for short-hold trims; revisit if a Reduced pick carries a large interim dividend.

**Rendering**: a `Reduced NN% @price · date` badge on the ticker and a `%`-cell sub-line (`NN% banked · MM% live`) always render. The muted-green row tint (`sc-row-reduced`) is reserved for a **fully closed** position (`fracPct >= 100`, i.e. every exit fraction summed to 100%): a partial trim (like 0300.HK Midea at 67%) is still an open position and stays plain white like any other active pick, badge and sub-line only. CSS in `publish/styles/scorecard.css`.

## Permanent stop ledger

The live trailing-stop scan in `scorecard.js` (`fetchOne`) fetches only a **rolling window** from Yahoo (`range=1y`, was `range=3mo` until Jul 23, 2026). Once a pick's entry date rolls outside that window, the entry-finding loop can no longer see the true entry bar and silently substitutes whatever bar is now first in the window as a fake "entry" — which erases the peak-price history needed to arm the tighter stop tiers, and can invent a wrong stop date, level, or locked %, or erase a real stop entirely.

**Caught 2026-07-23**: 1913.HK Prada's real Apr 30 stop (locked −10%) had silently vanished this way (the site showed it "recovered" to +10.92%, never stopped), and 1167.HK Jacobio / 1585.HK Yadea / 9988.HK Alibaba were showing wrong stop dates and, for Jacobio, a wrong locked % (−10% shown vs the true breakeven 0%). Root cause: all four share an April 10 entry date; by mid-July the 3-month window had rolled past it. 6690.HK Haier and 1698.HK Tencent Music were still correct at the time (their entry dates were still inside the window) and were used to cross-validate the true computation method.

**Fix, two parts:**
1. **`scorecard-stops.json`** (repo root): a hand-maintained permanent ledger, keyed by ticker, computed once from the full from-inception price history: `{ "1913.HK": { "stopDate": "2026-04-30", "stopLevel": 35.028, "lockedPct": -10 }, ... }`. `build.js` loads it and attaches `forcedStop` to the matching pick (same pattern as `scorecard-exits.json` → `reduced`). In `scorecard.js`, `fetchOne` checks `rec.forcedStop` first: if present, it skips the live stop-scan entirely and uses the frozen `stopDate` / `stopLevel` / `lockedPct` directly. A live price is still fetched and shown as the informational `now: XX.XX` line, but `pct` and the Stopped state can never again depend on the rolling window.
2. **Fetch range widened** `3mo` → `1y`, buying headroom before any *currently active* (not yet stopped) pick's own entry date rolls out of view and its % return or peak-tracking silently corrupts the same way. Not a permanent fix by itself (a pick older than a year would hit the same wall) — the permanent ledger in (1) is the structural fix; the wider range just delays when a *new*, not-yet-recorded stop could be missed.

**When a new pick's trailing stop fires**: add it to `scorecard-stops.json` once confirmed (do not rely on the live scan to keep remembering it indefinitely). Compute `stopDate`/`stopLevel`/`lockedPct` from the full price history from the pick's true entry date (weekday pub: first close strictly after the entry-cutoff calendar day; in practice, per the Jul 23 investigation, the live algorithm's entry-finding loop treats the entry/issue date's own trading session as eligible whenever its intraday timestamp is later than midnight UTC of that date — verify against a still-in-window pick before trusting a computed value).

---


---
[Wiki index](index.md)
