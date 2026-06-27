---
title: "Trading852 v2, Scorecard"
tags: [trading852, wiki, scorecard]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-27
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

**Benchmark**: 2800.HK (Tracker Fund / HSI) is always pinned to the bottom of the table, grey background (`sc-row-benchmark`). It is not a stock pick, it is the market reference since the April 10 inaugural issue — the HSI is tracked through the Tracker Fund ETF from that date. Do not reorder it. **The trailing-stop ratchet does not apply to the benchmark**: `fetchOne` skips the stop scan entirely when `rec.isBenchmark` is set, so the row never shows a Stopped badge and only displays the raw index return since the Apr-10 entry. **The benchmark is also excluded from the average return and from the winners/losers tally**, it is a reference line only, not a contributor to the headline number.

**Average return**: simple arithmetic mean of every line's `pct`, benchmark excluded. Each pick counts equally. Computed in both `renderStrip` (homepage teaser) and `renderTable` (`/scorecard`) by filtering on `!r.isBenchmark` before summing.

**What counts as a position (automatic)**: any `publish/analyses/*.html` whose hero has both a `meta-ticker` matching `NNNN.HK` and a `meta-verdict`. The SPY/HSI market-thesis pages and the sector hubs have no stock ticker, so they are excluded automatically. ticker / eyebrow (sector + ` · Monitor` when the verdict is MONITOR) / slug are read from the article; entry date defaults to `pubDate`.

**Overrides**: curated short names and the Apr-10 inaugural issue dates live in the `SCORECARD_OVERRIDES` map in `build.js`. A single article can also override via CONFIG: `scorecardName` (display name) and `scorecardEntryDate` (`YYYY-MM-DD`, when the issue/entry date differs from `pubDate`). The 2800.HK Tracker Fund benchmark is a fixed entry (`SCORECARD_BENCHMARK` in `build.js`), not derived from an article.

**Article and scorecard entry are inseparable, by construction**: positions are derived from the articles themselves, so a scorecard row cannot exist without its published article.

**To add a pick**: just publish the stock article with the standard hero (`meta-ticker` + `meta-verdict`). The next `node build.js` registers it automatically (Vercel runs `build.js` on deploy, so commit and push is enough). Set `scorecardName` in CONFIG only if you want a shorter display name than the schema `about.name`.

---


---
[Wiki index](index.md)
