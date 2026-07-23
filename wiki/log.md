---
title: "Trading852 v2, Changelog"
tags: [trading852, wiki, log, changelog]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-07-23
---

# Trading852 v2, Changelog

Part of the [Trading852 wiki](index.md).

## Changelog

### July 23, 2026 · Scorecard: Prada silently un-stopped — rolling-window bug, 4 positions had wrong stop data

Dany noticed 1913.HK Prada had flipped from Stopped back to an active +10.92% position with no manual action on his side. Investigation traced it to `scorecard.js`'s live trailing-stop scan, which fetched only a rolling `range=3mo` window from Yahoo. All of the April 10 inaugural-issue picks (0113 Dickson, 1913 Prada, 1167 Jacobio, 1585 Yadea, 9988 Alibaba) share that entry date; by mid-July the 3-month window had rolled past it, so the entry-finding loop silently substituted a much later bar as a fake "entry" once the true one aged out. That erases the peak-price history needed to arm the tighter stop tiers, and can invent a wrong stop date/level or erase a real stop entirely.

**Verified against full from-inception price history (Yahoo `range=1y`, cross-checked via 6690 Haier and 1698 Tencent Music, whose entry dates were still inside the 3-month window and so were provably still correct):**

| Ticker | Was showing (corrupted) | True value |
|---|---|---|
| 1913.HK Prada | not stopped, +10.92% | **STOPPED Apr 30 at −10%** |
| 1167.HK Jacobio | stopped May 5, −10% | **STOPPED Apr 24 at 0% (breakeven)** — it had first spiked to +14.68% peak, arming the breakeven tier, before round-tripping back to entry |
| 1585.HK Yadea | stopped Jun 8, −5% | **STOPPED Apr 23**, −5% |
| 9988.HK Alibaba | stopped May 18, 0% | **STOPPED May 21**, 0% |

Jacobio's public locked return had been overstated as a −10% loss when the true result was breakeven.

**Fix, two parts:**
1. **`scorecard-stops.json`** (new, repo root): permanent stop ledger, keyed by ticker, `{ stopDate, stopLevel, lockedPct }`, computed once from full history and frozen. `build.js` attaches it as `forcedStop`; `scorecard.js` skips the live scan entirely for a ticker carrying `forcedStop` and uses the recorded values, so a price recovery (or the window rolling further) can never again erase or corrupt a real stop. All 6 currently-stopped tickers (the 4 above plus Haier and Tencent Music) are now locked in.
2. **Fetch range widened `3mo` → `1y`** in `scorecard.js`, buying headroom before a *currently active* pick's own entry date rolls out of view and its % return silently corrupts the same way. Not a permanent fix alone (a pick older than a year hits the same wall) — the permanent ledger is the structural fix.

Wiki: [scorecard.md](scorecard.md) new "Permanent stop ledger" section.

### July 21, 2026 · Scorecard hero — article count dropped

Removed the "Eleven articles." count from the scorecard hero title, plus the now-dead JS that populated it (the `WORDS` array + `sc-article-count` updater in `scorecard.js`). The hero now reads: "The Hang Seng as benchmark. Entry at first close after publication. Live performance." No orphan code.

### July 20, 2026 · Scorecard "Reduced" state — partial exits lock banked gains

New per-pick state for the public scorecard: when a published pick is trimmed at a target, the realized portion is frozen into the row's `%` so a round-trip cannot give it back. Protects the portfolio's lead over the 2800.HK benchmark in a drawdown.

- First record: **0300.HK (Midea)**, 2/3 trimmed @94.30 on Jul 20 at the published Base target floor (HKD 95–100).
- Data: `scorecard-exits.json` at the repo root, keyed by ticker, hand-maintained (one `exits[]` entry per trim). Read by `build.js`, attached as `reduced` on the pick. Positions themselves stay auto-generated.
- Blend (`scorecard.js`): realized leg frozen at fill + live leg at current price (or `lockedPct` if the remainder stopped). For 0300: **+3.42% banked** regardless of what the live third does.
- Render: green `sc-row-reduced` tint, `Reduced NN% @price · date` badge, `NN% banked · MM% live` sub-line. Mirrors the Stopped state.
- Wiki: [scorecard.md](scorecard.md) → "Partial exits (Reduced state)".

### July 15, 2026 · DRAFT/ emptied, six stale drafts dropped

Dany deleted the six `DRAFT/` files: the work had gone stale and the tickers left coverage (0123 Yuexiu, 0816 Jinmao, 2050 Sanhua, Man Yue capacitors, a China consumer bifurcation piece, and a second 0086 Sun Hung Kai). Deliberate, not to be restored; all seven paths including `DRAFT/images/` remain in git history.

**The workflow is unchanged.** `DRAFT/` is a location, not a store: recreate it on the next draft. The three folders stay three distinct states, and [style-guide.md](style-guide.md) step 1 is absolute on this: `DRAFT/` (written, not yet reviewed) then `publish/drafts/` (reviewed, awaiting a price trigger) then `publish/analyses/` (published). They are never interchangeable, and `publish/drafts/` in particular is not a review area.

**Knock-on effects:**

- The `#18` numbering collision resolved itself. `DRAFT/#18-0086-sun-hung-kai.html` is gone, so Tencent keeps `#18` and no renumbering is needed. Next published article takes `#19`.
- The knowledge layer needed no content change, since drafts were never admitted. Its scope table was updated: Yuexiu no longer holds a pending draft, Sun Hung Kai still does in `publish/drafts/`.
- `publish/drafts/` is untouched: 0086 (HKD 4.28 anchor) and 6160 BeOne (HKD ~132) still stand.

**Two findings from the audit that prompted this:**

