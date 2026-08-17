---
title: "Trading852 v2, Scorecard"
tags: [trading852, wiki, scorecard]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-08-17
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

## Article ticker → scorecard row (deep link)

The `meta-ticker` pill in an article hero links to that ticker's row: `/scorecard#t-1913-hk`. Nothing to add per article — `build.js` rewrites the `<span class="meta-ticker">` into an `<a>` at build time, and only for a ticker the scorecard actually carries a row for, so an article without a verdict never gets a link that lands on nothing.

**Anchor rule**: `t-` + lowercase ticker with dots as hyphens. It exists twice on purpose — `tickerAnchor()` in `build.js` writes the href, `tickerAnchor()` in `scorecard.js` writes the `<tr id>`. They are independent, so `scripts/test-ticker-links.py` asserts every hero link resolves to a real row rather than trusting them to stay in step.

**Why the jump needs JavaScript**: the table is rendered after an async fetch, so the browser's own scroll-to-hash has already run and found nothing by the time the row exists. `focusHashRow()` redoes it after `renderTable`, adds `sc-row-target`, and scrolls the row to centre. It is also bound to `hashchange`, because following a second anchor from the scorecard itself (or the back button) changes only the hash and would never re-run the script.

**Highlight**: `sc-row-target` paints via `background-image`, not `background-color`, so it layers over the stopped / reduced / benchmark tints instead of replacing them, plus a blue inset bar on the first cell.

**Body prose too, at every mention** (`linkifyBodyTickers` in `build.js`): each occurrence of a tracked ticker in an article's running text links to the same row. Articles carry 2–7 mentions each, so a reader who scrolls to any section finds the link where they are. The pass steps over tags, HTML comments (the CONFIG and JSON-LD blocks), `<script>` / `<style>` / `<title>`, headings, and any existing `<a>…</a>`, which is what stops it nesting an anchor inside the hero pill `linkifyHeroTicker` just created. Order matters: hero first, prose second.

> **The hero standfirst (`.article-subtitle`) is excluded on purpose.** It sits on the dark hero, where a `color: inherit` link renders at 55% white and is effectively invisible, and the linked pill sits directly above it. This is exactly how the first version failed on 2026-07-31: it linked only the *first* mention per ticker, that mention was the standfirst, and every visible body section had no link. Verified live, the only anchor on 9973-chery was `rgba(255,255,255,0.55)` in the hero.

A ticker with no scorecard row is left as plain text, so an article can name a peer freely — 9973-chery mentions 0175.HK and 1211.HK, neither tracked, both unlinked. Cross-references between tracked names do link: 0700-tencent carries one to 9988.HK. Current state: 31 body links across the 12 stock articles.

`scripts/test-ticker-links.py` asserts every hero and body link resolves to a real row, that **no tracked ticker is left unlinked in any body** (the exact failure above), that the standfirst carries none, that no link lands in a script or comment, that no anchors nest, and that every JSON-LD block still parses after the rewrite.

## Portfolio vs HSI chart

A line chart above the table, from the April 10 issue to today: the portfolio in solid green against 2800.HK dashed grey, both as % return. Built in `renderChart` / `buildPortfolioSeries` (`scorecard.js`), drawn with the Chart.js 4.4.1 already vendored at `publish/static/chart.umd.js` for the SPY 747 article. No new dependency, no build step: the series is computed client-side from the OHLC each pick already fetches.

**What the line means.** At each session, the portfolio value is the simple arithmetic mean of the return of every pick that has entered by that date — the exact rule behind the headline average, evaluated on every bar instead of only the last one. `fetchOne` now returns a `series` array alongside the scalars, applying the same blend per bar: the stop locks the live leg from its own bar onward, and each exit freezes its fraction from its fill date. **The right edge therefore equals the summary's average by construction**, and `scripts/test-chart-parity.py` asserts it.

