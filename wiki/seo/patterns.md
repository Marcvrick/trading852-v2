---
title: "Trading852 v2, SEO"
tags: [trading852, wiki, seo]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-24
---

# Trading852 v2, SEO

Part of the [Trading852 wiki](../index.md).

## SEO pattern (mandatory for all ticker analyses)

Locked May 2026 after applying it to the 8 published articles. Reference template: any DRAFT with the `-SEO-OPTIMIZED.html` suffix in [DRAFT/](../../DRAFT/), canonical example is `DRAFT/1913-prada-SEO-OPTIMIZED.html`.

### CONFIG block

| Field | Rule |
|---|---|
| `title` | **≤ 60 chars total** (Google clips around 580px ≈ 55–60 chars on desktop). Format: `{Name} ({Ticker}.HK) Stock Analysis: {compact hook}`. **No ` · Trading852` suffix**: brand sits in `og:site_name` and the schema `publisher`, dropping it from the title is free SEO. Primary keyword "Stock Analysis" appears early. |
| `ogTitle` | Keeps the editorial hook intact: no `Stock Analysis` keyword. This is what shows on social cards; voice wins over search. |
| `description` | 150–165 chars. Opens with `{Name} ({Ticker}.HK) stock analysis:` then the arithmetic + main long-tail. |
| `canonical`, `ogType`, `ogImage`, `pubDate` | Unchanged from the standard CONFIG rules above. |

### JSONLD block

Standard fields stay (`headline`, `author`, `publisher`, `mainEntityOfPage`, `about`, `datePublished`, `dateModified`). **Add these six**:

| Field | Value |
|---|---|
| `image` | `"https://trading852.com/assets/og-image.png"` (Google explicitly recommends this on `Article`) |
| `inLanguage` | `"en"` |
| `wordCount` | Rounded to nearest 100 |
| `articleSection` | Matches the sector hub: `"Luxury"`, `"Technology"`, `"Biotech"`, `"Consumer Discretionary"`, `"Electric Vehicles"`, `"Special Situations"`, `"Market Thesis"` |
| `isPartOf` | `CollectionPage` object pointing to `https://trading852.com/analyses/{sector}` |
| `keywords` | Comma-separated. Must include: `{Name} stock analysis`, `{Ticker}.HK`, `{name} thesis 2026`. Plus 3–5 article-specific long-tails (e.g. `{name} vs {peer}`, `{catalyst} explained`, etc.) |

> **`dateModified` semantics.** `datePublished` is locked to the original publication date and never changes. `dateModified` must be bumped to the **actual** date a meaningful update was made, not just SEO refreshes (re-titling, schema enrichment, H2 changes), but also factual corrections, post-earnings updates, and price-target revisions. Stale `dateModified` on a page that *did* change suppresses Google re-crawl frequency and weakens YMYL freshness signals. Bump it. Bump the matching sitemap `lastmod` at the same time (see Step 6).

### BreadcrumbList JSON-LD (automatic: no per-article work)

`build.js` extracts the in-body `<div class="article-breadcrumb">` of every article (any page with `layout: article` and a breadcrumb element) and emits a `BreadcrumbList` JSON-LD block in the `<head>`. The leaf item is the article's `ogTitle` (falling back to `title`). Category hub pages and the homepage correctly skip it.

Implication for new articles: keep the standard breadcrumb pattern (`<a href="/">Trading852</a> &nbsp;/&nbsp; Research &nbsp;/&nbsp; <a href="/analyses/{sector}">{Sector}</a>`) and the schema is generated for free. The sector hub URL referenced in the breadcrumb must be live before publish (same rule as `isPartOf`).

### Body

| Element | Rule |
|---|---|
| H1 + subtitle | Never modified for SEO. Editorial integrity wins. |
| H2s | At least one H2 must include the entity name. Format: `Why {Company} Trades at a Discount` and/or `What {Company} Is Actually Worth`. Avoid generic H2s like `What the Company Is Worth` or `Why the Discount Exists`: they leave SEO weight on the table. |
| Risk callout labels | Use `<h3 class="risk-callout__label">` (not `<div>`). Same visual styling, but the H3 is parseable by Google's passage-extraction and helps AI summarisers attribute risks to the correct section. |
| `What {Company} Does` first paragraph | Must explicitly state `{Name} ({Ticker}.HK)` and the HKEX listing context. This is the canonical entity-establishment paragraph for Google + AI extractors. |
| Inline link | At least one inline link from the body to the article's sector hub (`/analyses/{sector}`). Anchor text = a natural noun phrase (e.g. `luxury sector`, `electric two-wheeler`, `biotechs`, `negative enterprise value`). |

### What never changes for SEO

- Numbers, tables, scenarios, risk callouts, sources
- Editorial voice and 7-section structure
- Disclaimer paragraph and price targets
- Update notice block (if any)

### Workflow when writing a new article

1. Write the article with the editorial voice and 7-section structure as usual.
2. Apply the SEO pattern above as the **last step before publishing**.
3. Diff against `DRAFT/1913-prada-SEO-OPTIMIZED.html` to verify pattern compliance.
4. Pre-publish checklist below covers the SEO line items.

---


## SEO checklist (every page)

The `head.html` partial already wires most of this, confirm the `CONFIG` block is complete:

- [ ] `canonical` is absolute, self-referencing, no `.html`
- [ ] RSS autodiscovery (`<link rel="alternate" type="application/rss+xml">`): already in `head.html`
- [ ] Twitter card + og:* tags: driven by `ogTitle` / `description` / `ogImage`
- [ ] JSON-LD block present (`Article` for analyses, `WebSite` for index)
- [ ] BreadcrumbList JSON-LD: emitted automatically by `build.js` from the in-body breadcrumb; verify the breadcrumb HTML pattern is intact
- [ ] Images: `width` + `height` + `alt`, lazy below the fold

### Ticker analyses (additional: see SEO pattern above)

- [ ] `title` ≤ 60 chars, opens with `{Name} ({Ticker}.HK) Stock Analysis:`, **no ` · Trading852` suffix**
- [ ] `description` 150–165 chars, opens with `{Name} ({Ticker}.HK) stock analysis:`
- [ ] JSONLD has `image`, `inLanguage`, `wordCount`, `articleSection`, `isPartOf` (sector hub `CollectionPage`), expanded `keywords`
- [ ] Sector hub URL referenced by `isPartOf` and inline link must be live before publish
- [ ] At least one H2 contains the entity name (e.g. `What {Company} Is Actually Worth`, `Why {Company} Trades at a Discount`)
- [ ] First paragraph of `What {Company} Does` establishes ticker + HKEX listing context
- [ ] Risk callout labels use `<h3 class="risk-callout__label">`, not `<div>`
- [ ] At least one inline link from body to a sector hub (`/analyses/{sector}`)

---


---
[Wiki index](../index.md)