- **`build.js` never read `DRAFT/`.** Its only source is `const SRC = path.join(ROOT, 'publish')`. `DRAFT/` files were source fragments with no DOCTYPE and no stylesheet, so they never rendered for review, which was the folder's whole purpose. Worth fixing if review-by-reading matters more than the folder split.
- **`DRAFT/1913-prada-SEO-OPTIMIZED.html`**, the SEO diff target in the pre-publish checklist, never existed on disk or in git history. The checklist now points at [publish/analyses/1913-prada.html](../publish/analyses/1913-prada.html).

### July 15, 2026 · Knowledge layer created + 11 cross-article contradictions found

**New sub-hub** [wiki/knowledge/](knowledge/index.md), seven pages. The claims and valuation numbers of all 18 published articles, held as entries rather than prose. Built because nothing in the repo stored them: [articles.md](articles.md) holds titles, [log.md](log.md) narrates changes, the scorecard holds identity plus entry date, and every number otherwise existed exactly once, inside one HTML file, invisible to the next article.

Pages: [index](knowledge/index.md) (the rules), [frames](knowledge/frames.md) (about 40 reusable analytical patterns), [macro-hsi](knowledge/macro-hsi.md), [financials-rates](knowledge/financials-rates.md), [gold](knowledge/gold.md), [peer-multiples](knowledge/peer-multiples.md) (every published peer set), [levels](knowledge/levels.md), [open-questions](knowledge/open-questions.md).

**The hard rule, and the reason the layer is shaped this way:** it is a consistency check, never a price source. [style-guide.md](style-guide.md) test 4 forbids reusing a price found in any prior document (the 0992 Lenovo incident), and a store of prior numbers is exactly that artifact. Sequence is fixed: fetch live, write the article, then check the layer for contradictions. Every entry is bucketed DURABLE (mechanisms, completed history, ownership facts, closed events) or PERISHABLE (anything carrying an `as_of`).

**First full cross-read of the corpus found 11 live contradictions**, all still on the site. The four that block reuse today:

- **The Hang Seng's own multiple**: 14x (Jun 21) against 8-9x (Jun 24), three days apart, and the second article uses 8-9x as both a discount and a multiple within itself.
- **The 35-year trendline touch count**: the title says six, the schema says five, the body says five and enumerates four, and a risk callout says the line never broke. It is in the title, the schema and the homepage card.
- **Dickson's HKD 7.20 offer**: argued as an empirically demonstrated floor in April, and as a ceiling at roughly cash value in the June update. Both readings live in the same file, unstruck. June supersedes.
- **Midea's EV/EBIT**: 12x in the Haier piece, about 11x in the Midea piece, both labelled April 2026. The Haier bull target (HKD 36.80) depends on which is right.

Also: Alibaba's net cash "rose" from US$40B to US$36B; Hermes at 30x and 40x on one page; gold's drawdown at 23% five times and 26% once; "SPY 1.3% from $747" meaning both above and below on the same page.

**Wired in.** [CLAUDE.md](../CLAUDE.md) read-before-writing item 4; [editorial.md](editorial.md) pre-publish checklist gets a check gate (after the live fetch) and a same-commit write-back gate, on the homepage-card pattern; [wiki/index.md](index.md) and [README](../README.md) navigation. CLAUDE.md's second checklist now defers to editorial.md, which is authoritative: the two had diverged.

**Catalog fixed.** [articles.md](articles.md) was missing two published articles, [0027-galaxy](../publish/analyses/0027-galaxy.html) (Jul 13) and [0700-tencent](../publish/analyses/0700-tencent.html) (Jul 14), now `#17` and `#18`. This collides with `DRAFT/#18-0086-sun-hung-kai.html`: published articles hold the stable IDs, so the draft block needs renumbering to `#19` onward. Not done, it renames six files.

### June 29, 2026 · 361 Degrees (1361.HK) + publishing rules hardened

**New article** [1361-361degrees.html](../publish/analyses/1361-361degrees.html) (`Consumer Discretionary`): CONVICTION. Five years of +17% revenue CAGR, 41.5% gross margins unchanged three years running, RMB 3.78B net cash (42% of market cap). EV/EBIT at 2.26× vs ANTA at 20×. Share placement compressed the multiple; earnings line did not move. Nav chain: ← Midea (0300, Jun 2) · no Next yet.

**Rules confirmed and hardened this session:**

- **v1 repo (`Marcvrick/trading852.com`) is archived and retired.** Never commit to it. Always use `Trading852-v2` / `Marcvrick/trading852-v2`. The v1 push attempt (403 error) confirmed this — v1 is read-only.
- **contextLine: one line, ~50 chars max.** Two sentences overflow the featured card and get truncated with "…". The rule: one crisp insight, no period-space-sentence chaining. Test: paste into a ~50-char ruler; if it wraps, shorten. Examples that work: `"Economic growth is not shareholder returns"`, `"42% of market cap in net cash. Yield at 7.7%."` Examples that don't: `"Net cash covers 42% of market cap. The yield is 7.7% while you wait."` (two full sentences → truncated in card).
- **contextLine must not repeat the ogTitle concept.** If ogTitle leads with EV/EBIT, contextLine must not mention EV/EBIT. Use a different frame: balance sheet, yield, market perception, macro angle.
- **Article nav chain follows pubDate order.** When publishing a new article, the `← Previous` link must point to the article with the most recent pubDate before this one — not the thematically closest article. Check `wiki/articles.md` published list (sorted newest-first) to identify the correct predecessor. Update the predecessor's nav to add `Next →` pointing to the new article.
- **`title` field (HTML `<title>` tag):** keep to ~50-60 chars, pattern `"Company (TICKER.HK) Stock Analysis: [short tension]"`. The `ogTitle` carries the full Trading852 tension formula; `title` is for SEO.