> **It is an average of open positions, not an equity curve.** A pick joins the mean at 0 % on its entry date, so publishing a new article pulls the green line toward zero that day. This is the same property the headline average has always had; the chart just makes it visible. The tooltip shows `N picks live` at every point so the dilution is readable rather than hidden. Do not present this line as the return on a fixed pot of money.

### The buy-back line (third series) — WITHHELD, not on the public page

> **Status 2026-07-31: computed but not displayed.** `reSeries` is still built in `fetchOne`, so `scripts/check-buyback-model.py` and any local work keep running, but the chart dataset, its key entry and the methodology paragraph are removed. Restore all three together. Pulled at Dany's instruction after the modelled result kept moving under him: −0.13 % → −0.31 % → −1.26 % across three corrections in one afternoon. **Do not put it back before the open question below is answered.**

Answers one question Dany asked on 2026-07-31: a position gets stopped out, the price later climbs back to where it was first bought, you buy it back and ride it — what would that have done to the portfolio?

**Model** (`fetchOne`, `reSeries`): each leg is the published rule unchanged — the same 3-tier trailing ratchet, re-anchored at what the buy-back actually cost. Legs compound, and it repeats without limit (Prada: three buy-backs). The first leg honours `scorecard-stops.json` so the line starts from the same history the table shows; later legs scan live. A pick closed by a decision to sell rather than by a stop (0300.HK Midea) carries its actual result on both lines, as does the benchmark.

**Trigger** — confirmed by Dany, not chosen: re-entry fires *the next time the price reaches the original entry*, on the intraday high, i.e. a buy-stop at that level. *"On devrait re-rentrer en position la prochaine fois que le prix monte à 12.58."* A close-confirmation variant was computed and rejected.

**Fill** — at the entry whenever the session trades there (its low comes back through the level), otherwise at the open. Only a session that gaps and never returns pays the open: 9988.HK opened 128.20 on May 22 with a 126.00 low against a 125.50 entry, so 125.50 was never available. 1585.HK on Jun 8 opened 12.69 but its low was 11.38, so it does fill at 12.58.

**Dividends** accrue to a leg only while that leg holds the shares, and the re-entry test compares raw prices — a position that is not held receives nothing.

#### The open question that stopped the work

**After a stock goes ex-dividend while the model is out of the market, does the buy-back level stay at the original entry, or drop by the dividend?**

The rule above is applied only on one side, and that asymmetry is probably wrong. 1913.HK is the case. HKD 1.5025 went ex on May 6, between the Apr 30 stop and the May 7 buy-back. Not crediting it is right — the shares were not held. But after the ex-date the price is permanently ~1.50 lower, so requiring it to climb back to **38.92** demands a *larger* recovery than the one originally bought. The level arguably should fall to ~**37.42**.

It is not academic. With the level at 38.92 the second leg was set up to fail, and it did: stopped May 18 at −10 % on a 34.90 low against a 35.03 stop. That single stop is the whole disagreement with Dany, who reads Prada's current +11.15 % over entry and expects the buy-back chain to be positive. It is −9.97 % because it realised −10 % twice, on Apr 30 and again on May 18, before the leg now open.

| | Prada chain as modelled |
|---|---|
| Apr 30 | stop −10 % → banked 0.90 |
| May 07 | buy back @38.92 |
| May 18 | stop −10 % (low 34.90 vs stop 35.03) → banked 0.81 |
| Jun 03 | buy back @38.92 |
| Jun 22 | stop 0 % (breakeven tier armed) → banked 0.81 |
| Jun 29 | buy back @38.92, still held; open leg +11.15 % |
| **Total** | **0.81 × 1.1115 − 1 = −9.97 %** |

**Last computed figures, on the withheld model** — recorded so the next attempt has a baseline, not as a published claim. Actual +1.15 % against −1.26 %, a gap of 2.41 pp:

