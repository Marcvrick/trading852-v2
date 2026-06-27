---
title: "Trading852 v2, Build Pipeline"
tags: [trading852, wiki, build, static-site]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-27
---

# Trading852 v2, Build Pipeline

Part of the [Trading852 wiki](index.md).

## What changed vs v1

v1 was flat HTML, every page duplicated the `<head>`, navbar, and footer. A single nav link change required edits in 13 files.

v2 splits the site into:
- **Source pages** ([publish/](../publish/)): body content + a `<!-- CONFIG -->` frontmatter comment. **No `<head>`. No navbar. No footer.**
- **Partials** ([publish/_partials/](../publish/_partials/)): single source of truth for `<head>`, navbar, footer variants, scroll script.
- **Build script** ([build.js](../build.js)): zero-dependency Node.js. Reads each source file, parses its `CONFIG` + `JSONLD` blocks, injects partials, writes the assembled HTML to `dist/`.
- **Vercel**: runs `node build.js` on push, serves `dist/`.

One nav link change = one edit in [publish/_partials/navbar.html](../publish/_partials/navbar.html) → propagates everywhere on next build.

---


## Folder structure

```
Trading852-v2/
├── build.js                    ← Build script (Node, zero deps)
├── vercel.json                 ← buildCommand + cleanUrls + rewrites + headers
├── README.md
│
├── wiki/                       ← Knowledge hub (NOT served): all docs live here
│   ├── index.md                   Wiki hub
│   ├── style-guide.md             Voice, structure, 7-section template, what to never write
│   ├── editorial.md               DRAFT-first workflow + guardrails
│   ├── build-pipeline.md          This file
│   ├── scorecard.md / ops.md / articles.md / log.md
│   └── seo/                       SEO sub-hub
│       ├── index.md                Sub-hub
│       ├── patterns.md             Mandatory ticker-analysis SEO pattern
│       ├── strategy.md             Positioning + keyword targets
│       ├── site-structure.md       URL architecture + internal linking
│       ├── content-calendar.md     Pipeline of upcoming articles
│       ├── competitor-analysis.md  Market gap mapping
│       ├── implementation-roadmap.md Staged delivery plan
│       └── architecture-audit-2026-05-07.md  Schema/sitemap audit
│
├── assets/                     ← Static assets copied as-is to dist/assets/
│   ├── favicon-32.png
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png
│   └── scorecard.js               Live HK price fetcher (Yahoo proxy)
│
├── publish/
│   ├── _partials/              ← Shared HTML fragments (NOT served)
│   │   ├── head.html              <head> with {{TITLE}}, {{OG_*}}, {{JSONLD}} tokens
│   │   ├── navbar.html            Header nav, used on every page
│   │   ├── footer-analysis.html   Footer for article pages
│   │   ├── footer-home.html       Footer for index + scorecard
│   │   ├── footer-static.html     Footer for static pages (about, legal, sector + thesis hubs)
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
├── scripts/                    ← Maintenance scripts (not served, not built)
│   └── update-hsi-quote.py        Refresh the live HSI quote + 5y sparkline on the market-thesis hub
│
├── preview-trading852.command  ← Double-click: build, then serve dist/ locally on :8799
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
3. Walks `publish/` (skipping `_partials` and any name starting with `_` or `.`).
4. For every `.html` source file: parses `CONFIG` + `JSONLD` blocks, picks the right CSS files based on `layout`, assembles `<head>` + navbar + body + footer + scroll script.
5. For every non-HTML file: copies as-is, preserving the relative path. **This is how images travel into `dist/`**: drop a file under `publish/analyses/images/` and it shows up at `/analyses/images/...` on the live site.
6. Generates the scorecard positions from the published articles and writes `dist/assets/scorecard-recos.json` (see "Scorecard" below). Prints `Scorecard: N stock positions + 1 benchmark generated`.

No npm install, no node_modules, no watcher. Pure `fs` + `path`.

---


## Source page format

Every page in `publish/` (except `_partials/`) follows the same structure:

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


## Images convention (important)

Article images go in `publish/analyses/images/<slug>.jpg`. The build copies them as-is to `dist/analyses/images/<slug>.jpg`.

In the article HTML, reference them with a **relative** path so the link works both in local preview and in production:

```html
<img src="images/hsi-35y-trendline.jpg" alt="..." width="1280" height="517" loading="lazy" decoding="async" />
```

Always set `width`, `height`, `alt`. Below-fold images get `loading="lazy" decoding="async"`.

> Bug we hit on Apr 26 2026: `hsi-35-year-trendline.html` referenced `images/hsi-35y-trendline.jpg` but `publish/analyses/images/` did not exist in v2 (was never migrated from v1). The image returned the alt text on the live site. Fix: drop the .jpg into `publish/analyses/images/` and rebuild.

---


## Vercel deployment

[vercel.json](../vercel.json) settings:

- `buildCommand: "node build.js"`: Vercel runs the build on every push.
- `outputDirectory: "dist"`: Vercel serves the build output, not `publish/`.
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


## Site plumbing

### Header nav: 4 items, identical on every page

```
Analyses · Scorecard · HSI · About
```

Defined once in [publish/_partials/navbar.html](../publish/_partials/navbar.html). Footer Explore column mirrors it in each `footer-*.html` partial.

**HSI target (Jun 24 2026):** the `HSI` item links to the Hang Seng Index Research hub [`/analyses/market-thesis`](../publish/analyses/market-thesis.html), not a single article. The hub H1 reads "Hang Seng Index Research"; the URL, breadcrumb label, `articleSection`, and card eyebrows keep "Market Thesis" so every cross-reference stays intact.

### Live HSI quote on the market-thesis hub

The top of [publish/analyses/market-thesis.html](../publish/analyses/market-thesis.html) carries a live Hang Seng value, day change, and a 5-year weekly sparkline (`.hsi-quote`, styled in [publish/styles/page.css](../publish/styles/page.css)), sitting above the article cards. It is a **live client-side widget**: [assets/hsi-quote.js](../assets/hsi-quote.js) fetches Yahoo `^HSI` through the yahoo-proxy worker (the same one [scorecard.js](../assets/scorecard.js) uses) on every page load and rewrites the value, the day change, and the 5-year sparkline SVG. It updates on every visit, so it is never stale. `build.js` injects the script on any page whose source contains a `class="hsi-quote"` block.

The HTML also ships a **build-time snapshot as the no-JS fallback** (the value shown before JS runs, or if the live fetch fails). Keep it current before a deploy:

```bash
python3 scripts/update-hsi-quote.py && node build.js
```

[scripts/update-hsi-quote.py](../scripts/update-hsi-quote.py) fetches Yahoo `^HSI` (weekly closes for the chart, daily for the day change), regenerates the `.hsi-quote` block in place (idempotent), and prints the refreshed value. The sparkline geometry is shared with `hsi-quote.js` (viewBox 720 x 150) so the live render and the fallback match. Path fixed Jun 27 2026: it still pointed at `src/analyses/...` after the `src/`→`publish/` rename, so the manual refresh would have failed.

> **Gotcha:** the block carries no HTML comment markers. The interactive zsh history-expansion of `!` rewrites `<!--` to `<\!--` and breaks the comment, so the script locates the block by its `<div class="hsi-quote">` instead.

### Per-layout footer

`build.js` picks the footer based on `layout`:
- `article` → `footer-analysis.html`
- `index` / `scorecard` → `footer-home.html`
- `static` → `footer-static.html`

All footers use a flex row (`justify-content:space-between`): tagline on the left, "Be water, My friend." on the right. Same style: `font-family:var(--ff-serif);font-size:var(--fs-16);color:rgba(255,255,255,0.45);line-height:1.7`.

### Article footer tagline (canonical)

> HKEX filings. Mispriced companies. Written up when the math holds.

---


---
[Wiki index](index.md)