### June 28, 2026 · Gold regime tracker + Macro article

- **New article** [gold-regime.html](../publish/analyses/gold-regime.html) (`Macro` section): why gold's direction is set by real rates and the dollar (both inverse), and when a 23%-off-the-high correction becomes a buy.
- **New live tracker**, companion to the convexity gauge, same two-layer architecture: composite `[-1,+1]` from `^TNX` (real-rate proxy, inverted, 0.30), `DX-Y.NYB` (DXY, inverted, 0.30), `GC=F` (gold trend, the tape, 0.40). Bake [scripts/update-gold-regime.py](../scripts/update-gold-regime.py) + client refresh [assets/gold-regime.js](../assets/gold-regime.js); markers `<!-- GOLD:START/END -->`; [build.js](../build.js) attaches the script on `class="gold-gauge"`.
- **CSS reuse**: [article.css](../publish/styles/article.css) regime-gauge base + colour modifiers generalised to `.convexity-gauge, .gold-gauge`; both share the `.cvx-*` element classes (no duplication).
- **First bake**: NEGATIVE -0.32 (gold -6.4%/3mo, dollar firming, yields flat). Sparkline crosses green-to-red around early May. Spec: [Gold regime tracker](gold-regime.md).
- **Wiki**: new [gold-regime.md](gold-regime.md); pointers in [index.md](index.md), [ops.md](ops.md). Build: 28 pages, 0 warnings.

### June 28, 2026 · Rate convexity tracker + Macro article

- **New article** [rate-convexity.html](../publish/analyses/rate-convexity.html) (`Macro` section, featured card): why US rate convexity is the dominant factor for HK financials, the market is ~40% financials and the HKD is pegged to the USD, so the Fed sets the rate regime for half the Hang Seng.
- **New live tracker**: composite regime gauge in `[-1, +1]` from three free, no-key Yahoo series, `^IRX` (short rate), `^TNX - ^IRX` (curve slope), `^HSNF / ^HSI` (HK financials relative strength, weighted 0.50). Regime: `>= +0.25` positive / `<= -0.25` negative / else transition. Same two-layer pattern as the HSI tile: build-time bake ([scripts/update-convexity.py](../scripts/update-convexity.py)) + client-side refresh ([assets/convexity.js](../assets/convexity.js)) via the yahoo-proxy worker, identical math and viewBox 720x160 geometry so the two never disagree.
- **Wiring**: [build.js](../build.js) auto-attaches `convexity.js` on any page carrying `class="convexity-gauge"`. Widget CSS appended to [article.css](../publish/styles/article.css). CSP unchanged: `connect-src` in [vercel.json](../vercel.json) already whitelists the yahoo-proxy worker.
- **First bake**: POSITIVE +0.47, financials outperforming +12.5% over 3mo overruled a flat short-rate signal (the empirical relative-strength term is weighted highest for exactly this reason). Snapshot also written to [scripts/convexity-snapshot.json](../scripts/convexity-snapshot.json).
- **Wiki**: new page [convexity-tracker.md](convexity-tracker.md); pointers added to [index.md](index.md) and [ops.md](ops.md). Build: 27 pages, 0 internal-link / orphan warnings; article cross-links to `hsi-35-year-trendline` and `market-thesis`.

### June 27, 2026 · HSI tile: live client-side widget (was a frozen build-time snapshot)

- **Problem**: the Hang Seng tile on the [market-thesis hub](../publish/analyses/market-thesis.html) was a build-time snapshot, refreshed only when someone manually ran `python3 scripts/update-hsi-quote.py && node build.js`. Nothing was automated (no Action, no launchd, no cron), so it had been frozen at the June 24 close (23,412.18) for three days while the index had actually fallen to 22,671.86. The wiki claimed it "updates every day"; that was never wired up.
- **Fix**: added [assets/hsi-quote.js](../assets/hsi-quote.js), a live client-side widget. On every page load it fetches Yahoo `^HSI` (5y weekly closes + 1mo daily) through the **yahoo-proxy worker** (the same source [scorecard.js](../assets/scorecard.js) uses) and rewrites the value, the day change, and the 5-year sparkline SVG in place. The tile is now current on every visit with zero infrastructure to maintain. [build.js](../build.js) injects the script on any page whose source carries a `class="hsi-quote"` block.
- **Fallback kept**: the build-time snapshot in the HTML stays as the no-JS / fetch-failure fallback (progressive enhancement). [scripts/update-hsi-quote.py](../scripts/update-hsi-quote.py) and the sparkline geometry (viewBox 720 x 150) are shared so the live render and the fallback match exactly. The snapshot was refreshed to the June 26 close while making the change.
- **CSP**: no change needed; `connect-src` in [vercel.json](../vercel.json) already whitelists `https://yahoo-proxy.marccharnal.workers.dev`.
- **Wiki**: [build-pipeline.md](build-pipeline.md) and [ops.md](ops.md) rewritten from "manual refresh step" to "live widget + fallback"; [articles.md](articles.md) HSI row updated.

### June 27, 2026 · Scorecard: benchmark exempt from the trailing stop

- **Bug**: the 2800.HK Tracker Fund benchmark row was showing a **Stopped** badge (locked at the breakeven / +10% peak tier). The HSI reference had rallied ≥ +10% since the Apr-10 entry, arming the breakeven stop, then an intraday low touched entry and tripped it.
- **Fix**: the trailing-stop ratchet now applies to **stock picks only**. `fetchOne` in [scorecard.js](../assets/scorecard.js) skips the whole stop scan when `rec.isBenchmark` is set, so the benchmark never arms a tier and can never be marked Stopped. It just shows the raw index return since entry. The ex-dividend adjustment still runs, keeping the benchmark's return comparable to the picks.
- **Methodology page**: new **Benchmark** paragraph states explicitly that the Hang Seng is tracked through the Tracker Fund (2800.HK), the HSI index ETF, from the April 10 issue, carries no stop, and is excluded from the average and the winners/losers tally.
- **Wiki**: [scorecard.md](scorecard.md) Benchmark section updated to document the exemption.
- Benchmark exclusion from the average / alpha row was already in place; only the stop logic was wrongly applied.

