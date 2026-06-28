---
title: "Trading852 v2, Rate Convexity Tracker"
tags: [trading852, wiki, tracker, macro, rates, financials]
category: Trading/Blog
type: wiki
created: 2026-06-28
updated: 2026-06-28
---

# Rate Convexity Tracker

Part of the [Trading852 wiki](index.md). The live widget lives on [publish/analyses/rate-convexity.html](../publish/analyses/rate-convexity.html) ([live](https://trading852.com/analyses/rate-convexity)).

A composite **rate convexity regime** gauge for HK financials. Hong Kong's market is ~40% financials and the HK dollar is pegged to the USD (Linked Exchange Rate System, 7.75-7.85 band), so US short rates, not local fundamentals, set the rate regime for half the Hang Seng. The tracker scores whether that regime is a tailwind or a headwind for long HK financials.

## The score

Composite in `[-1, +1]`, recomputed from three free, no-key Yahoo Finance series, each measured as a 3-month change (63 trading-day lookback):

| Signal | Source | Reads positive when | Weight |
|---|---|---|---|
| Short-rate trajectory | `^IRX` (13-week T-bill) | rates falling (cuts ahead = tailwind) | 0.25 |
| Yield-curve slope | `^TNX - ^IRX` (10Y - 3M) | curve steepening (wider bank NIM) | 0.25 |
| HK financials relative strength | `^HSNF / ^HSI` | financials outperforming the index | 0.50 |

`composite = 0.25*s_rate + 0.25*s_curve + 0.50*s_rs`

The relative-strength term carries half the weight on purpose: the two rate signals are the *theory* (what convexity should do); `^HSNF/^HSI` is the *tape* (the market's actual verdict). When theory and tape agree, the score hits an extreme; when they disagree, it sits in the transition band.

**Regime mapping:** `>= +0.25` POSITIVE (green) / `<= -0.25` NEGATIVE (red) / else TRANSITION (amber).

> Note (2026-06-28): a theoretical "negative" read (Fed signalling hikes) was overruled by the tape, financials outperformed +12.5% over 3mo, so the gauge printed POSITIVE +0.47. That gap is exactly why the empirical relative-strength term is weighted highest.

## How it is wired (two layers, same math)

Mirrors the [HSI quote](ops.md) pattern: a build-time baked snapshot + a client-side live refresh, with identical math and geometry so the two never disagree.

- **Build-time bake:** [scripts/update-convexity.py](../scripts/update-convexity.py) fetches the four series direct from Yahoo, computes the composite history, and replaces everything between the `<!-- CONVEXITY:START -->` / `<!-- CONVEXITY:END -->` markers in the page (idempotent). Also writes [scripts/convexity-snapshot.json](../scripts/convexity-snapshot.json) for debugging. This is the no-JS fallback.
- **Client-side live:** [assets/convexity.js](../assets/convexity.js) re-fetches the same series via the `yahoo-proxy` Cloudflare worker on every page load and re-renders the gauge, sub-signals, and sparkline. If any fetch fails, the baked snapshot stays in place (progressive enhancement). [build.js](../build.js) auto-attaches the script whenever the page contains `class="convexity-gauge"`.

The sparkline geometry (viewBox 720 x 160, score +1 top / -1 bottom) is identical in the Python and the JS, so the client render matches the baked SVG exactly.

## Refresh before deploy

```bash
python3 scripts/update-convexity.py && node build.js
```

Same cadence as the HSI snapshot, see [Ops](ops.md). The page is live (refreshes on load) even if the bake is stale, but keep the fallback current so first-paint and no-JS visitors see today's regime.

## Caveats

Directional, educational signal, **not investment advice** (the page and footer say so). It does not price credit risk, geopolitical tail events (Taiwan), or anything the four series cannot see. It answers one question: which way is the rate wind blowing for half the index.

---
[Wiki index](index.md)
