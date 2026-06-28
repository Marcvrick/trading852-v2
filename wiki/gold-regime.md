---
title: "Trading852 v2, Gold Regime Tracker"
tags: [trading852, wiki, tracker, macro, gold, commodities]
category: Trading/Blog
type: wiki
created: 2026-06-28
updated: 2026-06-28
---

# Gold Regime Tracker

Part of the [Trading852 wiki](index.md). Companion to the [convexity tracker](convexity-tracker.md), same architecture. Live widget on [publish/analyses/gold-regime.html](../publish/analyses/gold-regime.html) ([live](https://trading852.com/analyses/gold-regime)).

A composite **gold regime** gauge. Gold pays no yield, so it is driven by the **real interest rate** (its opportunity cost) and the **dollar** (its quote currency), both inverse. The tracker scores whether a correction is an accumulation regime or an ongoing headwind.

## The score

Composite in `[-1, +1]`, three free, no-key Yahoo series, each a 3-month change (63-session lookback):

| Signal | Source | Reads positive when | Weight |
|---|---|---|---|
| Real-rate direction | `^TNX` (10Y yield), inverted | yields falling (lower opportunity cost) | 0.30 |
| Dollar direction | `DX-Y.NYB` (DXY), inverted | dollar weakening | 0.30 |
| Gold trend | `GC=F` (gold futures) | gold's own 3mo trend rising | 0.40 |

`composite = 0.30*s_real + 0.30*s_usd + 0.40*s_trend`

The trend term is weighted highest: the first two are the macro setup (what should drive gold), the third is the tape (whether price is responding). Green only when drivers and price agree.

**Regime:** `>= +0.25` POSITIVE (accumulation) / `<= -0.25` NEGATIVE (headwind) / else TRANSITION (macro and price disagree).

> First bake (2026-06-28): NEGATIVE -0.32. Gold -6.4%/3mo (trend signal -0.64), dollar firming (-0.29), yields flat (+0.09). After a blow-off high gold fell 23% from peak; the sparkline shows the score crossing from green into red around early May, when the correction took hold.

## How it is wired

Identical two-layer pattern to the [convexity tracker](convexity-tracker.md): build-time bake ([scripts/update-gold-regime.py](../scripts/update-gold-regime.py), markers `<!-- GOLD:START/END -->`) + client-side live refresh ([assets/gold-regime.js](../assets/gold-regime.js)) via the yahoo-proxy worker, identical math and viewBox 720x160 geometry. [build.js](../build.js) attaches the script on any page carrying `class="gold-gauge"`. Both gauges share the `.cvx-*` element CSS and regime-colour modifiers in [article.css](../publish/styles/article.css). Snapshot: [scripts/gold-regime-snapshot.json](../scripts/gold-regime-snapshot.json).

## Refresh before deploy

```bash
python3 scripts/update-gold-regime.py && node build.js
```

## Caveats

Directional, educational signal, **not investment advice**. It does not price a geopolitical shock that sends gold vertical regardless of rates. It answers one question: which way is the wind blowing for gold.

---
[Wiki index](index.md)
