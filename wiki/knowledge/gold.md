---
title: "Trading852 v2, Gold and Miners"
tags: [trading852, wiki, knowledge, gold, miners, commodities, macro]
category: Trading/Blog
type: wiki
created: 2026-07-15
updated: 2026-07-15
---

# Gold and Miners

Part of the [Knowledge Layer](index.md). What the site has published about gold, its drivers, and the HK gold miners.

Source: [Gold: Real Rates, the Dollar, and When the Correction Becomes a Buy](../../publish/analyses/gold-regime.html) (2026-06-28, modified 2026-07-02). Tracker mechanics: [gold-regime.md](../gold-regime.md).

> **The drawdown number is not settled.** The article says gold fell 23% five times (title, subtitle, description, key takeaway, closing caveat) and 26% once, in a section updated 2026-07-02. Both are live drawdowns, both are stale. See [open-questions.md](open-questions.md) item 8.

## The two drivers (DURABLE)

The canonical definitions. Reuse verbatim.

**Real rates.** Gold has no cash flow, dividend, or coupon, so the cost of holding it is what you give up by not holding a bond: the real interest rate, the nominal yield minus inflation. Falling real rates shrink that opportunity cost; rising real rates make the bond win.

**The dollar.** Gold is quoted in dollars worldwide, so a stronger dollar mechanically raises the price for every non-dollar buyer and saps demand.

**The regime model:** the cleanest regimes are real rates and the dollar falling together; the worst are both turning against it; most of the time they pull in opposite directions.

> **Do not claim the tracker measures real rates.** It uses `^TNX`, the nominal 10-year yield, as a proxy. No inflation series enters the composite. The article discloses this ("real-rate proxy"), so it is not a hidden error, but a future article must say proxy or say nominal.

## Miner leverage (DURABLE)

A gold miner's profit is the gold price minus the cost of pulling an ounce out of the ground, so a move in the metal arrives amplified in the equity. **The torque is symmetric:** a worse outcome if gold keeps falling. Cite both halves.

## The tracker (DURABLE)

Cite exactly. The formula string, the 63-session lookback and the real Yahoo ticker appear only in [gold-regime.md](../gold-regime.md).

Composite in [-1, +1], three Yahoo series, each a 3-month change (63-session lookback):

| Signal | Series | Positive when | Weight |
|---|---|---|---|
| Real-rate direction (proxy) | `^TNX` (10Y yield), inverted | yields falling | 0.30 |
| Dollar direction | `DX-Y.NYB` (DXY), inverted | dollar weakening | 0.30 |
| Gold trend | `GC=F` (gold futures) | gold's own 3mo trend rising | 0.40 |

`composite = 0.30*s_real + 0.30*s_usd + 0.40*s_trend`

**Regime:** `>= +0.25` POSITIVE (accumulation), `<= -0.25` NEGATIVE (headwind), else TRANSITION (macro and price disagree). Same cutoffs as the [convexity tracker](financials-rates.md).

**Use `DX-Y.NYB`, not `DXY`, whenever the ticker is presented as a data source.** The article's methodology table prints "DXY", which is not a valid Yahoo symbol. Reproducing that table as-is publishes an unfetchable series.

**Why trend carries the most weight:** the first two signals are the macro setup and the third is the tape. The regime only earns green when drivers and price agree; macro-supportive-but-price-falling parks the score in the transition band.

**Scope limit, required caveat.** A directional, educational signal on three liquid series. It does not price a geopolitical shock that sends gold vertical regardless of rates.

## Miners versus the metal (DURABLE)

**The cycle top is fixed history:** every HK gold miner in the published table topped between January and March 2026, the same weeks gold topped. Citable forever.

**Why the site prefers HK and Chinese producers over Western majors.** All-in cost per ounce at Newmont and Barrick is rising even as gold trades near records, so record gold is not becoming record margin, and Newmont has guided to lower production for 2026. Cost inflation and declining ore grades work against the leverage a miner is bought for. Re-check Newmont's guidance once FY26 actuals land.

**Buy the reclaim, not the fall.** In a post-correction high-volatility regime a stop calibrated to calm markets gets swept on noise when the asset can move several percent in a day. See [frames.md](frames.md) F10b.

## The fundamentals score (DURABLE definition)

The 0 to 10 score grades the business on its FY2025 audited results across profitability, balance-sheet strength, and earnings growth. It reads company quality, not entry timing, and **moves only when new results are filed, not with the share price.** Any article reusing the column must describe it this way, and must repeat both warnings: a deeper fall is not a cheaper stock, and a higher score is not a cheaper stock.

## Perishable

Every drawdown below drifts daily. Re-verify before any reuse.

| Claim | as_of | Note |
|---|---|---|
| Gold sat 26% below its January high while the median HK gold miner sat about 56% below its own peak | 2026-07-02 | The producers fell roughly twice as hard as the metal. **The 2x ratio is the reusable idea; the two percentages are not** |
| Newmont down 29% and Barrick down 35% from their highs | 2026-07-02 | Dated comparison against the HK set only |
| The cheaper large HK gold names trade around 8 to 12 times EV to EBIT against richer Western multiples | 2026-07-02 | Re-verify live per stock. The frame (more torque for less price) is durable; the range is not |
| Gauge NEGATIVE -0.32, in regime since 2026-05-05 (37 sessions). Components: `^TNX` 4.37% (-0.04pp/3mo, signal +0.09), DXY 101.4 (+1.5%/3mo, signal -0.29), `GC=F` $4,096 (-6.4%/3mo, signal -0.64) | 2026-06-26 (gauge `data-asof`; article pubDate 2026-06-28) | Dated snapshot only. Re-run `scripts/update-gold-regime.py` |
| Silver fell roughly twice as far as gold | 2026-06-28 | |

### The HK miner table

Prices as_of 2026-07-02, off the 52-week high. Fundamentals scored on FY2025 audited results and semi-durable: they hold until the next FY filing. Price source not stated in the article.

| Miner | Ticker | Off 52w high | Fundamentals |
|---|---|---|---|
| Shandong Gold | 1787.HK | -68% | 6.1 |
| Zijin Gold International | 2259.HK | -65% | 9.8 |
| Zhaojin Mining | 1818.HK | -59% | 7.6 |
| Lingbao Gold | 3330.HK | -57% | 8.1 |
| Wanguo Gold | 3939.HK | -56% | 9.7 |
| Chifeng Jilong | 6693.HK | -49% | 10.0 |
| China Gold International | 2099.HK | -45% | 9.7 |
| Zijin Mining | 2899.HK | -40% | 8.7 |
| Zhihui Mining | 2546.HK | -31% | 8.2 |

## The cross-asset link (DURABLE)

The canonical bridge to [financials-rates.md](financials-rates.md): the catalyst for gold is a Fed pivot landing at the same time as a dollar that cracks, and that same rate easing is what drives the regime for HK financials. The two trackers are two sides of one coin.

---
[Knowledge Layer](index.md) . [Wiki index](../index.md)
