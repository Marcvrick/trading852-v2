# SEO Strategy — Trading852

*April 2026*

---

## Executive Summary

Trading852 is a personal research site publishing conviction analysis on HKEX-listed companies. The SEO opportunity is significant: the niche (English-language, independent, HKEX-specific value research) has almost no serious competition from an SEO standpoint, and the existing content is already high-quality, original, and citation-worthy.

The strategy has three phases:
1. **Fix the floor** — clean URLs, schema, sitemap, author page (3 hours of work)
2. **Build the pillar** — method pages + consistent stock analysis publishing (months 1–3)
3. **Compound** — let the content library grow, attract links, rank for long-tail tickers (months 4–12)

The biggest risk is not competition — it is inconsistency. Two analyses per month is enough to build authority in this niche within 12 months.

---

## Target Audience

**Primary:** English-speaking retail investors researching HKEX-listed stocks
- Based in: US, UK, Hong Kong, Singapore, Australia
- Intent: Research before investing, understanding the HK market, learning SOTP methodology
- Search behaviour: Company name + "analysis" / "undervalued" / "NAV", plus thematic queries like "why invest Hong Kong 2026"

**Secondary:** Finance students, analysts, journalists covering HK markets
- Intent: Background research, data verification, methodology reference
- High E-E-A-T value — these readers link and cite

---

## Positioning

**Unique angle:** Trading852 is the only English-language site that combines:
- HKEX-specific focus (not Asia-broad)
- Free access (not paywalled like Asian Century Stocks)
- Narrative depth (not just screens like Emerging Value)
- Investment thesis + SOTP methodology (not just governance like Webb-site)
- Independent voice (not a broker or fund)

One-line SEO positioning: **"The independent English-language research site for HKEX value investors."**

---

## Keyword Strategy

### Tier 1 — Own These (low competition, high intent)

| Keyword | Monthly searches (est.) | Competition | Target page |
|---|---|---|---|
| `NAV discount hong kong` | 200–500 | Very Low | `/method/nav-discount` |
| `HKEX conglomerate discount` | 100–300 | Very Low | `/analyses/why-hong-kong-why-now` |
| `great eagle holdings NAV` | 100–200 | Very Low | `/analyses/0041-great-eagle` |
| `Hongkong Land NAV discount` | 200–500 | Low | `/analyses/0101-hongkong-land` |
| `dickson concepts privatization` | 50–150 | Very Low | `/analyses/0113-dickson-concepts` |
| `jacobio pharmaceuticals analysis` | 100–300 | Very Low | `/analyses/1167-jacobio` |
| `sum of parts valuation HKEX` | 200–500 | Low | `/method/sotp-valuation` |
| `how to read HKEX annual report` | 300–800 | Low | `/method/how-to-read-hkex` |

### Tier 2 — Build Toward (medium competition, broader)

| Keyword | Monthly searches (est.) | Competition | Target page |
|---|---|---|---|
| `hong kong undervalued stocks 2026` | 1 000–3 000 | Medium | Homepage + thesis articles |
| `CK Hutchison undervalued` | 500–1 500 | Medium | `/analyses/0001-ck-hutchison` |
| `why invest hong kong stocks` | 1 000–2 000 | Medium | `/analyses/why-hong-kong-why-now` |
| `Jardine Matheson analysis` | 500–1 000 | Medium | `/analyses/jardine-matheson` |
| `stock connect southbound flows` | 500–1 000 | Medium | Thesis article |

### Tier 3 — Monitor (competitive, build authority toward)

| Keyword | Monthly searches (est.) | Competition | Notes |
|---|---|---|---|
| `hong kong stocks` | 10 000+ | High | Too broad; earn it via topic authority |
| `HKEX analysis` | 5 000+ | High | Same — earn gradually |
| `hang seng undervalued` | 2 000+ | Medium-High | Possible with 20+ indexed analyses |

---

## E-E-A-T Strategy

Finance content falls under Google's YMYL (Your Money Your Life) category — E-E-A-T is scrutinised heavily.

**Experience:** Demonstrated by original SOTP calculations, specific filings cited with dates, real numbers from real documents. Every article already does this — maintain it.

**Expertise:** Shown by methodology depth (SOTP, NAV, catalyst framework explained in method pages) and consistent accuracy. The method pillar directly signals expertise.

**Authoritativeness:** Built over time as other sites link to and cite Trading852 data. The "Privatisation Playbook" and "NAV Dashboard" pieces are designed to be cited.

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
| Method pages | `Article` + `HowTo` (where applicable) | Week 3 |
| About page | `Person`, `ProfilePage` | Week 2 |
| Glossary entries | `DefinedTerm` | Phase 2 |
| Data tables | `Dataset` (NAV dashboard) | Phase 3 |

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
Core Web Vitals     → LCP < 2.5s, CLS < 0.1 (fonts may cause CLS — preload)
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
- Keep tables in every article — AI systems extract and cite tabular data readily
- First paragraph of every article should contain 1–2 quotable facts
- Method pages should have clear definition boxes (AI pulls these for "what is X" queries)
- Ensure author entity is defined via Person schema with `sameAs` links when possible

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Low publishing frequency | Set 2 analyses/month as minimum — even short analyses count |
| E-E-A-T penalties for YMYL | Named author + source discipline already in place; add schema |
| Competitor copies content | Original SOTP models and filing citations are hard to replicate |
| Algorithm update | Diverse content types (analysis + method + thesis) reduce single-type dependency |
| Stale content | Mark analysis articles with "updated" dates; revisit after earnings |
