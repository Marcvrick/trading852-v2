---
title: "Design Convention, Trading852 v2"
tags: [trading852, wiki, design, visual-style, colors, css]
category: Trading/Blog
type: design-convention
created: 2026-07-02
updated: 2026-07-02
source: "[publish/styles/](../publish/styles/), [logo-trading852.svg](../logo-trading852.svg)"
---

> **Scope:** visual/CSS convention only, colors, type, layout mood. For writing voice and article structure see [Style guide](style-guide.md) and [Editorial](editorial.md).

---

## Visual principle

Dark-first, editorial-financial. Black canvas, white type, one serif/sans pairing, and a small set of soft blue-violet/cyan gradients used only as ambient background glow, never as flat fill. Data (price moves, gauges, scorecard rows) gets its own semantic green/red, kept separate from the brand gradient palette so a reader never confuses "brand decoration" with "this number is negative."

The look reads as a research desk at night, not a marketing landing page: no bright flat blocks, no saturated CTAs. Color is almost always low-opacity (rgba with 0.05-0.3 alpha) laid over black or white, not a solid hex fill.

## Typography

| Role | Family | Source |
|---|---|---|
| Sans (UI, headings, logo) | `Space Grotesk` | [fonts/](../fonts/) (400, 700 woff2, self-hosted) |
| Serif (article body) | `Lora` | fallback stack: Warnock Pro, Goudy Old Style, Palatino, Georgia |

Fallback stacks always end in system serif/sans, no FOUT-sensitive single-font declarations.

## Core palette

Defined once in [publish/styles/base.css](../publish/styles/base.css) as CSS custom properties, reused everywhere else.

| Token | Hex | Use |
|---|---|---|
| `--dp-c-black` | `#000` | page background, header, footer |
| `--dp-c-white` | `#fff` | primary text on black |
| `--dp-c-gray-2` | `#5b6478` | secondary text |
| `--dp-c-gray-border` | `#d6d5db` | hairline borders on light sections |
| `--dp-c-gray-pale` | `#eff0f5` | light-section background |
| `--dp-c-periwinkle` | `#d6d5dbcc` | header border-bottom on light scroll state |

White is also used at reduced opacity for hierarchy instead of separate gray tokens: `rgba(255,255,255,0.85/0.75/0.6/0.55/0.5/0.4)` for nav links, footer text, and secondary labels, darkest-to-faintest as importance drops.

## Brand gradient (hero/logo only)

Ambient, never solid. Used on the homepage hero background and the logo mark, always as a radial gradient fading to transparent over black.

| Color | Hex | Role |
|---|---|---|
| Blue-violet | `#4760ff` / `#1806ff` | large ellipse, top-center, primary brand glow |
| Cyan | `#77f6ff` | small ellipse, top-right accent |

Opacity stays low (0.06-0.28) so it reads as atmosphere, not a colored panel. This gradient pair is the closest thing the site has to a "brand color" and should not be reused for data or semantic states.

## Semantic data colors (price/performance)

Separate system, financial convention (green = up/good, red = down/bad). Used in the scorecard, convexity/gold gauges, and inline data tables. Do not borrow these for decoration, and do not let decorative color drift toward these hexes, a reader's eye reads red near a number as "loss."

| Token | Hex | Use |
|---|---|---|
| `--pos` | `#56d49f` | positive delta (base) |
| `--neg` | `#ff6d70` | negative delta (base) |
| pos (scorecard) | `#0f9d66` / `#17926a` | scorecard pos rows, HSI quote up |
| neg (scorecard) | `#c93338` / `#b91e23` / `#d83a3d` | scorecard neg rows, stopped-out row background `#fdf3f3`/`#fbe9e9`, HSI quote down |
| neg badge | `#ffe2e3` bg / `#b91e23` text, border `#f3b7ba` | scorecard status pill |
| benchmark row | `#dadada` / `#cecece` (hover) | neutral comparison row |

## Regime/gauge accent (gold + convexity trackers)

A third, separate accent family for the two live regime gauges, amber for "transition," green for "positive," red for "negative," each with a matching low-alpha soft fill:

| State | Hex | Soft fill |
|---|---|---|
| Transition (default) | `#d97706` | `rgba(217,119,6,0.08)` |
| Positive | `#16a34a` | `rgba(22,163,74,0.08)` |
| Negative | `#dc2626` | `rgba(220,38,38,0.08)` |

Article callouts (warning boxes) reuse the amber: border `#b45309`, background `#fffbeb`.

## One-off UI accents

- SPY-zone card (homepage): border `rgba(255,150,60,0.85)` normal, `rgba(255,90,90,0.9)` when price is in-zone; focus background `#9a4b12` / `#4f1116`.
- HSI quote widget: ticker/meta grays `#aaa` / `#8a8a90` / `#a0a0a6`, label `#444`, up `#17926a`, down `#d83a3d`.

---

## HK flag red, the "small touch" accent

**Hex:** `#DE2910` (the commonly cited web hex for the Hong Kong/PRC flag red; treat as approximate, flag-red hex values vary slightly by source, this is the standard one).

**Purpose:** a quiet, recognizable nod to Hong Kong, the site's core market, without turning the page into a flag. It is a *brand/identity* accent, not a data color.

**Rule: use it rarely and only in non-data contexts.**

- Do: a single small element per page at most, a hairline underline on the wordmark, a tiny dot/marker next to an "HK" tag or badge, a thin accent rule above an HK-specific section header, a favicon or share-image detail.
- Do not: use it as a background fill, a button/CTA color, a large block, or anywhere near a price, percentage, or scorecard row. It sits too close to the existing `--neg` red family (`#ff6d70`, `#c93338`, `#b91e23`, `#d83a3d`) and would read as "this is negative" instead of "this is Hong Kong."
- Do not: pair it with the brand gradient blue-violet/cyan in the same element, keep the HK red isolated as its own single accent, not part of a multi-color scheme.
- If in doubt, leave it out. The default state of any given page should have zero HK red on it; it appears only where an editor deliberately placed it.

Suggested implementation when it is used: a CSS variable alongside the others in `base.css`,

```css
--hk-red: #de2910;
```

introduced at the point of first real use rather than pre-wired everywhere, so it stays intentional.