| Ticker | Actual | With buy-backs | Buy-backs | Note |
|---|---|---|---|---|
| 1585.HK Yadea | −5 % | **−23.05 %** | 2 | buy May 12 @12.58 → stop May 28; buy Jun 8 @12.58 → stop Jun 9 |
| 9988.HK Alibaba | 0 % | **−10.00 %** | 1 | buy May 22 @128.20 (gap, never returned) → stop Jun 10 |
| 1167.HK Jacobio | 0 % | **−10.00 %** | 1 | buy Apr 27 @7.22 → stop May 5 |
| 1913.HK Prada | −10 % | −9.97 % | 3 | see the chain above; hinges on the open question |
| 6690.HK Haier | −5 % | −1.75 % | 2 | leg open |
| 1698.HK Tencent Music | −5 % | −2.73 % | 2 | leg open |
| 0700.HK Tencent | −5 % | −1.35 % | 1 | leg open |

Four of the seven buy-back legs are still open, so any verdict leans on live marks. Only the three closed cases are settled, and all three are worse.

#### Two things already checked, do not re-litigate

> **"Those names never came back to their entry" — they did.** Verified 2026-07-31 on raw bars, with no dividend adjustment involved in any of the three: 1167.HK opened **7.51** on Apr 27 against a 7.22 entry; 9988.HK traded above 125.50 in **six** sessions, reaching 131.20 and closing 130.90 on Jun 2; 1585.HK printed a 12.58 high on May 12 and opened 12.69 on Jun 8. All three sit far below entry *today* (4.67, 117.00, 10.73), which is what makes them look like they never recovered. Each recovered to the entry, was bought back, and fell away again — precisely what the rule is exposed to.

> **1585.HK cross-verified against three independent feeds**, because it drives the worst single result: Yahoo, FinMC_3 `cache_unadjusted` and eastmoney all give May 12 high 12.58 and Jun 8 open 12.69 / high 12.70. On `cache_adjusted` (TV-exact) the entry is 11.930 and May 12's high is 11.930 — the same touch.

**Cross-check**: `scripts/check-buyback-model.py` replicates the model from Yahoo independently of the JS and must print the same portfolio figure. Its "never stopped" picks reproduce the live table exactly, which validates the entry-finding. It marks the open leg from `meta.regularMarketPrice`, as the page does — walking the close array instead prices a different session, since Yahoo's daily array trails `meta` by one bar, and the two then disagree for no real reason.

**Calendar**: the benchmark's own bars are the x-axis (2800.HK trades every HK session from the Apr-10 entry). Each pick holds a pointer into its own series and contributes its last value at or before the current session, so a pick that misses a bar carries forward instead of dropping out of the mean.

**Palette**: the scorecard page body is white (`html, body` in `scorecard.css`), unlike the dark article background the SPY chart sits on. The chart uses the on-light pair the table already uses — `#0f9d66` positive, `#c93338` negative, `#5b6478` for the benchmark — not the `--pos` / `--neg` variables, which are tuned for the dark hero. The `#scorecard-chart-key` swatches double as the legend, so the chart itself renders none.

`renderChart` no-ops when `#scorecard-chart` or `Chart` is absent, so the same `scorecard.js` keeps driving the homepage strip untouched.

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

**Ratchet interaction**: the trailing-stop scan still runs on the full price history for a *partially* trimmed pick. It can also be Stopped (the remainder got stopped out); then the live leg takes `lockedPct` while the realized leg stays frozen at the fill. Both badges render on the ticker.

> **A fully exited pick is exempt from the stop scan** (`exitedPct < 100` in `fetchOne`, the same skip the benchmark gets). With no shares left, `remFrac` is 0, so a late stop could not move `pct` — but the live scan would still label the row `Stopped · stop hit <date>` on a position that was closed by sale, and the badge would simply be false. Added Jul 31, 2026 when 0300.HK Midea became the first fully closed pick: its peak of 99.75 had armed the breakeven tier at the 89.70 entry, so any drop back through 89.70 would have stamped a phantom stop on a trade already sold at 99.10. Regression check: `python3 scripts/test-stop-guard.py http://localhost:3000`.

