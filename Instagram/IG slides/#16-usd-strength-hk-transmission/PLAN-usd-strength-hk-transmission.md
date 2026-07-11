---
title: "IG Plan — USD strength / HK transmission (HKD peg)"
tags: [instagram, trading852, plan, hkd-peg, dxy, macro]
category: Trading/Social
type: ig-plan
created: 2026-07-11
updated: 2026-07-11
---

# IG Carousel Plan — USD Strength → HK Transmission

**Slug:** `usd-strength-hk-transmission` · **Type:** macro (no single ticker) · **Tag:** `HKD PEG · DXY`
**Article:** https://trading852.com/analyses/usd-strength-hk-transmission

> **Validation gate.** Dany reads the titles, subtitles and data below and validates BEFORE any
> JPEG is rendered. Nothing gets generated from an unvalidated plan.

---

## The through-line (why one slide leads to the next)

A single rising line, one idea per slide, nothing resolved on the deck:

1. **An anomaly** you can see: a 3% index move with zero local cause.
2. **The cause is foreign:** the number that moved it was American.
3. **Why that is even possible:** a 1983 peg that borrows the Fed's rate.
4. **How big the force is:** the same link took 11% off the index in six months.
5. **What is happening right now:** the dollar just broke a level, open question.
6. **CTA.**

Each slide hands ONE new fact to the next. The deck never says which way HK goes next, or what to
do about it. That call is the reason to open the article, so it stays off the slides.

---

## The 6 slides

### Slide 1 — Cover · the anomaly
- **Eyebrow:** `HONG KONG · USD PEG`
- **Title (hero):** The Hang Seng jumped 3% in one session.
- **Subtitle:** No Hong Kong company reported anything that day.
- **Data:** HSI +3% the session after 3 Jul 2026, on no local news. *(from article, confirm)*
- **Role:** One concrete, visible disconnect. States the anomaly in full, no orphan pronoun, no
  cause, no mechanism.

### Slide 2 — the mover
- **Eyebrow:** `THE MOVER`
- **Title (hero):** The number that moved it was American.
- **Subtitle:** A soft US jobs report, released in Washington. Not a local headline in sight.
- **Data:** US non-farm payrolls / jobs report, 3 Jul 2026. *(from article, confirm the print)*
- **Role:** Names the external cause. Opens the tension: why would a US jobs number move HK stocks?

### Slide 3 — the link
- **Eyebrow:** `THE LINK`
- **Title (hero):** Since 1983, Hong Kong has borrowed the Fed's interest rate.
- **Subtitle:** A currency peg it has never renegotiated. The city cannot set its own rates.
- **Data:** Linked exchange rate system since 1983; HKMA runs a currency board. *(historical fact)*
- **Role:** The structural fact that makes slide 2 possible. States the mechanism exists, without
  explaining the trade or the direction.

### Slide 4 — the cost
- **Eyebrow:** `THE COST`
- **Title (hero):** The same link cut 11% off the Hang Seng in six months.
- **Subtitle:** H1 2026. No local crisis. The dollar, transmitted through the peg.
- **Data:** HSI −11% in H1 2026. *(from article, confirm)*
- **Role:** Scale and stakes. The one-session move was not a fluke, it is a standing force worth
  11% in half a year. Raises the stakes before the forward question.

### Slide 5 — the question
- **Eyebrow:** `THE QUESTION`
- **Title (hero):** The dollar just broke a level that rejected it twice this year.
- **Subtitle:** Hold above it, and the mechanism that just moved the Hang Seng runs again.
- **Data:** DXY broke above ~100.24, a level that capped two prior rallies in 2026.
  *(from article, confirm the level + live DXY before render)*
- **Role:** The only open, forward hook, and it lands last where it belongs. The direction and the
  size of the next move are NOT on the slide. That is the article.

### Slide 6 — closer / CTA
- **Eyebrow:** `INDEPENDENT MACRO RESEARCH`
- **Title (hero):** Analyse complète : lien dans la bio.
- **Subtitle:** The 1983 peg, the dollar chart, and the mechanism that just moved the Hang Seng 3%.
- **Footer:** `@trading.852 · HKD PEG · DXY · trading852.com` + disclaimer.
- **Role:** Fixed CTA, verbatim string with the colon.

---

## What changed vs the current deck (rendered 2026-07-10)

| # | Old | New | Reason |
|---|---|---|---|
| 1 | "No HK company reported anything **that day**" (no referent) | +3% move stated first, "no company reported" demoted to subtitle | The anomaly is now visible on slide 1 instead of hidden behind a pronoun. |
| 2 | "Every HK dollar is backed by US reserves" (reserve backing) | "The number that moved it was American" | Removes the reserve-backing detour that never links to the price move. Keeps the reader on the one thread. |
| 3 | "Hang Seng fell 11%" + "handed a chunk back in one session" | moved to slide 4, split cleanly | Stops the +3% from being re-told sideways. 11% now reads as *scale*, not a second mystery. |
| 4 | "A soft US jobs report moved it" (catalyst + mechanism, thesis delivered) | catalyst pulled up to slide 2, mechanism to slide 3 | The thesis is no longer fully spelled out mid-deck. |
| 5 | "The dollar broke a level" (good, but buried after the reveal) | kept, now the payoff of a clean build | The forward hook lands last, still unresolved. |

**Reveal test:** after slide 5 the reader knows the mechanism exists and that the dollar just broke,
but not which way HK goes next or how far. That gap is the click.

---

## Copy guardrails (checked against every line above)
- No em-dash anywhere. No emojis in the visual. No financial advice (buy / sell / target).
- No verdict, no "because", no valuation, no peer table. Teaser, not summary.
- Every number is tagged with its source status; live DXY re-checked at render time.
- CTA string verbatim: `Analyse complète : lien dans la bio.`

---

## On validation → render
Once Dany approves, generate with:
```bash
cd "…/Trading852-v2/Instagram"
./generate-carousel.command "IG slides/#16-usd-strength-hk-transmission/usd-strength-hk-transmission.html" usd-strength-hk-transmission
```
(the `.html` is re-filled from this plan first, one `<section>` per slide, template unchanged).
