---
title: "Trading852 v2, Editorial Workflow"
tags: [trading852, wiki, editorial, writing]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-08-27
---

# Trading852 v2, Editorial Workflow

Part of the [Trading852 wiki](TRADING/Trading852-v2/wiki/index.md).

## Hard rules (digest)

The full, canonical style guide is [style-guide.md](style-guide.md): voice, the 7 sections, pre-flight tests, pitfalls. Voice parameters: [VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md). This page keeps the workflow and the absolute guardrails; it does not re-copy the guide.

- **Read [VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md) before the first sentence, not after.** The style guide sets the structure; VOIX-Marc sets the voice, and the two are not interchangeable. Four rules live only there and are the ones a draft loses first: every load-bearing number gets a human-scale referent in the next sentence, no belief attributed to an unnamed crowd (everyone, nobody, the consensus), no "it is not X, it is Y" reversal, no abstract category where a plain word exists. Verified 2026-08-12 on the foreign-investors draft: the article passed every style-guide gate and still broke all four.
- **DRAFT first.** Articles are drafted into `DRAFT/` and never published to `publish/analyses/` without review. `DRAFT/` (not yet reviewed) and `publish/drafts/` (reviewed, awaiting a price trigger) are two different states, never interchangeable.
- **No em dash** (em dash or double hyphen) anywhere: articles, metadata, titles, changelog. Use a period, a colon, or restructure. The middle dot is the only title separator.
- **7-section escalator:** Hook, Company/Context, Discount, Catalyst, Valuation, Risks, Decision.
- **Sentences 15 to 25 words, never over 30.** Max 3 consecutive number-sentences, then an interpretation sentence.
- **Anchor price live** before writing; every price figure carries its adjacent date.
- **China GDP: the World Bank series, always.** `NY.GDP.MKTP.CD`, current US dollars, from the
  World Bank API. Not the IMF WEO, and never a mix. The two differ by enough to change a
  headline: for 2010 the World Bank gives 6.193 trillion and the IMF 6.139, so one rounds to
  $6.2 and the other to $6.1. Decided 2026-08-27 after two articles shipped on different
  series and a reader comparing them would have seen two figures for the same economy.
  The API answers directly, so there is no reason to quote a remembered number:
  `https://api.worldbank.org/v2/country/CHN/indicator/NY.GDP.MKTP.CD?format=json&date=2010:2025`
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
- **Target length**: 1 000-1 400 words (ideal ~1 200)
- **Marc's voice**: accessible, direct, "montrer sans dire"

### Step 3: Article structure

| # | Section | Words |
|---|---|---|
| 1 | Hook (no header) | 80-120 |
| 2 | What the company/market does | 120-180 |
| 3 | Why the discount exists | 100-150 |
| 4 | Catalyst / main signal | 200-280 |
| 5 | Valuation (with table) | 150-200 |
| 6 | Risks (2 max, named in bold) | 180-250 |
| 7 | Decision (with scenario table) | 180-250 |

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

### Step 6: sitemap.xml + feed.xml: automatic, do not hand-edit

**Superseded 2026-08-20.** Both files used to be hand-maintained and drifted (3 articles missing
from the sitemap, 7 from the feed), `build.js` now regenerates both from disk on every build
(`generateSitemap` / `generateFeed`, see [build-pipeline.md](build-pipeline.md)). There is nothing
to edit here. `publish/feed.xml` and `publish/static/sitemap.xml` as files no longer exist; the
live ones are build output at `dist/feed.xml` / `dist/static/sitemap.xml`, gitignored like the
rest of `dist/`.

**What this means for a refresh:** set `modDate` (CONFIG) and `dateModified` (JSON-LD) to the
refresh date, same as always. `build.js` reads `modDate` off every article and uses it for the
sitemap `<lastmod>` whenever it postdates `pubDate`, no separate step, no separate file to touch.
(Bug fixed the same day this section was rewritten: `getAllAnalysisPages()` was reading `pubDate`
only, so every already-updated article sat on a sitemap date from its original publish, not its
last edit, Google had no signal any of them had changed. Confirm after building:
`grep -A1 SLUG dist/static/sitemap.xml` should show today's date, not the original `pubDate`.)

The feed's homepage "Updated" banner is also automatic (`generateUpdateBannerHTML`, one article
shown at a time, the single most recently `modDate`-stamped one, for `UPDATE_FRESH_DAYS` = 30 days
after `UPDATE_MIN_GAP_DAYS` = 7 days from its `pubDate`). Nothing to add by hand there either.

