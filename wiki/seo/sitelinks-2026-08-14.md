---
title: "Sitelinks, brand-query structure"
tags: [trading852, seo, sitelinks, schema, sitemap]
category: Trading/Blog
type: finding
created: 2026-08-14
updated: 2026-08-14
---

# Sitelinks. Brand-query structure.

Symptom, 2026-08-14: searching `trading852` on Google returns the homepage and `/about` as two separate, equal-weight results. No sitelink block, and the homepage is not the first result.

## The tree Dany wants

```
trading852.com                    ← homepage, the articles
├── Scorecard        /scorecard
├── Hang Seng Index  /analyses/market-thesis
└── About            /about
```

Three branches, not seven. The sector hubs stay crawlable and indexable, but they are deliberately not candidates for the block.

There is no `/analyses` branch and there should not be: the homepage already carries the featured card, the small-card stack, and the full numbered catalogue. A separate index page would duplicate the homepage and split the signal between two URLs.

## What sitelinks actually are

Google generates them algorithmically from pages it has **indexed** and that are **prominently linked from the homepage** with stable anchor text. No markup forces them. `SiteNavigationElement` is not a documented Google sitelink signal (Bing does use it); it is cheap and standard, so it is in, but it is not the mechanism.

The mechanisms: the candidate has to be in the index, the brand query has to resolve to the homepage as one entity, and each branch has to be reachable under **one URL with one label**.

## What was fixed

1. **The HSI branch was split in three.** Navbar said `HSI` → `/analyses/market-thesis`, the home footer said `Hang Seng Index` → `/analyses/hsi-35-year-trendline`, the sector grid said `Market Thesis` → `/analyses/market-thesis`. Two URLs, three labels, so three weak candidates instead of one strong one. All consolidated to `Hang Seng Index` → `/analyses/market-thesis`. The branch is now in the navbar and in all three footers: 64 identical links sitewide, matching Scorecard and About exactly.
2. **The 7 sector hubs were excluded from `sitemap.xml`.** Deliberate, back when they were 250-580 word link lists and GSC answered "Discovered - currently not indexed" (`build.js` comment). They now run 630-1600 words. An unindexed page can never become a sitelink. Back in via `HUB_PAGES`, derived from `Object.values(SECTION_HUB_SLUG)` so it cannot drift, minus anything already in `TREE_PAGES` (no duplicate `<loc>`). Sitemap 25 → 32 URLs.
3. **No `Organization` entity.** The homepage carried a bare `WebSite`. Now an `@graph`: `WebSite` + `Organization` (`alternateName`, `logo`, `sameAs` → IG and X) + an `ItemList` of exactly the 3 branches. `sameAs` is what ties the two social profiles to the domain as one brand, which is what the homepage needs to outrank `/about` on the brand query.
4. **"Browse by sector" was a `<div class="field-label">`.** The block holding all 7 hub links had no heading. Now an `<h2>`.

`<priority>` is ignored by Google (Bing reads it), so the 1.0 / 0.9 / 0.8 / 0.6 / 0.3 ladder in `generateSitemap` documents intent more than it moves anything.

## Where the branch list lives

`TREE_PAGES` in `build.js` is the sitemap half. The link half is hand-written in four partials. Change a branch and all five have to move together: `build.js`, `navbar.html`, `footer-home.html`, `footer-analysis.html`, `footer-static.html`. There is no build-time guard on this — if the split recurs, that guard is the thing to add.

## Not fixed here, on Dany's side

- Resubmit the sitemap in GSC, then URL-Inspect → request indexing on the 3 branches first, hubs second. The sitemap entry is permission; the request is what pulls the crawl forward on a young domain.
- `sameAs` helps only if the IG and X profiles link back to `trading852.com`.

## Optional, not done

13 article breadcrumbs still read `Market Thesis` → `/analyses/market-thesis`, and they feed `BreadcrumbList` names. Renaming them to `Hang Seng Index` would make the label uniform, at the cost of changing visible breadcrumb text on 13 published articles. The 64 nav/footer links already dominate, so this was left as an editorial call.

## Verification

```bash
node build.js && grep -o '<loc>[^<]*</loc>' dist/static/sitemap.xml | sort | uniq -d
```

Empty output = no duplicate URL. 32 `<loc>` total = 1 home + 3 branches + 20 dated analyses + 6 hubs + 2 legal. The build log prints the same number.

Timeline: sitelinks appear weeks after indexing, not days. Re-check the brand query and the GSC indexed count in ~4 weeks before changing anything else.

---
[SEO sub-hub](index.md)
