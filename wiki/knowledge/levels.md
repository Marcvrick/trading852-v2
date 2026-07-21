---
title: "Trading852 v2, Levels and Price Conventions"
tags: [trading852, wiki, knowledge, levels, spy, conventions]
category: Trading/Blog
type: wiki
created: 2026-07-15
updated: 2026-07-15
---

# Levels and Price Conventions

Part of the [Knowledge Layer](index.md). The structural-level framework, and the price bases that coexist on this site.

Source: [The 2022 High Was $0.13 From the Level. SPY Is Now 1.3% From the Next One.](../../publish/analyses/spy-747-level.html) (2026-05-11).

## Three price bases coexist. Never carry a number across them

This is the convention most likely to silently corrupt a reused figure.

| Work | Basis | Stated where |
|---|---|---|
| SPY structural levels | **unadjusted, dividends off** | [articles.md](../articles.md) catalog note; the article's chart label, banner, and footer |
| Scorecard returns | entry and last prices raw and chart-verifiable; **only the percentage adjusted for post-entry ex-div drops**, and the dividend is not added as income | [scorecard.md](../scorecard.md) |
| FinMC backtests | `cache_adjusted` (TradingView-exact) | FinMC_3 wiki |

The SPY note exists precisely to raise this flag, and it currently protects only SPY. The HK bank price table in the convexity article and the HK miner drawdowns in the gold article both state no adjustment basis at all.

**The SPY rule, verbatim from the catalog:** all calculations (level formula, ceiling, distance, backtest data) use unadjusted SPY prices, dividends off. When verifying on TradingView or any charting tool, turn off dividend adjustment before reading price versus level distances. Adjusted prices produce different distances and will not match the published levels. The backtest ran on SPY daily OHLCV, unadjusted, 1993 to 2025.

## The framework (DURABLE)

**Provenance.** A fixed mathematical formula applied to SPY's earliest price data generates structural levels across its full history. The formula has not been modified since first run, so a trader using it in 1999, before the dot-com peak, would have produced the same output. The article deliberately never publishes the formula itself.

**The four levels.** Only $477.58 and $747 are published as explicit numbers.

| Level | Active | Topped | Max decline | Outcome |
|---|---|---|---|---|
| 1 | 1999 to 2013 | 2000 dot-com, 2007 GFC | -56.5% (2007 to 2009) | broke 2013, never returned |
| 2 | 2014 to 2016 | 2015 flash crash | -14.3% | broke Dec 2016, never returned |
| 3 | 2018 to 2020 | pre-COVID 2020 | -35.6% in 33 days | broke Aug 2020, never returned |
| $477.58 | 2022 to 2024 | 2022 bear start, 2024 breakout | -25.4% over 9M | confirmed support April 2025 |

**The headline precision claim:** the January 2022 all-time high came in at $477.71 against a level of $477.58, a gap of $0.13 (+0.03% overshoot). The unadjusted basis is load-bearing here.

## The three signals (DURABLE)

**Signal 1, speed of approach.** The friction zone is the region within 7% of the level. Approaches that peaked within 252 trading days (about one calendar year) of entering it had an average subsequent peak-to-trough decline of -37.9%; approaches taking longer averaged -11.7%, with only 4 of 15 slow approaches exceeding a 15% decline. The separation holds across all 24 approaches in the dataset.

> Cite the count honestly. The -37.9% spans **nine cluster measurements across five underlying bear-market events**, not nine independent events. Four of five produced declines of 25% or more; the 2015 mid-cycle correction at -14.3% is the exception. Never upgrade this to "nine cases".

**Signal 2, post-peak volume.** Starting the session immediately after the peak day, average daily volume over the next 20 sessions divided by average daily volume over the prior 252 sessions was 1.46x or above on every confirmed major top and 1.24x or below on every clean breakout. The two groups never overlap. Constants in the page script: `TOP_RATIO = 1.46`, `BREAKOUT_RATIO = 1.24`, `POST_PEAK_N = 20`, `TRAIL_N = 252`.

> Four observations per group, eight total. The 1.24x to 1.46x band is an observed gap in the data, not a calibrated cutoff, and carries no historical observations. Reuse that caveat with the thresholds.

**Signal 3, the failed retest.** After a structural level breaks, price has always rallied back toward it, resolving as a reclaim (rally pushes back above and holds, the break was false) or a failed retest (rally peaks below the level, sellers control it, the decline continues). In every confirmed bear-market continuation the rally peaked below the level:

| Break | Retest | Outcome |
|---|---|---|
| March 2000 | November rally peaked just below | -45% over two years |
| October 2007 | May 2008 rally peaked below | -52% to the March 2009 bottom |
| February 2020 | bounce rejected within days | -30% over two weeks |
| January 2022, peak $477.71 | January 12 rally peaked at $471.02, about $6 below | fell to $356.56 by October |

Across the four independent continuations the average decline from the failed-retest peak is roughly -38%, range -24% to -52%. Magnitude tracked the macro regime: deeper in structural credit crises (2000, 2008), shallower in Fed-driven corrections (2020, 2022). This is the evidence base behind "buy the reclaim, not the fall" ([frames.md](frames.md) F10b).

## The calculated ceiling (DURABLE)

A separate measurement applied to SPY every trading day computes the maximum margin price can travel above the level that day. The structural level is the fixed floor, the ceiling is added on top, and the gap between them is the room available for the overshoot. It advances by a small fixed amount each trading day and **resets annually**. It is the only measurement in the framework fully observable before the high is set.

**Track record.** At every major SPY top since 1999 the peak landed within 2.1% of the calculated ceiling:

| Date | Peak | Ceiling | Miss |
|---|---|---|---|
| 2000-03-24 | $153.56 | $152.14 | +0.93% |
| 2007-10-09 | $156.48 | $159.74 | -2.09% |
| 2020-02-19 | $339.08 | $335.27 | +1.12% |
| 2022-01-03 | $477.71 | $477.08 | +0.13% |

Average miss 1.07%, largest 2.09%. The 2022 case is the instructive one: the ceiling sat $0.63 from the level itself, meaning no room above it, and the rally died the same day $477.58 was first crossed.

**The overshoot range is not random.** Historical overshoot has run from +0.03% (2022) to +9.0% (pre-COVID 2020), and the range is the daily gap between the fixed level and the moving ceiling: the 2007 gap was about +0.5% and price stopped at +0.5%; the February 2020 gap was about +9% and price stopped at +9%. Cite this to kill the "levels overshoot by a fixed percentage" misreading.

**First approach.** Every first approach to a prior structural level produced at least one correction of 14% or more before the level was eventually cleared. The April 2025 tariff crash tested $477.58 with an intraday low of $481.80 on 2025-04-07, less than 1% above the level, before recovering 19% over the following 20 trading sessions, confirming it as support.

## Framework scope (DURABLE, required epistemics)

The framework produces no buy or sell signal. Only 4 cycle highs in 25 years landed at structural levels (2000, 2007, 2020, 2022), which is what makes the $0.13 precision meaningful and also means the finding is consistent without supporting a precise forward probability. Speed describes the approach, volume confirms only after the high, the failed-retest signal arrives only after the level breaks. The ceiling is the only one readable before.

## HSI and SPY correlation (DURABLE)

High-value cross-market item. Nineteen years of rolling data show HSI and SPY are weakly correlated, annual average 0.22. The one known exception is acute global risk-off, where it hit 0.60 in March 2020. Past SPY declines driven by US-specific factors did not pull Hong Kong down; global events did.

Cite for any HK versus US decoupling, haven, or contagion claim. Data source not stated in the article.

## Perishable

| Claim | as_of | Note |
|---|---|---|
| SPY entered the friction zone below $747 around October 2025; close $737.62, roughly 150 trading days into the zone, level not yet touched (the 2022 setup peaked fast at 99 days). Ceiling about $769 (+3%). A peak in the next several weeks points to a top around $762 to $784; a peak in mid-2026 places it near $819 (+10%) | price 2026-05-08, ceiling 2026-05-11 | Snapshot only. **The December 2026 reset is durable and is a hard boundary: any target derived from this ceiling expires then** |
| Banner fallback: SPY $756.48, +1.3% above the $747 level (+$9.48), about 3.1% to the ceiling (about $781), 164 trading days in the zone | 2026-05-29 | Static fallback values baked into the DOM, not a live read. Never quote as current |
| Ceiling advances about $0.83 per trading day (`CEIL_PER_TD = 0.83`), current cycle | 2026-05-11 | Cycle-specific, resets annually. Treat the rate as perishable past December 2026 |

> **"SPY 1.3% from $747" means two opposite things on the same page.** The title has SPY at $737.62, 1.3% *below* the level (2026-05-11); the banner has it at $756.48, 1.3% *above* (2026-05-29). Coincidental identical magnitude, opposite sign, 18 days apart. See [open-questions.md](open-questions.md) item 14. The most dangerous number in this set to reuse.

---
[Knowledge Layer](index.md) . [Wiki index](../index.md)