**Article update items in feed.xml** are one per article (the article's own `pubDate`), not one
per update, the old "add an UPDATE: item, collapse the previous one" instruction described a
manual per-update feed entry that no longer has a manual step to perform.

### Step 6b: the "Update" block inside the article: stack it, never shorten it

**Superseded 2026-08-20**, same day as Step 6. The old instruction said: keep the newest update's
full text, but truncate every PRIOR update down to a one-line summary plus a "see update above"
note. Checked before writing this: no article on the live site was ever actually edited down this
way, every update block that existed (9988-alibaba's April through June, 1913-prada's two) is
still full length. The instruction was dead on arrival, just never removed. This is what removes
it and replaces it with what actually happens now.

**Do not shorten old updates.** `build.js`'s `collapsifyUpdateNotices` (see
[build-pipeline.md](build-pipeline.md)) turns every `.update-notice` block into a native
`<details>/<summary>` disclosure automatically, the moment an article has 2 or more of them. The
newest ships open (full text, no click needed); every older one collapses to a clickable date
strip, one line tall, chevron on the right, and expands to its **full original text** on click.
Nothing is shortened, nothing is thrown away. A single-update article is untouched (stays a plain
`<div>`, no chevron implying there's more to expand when there isn't).

**What this means for you, writing an update:** write the new `<div class="update-notice">…</div>`
block exactly as before, same markup, same voice, full length, no self-editing for space, and
insert it **above** the previous one (newest-first stacking, already the convention). Do not touch
any earlier block's text. Do not add a "see update above" note. The collapsing is presentation
only, applied at build time, and needs nothing from the author. Worked example:
[9988-alibaba.html](../publish/analyses/9988-alibaba.html), 4 stacked updates, only the August 20
one open by default.

### Step 6c: the "Update" block · protocole de hiérarchie (obligatoire)

**Ajouté 2026-08-25, sur le 1167 Jacobio.** Le premier jet livrait huit paragraphes de faits
filés, tous de même poids, dans l'ordre où ils sortaient du filing. Dany: *"tu me sors une liste
de points mais c'est pas très clair qu'est-ce qui est clé"*. Le défaut n'était pas les chiffres,
c'était l'absence de rang. Un update qui ne classe pas oblige le lecteur à faire le tri, ce qui
est précisément le travail qu'il vient chercher.

**Tout update block se range en trois étages, dans cet ordre, sans exception.**

| Étage | Contenu | Volume |
|---|---|---|
| **1. Critique** | Le fait qui change la lecture de l'article d'origine. Le test: *qu'est-ce que le lecteur comprendrait de travers s'il ne lisait que le titre du communiqué ?* Écrire ça, et rien d'autre, en tête. | 1 à 2 paragraphes |
| **2. Secondaire** | Ce qui déplace un chiffre de l'article sans toucher la thèse: corrections de snapshot, rachats, runway, nouveaux essais, changements de base comptable. Compressé, jamais un paragraphe par fait. | 1 paragraphe |
| **3. Bottom line** | Réconciliation explicite avec ce qui a été publié: quelle affirmation tient, laquelle casse, laquelle reste ouverte, et quel dépôt la tranchera. Se termine sur la date du prochain filing qui bouge le chiffre porteur. | 1 paragraphe |

**Règles dures qui découlent du classement:**

- **L'étage 1 ouvre sur le contraste, pas sur le bulletin de notes.** ❌ *"Le chiffre que j'avais
  nommé revient à RMB 14,5 millions"* (bulletin). ✅ *"Profit de RMB 600,6 millions. RMB 716,3
  millions viennent d'un seul encaissement sur une ligne"* (contraste). Le score vient après le
  fait, jamais à sa place.
- **Un fait secondaire ne prend jamais son propre paragraphe.** Cinq corrections tiennent en un
  paragraphe. Si l'une mérite un paragraphe entier, elle appartient à l'étage 1 et il faut la
  remonter.
- **Le bottom line cite l'article, pas le filing.** C'est le seul endroit où l'update dit
  explicitement *tient / casse / ouvert* face aux scénarios publiés. Sans lui, le lecteur qui
  revient six mois plus tard ne sait pas ce qui reste valide au-dessus.
- **Cible 400 à 550 mots.** Au-delà, l'étage 2 n'a pas été compressé. Vérifier avant tout autre
  arbitrage: c'est presque toujours là que le gras se trouve.
- Le reste des conventions d'update block (empilement newest-first, ne jamais raccourcir un bloc
  ancien, collapsing automatique au build) reste inchangé, voir Step 6b ci-dessus.

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
1. Claude drafts → deposits in `DRAFT/` folder (never `publish/analyses/`, never `publish/drafts/`)
2. Dany reviews and validates
3. Dany requests publication → Claude moves to `publish/analyses/`, updates homepage, updates feed/sitemap, commits
4. Claude never publishes directly to `publish/analyses/` without prior review