### June 24, 2026 · Rename `src/` to `publish/` + fold `instructions/` into the wiki

- **`src/` renamed to `publish/`.** The authored-pages folder was called `src`, which read like generic boilerplate. It is where articles are published from, so it is now `publish/`. One real path change in [build.js](../build.js) (`const SRC = path.join(ROOT, 'publish')`); `vercel.json` was untouched (it builds via `node build.js` and serves `dist/`). All wiki and README references repointed. `dist/` output is byte-identical, so the live site is unchanged.
- **`instructions/` folder removed; its content moved into the wiki.** `blog-style-guide.md` is now [style-guide.md](style-guide.md) at the wiki root, listed in Pages as the single source of truth. The six SEO docs moved into a new [seo/](seo/index.md) sub-hub (`patterns.md`, `strategy.md`, `site-structure.md`, `content-calendar.md`, `competitor-analysis.md`, `implementation-roadmap.md`, `architecture-audit-2026-05-07.md`). The old `wiki/seo.md` became `seo/patterns.md`. The pre-humanity style-guide backup moved to [_backups/](_backups/).
- **`about` page rewritten** in Marc's published voice at this commit, then reworked further across the day into its final "Be water" positioning. See the dedicated entry below.
- VOIX-Marc stays the external cross-project voice reference; the style guide is the Trading852 layer on top of it.

### June 24, 2026 · About page: "Be water" rework

The [about](../publish/static/about.html) page was rewritten at the `src/`→`publish/` rename, then reworked across roughly nine more commits into its final positioning. The earlier one-line log ("sharper hook, a 'What I am trying to do' section") no longer matches the page; this entry supersedes it.

- **Framing**: fundamentals plus chart-timing synthesis: "the fundamentals are only half of it. The timing is the other half." Leans toward larger companies and positions held for months, not short swings. Risk management is always key.
- **"Be water" section** (Bruce Lee): the method is deliberate adaptability, not only deep discounts. Momentum too, where "the trend is my friend." Bear phase right now, so most setups sit on the discount side: that is the season, not the rule. Flow most days, crash when the setup is really there; cut a loser fast, without ego.
- **Public diary** register ("This is my diary, kept in public"), not presented as a profession or a service. Dedicated **"What this is not"** section: this is not advice.
- Meta description broadened from discounts-only to "value, momentum, whatever the market is offering." Person JSON-LD retained; Marc's deadpan voice, no em dash.

### June 24, 2026 · HSI hub: nav repoint, live index quote, card restyle, footer signature

- **Header `HSI` now points to the Hang Seng Index Research hub** ([`/analyses/market-thesis`](../publish/analyses/market-thesis.html)) instead of the single `hsi-35-year-trendline` article. The hub H1 was renamed from "Market Thesis" to "Hang Seng Index Research"; the URL, breadcrumb label, `articleSection`, and card eyebrows keep "Market Thesis" so cross-references stay intact. One edit in [publish/_partials/navbar.html](../publish/_partials/navbar.html), propagated to all 25 pages on build.
- **Live HSI quote + 5-year sparkline added atop the hub** (`.hsi-quote`, value + day change + weekly-close area chart, styled in [publish/styles/page.css](../publish/styles/page.css)). Build-time snapshot dated "close DD Mon YYYY", refreshed by [scripts/update-hsi-quote.py](../scripts/update-hsi-quote.py) (Yahoo `^HSI`, idempotent). See "Live HSI quote on the market-thesis hub". A double-clickable [preview-trading852.command](../preview-trading852.command) was added for local preview.
  - *Gotcha logged:* the script first used `<!-- ... -->` marker comments; the interactive zsh history-expansion of `!` rewrote `<!--` to `<\!--` and broke the comments. It now locates the block by its `<div class="hsi-quote">`, no HTML comments.
- **Published-analysis cards restyled for contrast.** `.category-article-card` got a pale-gray fill (`--dp-c-gray-pale`), rounded corners (matching the quote box), and a white + shadow lift on hover. Applies to every sector hub, not just HSI.
- **market-thesis intro generalized.** Removed the luxury-discount line and the two trendline-specific paragraphs (the intro was narrated entirely around the first published article). Replaced with a general, regime-level framing in Marc's voice.
- **Hub cards sorted newest-first, with publication dates.** "Cheap Is a Question" (Jun 21) now sits above "Six Bounces. One Break." (Apr 11). Each card eyebrow shows the date via a new `.ca-date` span.
- **Footer signature restored on static pages.** [publish/_partials/footer-static.html](../publish/_partials/footer-static.html) carried only the left tagline; the category and static pages (all `layout: static`) were missing "Be water, My friend." Added the two-tagline block so they match the article/home footers, which makes the existing "all footers" claim under Per-layout footer true.
- **Note:** the China / Hang Seng GDP-paradox market-thesis article is drafted in `DRAFT/hang-seng-gdp-paradox.html` and remains unpublished, pending review (not pushed).

### June 24, 2026: README expanded with Voice of Marc + Editorial Standards

**Major update:** Added complete "Voice of Marc: Style Guide & Editorial Standards" section to README as the single source of truth for article writing.

