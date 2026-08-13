---
title: "Content Ideas – Trading852 v2"
tags:
  - seo
  - content-calendar
  - audit
category: Trading/Blog
type: audit
created: 2026-08-09
updated: 2026-08-09
---

# Content Ideas. Trading852 v2. 2026-08-09.

Frontend audit of `trading852.com` (homepage + all 19 published analyses + 7 sector hubs) cross-checked against [strategy.md](strategy.md), [content-calendar.md](content-calendar.md), and [competitor-analysis.md](competitor-analysis.md). Purpose: confirm what the site is actually positioned to rank for today, flag a concrete gap found while checking, then propose new content.

## What the site is trying to rank for

Positioning per [strategy.md](strategy.md): the only free, English-language, HKEX-specific site combining investment thesis with filing-grounded valuation (SOTP, NAV discount). Two keyword shapes:

- **Long-tail, high-intent**: `{company name} stock analysis` / `{company name} undervalued`, one page per ticker
- **Broader informational**: `hong kong undervalued stocks`, `NAV discount hong kong`, `HKEX conglomerate discount`, served by thesis pieces and sector hubs, never by "how-to" methodology pages (locked May 2026, the SOTP/NAV method itself stays unpublished)

19 tickers/theses are live: Dickson Concepts, HSI, Prada, Jacobio, Yadea, Alibaba, Haier, Tencent Music, SPY, Midea, Galaxy, Tencent, 361 Degrees, Chery Auto, plus 5 macro/thesis pieces (HK discount, Hang Seng/GDP, gold regime, rate convexity, USD/peg). 7 sector hubs group them.

## Finding: 4 published articles are missing from their own sector hub

Checked hub source files (`publish/analyses/*.html`) against publish dates. The hubs are hand-curated, not auto-generated from tags, and haven't been touched since they were tagged live:

| Hub | Last edited | Missing article (tagged for this sector on the homepage, published after the hub's last edit) |
|---|---|---|
| `consumer-discretionary.html` | Jun 2 | Galaxy (Jul 13, tagged Consumer Discretionary), 361 Degrees (Jun 29) |
| `electric-vehicles.html` | Jun 22 | Chery Auto (Jul 27) — the hub's only article is still Yadea |

This is not a new-content idea, it is a same-day fix: add the missing `<a>` links to those two hub files and rebuild. Cheap, and it directly answers the GSC audit's open question ([gsc-audit-2026-08-09.md](gsc-audit-2026-08-09.md)) about why some pages sit "discovered, not indexed" — a hub that stops updating reads as thin/stale to Google, and the EV hub currently doesn't even link its own flagship article.

## New content: highest priority (zero of these ever shipped, still open per your own gap analysis)

[strategy.md](strategy.md) and [content-calendar.md](content-calendar.md) named these HK conglomerate NAV-discount names as Tier-1, "Very Low" competition back in April/May. None are published four months later — this is the single biggest gap between plan and output:

- CK Hutchison (0001.HK) — ports deal, book discount
- Hongkong Land (0101.HK) — NAV discount, Central office occupancy
- Great Eagle Holdings (0041.HK) — self-disclosed NAV discount
- Jardine Matheson (0104.HK) — conglomerate discount
- Swire Pacific (0019.HK) — P/B below 0.3x
- CITIC Ltd (0267.HK) — conglomerate discount

These are exactly the site's stated moat (independent, filing-grounded, free) against exactly the gap the competitor analysis found (nobody else owns this angle). Pick the one with a live 2026 catalyst first, before working down the list in publish order.

## New content: thesis pieces named in the calendar, never written

- **"The Conglomerate Discount: Why It Exists and When It Closes"** — targets `hong kong conglomerate discount`, marked Low competition. Becomes the natural internal-link hub for the six tickers above once they exist.
- **"Stock Connect and the New Buyer"** (southbound flows) — targets `stock connect southbound flows 2026`, Low-Medium competition, timely given 2026 southbound volumes.

## New content: linkable assets (named in the calendar's Phase 3, still unbuilt)

The site's own risk section says low domain authority is the real ceiling, not competition — the GSC audit confirms it (8 of 26 pages sit unindexed with no technical fault found). A backlink-worthy reference asset does more for indexation than another single-ticker article:

- **"Historical HK Privatisations 2000–2026"** — a table of every HKEX privatisation, trigger, and realized return. No equivalent free resource exists; this is the kind of page Webb-site-adjacent readers and finance Twitter link to.
- **"HKEX Conglomerate NAV Dashboard"** — live discount-to-NAV table across the six names above, once those articles exist. Turns six standalone articles into one linkable, updating reference page.

## New content: fill the thinnest sector hubs before adding new sectors

Biotech and Electric Vehicles each carry exactly one company. A sector hub with one article reads as a stub to both users and Google. Before starting a new sector, add a second name to each:

- **Biotech**: a second HK-listed biotech with a specific catalyst (licensing deal, trial readout), same treatment as Jacobio
- **Electric Vehicles**: a second HK-listed EV/auto name to sit alongside Chery Auto (BYD and Geely are already used as comparables inside the Chery piece — a direct analysis of either completes the internal-linking loop)

## What to check before committing writing time

Every volume figure in [strategy.md](strategy.md) is a directional estimate, not verified via Search Console or Keyword Planner. Before prioritizing beyond "which of the six conglomerates has a live catalyst," pull actual query data from GSC (Performance report, not just the indexing report used in the Aug 9 audit) — it will show which existing pages already get impressions for adjacent unrigged keywords, which is a stronger signal than the April estimates.

---
[SEO hub](index.md) · [Wiki index](../index.md)
