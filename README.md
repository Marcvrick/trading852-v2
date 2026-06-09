---
title: "Trading852 v2, Build Pipeline + Editorial Workflow"
tags:
  - readme
  - blog
  - workflow
  - hk-stocks
  - static-site
category: Trading/Blog
type: readme
created: 2026-04-26
updated: 2026-06-03
---

# Trading852 v2: Build Pipeline + Editorial Workflow

Static site for conviction-led HK stock analyses and market thesis articles. Source pages live in [src/](src/), get assembled into [dist/](dist/) by [build.js](build.js), and Vercel serves `dist/`.

Live site: [trading852.com](https://trading852.com)
GitHub: [Marcvrick/trading852.com](https://github.com/Marcvrick/trading852.com)

Editorial + SEO references live in [instructions/](instructions/):
- [blog-style-guide.md](instructions/blog-style-guide.md): voice, structure, the 7 canonical sections, what to never write
- [seo/SEO-STRATEGY.md](instructions/seo/SEO-STRATEGY.md): overall positioning + keyword targets
- [seo/SITE-STRUCTURE.md](instructions/seo/SITE-STRUCTURE.md): URL architecture, internal linking
- [seo/CONTENT-CALENDAR.md](instructions/seo/CONTENT-CALENDAR.md): pipeline of upcoming articles
- [seo/COMPETITOR-ANALYSIS.md](instructions/seo/COMPETITOR-ANALYSIS.md): market gap mapping
- [seo/IMPLEMENTATION-ROADMAP.md](instructions/seo/IMPLEMENTATION-ROADMAP.md): staged delivery plan

---

## What changed vs v1

v1 was flat HTML, every page duplicated the `<head>`, navbar, and footer. A single nav link change required edits in 13 files.

v2 splits the site into:
- **Source pages** ([src/](src/)): body content + a `<!-- CONFIG -->` frontmatter comment. **No `<head>`. No navbar. No footer.**
- **Partials** ([src/_partials/](src/_partials/)): single source of truth for `<head>`, navbar, footer variants, scroll script.
- **Build script** ([build.js](build.js)): zero-dependency Node.js. Reads each source file, parses its `CONFIG` + `JSONLD` blocks, injects partials, writes the assembled HTML to `dist/`.
- **Vercel**: runs `node build.js` on push, serves `dist/`.

One nav link change = one edit in [src/_partials/navbar.html](src/_partials/navbar.html) → propagates everywhere on next build.

---

## Folder structure

```
Trading852-v2/
├── build.js                    ← Build script (Node, zero deps)
├── vercel.json                 ← buildCommand + cleanUrls + rewrites + headers
├── README.md
│
├── instructions/               ← Editorial + SEO reference docs (NOT served)
│   ├── blog-style-guide.md        Voice, structure, 7-section template, what to never write
│   └── seo/
│       ├── SEO-STRATEGY.md         Positioning + keyword targets
│       ├── SITE-STRUCTURE.md       URL architecture + internal linking
│       ├── CONTENT-CALENDAR.md     Pipeline of upcoming articles
│       ├── COMPETITOR-ANALYSIS.md  Market gap mapping
│       └── IMPLEMENTATION-ROADMAP.md Staged delivery plan
│
├── assets/                     ← Static assets copied as-is to dist/assets/
│   ├── favicon-32.png
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png
│   └── scorecard.js               Live HK price fetcher (Yahoo proxy)
│
├── src/
│   ├── _partials/              ← Shared HTML fragments (NOT served)
│   │   ├── head.html              <head> with {{TITLE}}, {{OG_*}}, {{JSONLD}} tokens
│   │   ├── navbar.html            Header nav, used on every page
│   │   ├── footer-analysis.html   Footer for article pages
│   │   ├── footer-home.html       Footer for index + scorecard
│   │   ├── footer-static.html     Footer for about/disclaimer/legal-notice
│   │   └── scroll-script.html     Inline scroll behavior script
│   │
│   ├── styles/                 ← CSS, copied to dist/styles/
│   │   ├── base.css               Loaded on every page
│   │   ├── article.css            layout: article
│   │   ├── index.css              layout: index
│   │   ├── page.css               layout: static
│   │   └── scorecard.css          layout: scorecard
│   │
│   ├── index.html              ← Homepage (layout: index)
│   ├── feed.xml                ← RSS feed (copied as-is)
│   ├── favicon.ico             ← Root favicon (copied to dist/favicon.ico, required by Google + GSC, not just /assets/)
│   │
│   ├── analyses/               ← Published articles (layout: article)
│   │   ├── *.html
│   │   └── images/                Article-specific images, copied as-is
│   │
│   ├── drafts/                 ← Pending articles, NOT linked from homepage
│   │
│   └── static/                 ← Cold pages served via vercel rewrites
│       ├── about.html             → trading852.com/about
│       ├── scorecard.html         → trading852.com/scorecard
│       ├── disclaimer.html        → trading852.com/disclaimer
│       ├── legal-notice.html      → trading852.com/legal-notice
│       ├── robots.txt             → trading852.com/robots.txt
│       └── sitemap.xml            → trading852.com/sitemap.xml
│
├── TO DO/                      ← Pending engineering tasks (not served, not built)
│   └── per-article-og-images.md   Spec for unique OG images per article (highest social CTR move)
│
└── dist/                       ← Build output. Do NOT edit. Do NOT commit changes here manually.
```

---

## Build

```bash
cd "TRADING/Trading852-v2"
node build.js
```

Output: `Built N HTML pages, copied M files → dist/`.

The script:
1. Wipes `dist/` and recreates it.
2. Copies `assets/` → `dist/assets/`.
3. Walks `src/` (skipping `_partials` and any name starting with `_` or `.`).
4. For every `.html` source file: parses `CONFIG` + `JSONLD` blocks, picks the right CSS files based on `layout`, assembles `<head>` + navbar + body + footer + scroll script.
5. For every non-HTML file: copies as-is, preserving the relative path. **This is how images travel into `dist/`**: drop a file under `src/analyses/images/` and it shows up at `/analyses/images/...` on the live site.
6. Generates the scorecard positions from the published articles and writes `dist/assets/scorecard-recos.json` (see "Scorecard" below). Prints `Scorecard: N stock positions + 1 benchmark generated`.

No npm install, no node_modules, no watcher. Pure `fs` + `path`.

---

## Source page format

Every page in `src/` (except `_partials/`) follows the same structure:

```html
<!-- CONFIG {
  "layout": "article",
  "title": "Page Title · Trading852",
  "ogTitle": "Page Title",
  "description": "One-sentence meta description.",
  "canonical": "https://trading852.com/analyses/slug",
  "ogType": "article",
  "ogImage": "https://trading852.com/assets/og-image.png",
  "pubDate": "2026-04-11"
} -->

<!-- JSONLD {
  "@context": "https://schema.org",
  "@type": "Article",
  ...
} -->

<!-- ══ ARTICLE HERO ══ -->
<div class="article-hero">
  ...
</div>

<!-- body content only: NO <head>, NO <body>, NO navbar, NO footer -->
```

### CONFIG fields

| Key | Required | Notes |
|---|---|---|
| `layout` | yes | `article` · `index` · `static` · `scorecard`: drives CSS + footer + nav variant |
| `title` | yes | Full `<title>`. Static pages keep the ` · Trading852` suffix; **ticker analyses drop it**: see SEO pattern below (brand sits in `og:site_name`). |
| `ogTitle` | yes | Open Graph + Twitter title (no suffix) |
| `description` | yes | `<meta name="description">` + OG/Twitter description |
| `canonical` | yes | Absolute URL, no `.html` (cleanUrls is on) |
| `ogType` | yes | `article` for analyses, `website` for static pages |
| `ogImage` | yes | Absolute URL |
| `pubDate` | articles only | `YYYY-MM-DD`: drives `<meta property="article:published_time">` |
| `scorecardName` | optional | Short display name for the scorecard (e.g. `Midea Group`). Defaults to a cleaned `about.name` if omitted. See Scorecard. |
| `scorecardEntryDate` | optional | `YYYY-MM-DD`: scorecard entry date when it differs from `pubDate` (e.g. the Apr-10 inaugural issue). Defaults to `pubDate`. |

### JSONLD

Optional. If present, the inner JSON is wrapped in `<script type="application/ld+json">` and injected into `<head>`. Use `Article` schema for analyses, `WebSite` for the homepage.

### Layouts → CSS map

| Layout | CSS files | Footer | Nav theme |
|---|---|---|---|
| `article` | base + article | `footer-analysis` | dark |
| `index` | base + index | `footer-home` | scrolls-light |
| `static` | base + page | `footer-static` | dark |
| `scorecard` | base + scorecard | `footer-home` | scrolls-light |

---

## SEO pattern (mandatory for all ticker analyses)

Locked May 2026 after applying it to the 8 published articles. Reference template: any DRAFT with the `-SEO-OPTIMIZED.html` suffix in [DRAFT/](DRAFT/), canonical example is `DRAFT/1913-prada-SEO-OPTIMIZED.html`.

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

## Images convention (important)

Article images go in `src/analyses/images/<slug>.jpg`. The build copies them as-is to `dist/analyses/images/<slug>.jpg`.

In the article HTML, reference them with a **relative** path so the link works both in local preview and in production:

```html
<img src="images/hsi-35y-trendline.jpg" alt="..." width="1280" height="517" loading="lazy" decoding="async" />
```

Always set `width`, `height`, `alt`. Below-fold images get `loading="lazy" decoding="async"`.

> Bug we hit on Apr 26 2026: `hsi-35-year-trendline.html` referenced `images/hsi-35y-trendline.jpg` but `src/analyses/images/` did not exist in v2 (was never migrated from v1). The image returned the alt text on the live site. Fix: drop the .jpg into `src/analyses/images/` and rebuild.

---

## Vercel deployment

[vercel.json](vercel.json) settings:

- `buildCommand: "node build.js"`: Vercel runs the build on every push.
- `outputDirectory: "dist"`: Vercel serves the build output, not `src/`.
- `installCommand: ""`: no npm install (zero-dep build).
- `cleanUrls: true`: `.html` is stripped from URLs. **Rewrite destinations and canonicals must NOT include `.html`**.
- `trailingSlash: false`.

### Rewrite gotcha

```json
✅ { "source": "/scorecard", "destination": "/static/scorecard" }
❌ { "source": "/scorecard", "destination": "/static/scorecard.html" }   // 404 with cleanUrls
```

### Footer / internal links: absolute paths only

Relative paths like `about.html` break under cleanUrls. Always use `/about`, `/disclaimer`, `/legal-notice`, etc.

### Security headers

Set globally in `vercel.json`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## Editorial workflow

### Step 1: Find the source material

Stock analyses: look up the ticker in `TRADING/Trading-research/HK Stocks/Experts analysis/`. Folder pattern: `{TICKER} - {Company} - {CONVICTION|MONITOR|AVOID}`. The verdict is whatever the expert analysis returns (`CONVICTION`, `MONITOR`, or `AVOID`). All three publish; the label drives how the article is framed and how it surfaces on the homepage, the sector hub eyebrow, the scorecard eyebrow, and the meta-verdict pill. Apply the verdict consistently across all four surfaces from day one.

Market thesis articles: source `.md` lives outside the repo (e.g. `TRADING/Trading852/BD/Briefs-ChatGPT/`).

### Step 2: Read the style guide

Open the local style guide at [instructions/blog-style-guide.md](instructions/blog-style-guide.md) and the voice guide at [../../Voix Marc/VOIX-Marc.md](../../Voix%20Marc/VOIX-Marc.md). Key rules:

- **7 canonical sections**: Hook → Company/Context → Discount → Catalyst → Valuation → Risks → Decision
- **No bullet points** in the body (except numbered catalyst points and scenario tables)
- **No superlatifs**, no conditional mou, no disclaimers
- **Numbers always precise**: `HKD 2 354 millions`, `+14 %`, never "environ"
- **Title formula**: `[Subject]: [Concrete arithmetic fact that surprises]`
- **Target length**: 1 000–1 400 words (ideal ~1 200)
- **Marc's voice**: accessible, direct, "montrer sans dire"

### Step 3: Article structure

| # | Section | Words |
|---|---|---|
| 1 | Hook (no header) | 80–120 |
| 2 | What the company/market does | 120–180 |
| 3 | Why the discount exists | 100–150 |
| 4 | Catalyst / main signal | 200–280 |
| 5 | Valuation (with table) | 150–200 |
| 6 | Risks (2 max, named in bold) | 180–250 |
| 7 | Decision (with scenario table) | 180–250 |

### Step 4: Create the source file

Stock analysis: copy `src/analyses/1913-prada.html`. Market thesis: copy `src/analyses/hsi-35-year-trendline.html`. Edit the `CONFIG` and `JSONLD` blocks first, then the body.

Required body elements:
- Hero with breadcrumb, meta row, h1, subtitle, tags
- Key takeaway box
- Section h2s, data tables
- Scenario table (3 rows max) at the end
- **Sources section**: `<div class="sources-section">` + `<h2>Sources</h2>` + `<ul>` with one `<li>` per source. Never plain `<h2>` + `<p>`.
- Article footer with disclaimer + back link (already in `footer-analysis.html` partial: do not duplicate)

### Step 5: Update the homepage

Two sections in [src/index.html](src/index.html):

**Recent Analyses cards** (top): 1 featured card (2/3 width) + 2 small cards stacked (1/3 width).

**Rotation rule** when a new article publishes:
1. New article → featured card
2. Old featured → small card #1
3. Old small card #1 → small card #2
4. Old small card #2 → **prepend to Identified Situations as the new 04**, renumber all existing rows down by one

**Step 4 is mandatory.** The evicted card must be added to Identified Situations in the same commit. Skipping it silently removes the article from the homepage with no trace. The numbered list must grow by one entry every time a new article publishes.

**Identified Situations**: all articles outside the top 3, reverse chronological, numbered from 04 upward. Tag with the expert verdict (`CONVICTION`, `MONITOR`, or `AVOID`) for stock analyses, `THESIS` for market thesis articles. Whichever the expert returns is what ships; the rule is to apply it consistently.

**Checklist before committing a homepage update:**
- [ ] New article is in the featured card
- [ ] Old cards shifted correctly (featured → small #1, small #1 → small #2)
- [ ] Evicted article added as item 04 in Identified Situations
- [ ] All existing items renumbered down by one
- [ ] Item count in Identified Situations = (total published articles) − 3

### Step 6: Update feed.xml + sitemap.xml

[src/feed.xml](src/feed.xml): add a new `<item>` at the top, update `<lastBuildDate>`.

```xml
<item>
  <title>TITLE</title>
  <link>https://trading852.com/analyses/SLUG</link>
  <guid>https://trading852.com/analyses/SLUG</guid>
  <pubDate>Day, DD Mon YYYY 00:00:00 +0800</pubDate>
  <description>EXCERPT (1-2 sentences)</description>
</item>
```

[src/static/sitemap.xml](src/static/sitemap.xml): add `<url>` entry, update homepage `<lastmod>`.

```xml
<url>
  <loc>https://trading852.com/analyses/SLUG</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

> **Refresh rule.** When updating an existing article (SEO restructure, factual correction, post-earnings update), bump that article's `<lastmod>` AND the homepage `<lastmod>` to the refresh date. The same date should appear in JSON-LD `dateModified` (see SEO pattern). Sitemap and JSON-LD freshness signals must agree, or Google trusts neither.

**Article update items in feed.xml** (post-earnings, factual corrections, thesis changes):

Add a new `UPDATE:` item at the top with a unique `guid` (`#update-YYYYMMDD`). When a second update follows for the same article, **collapse the previous update item**, shorten its `<description>` to one line summary, before inserting the new one above it. This keeps the feed readable as updates accumulate.

```xml
<!-- New update: full description -->
<item>
  <title>UPDATE: Company (TICKER.HK) Q2 2026: one-line hook</title>
  <link>https://trading852.com/analyses/SLUG</link>
  <guid>https://trading852.com/analyses/SLUG#update-YYYYMMDD</guid>
  <pubDate>Day, DD Mon YYYY 00:00:00 +0800</pubDate>
  <description>Full detail: key numbers, scenario check, next catalyst.</description>
</item>

<!-- Previous update: collapsed to one line -->
<item>
  <title>UPDATE: Company (TICKER.HK) Q1 2026: one-line hook</title>
  <link>https://trading852.com/analyses/SLUG</link>
  <guid>https://trading852.com/analyses/SLUG#update-YYYYMMDD</guid>
  <pubDate>Day, DD Mon YYYY 00:00:00 +0800</pubDate>
  <description>Q1 2026: Revenue +X%, net profit +Y%. Base case met. [Collapsed, see Q2 update above.]</description>
</item>
```

Same rule applies to the **update notice block inside the article**: the most recent update sits at the top; prior updates are collapsed to a single `<p>` with date + one-line summary, then a "see update above" note.

### Step 7: Build, verify locally, commit

```bash
cd "TRADING/Trading852-v2"
node build.js
# spot-check dist/analyses/<slug>.html in a browser, then:
git add .
git commit -m "Add [article title]"
git push origin main
```

Vercel rebuilds and deploys on push.

---

## Scorecard: live performance tracker

Public accountability page at [trading852.com/scorecard](https://trading852.com/scorecard). 100% client-side, zero backend.

**Data flow**:
1. **Positions are auto-generated at build time.** `build.js` (`generateScorecardData()`) scans `src/analyses/` and registers every article whose hero carries an HK ticker (`NNNN.HK`) **and** a verdict, then writes `dist/assets/scorecard-recos.json` (ticker, company, eyebrow, slug, `issueDate`). There is **no hand-maintained list**: publishing a stock article registers it automatically.
2. On page load, [assets/scorecard.js](assets/scorecard.js) fetches that JSON, then each ticker hits the [yahoo-proxy Cloudflare worker](https://yahoo-proxy.marccharnal.workers.dev/) for 3-mo daily OHLC.
3. Script computes entry = first close strictly after the entry date, scans intraday lows for the stop, renders the table.
4. Same `scorecard.js` powers the homepage strip teaser (`<div id="scorecard-strip">`).

**Entry price rule**: weekday pub → first close strictly after `pubDate` (uses `ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → opening price of the next trading day (Monday open). The "open" label appears in the Entry column for weekend publications.

**Last price**: `meta.regularMarketPrice` from the Yahoo Finance response is used as the primary source (always current, no OHLC lag). Falls back to the close array scan only if the meta field is absent or pre-entry. This prevents thinly traded HK stocks (e.g. 0113.HK) from showing a stale entry-day close in the Last column.

**Stop-loss rule (trailing, one-way ratchet, all picks)**: the stop tightens as the position appreciates and never loosens.

| Peak gain since entry | Stop level | Locked return if hit |
|---|---|---|
| < +5 % | entry × 0.90 | −10 % |
| ≥ +5 % | entry × 0.95 | −5 % |
| ≥ +10 % | entry × 1.00 (breakeven) | 0 % |

A stop fires when the intraday low ≤ the active stop level for that bar. Once a tighter tier activates, the stop never reverts even if the peak recedes. Stopped rows are highlighted in light red (`sc-row-stopped`, `#fdf3f3`) with a "Stopped" badge next to the ticker, exit date under the Last column, and the locked return in the % cell with a small uppercase "Stopped" label underneath. The locked return still feeds the average.

**Post-stop live price**: once a position is stopped, the % column stays frozen at the locked tier (no re-entry, no recovery if the stock bounces back above entry). The live last close keeps refreshing and is shown as a small `now: XX.XX` line under the entry price, right-aligned in the Entry column. It is colored **green when the live price is at/above the stop level and red when below it** (`.sc-now-pos` / `.sc-now-neg`), so a glance shows whether the stop was vindicated. It is informational only: it never feeds `pct` or the average. Wired in `fetchOne` (preserves `currentPrice` separately from `last`) and rendered in `renderTable` via `.sc-now`.

**Benchmark**: 2800.HK (Tracker Fund / HSI) is always pinned to the bottom of the table, grey background (`sc-row-benchmark`). It is not a stock pick, it is the market reference since the April 10 inaugural issue. Do not reorder it. **The benchmark is excluded from the average return and from the winners/losers tally**, it is a reference line only, not a contributor to the headline number.

**Average return**: simple arithmetic mean of every line's `pct`, benchmark excluded. Each pick counts equally. Computed in both `renderStrip` (homepage teaser) and `renderTable` (`/scorecard`) by filtering on `!r.isBenchmark` before summing.

**What counts as a position (automatic)**: any `src/analyses/*.html` whose hero has both a `meta-ticker` matching `NNNN.HK` and a `meta-verdict`. The SPY/HSI market-thesis pages and the sector hubs have no stock ticker, so they are excluded automatically. ticker / eyebrow (sector + ` · Monitor` when the verdict is MONITOR) / slug are read from the article; entry date defaults to `pubDate`.

**Overrides**: curated short names and the Apr-10 inaugural issue dates live in the `SCORECARD_OVERRIDES` map in `build.js`. A single article can also override via CONFIG: `scorecardName` (display name) and `scorecardEntryDate` (`YYYY-MM-DD`, when the issue/entry date differs from `pubDate`). The 2800.HK Tracker Fund benchmark is a fixed entry (`SCORECARD_BENCHMARK` in `build.js`), not derived from an article.

**Article and scorecard entry are inseparable, by construction**: positions are derived from the articles themselves, so a scorecard row cannot exist without its published article.

**To add a pick**: just publish the stock article with the standard hero (`meta-ticker` + `meta-verdict`). The next `node build.js` registers it automatically (Vercel runs `build.js` on deploy, so commit and push is enough). Set `scorecardName` in CONFIG only if you want a shorter display name than the schema `about.name`.

---

## Site plumbing

### Header nav: 4 items, identical on every page

```
Analyses · Scorecard · HSI · About
```

Defined once in [src/_partials/navbar.html](src/_partials/navbar.html). Footer Explore column mirrors it in each `footer-*.html` partial.

### Per-layout footer

`build.js` picks the footer based on `layout`:
- `article` → `footer-analysis.html`
- `index` / `scorecard` → `footer-home.html`
- `static` → `footer-static.html`

All footers use a flex row (`justify-content:space-between`): tagline on the left, "Be water, My friend." on the right. Same style: `font-family:var(--ff-serif);font-size:var(--fs-16);color:rgba(255,255,255,0.45);line-height:1.7`.

### Article footer tagline (canonical)

> HKEX filings. Mispriced companies. Written up when the math holds.

---

## Drafts: pending price trigger

| File | Ticker | Title | Trigger to publish |
|---|---|---|---|
| [src/drafts/6160-beone.html](src/drafts/6160-beone.html) | 6160.HK | Beat AbbVie's Imbruvica in a Head-to-Head Trial. First Annual Profit. Net Margin: 5.4%. | HKD ~132 (EV/FCF ~24×, forward P/E ~21×) |

Drafts live at [src/drafts/](src/drafts/). They are built into `dist/drafts/` but **not linked from the homepage, feed, or sitemap**. Do not promote a draft until the trigger fires.

---

## Published articles

| File | Ticker | Title | Date |
|---|---|---|---|
| [src/analyses/spy-747-level.html](src/analyses/spy-747-level.html) | SPY | The 2022 High Was $0.13 From the Level. SPY Is Now 1.3% From the Next One. | 2026-05-11 |

> **SPY structural level methodology note:** all calculations (level formula, ceiling, distance, backtest data) use **unadjusted SPY prices, dividends off**. When verifying on TradingView or any charting tool, turn off dividend adjustment before reading price vs. level distances. Adjusted prices produce different distances and will not match the published levels.
| [src/analyses/1698-tencent-music.html](src/analyses/1698-tencent-music.html) | 1698.HK | Profit +66%, Stock -66% from ATH. Spotify Trades at Four Times the Multiple. | 2026-05-04 |
| [src/analyses/6690-haier.html](src/analyses/6690-haier.html) | 6690.HK | The World's Largest Appliance Maker Trades at 6.85×. Midea at 12×. Electrolux at 14×. | 2026-04-25 |
| [src/analyses/9988-alibaba.html](src/analyses/9988-alibaba.html) | 9988.HK | EBITA Down 57%. Cloud Up 36%. This Is What Amazon Looked Like in 2014. | 2026-04-14 |
| [src/analyses/1585-yadea.html](src/analyses/1585-yadea.html) | 1585.HK | Profit +129%. EV/EBIT 6.1x. The Market Sees a Bicycle Company. | 2026-04-14 |
| [src/analyses/1167-jacobio.html](src/analyses/1167-jacobio.html) | 1167.HK | AstraZeneca Paid US$100M for One Molecule. The Rest Trades at US$507M. | 2026-04-14 |
| [src/analyses/1913-prada.html](src/analyses/1913-prada.html) | 1913.HK | EPS Down 74%. Revenue Up 9%. One of These Numbers Is a Distraction. | 2026-04-12 |
| [src/analyses/0113-dickson-concepts.html](src/analyses/0113-dickson-concepts.html) | 0113.HK | The Market Is Paying You HKD 375M to Buy This Company | 2026-04-11 |
| [src/analyses/hsi-35-year-trendline.html](src/analyses/hsi-35-year-trendline.html) |: | Six Bounces. One Break. Now the Retest. | 2026-04-11 |

---

## What to never write

- "This is not investment advice"
- "It should be noted that" / "It is worth mentioning"
- Section title as a teaser: "What's next?", "The bottom line"
- A number without its source date or document
- A risk framed as hypothetical when it is documented
- **Any em dash** (`, ` or `, `) anywhere: articles, scorecard, metadata, titles, methodology, changelogs. Use a period, a colon, or restructure the sentence. The middle dot `·` is the only permitted title separator.
- **Any reference to internal research notes**. The published article is presented as the analyst's view, not the output of a prior pipeline. Never write "the original valuation work", "our prior note", "since we filed", "in our May analysis", "the earlier analysis flagged", or any phrase that implies a non-public preceding document. Public market data is fine (`+9% over the past three weeks`, `since the IPO`, `since the FY2025 release`); references to internal research are not. This is a specialisation of the broader "cuisine interne" rule in [instructions/blog-style-guide.md](instructions/blog-style-guide.md). When the urge appears, rewrite using a public anchor date instead.

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

## Pre-publish checklist

- [ ] Source material identified, read
- [ ] Style guide + VOIX-Marc read
- [ ] CONFIG + JSONLD blocks complete and JSON-valid
- [ ] **SEO pattern applied**: see "SEO pattern (mandatory for all ticker analyses)" section above. Diff against `DRAFT/1913-prada-SEO-OPTIMIZED.html` to verify
- [ ] No bullet points in body text
- [ ] Every number has a date or source
- [ ] Valuation / NAV table present
- [ ] Scenario table present (3 rows max)
- [ ] Risks: exactly 2, named in bold
- [ ] Word count between 1 000 and 1 400
- [ ] Title contains a concrete number
- [ ] At least one H2 contains the entity name
- [ ] First paragraph of `What X Does` establishes ticker + HKEX listing
- [ ] At least one inline link to a sector hub (`/analyses/{sector}`)
- [ ] Image (if any) dropped in `src/analyses/images/` with relative `<img src="images/...">`
- [ ] Homepage updated: new article in featured card, old cards shifted, evicted card prepended as item 04 in Identified Situations, all items renumbered, item count = (total published) − 3
- [ ] feed.xml: new `<item>` + `<lastBuildDate>` updated
- [ ] sitemap.xml: new `<url>` + homepage `<lastmod>` updated. **Refresh of an existing article** = bump that article's `<lastmod>` AND the homepage `<lastmod>` AND JSON-LD `dateModified` to the refresh date
- [ ] Scorecard: **automatic** (no action) for stock articles with `meta-ticker` + `meta-verdict` in the hero. Set CONFIG `scorecardName` only if a shorter display name is wanted
- [ ] No em dash anywhere (`grep -rn ", \|, " src/ assets/` returns nothing)
- [ ] `node build.js` runs clean
- [ ] Spot-checked `dist/analyses/<slug>.html` in a browser
- [ ] Committed and pushed

---

## Changelog

### June 9, 2026 · Scorecard: trailing stop fix + post-stop display + HSI alpha row

- **Removed the date-based legacy stop gate.** All picks now use the 3-tier trailing ratchet from day one — no flat −10 % exception for picks published before May 5. `TRAILING_STOP_FROM` deleted from `scorecard.js`.
- **Post-stop now: price shows % from entry.** Stopped rows display `now: XX.XX / −x.xx %` under the entry price. Color is green when current price is above entry, red when below (was previously compared against stop level, which was misleading).
- **Benchmark row darker.** Background bumped from `#f5f5f5` to `#dadada` so the HSI row is visually distinct from regular picks.
- **Portfolio vs HSI alpha row.** A dark footer row (`sc-row-alpha`, `#1a1a2e` background) sits below the benchmark and shows the spread between the portfolio average and the HSI return in percentage points (e.g. `+3.24 pp`). Green if portfolio leads, red if it trails.

### June 3, 2026 · Scorecard auto-generated from articles + live SPY tracking + em-dash scrub

- **Scorecard positions now build from the articles.** `build.js` (`generateScorecardData()`) scans `/analyses`, registers every article with an HK ticker + verdict, and writes `dist/assets/scorecard-recos.json`, which `scorecard.js` fetches. The hand-maintained `RECOS` array is gone. Publishing a stock article auto-registers it; curated short names and the Apr-10 inaugural entry dates are preserved via `SCORECARD_OVERRIDES`, plus optional per-article `scorecardName` / `scorecardEntryDate` CONFIG fields. Non-picks (SPY/HSI theses, sector hubs) are excluded automatically; the 2800.HK benchmark is a fixed entry.
- **Post-stop `now:` price colored** green at/above the stop level, red below (`.sc-now-pos` / `.sc-now-neg`).
- **SPY $747 banner is live.** `spy-747-level.html` fetches SPY on each load via the yahoo-proxy worker and recomputes the level distance, advancing ceiling, and friction-zone day count, with a within-1%-of-ceiling highlight. Dark panel for contrast, no accent border, static May-29 snapshot as fallback.
- **Homepage SPY card turns red** when SPY is within 1% of the advancing ceiling (`scorecard.js`, `#spy-zone-card`).
- **Site-wide em-dash scrub.** All 67 em dashes removed across articles, homepage, RSS feed, static pages, and `scorecard.js`, replaced with context-correct punctuation (colon, comma, parentheses, period). The scorecard "no value" placeholder is now `n/a`. Already banned in "What to never write".
- **Midea Group (0300.HK)** published (MONITOR, Kuka robotics angle) and added as the first auto-tracked position. **Lenovo (0992.HK) discarded** (thesis stale after a +50% move).

### May 31, 2026 · SPY article update + unadjusted-price convention

- **Live update banner added** to `spy-747-level.html`: SPY at $756.48 (May 29 close), +1.3% above $747, ~3.1% to calculated ceiling (~$781), 164 trading days in friction zone.
- **Unadjusted-price rule documented** in banner and README: all structural level distances must be read on a chart with dividends off. Adjusted prices produce different values and do not match the published levels.

### May 7, 2026 · SEO architecture audit + CollectionPage schema for 7 sector hubs

- **Audit deliverable** at [instructions/seo/SEO-ARCHITECTURE-AUDIT-2026-05-07.md](instructions/seo/SEO-ARCHITECTURE-AUDIT-2026-05-07.md). Full-site review of schema, sitemap, and hreflang. 0 critical, 12 high-severity items. Hreflang N/A (English-only).
- **CollectionPage + ItemList JSON-LD added to all 7 sector hubs**: luxury, biotech, technology, electric-vehicles, consumer-discretionary, special-situations, market-thesis. Closes the dangling `isPartOf` `@id` references that every ticker article was already emitting (each article declares "I belong to /analyses/luxury", but those hub URLs previously had no schema entity at the destination). Each hub `@id` and `name` are kept consistent with the article-side reference. Build script unchanged: hubs use the existing `<!-- JSONLD ... -->` comment pattern picked up by `build.js`.
- **Sitemap `<lastmod>` bumped to 2026-05-07** for the 7 hub URLs to reflect the schema addition.
- **Audit items still open** (tracked in the audit doc): HSI article missed the May 6 SEO pattern upgrade (no `image`, `inLanguage`, `wordCount`, `articleSection`, `isPartOf`); no sitewide `Organization` entity in `head.html`; sitemap `<priority>` and `<changefreq>` are dead weight (Google ignores both).

### May 7, 2026: Scorecard: post-stop live price + 1167 verdict correction

- **Live last close shown under the entry price for stopped rows**. New `now: XX.XX` line, small green text right-aligned in the Entry column. Locked `pct` stays frozen at the stop tier; the live price is informational, never feeds the average. Wired in `assets/scorecard.js` (`currentPrice` preserved separately from `last`) and styled in `src/styles/scorecard.css` (`.sc-now`). Methodology paragraph updated.
- **1167.HK Jacobio verdict corrected from CONVICTION to MONITOR.** The expert analysis returned MONITOR; the article was labelled CONVICTION at the Apr 14 publication in error. The correct call has always been MONITOR. Updated in five places: meta-verdict pill on the analysis page, new Correction notice block at the top of `src/analyses/1167-jacobio.html`, biotech category card eyebrow on `src/analyses/biotech.html`, the verdict-tag on the Identified Situations row in `src/index.html`, and the scorecard eyebrow on the Jacobio row in `assets/scorecard.js` (`Biotech` → `Biotech · Monitor`). Reasoning: binary Phase III futility risk, NRDL adoption pace unverified through one full reporting cycle (H1 2026 interim due Jul or Aug), CEO Wang Yinxiang silent in the secondary market since his HK$96M purchase between Jul and Sep 2025 at HK$8.56. The arithmetic and valuation framework in the article are unchanged.
- **Editorial rule clarification (Step 1 + Step 5)**: the verdict is whatever the expert analysis returns (CONVICTION, MONITOR, or AVOID). All three publish. The label drives framing and surface treatment across the four canonical places: meta-verdict pill, sector card eyebrow, homepage verdict-tag, scorecard eyebrow.

### May 6, 2026: Sitemap refresh + favicon at root (SEO follow-up)

- **Sitemap `<lastmod>` bumped to 2026-05-06** for the 7 SEO-refreshed ticker articles + homepage. Without this, Google sees the May 6 schema/H2/title restructure as if it never happened: re-crawl frequency depends on the `<lastmod>` signal, not on actual change detection.
- **JSON-LD `dateModified` bumped to 2026-05-06** in the same 7 articles. Sitemap and JSON-LD freshness must agree.
- **`/favicon.ico` added at the site root** (was returning 404). Google Search Console and many crawlers fetch `/favicon.ico` directly rather than reading `<link rel="icon">` declarations: the missing root favicon was producing a placeholder avatar in GSC's property selector. Built from the existing 32×32 PNG; `head.html` now also declares the legacy `<link rel="shortcut icon">`.
- **README**: SEO pattern doc expanded with `dateModified` semantics rule, sitemap refresh rule in Step 6, pre-publish checklist updated, folder structure shows `src/favicon.ico`. Title field rule clarified: static pages keep ` · Trading852` suffix, ticker analyses drop it.

### May 6, 2026: Auto-generated BreadcrumbList JSON-LD + TO DO folder

- `build.js` now emits `BreadcrumbList` JSON-LD for every article page by parsing the existing in-body `<div class="article-breadcrumb">`. New token `{{BREADCRUMB_JSONLD}}` added to `head.html`. Zero per-article edits: all 7 stock analyses + the HSI thesis page get the schema; category hubs and homepage correctly skip it.
- `TO DO/` folder created. First entry: `per-article-og-images.md`: spec for replacing the shared `og-image.png` with one unique 1200×630 PNG per article (manual Figma path or auto-generated Puppeteer path), highest social CTR move available.

### May 6, 2026: SEO pattern locked, applied to all 8 published articles

- Added "SEO pattern (mandatory for all ticker analyses)" section to README: title/description format, JSONLD additions (image, articleSection, inLanguage, wordCount, isPartOf, expanded keywords), H2 entity-name rule, body ticker+HKEX establishment paragraph, inline sector-hub link, h3 risk callout labels.
- Pre-publish checklist updated with 8 new SEO line items.
- 8 SEO-optimized DRAFTs created in `DRAFT/`, one per published article (Tencent Music, Haier, Alibaba, Yadea, Jacobio, Prada, Dickson, HSI 35-year). Pattern was first developed and validated on `1913-prada-SEO-OPTIMIZED.html`, which is the canonical reference.
- All titles trimmed to ≤ 60 chars, ` · Trading852` suffix dropped (brand sits in `og:site_name` + schema `publisher`, so dropping it from title is free SEO).
- All Article schemas now include `image` field (Google explicit recommendation).
- All `risk-callout__label` divs converted to `<h3>` for passage-extraction by Google + AI summarisers.
- New `SEO/` folder with `keywords-funnel.md` (TOFU/MOFU/BOFU keyword strategy without Ahrefs).
- New `POST SUGGESTION/` folder cross-referencing FinRatios CONVICTION ≥ 7.5 with active investor research themes.
- `instructions/seo/SEO-STRATEGY.md` cleaned: methodology pages (`/method/*`) abandoned. MOFU served by sectoral hubs + comparatifs + screens + thesis articles instead. The methodology stays a moat.

### Apr 29, 2026: Homepage pub date + mobile menu dividers

- Recent Analyses cards (homepage) now show the pub date in 45%-opacity grey after the ticker: `Sector · Ticker · Mon DD, YYYY`. Ticker stays bold; date is regular weight. New `.eyebrow-date` class in `src/styles/index.css`.
- Mobile hamburger menu: divider lines between Analyses / Scorecard / HSI / About bumped from `rgba(255,255,255,0.08)` to `0.14` (+75%): they were nearly invisible on dark backgrounds.

### Apr 29, 2026: Link `instructions/` from README

- Top of README now lists the editorial + SEO references in [instructions/](instructions/) (style guide + 5 SEO docs).
- Folder structure block updated to show `instructions/` and its `seo/` subfolder.
- Step 2 of the editorial workflow now points to the local `instructions/blog-style-guide.md` instead of the v1 path.

### Apr 29, 2026: Scorecard: average methodology, benchmark exclusion, stopped-row restyle

- **Methodology block** rewritten to explain the average calculation: simple arithmetic mean of every line's % change, each ticker counts equally, benchmark excluded.
- **Tracker Fund (2800.HK) excluded from the average** and from the winners/losers tally on both `/scorecard` and the homepage strip. The benchmark stays visible at the bottom of the table as a reference line only. Implemented by filtering `!r.isBenchmark` in `renderStrip` and `renderTable` before reducing.
- **Stopped rows restyled**: opacity-based grey-out replaced by a very light red background (`#fdf3f3`, hover `#fbe9e9`). The previous opacity treatment looked too similar to the benchmark row's grey, blurring the difference between "we hit the stop" and "this is the market reference".
- **Stopped % cell** now shows the locked `−10.0%` value with a small uppercase "Stopped" caption underneath (instead of replacing the number with text). Locked −10% still feeds the average.
- Removed the "past performance on a three-figure sample is not a track record" line from the methodology: readers can draw their own conclusions.

### Apr 28, 2026: Remove Galaxy from scorecard, enforce article-first rule

- 0027.HK Galaxy Entertainment removed from `RECOS`. No article was published, so no scorecard entry should exist.
- Rule added to README: article and scorecard entry are inseparable. Never add a ticker to `RECOS` without a live article in `src/analyses/`. No article = no scorecard entry.

### Apr 27, 2026: Scorecard engine, SEO fixes, category pages

**Scorecard engine**
- Entry price: first close strictly AFTER `pubDate` (`ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → Monday open instead of close. Haier (Apr 25 = Saturday) uses Apr 28 open.
- Last price: `meta.regularMarketPrice` used as primary source; OHLC close array as fallback. Fixes thinly traded stocks (e.g. 0113.HK) where the OHLC array lags and returns the entry-day close as "last".
**SEO, high priority**
- Homepage H1 added (visually hidden) for correct heading hierarchy.
- Mobile hamburger menu added: button, CSS `.is-open` panel, JS toggle with `aria-expanded` and click-outside close.
- About page expanded from 253 to ~600 words: Who I am / Why Hong Kong / How I work / What this is not. Person JSON-LD schema added.
- All article source citations hyperlinked (previously plain text) using HKEX News search URLs + IR pages.

**SEO, medium priority**
- `/legal-notice` added to `sitemap.xml`.
- 7 sector/category pages created in `src/analyses/`: `luxury`, `special-situations`, `biotech`, `technology`, `consumer-discretionary`, `electric-vehicles`, `market-thesis`. Each has a hero H1, sector intro paragraph, and `.category-article-card` components linking to published analyses.
- Article breadcrumb labels made into links pointing to their category page.
- RSS `feed.xml` upgraded with `xmlns:content` namespace and `<content:encoded>` full-text blocks for AI aggregator indexing.
- "Browse by sector" pill grid added to homepage.

**Editorial**
- Dickson Concepts (0113.HK) classified in both Luxury and Special Situations category pages.
- Manifesto: "public filings" → "public sources".

### Apr 27, 2026: Scorecard rules, nav rename, image fix, OG tags

- **Scorecard: weekend pub entry**: weekday pub → first close after `pubDate`; weekend pub (Sat/Sun) → Monday open price. Haier (Apr 25 = Sat) was the first case. Entry cell shows "open" label when applicable.
- **Scorecard: benchmark row**: 2800.HK pinned to bottom via `isBenchmark: true` + `sort()`. Grey background (`sc-row-benchmark`). Eyebrow changed to "Benchmark".
- **Scorecard: copy**: "recommendation" replaced by "article" everywhere in scorecard page and meta description.
- **Navbar**: "Hong Kong" renamed to "HSI". Footer: "Hong Kong" renamed to "Hang Seng Index".
- **Article images**: `max-width: 100%; height: auto` added to `.article-body img`: prevents 1280px images from overflowing the 46rem content column.
- **OG image**: added `og:image:width`, `og:image:height`, `og:image:type` to `head.html`: required by WhatsApp for link preview thumbnail.
- **Git**: `Trading852-v2/.git` was a broken ghost (no config/objects). Re-initialized and connected to `Marcvrick/trading852-v2`. `git push` from this folder now triggers Vercel auto-deploy.

### Apr 26, 2026: README v2 created

- Documents the new `src/` → `dist/` build pipeline, partials, source page format (`CONFIG` + `JSONLD` comments, no `<head>` / nav / footer in source), images convention (`src/analyses/images/<slug>.jpg`), Vercel cleanUrls gotcha.
- Editorial workflow (style guide, 7-section structure, scorecard, drafts, published articles, "what to never write", SEO checklist) carried over from the v1 README.
- Triggered by the `hsi-35-year-trendline` broken image (image folder was never migrated from v1 to v2 because the convention was undocumented).
