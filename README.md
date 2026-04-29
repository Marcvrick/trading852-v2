---
title: "Trading852 v2 — Build Pipeline + Editorial Workflow"
tags:
  - readme
  - blog
  - workflow
  - hk-stocks
  - static-site
category: Trading/Blog
type: readme
created: 2026-04-26
updated: 2026-04-29
---

# Trading852 v2 — Build Pipeline + Editorial Workflow

Static site for conviction-led HK stock analyses and market thesis articles. Source pages live in [src/](src/), get assembled into [dist/](dist/) by [build.js](build.js), and Vercel serves `dist/`.

Live site: [trading852.com](https://trading852.com)
GitHub: [Marcvrick/trading852.com](https://github.com/Marcvrick/trading852.com)

---

## What changed vs v1

v1 was flat HTML — every page duplicated the `<head>`, navbar, and footer. A single nav link change required edits in 13 files.

v2 splits the site into:
- **Source pages** ([src/](src/)) — body content + a `<!-- CONFIG -->` frontmatter comment. **No `<head>`. No navbar. No footer.**
- **Partials** ([src/_partials/](src/_partials/)) — single source of truth for `<head>`, navbar, footer variants, scroll script.
- **Build script** ([build.js](build.js)) — zero-dependency Node.js. Reads each source file, parses its `CONFIG` + `JSONLD` blocks, injects partials, writes the assembled HTML to `dist/`.
- **Vercel** — runs `node build.js` on push, serves `dist/`.

One nav link change = one edit in [src/_partials/navbar.html](src/_partials/navbar.html) → propagates everywhere on next build.

---

## Folder structure

```
Trading852-v2/
├── build.js                    ← Build script (Node, zero deps)
├── vercel.json                 ← buildCommand + cleanUrls + rewrites + headers
├── README.md
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
5. For every non-HTML file: copies as-is, preserving the relative path. **This is how images travel into `dist/`** — drop a file under `src/analyses/images/` and it shows up at `/analyses/images/...` on the live site.

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

<!-- body content only — NO <head>, NO <body>, NO navbar, NO footer -->
```

### CONFIG fields

| Key | Required | Notes |
|---|---|---|
| `layout` | yes | `article` · `index` · `static` · `scorecard` — drives CSS + footer + nav variant |
| `title` | yes | Full `<title>` (include the ` · Trading852` suffix) |
| `ogTitle` | yes | Open Graph + Twitter title (no suffix) |
| `description` | yes | `<meta name="description">` + OG/Twitter description |
| `canonical` | yes | Absolute URL, no `.html` (cleanUrls is on) |
| `ogType` | yes | `article` for analyses, `website` for static pages |
| `ogImage` | yes | Absolute URL |
| `pubDate` | articles only | `YYYY-MM-DD` — drives `<meta property="article:published_time">` |

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

- `buildCommand: "node build.js"` — Vercel runs the build on every push.
- `outputDirectory: "dist"` — Vercel serves the build output, not `src/`.
- `installCommand: ""` — no npm install (zero-dep build).
- `cleanUrls: true` — `.html` is stripped from URLs. **Rewrite destinations and canonicals must NOT include `.html`**.
- `trailingSlash: false`.

### Rewrite gotcha

```json
✅ { "source": "/scorecard", "destination": "/static/scorecard" }
❌ { "source": "/scorecard", "destination": "/static/scorecard.html" }   // 404 with cleanUrls
```

### Footer / internal links — absolute paths only

Relative paths like `about.html` break under cleanUrls. Always use `/about`, `/disclaimer`, `/legal-notice`, etc.

### Security headers

Set globally in `vercel.json`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## Editorial workflow

### Step 1 — Find the source material

Stock analyses: look up the ticker in `TRADING/Trading-research/HK Stocks/Experts analysis/`. Folder pattern: `{TICKER} - {Company} - {CONVICTION|MONITOR|AVOID}`. Only proceed if verdict is **CONVICTION**.

Market thesis articles: source `.md` lives outside the repo (e.g. `TRADING/Trading852/BD/Briefs-ChatGPT/`).

### Step 2 — Read the style guide

Open the v1 style guide at [../Trading852/instructions/blog-style-guide.md](../Trading852/instructions/blog-style-guide.md) and the voice guide at [../../Voix Marc/VOIX-Marc.md](../../Voix%20Marc/VOIX-Marc.md). Key rules:

- **7 canonical sections** — Hook → Company/Context → Discount → Catalyst → Valuation → Risks → Decision
- **No bullet points** in the body (except numbered catalyst points and scenario tables)
- **No superlatifs**, no conditional mou, no disclaimers
- **Numbers always precise** — `HKD 2 354 millions`, `+14 %`, never "environ"
- **Title formula**: `[Subject] — [Concrete arithmetic fact that surprises]`
- **Target length**: 1 000–1 400 words (ideal ~1 200)
- **Marc's voice**: accessible, direct, "montrer sans dire"

### Step 3 — Article structure

| # | Section | Words |
|---|---|---|
| 1 | Hook (no header) | 80–120 |
| 2 | What the company/market does | 120–180 |
| 3 | Why the discount exists | 100–150 |
| 4 | Catalyst / main signal | 200–280 |
| 5 | Valuation (with table) | 150–200 |
| 6 | Risks (2 max, named in bold) | 180–250 |
| 7 | Decision (with scenario table) | 180–250 |

### Step 4 — Create the source file

Stock analysis: copy `src/analyses/1913-prada.html`. Market thesis: copy `src/analyses/hsi-35-year-trendline.html`. Edit the `CONFIG` and `JSONLD` blocks first, then the body.

Required body elements:
- Hero with breadcrumb, meta row, h1, subtitle, tags
- Key takeaway box
- Section h2s, data tables
- Scenario table (3 rows max) at the end
- **Sources section** — `<div class="sources-section">` + `<h2>Sources</h2>` + `<ul>` with one `<li>` per source. Never plain `<h2>` + `<p>`.
- Article footer with disclaimer + back link (already in `footer-analysis.html` partial — do not duplicate)

### Step 5 — Update the homepage

Two sections in [src/index.html](src/index.html):

**Recent Analyses cards** (top): 1 featured card (2/3 width) + 2 small cards stacked (1/3 width).

**Rotation rule** when a new article publishes:
1. New article → featured card
2. Old featured → small card #1
3. Old small card #1 → small card #2
4. Old small card #2 → drops to **Identified Situations** as the next numbered row

**Identified Situations**: all articles outside the top 3, reverse chronological, numbered from 04 upward. Tag `CONVICTION` for stock analyses, `THESIS` for market thesis articles.

### Step 6 — Update feed.xml + sitemap.xml

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

### Step 7 — Build, verify locally, commit

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

## Scorecard — live performance tracker

Public accountability page at [trading852.com/scorecard](https://trading852.com/scorecard). 100% client-side, zero backend.

**Data flow**:
1. [assets/scorecard.js](assets/scorecard.js) holds the editorial `RECOS` array (ticker, slug, eyebrow, company, **per-reco `pubDate`**).
2. On page load, each ticker hits the [yahoo-proxy Cloudflare worker](https://yahoo-proxy.marccharnal.workers.dev/) for 3-mo daily OHLC.
3. Script computes entry = first close strictly after `pubDate`, scans intraday lows for the −10% stop, renders the table.
4. Same `scorecard.js` powers the homepage strip teaser (`<div id="scorecard-strip">`).

**Entry price rule**: weekday pub → first close strictly after `pubDate` (uses `ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → opening price of the next trading day (Monday open). The "open" label appears in the Entry column for weekend publications.

**Last price**: `meta.regularMarketPrice` from the Yahoo Finance response is used as the primary source (always current, no OHLC lag). Falls back to the close array scan only if the meta field is absent or pre-entry. This prevents thinly traded HK stocks (e.g. 0113.HK) from showing a stale entry-day close in the Last column.

**Stop-loss rule**: intraday low ≤ entry × 0.90 closes the line at −10%. Return frozen at −10%, row highlighted in light red (`sc-row-stopped`, `#fdf3f3`), "Stopped" badge next to the ticker + exit date under the Last column. The % cell shows the locked −10% with a small uppercase "Stopped" label underneath. The frozen −10% still feeds the average.

**Benchmark**: 2800.HK (Tracker Fund / HSI) is always pinned to the bottom of the table, grey background (`sc-row-benchmark`). It is not a stock pick — it is the market reference since the April 10 inaugural issue. Do not reorder it. **The benchmark is excluded from the average return and from the winners/losers tally** — it is a reference line only, not a contributor to the headline number.

**Average return**: simple arithmetic mean of every line's `pct`, benchmark excluded. Each pick counts equally. Computed in both `renderStrip` (homepage teaser) and `renderTable` (`/scorecard`) by filtering on `!r.isBenchmark` before summing.

**Rule — article and scorecard entry are inseparable**: never add a ticker to `RECOS` without a published article in `src/analyses/`. No article = no scorecard entry, regardless of `noLink`. The two ship together or not at all.

**To add a reco**: edit the `RECOS` array. Set `pubDate: Date.UTC(YYYY, M-1, DD)` per entry (months are 0-indexed: 3 = April). Weekend publications (Sat/Sun) automatically use Monday open as entry. No rebuild needed — commit and push.

---

## Site plumbing

### Header nav — 4 items, identical on every page

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

## Drafts — pending price trigger

| File | Ticker | Title | Trigger to publish |
|---|---|---|---|
| [src/drafts/6160-beone.html](src/drafts/6160-beone.html) | 6160.HK | Beat AbbVie's Imbruvica in a Head-to-Head Trial. First Annual Profit. Net Margin: 5.4%. | HKD ~132 (EV/FCF ~24×, forward P/E ~21×) |

Drafts live at [src/drafts/](src/drafts/). They are built into `dist/drafts/` but **not linked from the homepage, feed, or sitemap**. Do not promote a draft until the trigger fires.

---

## Published articles

| File | Ticker | Title | Date |
|---|---|---|---|
| [src/analyses/6690-haier.html](src/analyses/6690-haier.html) | 6690.HK | The World's Largest Appliance Maker Trades at 6.85×. Midea at 12×. Electrolux at 14×. | 2026-04-25 |
| [src/analyses/9988-alibaba.html](src/analyses/9988-alibaba.html) | 9988.HK | EBITA Down 57%. Cloud Up 36%. This Is What Amazon Looked Like in 2014. | 2026-04-14 |
| [src/analyses/1585-yadea.html](src/analyses/1585-yadea.html) | 1585.HK | Profit +129%. EV/EBIT 6.1x. The Market Sees a Bicycle Company. | 2026-04-14 |
| [src/analyses/1167-jacobio.html](src/analyses/1167-jacobio.html) | 1167.HK | AstraZeneca Paid US$100M for One Molecule. The Rest Trades at US$507M. | 2026-04-14 |
| [src/analyses/1913-prada.html](src/analyses/1913-prada.html) | 1913.HK | EPS Down 74%. Revenue Up 9%. One of These Numbers Is a Distraction. | 2026-04-12 |
| [src/analyses/0113-dickson-concepts.html](src/analyses/0113-dickson-concepts.html) | 0113.HK | The Market Is Paying You HKD 375M to Buy This Company | 2026-04-11 |
| [src/analyses/hsi-35-year-trendline.html](src/analyses/hsi-35-year-trendline.html) | — | Six Bounces. One Break. Now the Retest. | 2026-04-11 |

---

## What to never write

- "This is not investment advice"
- "It should be noted that" / "It is worth mentioning"
- Section title as a teaser: "What's next?", "The bottom line"
- A number without its source date or document
- A risk framed as hypothetical when it is documented
- **Any em dash** (`—` or `&mdash;`) anywhere: articles, scorecard, metadata, titles, methodology, changelogs. Use a period, a colon, or restructure the sentence. The middle dot `·` is the only permitted title separator.

---

## SEO checklist (every page)

The `head.html` partial already wires most of this — confirm the `CONFIG` block is complete:

- [ ] `canonical` is absolute, self-referencing, no `.html`
- [ ] RSS autodiscovery (`<link rel="alternate" type="application/rss+xml">`) — already in `head.html`
- [ ] Twitter card + og:* tags — driven by `ogTitle` / `description` / `ogImage`
- [ ] JSON-LD block present (`Article` for analyses, `WebSite` for index)
- [ ] Images: `width` + `height` + `alt`, lazy below the fold

---

## Pre-publish checklist

- [ ] Source material identified, read
- [ ] Style guide + VOIX-Marc read
- [ ] CONFIG + JSONLD blocks complete and JSON-valid
- [ ] No bullet points in body text
- [ ] Every number has a date or source
- [ ] Valuation / NAV table present
- [ ] Scenario table present (3 rows max)
- [ ] Risks: exactly 2, named in bold
- [ ] Word count between 1 000 and 1 400
- [ ] Title contains a concrete number
- [ ] Image (if any) dropped in `src/analyses/images/` with relative `<img src="images/...">`
- [ ] Homepage updated (Recent Analyses + Identified Situations)
- [ ] feed.xml: new `<item>` + `<lastBuildDate>` updated
- [ ] sitemap.xml: new `<url>` + homepage `<lastmod>` updated
- [ ] `node build.js` runs clean
- [ ] Spot-checked `dist/analyses/<slug>.html` in a browser
- [ ] Committed and pushed

---

## Changelog

### Apr 29, 2026 — Scorecard: average methodology, benchmark exclusion, stopped-row restyle

- **Methodology block** rewritten to explain the average calculation: simple arithmetic mean of every line's % change, each ticker counts equally, benchmark excluded.
- **Tracker Fund (2800.HK) excluded from the average** and from the winners/losers tally on both `/scorecard` and the homepage strip. The benchmark stays visible at the bottom of the table as a reference line only. Implemented by filtering `!r.isBenchmark` in `renderStrip` and `renderTable` before reducing.
- **Stopped rows restyled**: opacity-based grey-out replaced by a very light red background (`#fdf3f3`, hover `#fbe9e9`). The previous opacity treatment looked too similar to the benchmark row's grey, blurring the difference between "we hit the stop" and "this is the market reference".
- **Stopped % cell** now shows the locked `−10.0%` value with a small uppercase "Stopped" caption underneath (instead of replacing the number with text). Locked −10% still feeds the average.
- Removed the "past performance on a three-figure sample is not a track record" line from the methodology — readers can draw their own conclusions.

### Apr 28, 2026 — Remove Galaxy from scorecard, enforce article-first rule

- 0027.HK Galaxy Entertainment removed from `RECOS`. No article was published, so no scorecard entry should exist.
- Rule added to README: article and scorecard entry are inseparable. Never add a ticker to `RECOS` without a live article in `src/analyses/`. No article = no scorecard entry.

### Apr 27, 2026 — Scorecard engine, SEO fixes, category pages

**Scorecard engine**
- Entry price: first close strictly AFTER `pubDate` (`ts * 1000 > recoPubDate`). Weekend pub (Sat/Sun) → Monday open instead of close. Haier (Apr 25 = Saturday) uses Apr 28 open.
- Last price: `meta.regularMarketPrice` used as primary source; OHLC close array as fallback. Fixes thinly traded stocks (e.g. 0113.HK) where the OHLC array lags and returns the entry-day close as "last".
**SEO — high priority**
- Homepage H1 added (visually hidden) for correct heading hierarchy.
- Mobile hamburger menu added: button, CSS `.is-open` panel, JS toggle with `aria-expanded` and click-outside close.
- About page expanded from 253 to ~600 words: Who I am / Why Hong Kong / How I work / What this is not. Person JSON-LD schema added.
- All article source citations hyperlinked (previously plain text) using HKEX News search URLs + IR pages.

**SEO — medium priority**
- `/legal-notice` added to `sitemap.xml`.
- 7 sector/category pages created in `src/analyses/`: `luxury`, `special-situations`, `biotech`, `technology`, `consumer-discretionary`, `electric-vehicles`, `market-thesis`. Each has a hero H1, sector intro paragraph, and `.category-article-card` components linking to published analyses.
- Article breadcrumb labels made into links pointing to their category page.
- RSS `feed.xml` upgraded with `xmlns:content` namespace and `<content:encoded>` full-text blocks for AI aggregator indexing.
- "Browse by sector" pill grid added to homepage.

**Editorial**
- Dickson Concepts (0113.HK) classified in both Luxury and Special Situations category pages.
- Manifesto: "public filings" → "public sources".

### Apr 27, 2026 — Scorecard rules, nav rename, image fix, OG tags

- **Scorecard — weekend pub entry**: weekday pub → first close after `pubDate`; weekend pub (Sat/Sun) → Monday open price. Haier (Apr 25 = Sat) was the first case. Entry cell shows "open" label when applicable.
- **Scorecard — benchmark row**: 2800.HK pinned to bottom via `isBenchmark: true` + `sort()`. Grey background (`sc-row-benchmark`). Eyebrow changed to "Benchmark".
- **Scorecard — copy**: "recommendation" replaced by "article" everywhere in scorecard page and meta description.
- **Navbar**: "Hong Kong" renamed to "HSI". Footer: "Hong Kong" renamed to "Hang Seng Index".
- **Article images**: `max-width: 100%; height: auto` added to `.article-body img` — prevents 1280px images from overflowing the 46rem content column.
- **OG image**: added `og:image:width`, `og:image:height`, `og:image:type` to `head.html` — required by WhatsApp for link preview thumbnail.
- **Git**: `Trading852-v2/.git` was a broken ghost (no config/objects). Re-initialized and connected to `Marcvrick/trading852-v2`. `git push` from this folder now triggers Vercel auto-deploy.

### Apr 26, 2026 — README v2 created

- Documents the new `src/` → `dist/` build pipeline, partials, source page format (`CONFIG` + `JSONLD` comments, no `<head>` / nav / footer in source), images convention (`src/analyses/images/<slug>.jpg`), Vercel cleanUrls gotcha.
- Editorial workflow (style guide, 7-section structure, scorecard, drafts, published articles, "what to never write", SEO checklist) carried over from the v1 README.
- Triggered by the `hsi-35-year-trendline` broken image (image folder was never migrated from v1 to v2 because the convention was undocumented).
