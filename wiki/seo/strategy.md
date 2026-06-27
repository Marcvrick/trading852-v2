# SEO Strategy · Trading852

*April 2026 · revised May 2026*

> **Strategic constraint (May 2026 revision)** : la méthodologie Trading852 (SOTP, NAV, lecture de filings) **n'est jamais publiée comme contenu autonome**. Elle reste un moat éditorial. Le MOFU est servi par des sectoral hubs, comparatifs ticker vs peer, screens éditorialisés et thesis articles macro, jamais par des pages méthode. Voir [`SEO/keywords-funnel.md`](../../SEO/keywords-funnel.md) pour le détail des formats.

---

## Executive Summary

Trading852 is a personal research site publishing conviction analysis on HKEX-listed companies. The SEO opportunity is significant: the niche (English-language, independent, HKEX-specific value research) has almost no serious competition from an SEO standpoint, and the existing content is already high-quality, original, and citation-worthy.

The strategy has three phases:
1. **Fix the floor**: clean URLs, schema, sitemap, author page (3 hours of work)
2. **Build the pillar**: sectoral hubs, comparatifs, thesis articles, screens. The methodology itself is never published. (months 1–3)
3. **Compound**: let the content library grow, attract links, rank for long-tail tickers (months 4–12)

The biggest risk is not competition; it is inconsistency. Two analyses per month is enough to build authority in this niche within 12 months.

---

## Target Audience

**Primary:** English-speaking retail investors researching HKEX-listed stocks
- Based in: US, UK, Hong Kong, Singapore, Australia
- Intent: Research before investing, understanding the HK market, finding undervalued names
- Search behaviour: Company name + "analysis" / "undervalued" / "NAV", plus thematic queries like "why invest Hong Kong 2026"

**Secondary:** Finance students, analysts, journalists covering HK markets
- Intent: Background research, data verification, methodology reference
- High E-E-A-T value; these readers link and cite

---

## Positioning

**Unique angle:** Trading852 is the only English-language site that combines:
- HKEX-specific focus (not Asia-broad)
- Free access (not paywalled like Asian Century Stocks)
- Narrative depth (not just screens like Emerging Value)
- Investment thesis + filing-grounded valuation (not just governance like Webb-site)
- Independent voice (not a broker or fund)

One-line SEO positioning: **"The independent English-language research site for HKEX value investors."**

---

## Keyword Strategy

### Tier 1 · Own These (low competition, high intent)

> Volumes mensuels = estimations directionnelles, à valider via Google Search Console + Google Keyword Planner. Voir le pipeline dans [`SEO/keywords-funnel.md`](../../SEO/keywords-funnel.md).

| Keyword | Monthly searches (est.) | Competition | Target page |
|---|---|---|---|
| `dickson concepts privatization` | 50–150 | Very Low | `/analyses/0113-dickson-concepts` |
| `jacobio pharmaceuticals analysis` | 100–300 | Very Low | `/analyses/1167-jacobio` |
| `prada 1913 stock analysis` | 100–300 | Low | `/analyses/1913-prada` |
| `tencent music stock analysis` | 200–500 | Low | `/analyses/1698-tencent-music` |
| `haier smart home stock analysis` | 100–300 | Low | `/analyses/6690-haier` |
| `yadea stock analysis` | 50–150 | Very Low | `/analyses/1585-yadea` |
| `HKEX conglomerate discount` | 100–300 | Very Low | Thesis article (à créer) |
| `southbound stock connect explained` | 100–300 | Low-Medium | Thesis article (à créer) |

### Tier 2 · Build Toward (medium competition, broader)

| Keyword | Monthly searches (est.) | Competition | Target page |
|---|---|---|---|
| `hong kong undervalued stocks 2026` | 1 000–3 000 | Medium | Homepage + thesis articles |
| `CK Hutchison undervalued` | 500–1 500 | Medium | `/analyses/0001-ck-hutchison` |
| `why invest hong kong stocks` | 1 000–2 000 | Medium | `/analyses/why-hong-kong-why-now` |
| `Jardine Matheson analysis` | 500–1 000 | Medium | `/analyses/jardine-matheson` |
| `stock connect southbound flows` | 500–1 000 | Medium | Thesis article |

