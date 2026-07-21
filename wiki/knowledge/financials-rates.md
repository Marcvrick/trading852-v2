---
title: "Trading852 v2, Financials and Rates"
tags: [trading852, wiki, knowledge, banks, financials, rates, convexity]
category: Trading/Blog
type: wiki
created: 2026-07-15
updated: 2026-07-15
---

# Financials and Rates

Part of the [Knowledge Layer](index.md). What the site has published about HK banks and the rate regime that drives them.

Source: [Rate Convexity: The Hidden Factor Behind Every HK Financial](../../publish/analyses/rate-convexity.html) (2026-06-28). Tracker mechanics: [convexity-tracker.md](../convexity-tracker.md).

## Why the sector is the index (DURABLE)

- Financials are roughly 40% of the Hong Kong market against about 13% in the US. A Hang Seng buyer is making a large concentrated bet on a single rate-sensitive sector. Cite for any HSI concentration or sector-rotation piece, or for why US index playbooks miscarry in HK.
- Under the Linked Exchange Rate System the HKD trades in a 7.75 to 7.85 band and the HKMA must follow the Fed to defend it, so the rate driving 40% of the Hang Seng is set by the FOMC, not in Hong Kong. Full peg mechanics and the transmission chain: [macro-hsi.md](macro-hsi.md).

Do not conflate this 40% with the separate published claim that Hang Seng Tech is close to 40% of the index. Different objects.

## The convexity mechanism (DURABLE)

Reuse this definition verbatim so it never drifts.

A bank's earnings are a spread business: borrow short, lend long. A steepening curve widens the margin and expands the multiple at the same time, and the two compound. That compounding is the convexity. Duration is the straight-line estimate; convexity is the second derivative of price with respect to yield.

**The regime rule, one line:** for HK banks and insurers, falling short rates plus a steepening curve is the tailwind; rising rates plus a flattening curve is the headwind.

## The tracker (DURABLE)

Cite exactly. The formula string and the 63-day lookback appear only in [convexity-tracker.md](../convexity-tracker.md); the thresholds appear only there and never in the published article.

Composite in [-1, +1], three Yahoo Finance series, each a 3-month change (63 trading-day lookback):

| Signal | Series | Positive when | Weight |
|---|---|---|---|
| Short-rate trajectory | `^IRX` (13-week T-bill) | rates falling (cuts ahead) | 0.25 |
| Yield-curve slope | `^TNX - ^IRX` (10Y - 3M) | curve steepening (wider NIM) | 0.25 |
| HK financials relative strength | `^HSNF / ^HSI` | financials outperforming | 0.50 |

`composite = 0.25*s_rate + 0.25*s_curve + 0.50*s_rs`

**Regime:** `>= +0.25` POSITIVE (green), `<= -0.25` NEGATIVE (red), else TRANSITION (amber). Same cutoffs as the [gold tracker](gold.md). Never invent a different one.

**Why relative strength carries half the weight:** the two rate signals are the theory (what convexity should do) and `^HSNF/^HSI` is the tape (the market's verdict). Agreement drives the score to an extreme; disagreement parks it in the transition band.

**The case that justifies the design.** On 2026-06-28 a theoretically negative read (Fed signalling hikes) was overruled by the tape, financials having outperformed 12.5% over three months, so the gauge printed POSITIVE +0.47. The go-to example when a future article's macro story disagrees with the gauge.

**Scope limit, required caveat.** A directional, educational regime filter on three liquid series. It does not price credit risk, does not see a Taiwan escalation, and is not a buy signal.

## The H1 2026 record (DURABLE, completed window)

A completed, dated measurement. Citable as history forever.

Over 2025-12-29 to 2026-06-26, the five largest HK-listed banks by market cap:

| Bank | Ticker | Start | End | Return |
|---|---|---|---|---|
| HSBC | 0005.HK | HK$121.90 | HK$147.70 | +21.2% |
| Bank of China | 3988.HK | HK$4.44 | HK$5.06 | +14.0% |
| CCB | 0939.HK | HK$7.62 | HK$8.26 | +8.4% |
| ICBC | 1398.HK | HK$6.23 | HK$6.62 | +6.3% |
| ABC | 1288.HK | HK$5.74 | HK$5.33 | -7.1% |

Top-5 average +8.5%. Over the identical window the Hang Seng fell 11.6% while the Hang Seng Finance sub-index `^HSNF` held roughly flat at +1.9%, giving the top-5 bank group a spread of about 20 points over the index. The benchmark pair for any "banks versus index" claim in H1 2026.

Data source is not stated in the article, and no adjustment basis is given. See [levels.md](levels.md) on the three bases.

## Perishable

| Claim | as_of | Note |
|---|---|---|
| Gauge POSITIVE +0.47, in regime since 2025-10-31 (156 sessions). Components: `^IRX` 3.66% (+0.05pp/3mo, signal -0.10), curve +0.71pp (signal -0.03), `^HSNF/^HSI` +12.5% 3mo relative (signal +1.00) | 2026-06-26 (gauge `data-asof`; article pubDate 2026-06-28) | Dated snapshot only. Re-run `scripts/update-convexity.py`. Data: Yahoo `^IRX`, `^TNX`, `^HSNF`, `^HSI` |

## The cross-asset link (DURABLE)

The canonical bridge sentence to [gold.md](gold.md): the catalyst for gold is a Fed pivot landing at the same time as a dollar that cracks, and that same rate easing is what drives the regime for HK financials. The two trackers are two sides of one coin.

---
[Knowledge Layer](index.md) . [Wiki index](../index.md)