- **Editorial workflow formalized:** Articles must pass DRAFT → Dany review → publication sequence. Claude never publishes directly to `publish/analyses/` without prior review.
- **Voice of Marc codified:** Core parameters (formality level 3, certainty 4, rhythm 15-25 words), pronouns priority, what the voice does/never does, read-aloud test.
- **Pre-flight checklist added:** 4 mandatory tests before writing (acronym map, central number(s), thread question, anchor price).
- **Narrative arc documented:** Escalator principle with 7-section structure + thread question progression.
- **Sentence-level rules detailed:** Sentence length (15-25 words, never >30), number density (max 3 consecutive number-sentences), human-scale recasting, introduction precedence, one-concept-one-pass rule.
- **Anti-patterns catalogued:** Forbidden em-dashes, forward-deferral limits (max 2 per article), filler phrases, internal research references, jargon rules.
- **Pendulum phrase explained:** Howard Marks technique with banned examples and how to write new ones.
- **Key Takeaway vs hook:** Absolute separation rule with test for angle differentiation.
- **Pre-publication checklist expanded:** 25+ checkpoints covering style, structure, SEO, procedure, and accessibility.
- **References:** Full cross-links to [style-guide.md](style-guide.md) and [../../Voix Marc/VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md).

This section supersedes all prior instructions on writing style. It is the source of truth.

### June 22, 2026 · Homepage cards: grey key-number added to small cards + mobile truncation fix

- **`card-key-number` added to both small cards.** The grey "frame" line was exclusive to the featured card; small cards felt half-built without it. 0300.HK gets `"Robot Maker. Washing-Machine Multiple."`, SPY gets `"Two Levels. Same Distance."` Both follow the same `card-key-number` CSS (bold, 45%-opacity white, ellipsis on desktop).
- **Featured card mobile truncation fixed.** `card-key-number` had `white-space: nowrap` globally, so at the 1.5rem mobile floor the 34-char key-number overflowed and got ellipsized. Added a `@media (max-width: 48rem)` override: `white-space: normal; font-size: 1.125rem` on `.node-mode-recent_update--featured .card-key-number`. The text now wraps cleanly instead of truncating.

### June 19, 2026 · Scorecard: ex-dividend adjusted returns