### Tier 3 · Monitor (competitive, build authority toward)

| Keyword | Monthly searches (est.) | Competition | Notes |
|---|---|---|---|
| `hong kong stocks` | 10 000+ | High | Too broad; earn it via topic authority |
| `HKEX analysis` | 5 000+ | High | Same, earn gradually |
| `hang seng undervalued` | 2 000+ | Medium-High | Possible with 20+ indexed analyses |

---

## E-E-A-T Strategy

Finance content falls under Google's YMYL (Your Money Your Life) category; E-E-A-T is scrutinised heavily.

**Experience:** Demonstrated by original SOTP calculations, specific filings cited with dates, real numbers from real documents. Every article already does this; maintain it.

**Expertise:** Shown by the depth of each individual analysis, original SOTP models, filing-grounded NAV calculations, catalyst frameworks applied case by case. The methodology is signalled by results, not published as standalone tutorials.

**Authoritativeness:** Built over time as other sites link to and cite Trading852 data. Sectoral hubs and screen pages (e.g. "HK privatization watch", "HK deep value 2026") are designed to be cited.

**Trustworthiness:** Named author (Marc), visible date on every article, disclaimer page, source citations with dates. Currently partially achieved. Gap: no author photo, no social proof links.

### E-E-A-T Action List

| Action | Impact | Effort |
|---|---|---|
| Add "Marc" byline to all articles | High | Low |
| Publish `/about/` author page | High | Low |
| Add Person schema to about page | Medium | Low |
| Add Article schema to all articles | Medium | Low |
| Link all articles to source HKEX filings | High | Medium |
| Add "last updated" date to evergreen pages | Medium | Low |

---

## Schema Plan

| Page | Schema Type | Priority |
|---|---|---|
| Homepage | `WebSite`, `Person` (author) | Week 1 |
| All analyses | `Article` + `Person` (author) | Week 1 |
| Sectoral hubs | `CollectionPage` + `ItemList` | Week 3 |
| Comparatifs ticker vs peer | `Article` + `ComparativeAnalysis` (custom) | Week 4 |
| Screens éditorialisés | `CollectionPage` + `ItemList` | Phase 2 |
| About page | `Person`, `ProfilePage` | Week 2 |

---

## Technical Foundation

### Must-Have (Week 1)

```
vercel.json         → cleanUrls: true
robots.txt          → allow all, sitemap pointer
sitemap.xml         → all live pages, update on every publish
<meta description>  → all pages, 150–160 chars, keyword-first
canonical tags      → self-referential on every page
```

### Should-Have (Month 1–2)

```
Open Graph tags     → og:title, og:description, og:image per page
Twitter Card        → twitter:card, twitter:title
Article schema      → JSON-LD in <head> of all analysis pages
Breadcrumb schema   → on all inner pages
```

### Nice-to-Have (Month 3+)

```
Core Web Vitals     → LCP < 2.5s, CLS < 0.1 (fonts may cause CLS, preload)
hreflang            → not needed (English only)
Pagination          → not needed yet
Google News sitemap → add if publishing cadence reaches 1+/week
```

---

## GEO (Generative Engine Optimisation)

Trading852 content is well-positioned to be cited by AI systems because:
- Original data and calculations not found elsewhere
- Tables with precise numbers (highly cited by AI)
- Named sources (HKEX filings, company investor decks with dates)
- Clear, quotable assertions ("Great Eagle trades at 88% below its own NAV estimate")

**To maximise AI citation:**
- Keep tables in every article; AI systems extract and cite tabular data readily
- First paragraph of every article should contain 1–2 quotable facts
- Sectoral hubs should have a one-paragraph thesis at the top (AI pulls these for "best HK X stocks" queries)
- Ensure author entity is defined via Person schema with `sameAs` links when possible

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Low publishing frequency | Set 2 analyses/month as minimum; even short analyses count |
| E-E-A-T penalties for YMYL | Named author + source discipline already in place; add schema |
| Competitor copies content | Original SOTP models and filing citations are hard to replicate |
| Algorithm update | Diverse content types (individual analyses + sectoral hubs + thesis + screens) reduce single-type dependency |
| Stale content | Mark analysis articles with "updated" dates; revisit after earnings |
