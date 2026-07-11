---
title: "IG Plan — Rate convexity (HK rate regime)"
tags: [instagram, trading852, plan, hang-seng, rates, macro]
category: Trading/Social
type: ig-plan
created: 2026-07-11
updated: 2026-07-11
---

# IG Carousel Plan — Rate Convexity

**Slug:** `rate-convexity` · **Type:** macro (HK rate regime) · **Tag:** `HONG KONG · RATE REGIME`

> **Validation gate.** Read and validate before any re-render. Deck is coherent; the plan proposes
> ONE change (slide 2) and keeps the rest.

## Diagnosis
Same single break as #12: **cover and slide 2 restate each other.**
- Cover: "Half the Hang Seng moves on a rate Hong Kong doesn't set." (+ sub: 40% financials, HK can't set rates)
- Slide 2: "The Hang Seng is built on a sector it can't control."

Both say *the index depends on a rate/sector HK can't control.* Slide 2 adds no new beat. Fix: turn
slide 2 into the *reader's stake* (you are positioned on this whether you meant to be or not), which
advances the thread and does NOT spoil the Fed/peg reveal that belongs to slide 4.

## Through-line (after the fix)
1. The anomaly: half the index rides a rate HK does not set.
2. **Your position:** hold the index, and you are taking that bet too. (new job for slide 2)
3. The tape: six-month proof it moved on that rate.
4. The hidden cause: the rate was set in Washington, via the peg.
5. The question: so which way is the wind blowing now?
6. CTA.

## The 6 slides

| # | Eyebrow | Title (hero) | Subtitle | Status |
|---|---|---|---|---|
| 1 | Hong Kong · Rate Regime | Half the Hang Seng moves on a rate Hong Kong doesn't set. | Forty percent of the index is financial stocks. And Hong Kong cannot set its own interest rates. | keep |
| 2 | **The position** *(was: The structure)* | **Hold the index, and you are taking that bet too.** | *(no subtitle: keeps the 40% / 13% / 7.80 stat block)* | **DONE** |
| 3 | Then, the tape | *(stat slide: six-month proof in the tape)* | — | keep |
| 4 | The reason you can't see it | The rate that moved them was set in Washington. Not in Central. | The dollar peg forces Hong Kong to follow the Fed. The force driving half the index is one no local chart can show. | keep |
| 5 | The question | So which way is the wind blowing right now? | **Half the Hang Seng turns on this regime. There is a live way to read it.** | **CHANGE (neutral voice)** |
| 6 | Independent HKEX research | Read the full analysis. | The live regime tracker, the six-month proof in the tape, and how to use it as a filter. On the site. | keep |

**Why the new slide 2 works:** it moves from *the structural fact* (cover) to *what it means for
anyone holding the index* (slide 2), a genuine next beat, and it stops short of naming the Fed so
slide 4's reveal still lands.

**Neutral-voice fix (slides 2 and 5):** both originals leaned on an unnamed crowd ("most who own",
"most traders are long ... without knowing the regime"). We never surveyed those traders, so we do
not speak for them. Rewritten to state our own read directly: slide 2 addresses the reader ("you"),
slide 5 states the fact ("half the Hang Seng turns on this regime") and keeps the tease. See
[[feedback_no_unnamed_crowd_voice]].

## Data (confirm before render)
- Financials ≈ 40% of the HSI. *(from article, confirm current index weight)*
- Six-month tape proof of rate-driven moves. *(from article)*
- Linked exchange rate → HK follows the Fed. *(historical fact)*

## Reveal test
After slide 5 the reader knows the index is a hidden rate bet and that a live way to read it exists,
but not the current read or how to use it as a filter. That gap is the click.

## On validation → render
Fix only slide 2 in `rate-convexity.html`, keep font sizes/design, then:
`./generate-carousel.command "IG slides/#14-rate-convexity/rate-convexity.html" rate-convexity`