- **The scorecard no longer counts an ex-dividend price drop as a loss.** `scorecard.js` now requests Yahoo dividend events (`&events=div`) and, for any dividend that goes ex strictly after a pick's entry bar, adjusts that one-off ex-dividend drop out of the return. The dividend is **not** added as income and the displayed entry / last prices stay raw and chart-verifiable: only the percentage changes, so it shows the price move with the mechanical ex-dividend gap removed. Trigger: 0300.HK Midea went ex on a 4.367 HKD/share dividend (Jun 18), so the raw return showed the pick at −6.1% from its Jun 2 entry when the move with the ex-dividend drop removed was −1.3%. Mirrors the HK Portfolio app's Jun 18 ex-dividend fix (commit `be66e99` there).
- **The trailing stop is ex-div aware too.** The stop scan adjusts the ex-dividend drop out the same way (it compares the price path with the gap removed), so an ex-dividend gap can no longer falsely trip a stop that has ratcheted to the −5% or breakeven tier. Previously a ~5% ex-div drop could stop out a position that had not actually fallen.
- **General, not one-off.** Applies to every tracked ticker and the 2800.HK benchmark, so the portfolio average and the HSI reference are compared on the same basis. Dividends with an ex-date on or before the entry bar (e.g. 1698.HK Tencent Music's Apr 1 payout vs its May 4 entry) are already in the entry price and stay excluded. Affected rows show a small `ex-div adj` caption under the % with a tooltip stating the per-share dividend adjusted out.
- **SPY 747 "days since the cycle high" no longer trails the price tile by a session.** Same Yahoo quirk, different symptom: the daily OHLC array carries the latest session as a trailing slot whose `close` is still `null` (not finalized) while `meta.regularMarketPrice` already holds that close. The price tile reads `meta` so it looked current, but the days-since counter ran off the OHLC array, which `analyze()` walks back past the null to the prior session, so it showed 11 when the price already reflected the newer day (12). Fix: before `analyze()` runs, backfill the latest session from `meta` (fill the existing null slot, or append a bar if absent) so both tiles count the same day. Volume from `meta.regularMarketVolume` feeds the post-peak ratio too. **Lesson (applies to any live-data widget): the last-price tile and every counter/ratio derived from the OHLC array must read the same most-recent session. `meta` leads the array by a bar, so either source everything from `meta` or backfill the array from `meta` first, never mix.** See the generalized "Last price" rule in the Scorecard section.

### June 9, 2026 · Scorecard: trailing stop fix + post-stop display + HSI alpha row

- **Removed the date-based legacy stop gate.** All picks now use the 3-tier trailing ratchet from day one: no flat −10 % exception for picks published before May 5. `TRAILING_STOP_FROM` deleted from `scorecard.js`.
- **Post-stop now: price shows % from entry.** Stopped rows display `now: XX.XX / −x.xx %` under the entry price. Color is green when current price is above entry, red when below (was previously compared against stop level, which was misleading).
- **Benchmark row darker.** Background bumped from `#f5f5f5` to `#dadada` so the HSI row is visually distinct from regular picks.
- **Portfolio vs HSI alpha row.** A dark footer row (`sc-row-alpha`, `#1a1a2e` background) sits below the benchmark and shows the spread between the portfolio average and the HSI return in percentage points (e.g. `+3.24 pp`). Green if portfolio leads, red if it trails.

### June 3, 2026 · Scorecard auto-generated from articles + live SPY tracking + em-dash scrub

- **Scorecard positions now build from the articles.** `build.js` (`generateScorecardData()`) scans `/analyses`, registers every article with an HK ticker + verdict, and writes `dist/assets/scorecard-recos.json`, which `scorecard.js` fetches. The hand-maintained `RECOS` array is gone. Publishing a stock article auto-registers it; curated short names and the Apr-10 inaugural entry dates are preserved via `SCORECARD_OVERRIDES`, plus optional per-article `scorecardName` / `scorecardEntryDate` CONFIG fields. Non-picks (SPY/HSI theses, sector hubs) are excluded automatically; the 2800.HK benchmark is a fixed entry.
- **Post-stop `now:` price colored** green at/above the stop level, red below (`.sc-now-pos` / `.sc-now-neg`).
- **SPY $747 banner is live.** `spy-747-level.html` fetches SPY on each load via the yahoo-proxy worker and recomputes the level distance, advancing ceiling, and friction-zone day count, with a within-1%-of-ceiling highlight. Dark panel for contrast, no accent border, static May-29 snapshot as fallback.
- **Homepage SPY card turns red** when SPY is within 1% of the advancing ceiling (`scorecard.js`, `#spy-zone-card`).
- **Site-wide em-dash scrub.** All 67 em dashes removed across articles, homepage, RSS feed, static pages, and `scorecard.js`, replaced with context-correct punctuation (colon, comma, parentheses, period). The scorecard "no value" placeholder is now `n/a`. Already banned in "What to never write".
- **Midea Group (0300.HK)** published (MONITOR, Kuka robotics angle) and added as the first auto-tracked position. **Lenovo (0992.HK) discarded** (thesis stale after a +50% move).

### May 31, 2026 · SPY article update + unadjusted-price convention

- **Live update banner added** to `spy-747-level.html`: SPY at $756.48 (May 29 close), +1.3% above $747, ~3.1% to calculated ceiling (~$781), 164 trading days in friction zone.
- **Unadjusted-price rule documented** in banner and README: all structural level distances must be read on a chart with dividends off. Adjusted prices produce different values and do not match the published levels.

### May 7, 2026 · SEO architecture audit + CollectionPage schema for 7 sector hubs

- **Audit deliverable** at [seo/architecture-audit-2026-05-07.md](seo/architecture-audit-2026-05-07.md). Full-site review of schema, sitemap, and hreflang. 0 critical, 12 high-severity items. Hreflang N/A (English-only).
- **CollectionPage + ItemList JSON-LD added to all 7 sector hubs**: luxury, biotech, technology, electric-vehicles, consumer-discretionary, special-situations, market-thesis. Closes the dangling `isPartOf` `@id` references that every ticker article was already emitting (each article declares "I belong to /analyses/luxury", but those hub URLs previously had no schema entity at the destination). Each hub `@id` and `name` are kept consistent with the article-side reference. Build script unchanged: hubs use the existing `<!-- JSONLD ... -->` comment pattern picked up by `build.js`.
- **Sitemap `<lastmod>` bumped to 2026-05-07** for the 7 hub URLs to reflect the schema addition.
- **Audit items still open** (tracked in the audit doc): HSI article missed the May 6 SEO pattern upgrade (no `image`, `inLanguage`, `wordCount`, `articleSection`, `isPartOf`); no sitewide `Organization` entity in `head.html`; sitemap `<priority>` and `<changefreq>` are dead weight (Google ignores both).

### May 7, 2026: Scorecard: post-stop live price + 1167 verdict correction

- **Live last close shown under the entry price for stopped rows**. New `now: XX.XX` line, small green text right-aligned in the Entry column. Locked `pct` stays frozen at the stop tier; the live price is informational, never feeds the average. Wired in `assets/scorecard.js` (`currentPrice` preserved separately from `last`) and styled in `publish/styles/scorecard.css` (`.sc-now`). Methodology paragraph updated.
- **1167.HK Jacobio verdict corrected from CONVICTION to MONITOR.** The expert analysis returned MONITOR; the article was labelled CONVICTION at the Apr 14 publication in error. The correct call has always been MONITOR. Updated in five places: meta-verdict pill on the analysis page, new Correction notice block at the top of `publish/analyses/1167-jacobio.html`, biotech category card eyebrow on `publish/analyses/biotech.html`, the verdict-tag on the Identified Situations row in `publish/index.html`, and the scorecard eyebrow on the Jacobio row in `assets/scorecard.js` (`Biotech` → `Biotech · Monitor`). Reasoning: binary Phase III futility risk, NRDL adoption pace unverified through one full reporting cycle (H1 2026 interim due Jul or Aug), CEO Wang Yinxiang silent in the secondary market since his HK$96M purchase between Jul and Sep 2025 at HK$8.56. The arithmetic and valuation framework in the article are unchanged.
- **Editorial rule clarification (Step 1 + Step 5)**: the verdict is whatever the expert analysis returns (CONVICTION, MONITOR, or AVOID). All three publish. The label drives framing and surface treatment across the four canonical places: meta-verdict pill, sector card eyebrow, homepage verdict-tag, scorecard eyebrow.

### May 6, 2026: Sitemap refresh + favicon at root (SEO follow-up)

- **Sitemap `<lastmod>` bumped to 2026-05-06** for the 7 SEO-refreshed ticker articles + homepage. Without this, Google sees the May 6 schema/H2/title restructure as if it never happened: re-crawl frequency depends on the `<lastmod>` signal, not on actual change detection.
- **JSON-LD `dateModified` bumped to 2026-05-06** in the same 7 articles. Sitemap and JSON-LD freshness must agree.
- **`/favicon.ico` added at the site root** (was returning 404). Google Search Console and many crawlers fetch `/favicon.ico` directly rather than reading `<link rel="icon">` declarations: the missing root favicon was producing a placeholder avatar in GSC's property selector. Built from the existing 32×32 PNG; `head.html` now also declares the legacy `<link rel="shortcut icon">`.
- **README**: SEO pattern doc expanded with `dateModified` semantics rule, sitemap refresh rule in Step 6, pre-publish checklist updated, folder structure shows `publish/favicon.ico`. Title field rule clarified: static pages keep ` · Trading852` suffix, ticker analyses drop it.

### May 6, 2026: Auto-generated BreadcrumbList JSON-LD + TO DO folder

- `build.js` now emits `BreadcrumbList` JSON-LD for every article page by parsing the existing in-body `<div class="article-breadcrumb">`. New token `{{BREADCRUMB_JSONLD}}` added to `head.html`. Zero per-article edits: all 7 stock analyses + the HSI thesis page get the schema; category hubs and homepage correctly skip it.
- `TO DO/` folder created. First entry: `per-article-og-images.md`: spec for replacing the shared `og-image.png` with one unique 1200×630 PNG per article (manual Figma path or auto-generated Puppeteer path), highest social CTR move available.

### May 6, 2026: SEO pattern locked, applied to all 8 published articles

- Added "SEO pattern (mandatory for all ticker analyses)" section to README: title/description format, JSONLD additions (image, articleSection, inLanguage, wordCount, isPartOf, expanded keywords), H2 entity-name rule, body ticker+HKEX establishment paragraph, inline sector-hub link, h3 risk callout labels.
- Pre-publish checklist updated with 8 new SEO line items.
- 8 SEO-optimized DRAFTs created in `DRAFT/`, one per published article (Tencent Music, Haier, Alibaba, Yadea, Jacobio, Prada, Dickson, HSI 35-year). Pattern was first developed and validated on `1913-prada-SEO-OPTIMIZED.html`, which is the canonical reference.
- All titles trimmed to ≤ 60 chars, ` · Trading852` suffix dropped (brand sits in `og:site_name` + schema `publisher`, so dropping it from title is free SEO).
- All Article schemas now include `image` field (Google explicit recommendation).
- All `risk-callout__label` divs converted to `<h3>` for passage-extraction by Google + AI summarisers.
- New `SEO/` folder with `keywords-funnel.md` (TOFU/MOFU/BOFU keyword strategy without Ahrefs).
- New `POST SUGGESTION/` folder cross-referencing FinRatios CONVICTION ≥ 7.5 with active investor research themes.
- `seo/strategy.md` cleaned: methodology pages (`/method/*`) abandoned. MOFU served by sectoral hubs + comparatifs + screens + thesis articles instead. The methodology stays a moat.

### Apr 29, 2026: Homepage pub date + mobile menu dividers

- Recent Analyses cards (homepage) now show the pub date in 45%-opacity grey after the ticker: `Sector · Ticker · Mon DD, YYYY`. Ticker stays bold; date is regular weight. New `.eyebrow-date` class in `publish/styles/index.css`.
- Mobile hamburger menu: divider lines between Analyses / Scorecard / HSI / About bumped from `rgba(255,255,255,0.08)` to `0.14` (+75%): they were nearly invisible on dark backgrounds.

### Apr 29, 2026: Link `instructions/` from README

- Top of README now lists the editorial + SEO references in `instructions/` (style guide + 5 SEO docs). (Moved into [wiki/](index.md) on Jun 24, 2026.)
- Folder structure block updated to show `instructions/` and its `seo/` subfolder.
- Step 2 of the editorial workflow now points to the local `style-guide.md` instead of the v1 path.

### Apr 29, 2026: Scorecard: average methodology, benchmark exclusion, stopped-row restyle

- **Methodology block** rewritten to explain the average calculation: simple arithmetic mean of every line's % change, each ticker counts equally, benchmark excluded.
- **Tracker Fund (2800.HK) excluded from the average** and from the winners/losers tally on both `/scorecard` and the homepage strip. The benchmark stays visible at the bottom of the table as a reference line only. Implemented by filtering `!r.isBenchmark` in `renderStrip` and `renderTable` before reducing.
- **Stopped rows restyled**: opacity-based grey-out replaced by a very light red background (`#fdf3f3`, hover `#fbe9e9`). The previous opacity treatment looked too similar to the benchmark row's grey, blurring the difference between "we hit the stop" and "this is the market reference".
- **Stopped % cell** now shows the locked `−10.0%` value with a small uppercase "Stopped" caption underneath (instead of replacing the number with text). Locked −10% still feeds the average.
- Removed the "past performance on a three-figure sample is not a track record" line from the methodology: readers can draw their own conclusions.

### Apr 28, 2026: Remove Galaxy from scorecard, enforce article-first rule

- 0027.HK Galaxy Entertainment removed from `RECOS`. No article was published, so no scorecard entry should exist.
- Rule added to README: article and scorecard entry are inseparable. Never add a ticker to `RECOS` without a live article in `publish/analyses/`. No article = no scorecard entry.

### Apr 27, 2026: Scorecard engine, SEO fixes, category pages

**Scorecard engine**
- Entry price: first close strictly AFTER `pubDate` (`ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → Monday open instead of close. Haier (Apr 25 = Saturday) uses Apr 28 open.
- Last price: `meta.regularMarketPrice` used as primary source; OHLC close array as fallback. Fixes thinly traded stocks (e.g. 0113.HK) where the OHLC array lags and returns the entry-day close as "last".
**SEO, high priority**
- Homepage H1 added (visually hidden) for correct heading hierarchy.
- Mobile hamburger menu added: button, CSS `.is-open` panel, JS toggle with `aria-expanded` and click-outside close.
- About page expanded from 253 to ~600 words: Who I am / Why Hong Kong / How I work / What this is not. Person JSON-LD schema added.
- All article source citations hyperlinked (previously plain text) using HKEX News search URLs + IR pages.

**SEO, medium priority**
- `/legal-notice` added to `sitemap.xml`.
- 7 sector/category pages created in `publish/analyses/`: `luxury`, `special-situations`, `biotech`, `technology`, `consumer-discretionary`, `electric-vehicles`, `market-thesis`. Each has a hero H1, sector intro paragraph, and `.category-article-card` components linking to published analyses.
- Article breadcrumb labels made into links pointing to their category page.
- RSS `feed.xml` upgraded with `xmlns:content` namespace and `<content:encoded>` full-text blocks for AI aggregator indexing.
- "Browse by sector" pill grid added to homepage.

**Editorial**
- Dickson Concepts (0113.HK) classified in both Luxury and Special Situations category pages.
- Manifesto: "public filings" → "public sources".

### Apr 27, 2026: Scorecard rules, nav rename, image fix, OG tags

- **Scorecard: weekend pub entry**: weekday pub → first close after `pubDate`; weekend pub (Sat/Sun) → Monday open price. Haier (Apr 25 = Sat) was the first case. Entry cell shows "open" label when applicable.
- **Scorecard: benchmark row**: 2800.HK pinned to bottom via `isBenchmark: true` + `sort()`. Grey background (`sc-row-benchmark`). Eyebrow changed to "Benchmark".
- **Scorecard: copy**: "recommendation" replaced by "article" everywhere in scorecard page and meta description.
- **Navbar**: "Hong Kong" renamed to "HSI". Footer: "Hong Kong" renamed to "Hang Seng Index".
- **Article images**: `max-width: 100%; height: auto` added to `.article-body img`: prevents 1280px images from overflowing the 46rem content column.
- **OG image**: added `og:image:width`, `og:image:height`, `og:image:type` to `head.html`: required by WhatsApp for link preview thumbnail.
- **Git**: `Trading852-v2/.git` was a broken ghost (no config/objects). Re-initialized and connected to `Marcvrick/trading852-v2`. `git push` from this folder now triggers Vercel auto-deploy.

### Apr 26, 2026: README v2 created

- Documents the new `publish/` → `dist/` build pipeline, partials, source page format (`CONFIG` + `JSONLD` comments, no `<head>` / nav / footer in source), images convention (`publish/analyses/images/<slug>.jpg`), Vercel cleanUrls gotcha.
- Editorial workflow (style guide, 7-section structure, scorecard, drafts, published articles, "what to never write", SEO checklist) carried over from the v1 README.
- Triggered by the `hsi-35-year-trendline` broken image (image folder was never migrated from v1 to v2 because the convention was undocumented).


### Jul 10, 2026: PENDING — usd-strength-hk-transmission DRAFT needs Aggregate Balance refresh on Jul 14

- `DRAFT/usd-strength-hk-transmission.html` cites the Aggregate Balance at roughly HK$54 billion (HK$53,997M), the latest confirmed HKMA figure as of end-May 2026. HKMA's next Currency Board Account release, covering June 2026, is due **July 14, 2026** and was not yet published as of this entry.
- **Action when it lands:** re-check the figure at the HKMA press release under `news-and-media/press-releases/2026/07/` (Currency Board Account / Aggregate Balance), update the "Why Hong Kong's banks tighten when the Fed does" section of the draft with the confirmed June number, and reconfirm HIBOR direction still matches the article's thesis before this article is moved to `publish/analyses/`.
- A session-only cron reminder was also set for Jul 14; this log entry is the durable fallback in case that session has since ended.
- **Update, same day:** Dany reviewed the draft (title changed to "The 1983 Peg Still Sets Hong Kong Stock Prices", DXY chart swapped for the real weekly chart, DXY paragraph rewritten to match it) and gave explicit go to publish despite the pending May-vs-June Aggregate Balance gap. Published to `publish/analyses/usd-strength-hk-transmission.html`. **Action still open:** when the June Currency Board Account lands Jul 14, re-check the HK$54B figure and HIBOR direction against the live article and patch if materially different.

### Jul 14, 2026 · Galaxy (0027.HK) scorecard entry-date bug fixed

- **Bug found:** Galaxy Entertainment's Scorecard entry showed HK$31.00 instead of the weekend-pub rule's Monday-open price. Root cause: [0027-galaxy.html](../publish/analyses/0027-galaxy.html)'s `CONFIG.pubDate` is `"2026-07-13"` (the Monday byline date), but the article was actually committed/published Sunday `2026-07-12 22:32 +0200`. `generateScorecardData()` in [build.js](../build.js) falls back to `config.pubDate` for `issueDate` when no override is set, so `scorecard.js`'s `isWeekendPub` check (`getUTCDay()` on the pubDate) saw a Monday and skipped the weekend branch, landing on Monday's own close (31.00) instead of Monday's open (31.60).
- **Fix:** added `"scorecardEntryDate": "2026-07-12"` to the article's `CONFIG` block — the existing override field `generateScorecardData()` already checks before falling back to `pubDate` (`config.scorecardEntryDate || ov.entryDate || config.pubDate`). `pubDate`/byline stay Monday for display; only the scorecard entry-date calc now sees the true Sunday publish day. Rebuilt, verified `scorecard-recos.json` issueDate → `2026-07-12`, pushed, confirmed live: Entry now reads `31.60 · open Jul 13`.
- **Scope check:** cross-referenced every other ticker article's `CONFIG.pubDate` against its actual first-commit date. Galaxy was the only mismatch — the rest either match their real publish day or were part of the June 24 bulk migration (dates come from the hardcoded `SCORECARD_OVERRIDES` entryDates, unaffected).
- **General rule going forward:** if an article is authored/committed on a weekend but given a Monday byline date (editorial convention), always set `CONFIG.scorecardEntryDate` to the real weekend calendar date explicitly — do not rely on `pubDate` alone to carry both the display date and the scorecard weekend-detection.

---
[Wiki index](index.md)
