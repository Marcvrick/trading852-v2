---
title: "IG Plan — Hang Seng GDP paradox (China)"
tags: [instagram, trading852, plan, hang-seng, china, macro]
category: Trading/Social
type: ig-plan
created: 2026-07-11
updated: 2026-07-11
---

# IG Carousel Plan — The GDP Paradox

**Slug:** `hang-seng-gdp-paradox` · **Type:** market thesis (China) · **Tag:** `MARKET THESIS · CHINA`

> **Validation gate.** Read and validate before any re-render. This deck is already coherent, so the
> plan proposes ONE change (slide 2) and leaves the rest as shipped.

## Diagnosis
The current deck breaks its own thread once: **the cover and slide 2 say the same thing.**
- Cover: "China tripled its GDP. The Hang Seng didn't move." (+ sub: sixteen years, zero price return)
- Slide 2: "One economy tripled. Its stock market stood still."

Slide 2 is the cover reworded. It burns a beat between the hook and the numbers slide (slide 3)
without adding anything. Fix: make slide 2 build the *assumption* the rest of the deck interrogates,
and say nothing about the outcome (the outcome is the cover's job, and slide 3's).

## Through-line (after the fix)
1. The anomaly: GDP tripled, the index did not move.
2. **The reflex:** growth is *why* people buy a market. (new job for slide 2, states the expectation, not the outcome)
3. The numbers: sixteen years, zero price return.
4. The twist: the catalyst everyone waits for already fired.
5. The question: so why is it still priced at a third of the S&P?
6. CTA.

## The 6 slides

| # | Eyebrow | Title (hero) | Subtitle | Status |
|---|---|---|---|---|
| 1 | Market Thesis · China | China tripled its GDP. The Hang Seng didn't move. | Sixteen years, the world's second-largest economy, and zero price return on its benchmark index. | keep |
| 2 | **The reflex** *(was: The numbers)* | **Growth is the first reason anyone buys a market.** | **A bigger economy, bigger profits, a higher index. That is how it is supposed to run.** | **CHANGE** |
| 3 | Sixteen years of tape | *(stat slide: 16 yrs / 0% price return, big figure)* | — | keep |
| 4 | What the consensus missed | The catalyst everyone waits for already fired. | Since 2022 Beijing has ordered record dividends and buybacks by command. The central bank now funds the repurchases itself. | keep |
| 5 | The question | So why is it still priced at a third of the S&P's multiple? | The mandate arrived and the discount held. What the market prices is not what the bears think. | keep |
| 6 | Independent HKEX research | Read the full analysis. | Why the discount survived the catalyst, and the one distinction between the naive bull case and the correct one. On the site. | keep |

**Why the new slide 2 works:** it moves from *the fact* (cover) to *the belief that fact violates*,
without repeating the flat-market outcome. Slide 3's numbers then land as the violation. The reader
now has expectation → evidence → twist, not fact → same fact → evidence.

## Data (confirm before render)
- China GDP ~tripled over the 16-year window; HSI ~0% price return same window. *(from article)*
- HSI priced ~1/3 of the S&P's multiple. *(from article, confirm current)*
- Since 2022: state-directed dividends/buybacks, PBoC-funded repurchase facility. *(from article)*

## Reveal test
After slide 5 the reader knows a catalyst fired and the discount held, but not *why* it held or the
one distinction that separates the naive bull case from the correct one. That gap is the click.

## On validation → render
Fix only slide 2 in `hang-seng-gdp-paradox.html`, keep font sizes/design, then:
`./generate-carousel.command "IG slides/#12-hang-seng-gdp-paradox/hang-seng-gdp-paradox.html" hang-seng-gdp-paradox`
