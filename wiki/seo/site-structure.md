# Site Structure — Trading852

*April 2026*

---

## Current State (flat, minimal)

```
trading852.com/
├── index.html
├── about.html          ← moved to Cold content, not live
├── analyses/
│   ├── 0113-dickson-concepts.html
│   ├── 1167-jacobio-pharmaceuticals.html
│   └── hsi-35-year-trendline.html
```

**Problems:**
- No URL hierarchy — all articles at the same depth
- No topic/category pages — no internal linking surface
- No method/glossary content — no educational SEO entry points
- No author page — E-E-A-T signal missing
- `.html` extensions in URLs — not ideal for long-term (fixable at hosting level)

---

## Target Architecture

```
trading852.com/
│
├── /                           ← Homepage (index.html)
│
├── /analyses/                  ← Article hub (all published analyses)
│   ├── /0113-dickson-concepts
│   ├── /1167-jacobio-pharmaceuticals
│   ├── /hsi-35-year-trendline
│   └── /[ticker]-[slug]        ← future articles
│
├── /method/                    ← How we work (pillar page)
│   ├── /sotp-valuation         ← "What is sum-of-parts valuation"
│   ├── /nav-discount           ← "What is NAV discount"
│   ├── /how-to-read-hkex       ← "How to read an HKEX annual report"
│   └── /catalyst-framework     ← "What makes a catalyst"
│
├── /hong-kong/                 ← Market context pillar
│   ├── /why-now                ← Redirect → /analyses/hsi-35-year-trendline
│   └── /market-structure       ← Future: HK market explained
│
├── /about/                     ← Author page (E-E-A-T critical)
│
└── /disclaimer/                ← Legal
```

---

## URL Strategy

### Current
`trading852.com/analyses/0113-dickson-concepts.html`

### Target (clean URLs — configure at hosting/Vercel level)
`trading852.com/analyses/0113-dickson-concepts`

**How to implement on Vercel:** Add `vercel.json` with clean URL rewrites (see Implementation Roadmap).

### Naming Convention for New Articles

**Stock analysis:** `/analyses/[ticker]-[company-slug]`
- `/analyses/0013-hutchison-ports`
- `/analyses/0041-great-eagle-holdings`
- `/analyses/0101-hk-land`

**Market thesis:** `/analyses/[theme-slug]`
- `/analyses/why-hong-kong-why-now`
- `/analyses/hkex-conglomerate-discount-2026`

**Method content:** `/method/[concept-slug]`
- `/method/nav-discount-explained`
- `/method/sum-of-parts-valuation`

---

## Internal Linking Map

Every analysis article should link to:
- The relevant `/method/` page (e.g., NAV discount article → `/method/nav-discount`)
- 1–2 related analyses (e.g., Great Eagle → Hongkong Land)
- Homepage

Every method page should link to:
- 2–3 analyses that demonstrate the concept
- `/about/`

Homepage should link to:
- All published analyses
- `/method/` pillar
- `/about/`

---

## Page Priority Queue

| Priority | Page | Type | SEO Rationale |
|---|---|---|---|
| 1 | `/about/` | Author page | E-E-A-T foundation — required before scaling |
| 2 | `/method/nav-discount` | Educational | "NAV discount hong kong" — very low competition |
| 3 | `/method/sotp-valuation` | Educational | "sum of parts valuation hong kong" — low competition |
| 4 | `/method/how-to-read-hkex` | Educational | "how to read HKEX annual report" — unowned keyword |
| 5 | `/analyses/why-hong-kong-why-now` | Market thesis | "why invest hong kong 2026" — medium competition |
| 6 | Next stock analysis | Stock-specific | Long-tail, high intent, very low competition |

---

## Technical Notes

### vercel.json (clean URLs)
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://trading852.com/sitemap.xml
```

### sitemap.xml (generate and maintain)
- Include all published pages
- Set `changefreq: monthly` for analyses, `weekly` for homepage
- Set `priority: 1.0` for homepage, `0.8` for analyses, `0.6` for method pages