**Why:** The style guide is comprehensive. Articles that skip review publish with endemic voice/style errors that read as corporate templates, not Marc's perspective. Review before publication is not optional.

**The three folders are three states. Never substitute one for another** ([style-guide.md](style-guide.md) makes step 1 absolute):

| Folder | State | Built by build.js | Readable |
|---|---|---|---|
| `DRAFT/` | written, not yet reviewed | no | no, source fragment with no DOCTYPE and no stylesheet |
| `publish/drafts/` | reviewed and approved, **awaiting a price trigger** | yes, into `dist/drafts/` | yes, unlinked from homepage, feed, sitemap |
| `publish/analyses/` | published | yes, into `dist/analyses/` | yes, linked everywhere |

> **`DRAFT/` is empty as of 2026-07-15.** Its six drafts were deleted on purpose: stale work, tickers dropped from coverage. Recreate the folder on the next draft, it is a location and not a store. Do not restore the old files, they remain in git history. Note `DRAFT/` files never rendered for review, which is worth fixing separately if review-by-reading matters more than the folder split.

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
- [ ] **SEO pattern applied**: see "SEO pattern (mandatory for all ticker analyses)" section above. Diff against [publish/analyses/1913-prada.html](../publish/analyses/1913-prada.html), the reference implementation (the old `DRAFT/1913-prada-SEO-OPTIMIZED.html` target never existed on disk or in git history)
- [ ] No bullet points in body text
- [ ] Every number has a date or source
- [ ] **Knowledge layer checked** ([wiki/knowledge/](knowledge/index.md)): no number silently contradicts a previously published claim, and nothing in [open-questions.md](knowledge/open-questions.md) touches this article's numbers. A contradiction is either stated in the article or fixed with a dated update note on the older one. Run this *after* the live price fetch, never instead of it: the layer is a check, never a source
- [ ] Valuation / NAV table present
- [ ] Scenario table present (3 rows max)
- [ ] Risks: exactly 2, named in bold
- [ ] Word count between 1 000 and 1 400
- [ ] Title contains a concrete number
- [ ] At least one H2 contains the entity name
- [ ] First paragraph of `What X Does` establishes ticker + HKEX listing
- [ ] At least one inline link to a sector hub (`/analyses/{sector}`)
- [ ] Image (if any) dropped in `publish/analyses/images/` with relative `<img src="images/...">`
- [ ] Homepage card, feed.xml, sitemap.xml: **all automatic**, generated from CONFIG on every build (see Step 6). Nothing to hand-edit. Just set `pubDate` (new article) or `modDate` (refresh) + JSON-LD `dateModified` to match, and confirm after building: `grep SLUG dist/index.html` (card present), `grep -A1 SLUG dist/static/sitemap.xml` (today's date on a refresh)
- [ ] **Refresh of an existing article, article body:** new `<div class="update-notice">` block inserted above the previous one, full length, nothing shortened (see Step 6b, the page collapses older ones automatically, do not hand-truncate them)
- [ ] Scorecard: **automatic** (no action) for stock articles with `meta-ticker` + `meta-verdict` in the hero. Set CONFIG `scorecardName` only if a shorter display name is wanted
- [ ] Ticker → scorecard links: **automatic, but verify.** Write every ticker as plain text (`9973.HK`), hero as `<span class="meta-ticker">9973.HK</span>`; `build.js` links the pill and every body mention to `/scorecard#t-<ticker>`. Never hand-write `<a href="/scorecard#…">`, the prose pass skips existing anchors, so a manual link opts that mention out of the automation. Verify with the preview server up: `python3 scripts/test-ticker-links.py http://localhost:3000`
- [ ] No em dash anywhere (`grep -rn ", \|, " publish/ assets/` returns nothing)
- [ ] `node build.js` runs clean
- [ ] Spot-checked `dist/analyses/<slug>.html` in a browser
- [ ] **Knowledge layer written back** in this same commit: new peer sets, new frames, reversed readings, and any new contradiction recorded in [wiki/knowledge/](knowledge/index.md). Same-commit rule as the homepage card. A follow-up pass does not happen. **Published only:** a draft's claims enter the layer when it ships to `publish/analyses/`, never while it sits in `DRAFT/` or `publish/drafts/`
- [ ] Committed and pushed

---


---
[Wiki index](TRADING/Trading852-v2/wiki/index.md)