**Known display gap on a closed pick**: the Last column keeps showing the live price (a closed Midea would read `Last 60.00` beside `+6.91%`), and with more than one exit the badge drops the fill and date — `reducedInfo()` only fills those when `exits.length === 1`, so it reads a bare `Reduced 100%`. The numbers are right; the row just does not show what it was sold at.

**Average**: the portfolio mean (`!isBenchmark`) reads each row's blended `pct`, so banked gains hold the average — and the "Portfolio vs HSI" alpha — through a drawdown. Reduced picks count as winners/losers by their blended `pct`.

**v1 simplification**: the realized leg is capital return only. Dividends that went ex-div on the sold shares before the trim are not credited to the realized leg (the live leg keeps its ex-div adjustment). Immaterial for short-hold trims; revisit if a Reduced pick carries a large interim dividend.

**Rendering**: a `Reduced NN% @price · date` badge on the ticker and a `%`-cell sub-line (`NN% banked · MM% live`) always render. The muted-green row tint (`sc-row-reduced`) is reserved for a **fully closed** position (`fracPct >= 100`, i.e. every exit fraction summed to 100%): a partial trim (like 0300.HK Midea at 67%) is still an open position and stays plain white like any other active pick, badge and sub-line only. CSS in `publish/styles/scorecard.css`.

## Re-entry rows

A position taken **again** in a ticker that already has a row is a separate trade with its own entry, its own stop and its own result. The auto-generation cannot express it: picks are derived from articles and keyed by ticker, so one article produces exactly one row. Re-entries are the second hand-maintained layer, next to `scorecard-exits.json`.

**Data source**: `scorecard-reentries.json` at the repo root, one object per re-entry:

```json
{ "reentries": [ { "t": "9988.HK", "anchor": "t-9988-hk-2", "reentry": true, "company": "Alibaba", "eyebrow": "Technology · Re-entry", "slug": "9988-alibaba", "issueDate": "2026-08-17", "entryPrice": 123.00 } ] }
```

`build.js` reads it once at module load (missing or invalid file = no re-entry rows) and appends each entry to `picks` as a full pick, so it sorts into the table by `issueDate` like any other and counts once in the average, in the winners/losers tally and in the portfolio curve.

**The original row is not touched.** It keeps its `forcedStop` and stays frozen at its locked %. A re-entry deliberately carries **no** `forcedStop` and **no** `reduced`: `scorecard.js` scans its trailing stop live from its own entry bar, which is correct while that entry is recent and well inside the `range=1y` fetch window. Record it in `scorecard-stops.json` only once its stop actually fires — and note that ledger is keyed by ticker, so freezing a re-entry's stop requires re-keying the ledger on the anchor first.

**Entry price is stated, not derived.** An article pick has no fill to record, so its entry is inferred from the publication date (first close strictly after `issueDate`). A re-entry is a real trade at a real price, so `entryPrice` holds what it actually cost and `fetchOne` measures the row against that. The bar found by the normal entry loop still supplies `entryIdx` and `entryDate` — the stop scan, the dividend cut-off and the chart series all start from that session — only the price is replaced. Omit `entryPrice` to fall back to the derived rule.

**The row states its own entry date** (`entered Aug 17`, under the entry price). Article picks are dated by their byline; a re-entry has no article of its own, so without the line nothing on the page says when the position was taken. Driven by the `reentry` flag, so no other row's display changes.

> **`anchor` is mandatory and must be unique.** Both rows carry the same ticker, so `tickerAnchor()` would give them the same `<tr id>`, and the deep link plus `focusHashRow` would silently land on whichever rendered first. `generateScorecardData()` throws on a duplicate anchor rather than shipping the collision; `scorecard.js` renders `rowAnchor(r) = r.anchor || tickerAnchor(r.t)`.

**Where the article link lands**: `linkifyHeroTicker` and `linkifyBodyTickers` derive the anchor from the ticker alone, so every link in the article still resolves to the **original** row, not the re-entry. That is the position the article opened. A reader following the pill lands on the stopped row, with the re-entry visible higher in the same table.

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
