# Implementation Roadmap — Trading852

*April 2026 — March 2027*

---

## Phase 1 — Foundation (Weeks 1–4)

**Goal:** Fix the technical floor, establish E-E-A-T, get the first 4 method pages live.

### Week 1 — Technical Setup

- [ ] **Add `vercel.json`** with `cleanUrls: true` → removes `.html` from all URLs
  ```json
  { "cleanUrls": true, "trailingSlash": false }
  ```
- [ ] **Add `robots.txt`** at root
  ```
  User-agent: *
  Allow: /
  Sitemap: https://trading852.com/sitemap.xml
  ```
- [ ] **Generate `sitemap.xml`** — include all 4 live pages (index, 3 analyses)
- [ ] **Add Article schema** to the 3 existing analyses (JSON-LD in `<head>`)
- [ ] **Add WebSite schema** to homepage
- [ ] **Add `<meta name="description">`** to index.html (currently missing a strong description)
- [ ] **Verify Google Search Console** — add property, submit sitemap

### Week 2 — Author Page (E-E-A-T critical)

- [ ] **Publish `/about/`** — author page with:
  - Name: Marc
  - Short bio (the 30-word version already written)
  - What Trading852 is
  - Link to disclaimer
- [ ] **Add author byline** to all 3 existing articles: "Marc — Trading852 · April 11, 2026"
- [ ] **Add Person schema** to about page
- [ ] **Cross-link**: all articles link to `/about/`, about page links to all articles

### Week 3 — Method Pages (×2)

- [ ] Publish `/method/nav-discount` — "What Is NAV Discount?"
- [ ] Publish `/method/sotp-valuation` — "Sum-of-Parts Valuation Explained"
- [ ] Add to sitemap
- [ ] Internal link from existing articles (Why HK, Dickson, Jacobio) to relevant method pages

### Week 4 — Method Pages (×2) + First New Analysis

- [ ] Publish `/method/how-to-read-hkex`
- [ ] Publish `/method/catalyst-framework`
- [ ] Publish first new stock analysis (CK Hutchison or Hongkong Land — whichever has CONVICTION)
- [ ] Update homepage with new article card

---

## Phase 2 — Expansion (Weeks 5–12)

**Goal:** 2 new analyses per month, complete method pillar, begin glossary.

### Ongoing Weekly

- [ ] Monitor Google Search Console — track impressions for target keywords
- [ ] One glossary entry per week (see Content Calendar)
- [ ] Keep sitemap.xml updated after every publish

### Month 2 (Weeks 5–8)

- [ ] Publish 2 stock analyses (Hongkong Land + Great Eagle)
- [ ] Publish "Conglomerate Discount" thesis article
- [ ] Begin tracking impressions for "NAV discount hong kong" and "HKEX conglomerate"
- [ ] Add `NewsArticle` schema to thesis articles, `Article` schema to stock analyses

### Month 3 (Weeks 9–12)

- [ ] Publish 2 stock analyses (Jardine Matheson + Swire Pacific)
- [ ] Publish "Stock Connect and the New Buyer" thesis piece
- [ ] Add internal links across all 8+ articles (at minimum 2 per article)
- [ ] Review: which pages are getting impressions? Double down.

---

## Phase 3 — Scale (Months 4–6)

**Goal:** 10+ indexed analyses, method pillar complete, first inbound links.

### Content

- [ ] 2 analyses per month (Henderson Land, Wharf, Sino Land, Kerry, NWS)
- [ ] "Reading the Related-Party Notes" educational piece
- [ ] "The Privatisation Playbook" — historical data article (link magnet)

### Link Building

- [ ] Share articles in relevant communities: r/SecurityAnalysis, r/ValueInvesting, HK investing forums
- [ ] Reach out to Asian Century Stocks, Emerging Value — offer guest perspective or data
- [ ] Cite and email Webb-site if cross-referencing governance data
- [ ] Submit to finance aggregators that list HKEX research

### Technical

- [ ] Add `breadcrumb` schema to all article pages
- [ ] Implement `SiteLinksSearchBox` schema on homepage
- [ ] Review Core Web Vitals in Search Console — address any LCP/CLS issues
- [ ] Add Open Graph tags (`og:title`, `og:description`, `og:image`) for social sharing

---

## Phase 4 — Authority (Months 7–12)

**Goal:** Recognised as the go-to English source for HKEX value research.

### Content

- [ ] NAV Dashboard page — live table of discount-to-NAV for 10 covered companies (updated quarterly)
- [ ] "Historical HK Privatisations 2000–2026" — reference page (link magnet)
- [ ] "Hong Kong Value Investing — Year in Review 2026" (December)
- [ ] Event coverage: any privatisation offers, major PBOC announcements

### Distribution

- [ ] Launch email list — simple signup form, send new articles to subscribers
- [ ] Social: minimal LinkedIn presence — share each new article once
- [ ] Consider Substack cross-post for discovery (keep trading852.com as canonical)

### Monitoring

- [ ] Monthly: Search Console review — rankings, CTR, impressions
- [ ] Monthly: Check who is linking to the site (Ahrefs free / Search Console links report)
- [ ] Quarterly: Update NAV/discount tables in existing articles — freshness signal

---

## KPI Targets

| Metric | Baseline (Apr 2026) | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Google-indexed pages | ~4 | 20+ | 40+ | 70+ |
| Organic sessions/month | ~0 | 200+ | 800+ | 2 500+ |
| Keywords ranking (any position) | 0 | 30+ | 100+ | 300+ |
| Keywords in top 10 | 0 | 3–5 | 15+ | 40+ |
| Inbound links (domains) | 0 | 2+ | 8+ | 20+ |
| AI citation (Perplexity/ChatGPT) | 0 | Monitor | 2–3 | 5+ |

---

## Quick Wins (do this week)

1. **`vercel.json`** — clean URLs, one file, 5 minutes
2. **`robots.txt` + `sitemap.xml`** — 30 minutes
3. **Article schema** on 3 existing pages — 1 hour
4. **Google Search Console** — property verification, sitemap submission — 20 minutes
5. **Author byline** on all articles — 15 minutes

Total: ~3 hours of setup to make the existing content fully crawlable and schema-tagged.
