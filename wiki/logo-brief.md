---
title: "Logo brief, Trading852"
tags: [trading852, wiki, design, logo, brand]
category: Trading/Blog
type: design-brief
created: 2026-07-29
updated: 2026-07-29
source: "[design-convention.md](design-convention.md), [publish/styles/base.css](../publish/styles/base.css), [publish/_partials/navbar.html](../publish/_partials/navbar.html)"
---

> Brief to hand to the designer. Everything below is derived from the existing
> [Design Convention](design-convention.md), not from taste. Where the current draft
> conflicts with the charter, the charter wins.

---

## Context the designer needs

Trading852 is a dark-first editorial site: **pure black canvas (`#000`), white type, Space Grotesk**. The logo lives in three places, all of them on black:

| Placement | Current state | Constraint |
|---|---|---|
| Navbar | live HTML text, Space Grotesk 700, `letter-spacing: -0.03em`, `1.125rem` | cap height ≈ 13px on desktop |
| Favicon | crude SVG, Helvetica "T852", black on white | must read at **32×32** and 16×16 |
| Social cover | 1200×630 generated card, wordmark bottom-left, `TRADING852` in caps | sits on `#000`, next to a `#56d49f` rule |

There is no logo image file in the repo today. The charter references `logo-trading852.svg`; it does not exist. This brief is what fills that gap.

---

## What is wrong with the current draft

**1. The navy field.** The site canvas is `#000`, not navy. A navy square dropped into the navbar or the social cover shows as a visible rectangle against black. Deliver on **transparent background**, and design the mark so it holds on pure black.

**2. The gold is already taken.** `#d97706` amber/gold is the **regime gauge "transition" state** on the live site (convexity and gold trackers). The charter's rule is explicit: decorative color must not drift toward semantic hexes, because a reader who sees gold near a number reads it as a data state. A gold skyline puts the identity into the same family as a live indicator.

**3. Wrong typeface.** The charter assigns Space Grotesk to "UI, headings, **logo**". The navbar renders `Trading852` as live text in Space Grotesk 700. An image wordmark in a different geometric sans, sitting inches from that text, clashes on every page.

**4. The skyline sits under the type.** Building silhouettes cut through the word "Trading". At navbar size the skyline collapses to noise; at 32px favicon it is unreadable. Type and mark must be separable.

Two secondary issues: the "852" is set far larger than "Trading", so the eye reads "852" first, while the site's own wordmark is one word at one size. And the 1:1 square gives no horizontal lockup, which is the only shape the navbar can use.

---

## Palette the designer must work from

```
--dp-c-black      #000       page background, header, footer
--dp-c-white      #fff       primary type
--dp-c-gray-2     #5b6478    secondary type
```

**Brand glow (the closest thing to a brand color):** blue-violet `#4760ff` / `#1806ff`, cyan `#77f6ff`. Used only as a low-opacity radial gradient fading to transparent (alpha 0.06–0.28), never as a flat fill.

**Off-limits, all semantic:** `#56d49f` and `#ff6d70` (price deltas), `#d97706` / `#16a34a` / `#dc2626` (regime gauges), the scorecard greens and reds.

**The sanctioned Hong Kong reference:** `#DE2910`, HK flag red. The charter already answers "how do we nod to Hong Kong" and the answer is not a skyline — it is this red, used at most once per page, in a non-data context: *a hairline underline on the wordmark, a small marker beside an HK tag, a favicon detail*. Never as a fill, never near a number. If the mark needs a Hong Kong signal, this is where it comes from.

---

## What to deliver

- **Horizontal lockup** — primary. Sized to sit at 13px cap height without loss.
- **Stacked lockup** — for the social cover and square contexts.
- **Mark alone** — favicon and social avatar. Must survive 16×16.
- All three as **SVG, transparent background**, plus PNG at 32, 180, 512.

Set the wordmark in **Space Grotesk 700 at `letter-spacing: -0.03em`** so the image and the live navbar text are indistinguishable. One word, `Trading852`, one size — no size break between the letters and the numerals.

Proof required before sign-off: a single sheet showing the mark on `#000` at 16px, 32px, and navbar scale, alongside the live navbar text for direct comparison.

---

## If the skyline stays

Only one Hong Kong silhouette is recognizable without a caption: the **Bank of China Tower**, from its triangulated bracing. A generic cluster of towers reads as "a city", which is worth nothing. Either commit to one identifiable form used as a geometric mark, or drop the skyline and let the wordmark plus a single HK-red detail carry the identity.

Recommendation: drop it. The site is typographic, the covers are typographic, and a detailed illustration is the one element that cannot survive 16 pixels.
