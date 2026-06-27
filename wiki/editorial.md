---
title: "Trading852 v2, Editorial Workflow"
tags: [trading852, wiki, editorial, writing]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-24
---

# Trading852 v2, Editorial Workflow

Part of the [Trading852 wiki](index.md).

## Hard rules (digest)

The full, canonical style guide is [style-guide.md](style-guide.md): voice, the 7 sections, pre-flight tests, pitfalls. Voice parameters: [VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md). This page keeps the workflow and the absolute guardrails; it does not re-copy the guide.

- **DRAFT first.** Articles are drafted into `DRAFT/` and never published to `publish/analyses/` without review.
- **No em dash** (em dash or double hyphen) anywhere: articles, metadata, titles, changelog. Use a period, a colon, or restructure. The middle dot is the only title separator.
- **7-section escalator:** Hook, Company/Context, Discount, Catalyst, Valuation, Risks, Decision.
- **Sentences 15 to 25 words, never over 30.** Max 3 consecutive number-sentences, then an interpretation sentence.
- **Anchor price live** before writing; every price figure carries its adjacent date.
- **No internal-pipeline references** (Sophie, FinRatios, expert-analysis, "our prior note"). The article is the analyst's view.
- **No financial advice:** no buy/sell timing, no position sizing.
- **Every new article gets a homepage card** in the same commit that publishes it.

## Editorial workflow

### Step 1: Find the source material

Stock analyses: look up the ticker in `TRADING/Trading-research/HK Stocks/Experts analysis/`. Folder pattern: `{TICKER} - {Company} - {CONVICTION|MONITOR|AVOID}`. The verdict is whatever the expert analysis returns (`CONVICTION`, `MONITOR`, or `AVOID`). All three publish; the label drives how the article is framed and how it surfaces on the homepage, the sector hub eyebrow, the scorecard eyebrow, and the meta-verdict pill. Apply the verdict consistently across all four surfaces from day one.

Market thesis articles: source `.md` lives outside the repo (e.g. `TRADING/Trading852/BD/Briefs-ChatGPT/`).

### Step 2: Read the style guide

Open the local style guide at [style-guide.md](style-guide.md) and the voice guide at [../../Voix Marc/VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md). Key rules:

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

Stock analysis: copy `publish/analyses/1913-prada.html`. Market thesis: copy `publish/analyses/hsi-35-year-trendline.html`. Edit the `CONFIG` and `JSONLD` blocks first, then the body.

Required body elements:
- Hero with breadcrumb, meta row, h1, subtitle, tags
- Key takeaway box
- Section h2s, data tables
- Scenario table (3 rows max) at the end
- **Sources section**: `<div class="sources-section">` + `<h2>Sources</h2>` + `<ul>` with one `<li>` per source. Never plain `<h2>` + `<p>`.
- Article footer with disclaimer + back link (already in `footer-analysis.html` partial: do not duplicate)

### Step 5: Update the homepage

> **NON-NEGOTIABLE: every new article gets a homepage card, in the same commit that publishes it.** A new article is ALWAYS featured in the Recent-Analyses card list (it becomes the featured card) AND always creates a card on the homepage. Publishing the article file + feed + sitemap without touching `publish/index.html` ships a page that is live at its URL but unreachable by browsing. It exists only if you already know the link. This happened with `hong-kong-discount-cheap-two-ways` (Jun 2026, commit b50887c): published, in the sitemap, returning 200, but linked from nowhere. Do not let an article reach `main` without its card.

Two sections in [publish/index.html](../publish/index.html):

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

[publish/feed.xml](../publish/feed.xml): add a new `<item>` at the top, update `<lastBuildDate>`.

```xml
<item>
  <title>TITLE</title>
  <link>https://trading852.com/analyses/SLUG</link>
  <guid>https://trading852.com/analyses/SLUG</guid>
  <pubDate>Day, DD Mon YYYY 00:00:00 +0800</pubDate>
  <description>EXCERPT (1-2 sentences)</description>
</item>
```

[publish/static/sitemap.xml](../publish/static/sitemap.xml): add `<url>` entry, update homepage `<lastmod>`.

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


## ⚠️ EDITORIAL WORKFLOW (MANDATORY PROCEDURE)

**Important: this section replaced the old Step 2 description. Read it entirely before drafting.**

### Rule: Articles must pass DRAFT + review before publication

**Absolute sequence:**
1. Claude drafts → deposits in `DRAFT/` folder
2. Dany reviews and validates
3. Dany requests publication → Claude moves to `publish/analyses/`, updates homepage, updates feed/sitemap, commits
4. Claude never publishes directly to `publish/analyses/` without prior review

**Why:** The style guide is comprehensive. Articles that skip review publish with endemic voice/style errors that read as corporate templates, not Marc's perspective. Review before publication is not optional.

---


## What to never write

- "This is not investment advice"
- "It should be noted that" / "It is worth mentioning"
- Section title as a teaser: "What's next?", "The bottom line"
- A number without its source date or document
- A risk framed as hypothetical when it is documented
- **Any em dash** (`, ` or `, `) anywhere: articles, scorecard, metadata, titles, methodology, changelogs. Use a period, a colon, or restructure the sentence. The middle dot `·` is the only permitted title separator.
- **Any reference to internal research notes**. The published article is presented as the analyst's view, not the output of a prior pipeline. Never write "the original valuation work", "our prior note", "since we filed", "in our May analysis", "the earlier analysis flagged", or any phrase that implies a non-public preceding document. Public market data is fine (`+9% over the past three weeks`, `since the IPO`, `since the FY2025 release`); references to internal research are not. This is a specialisation of the broader "cuisine interne" rule in [style-guide.md](style-guide.md). When the urge appears, rewrite using a public anchor date instead.

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
- [ ] Image (if any) dropped in `publish/analyses/images/` with relative `<img src="images/...">`
- [ ] Homepage updated: new article in featured card, old cards shifted, evicted card prepended as item 04 in Identified Situations, all items renumbered, item count = (total published) − 3
- [ ] feed.xml: new `<item>` + `<lastBuildDate>` updated
- [ ] sitemap.xml: new `<url>` + homepage `<lastmod>` updated. **Refresh of an existing article** = bump that article's `<lastmod>` AND the homepage `<lastmod>` AND JSON-LD `dateModified` to the refresh date
- [ ] Scorecard: **automatic** (no action) for stock articles with `meta-ticker` + `meta-verdict` in the hero. Set CONFIG `scorecardName` only if a shorter display name is wanted
- [ ] No em dash anywhere (`grep -rn ", \|, " publish/ assets/` returns nothing)
- [ ] `node build.js` runs clean
- [ ] Spot-checked `dist/analyses/<slug>.html` in a browser
- [ ] Committed and pushed

---


---
[Wiki index](index.md)
