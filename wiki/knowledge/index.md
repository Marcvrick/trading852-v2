---
title: "Trading852 v2, Knowledge Layer"
tags: [trading852, wiki, knowledge, claims, valuation, hub]
category: Trading/Blog
type: wiki
created: 2026-07-15
updated: 2026-07-15
---

# Knowledge Layer

Part of the [Trading852 wiki](../index.md). What the site has already published, held as claims rather than as prose.

Eighteen articles carry several hundred numbers and roughly forty reusable frames. Until now each one existed exactly once, inside one HTML file, invisible to the next article. [articles.md](../articles.md) lists titles; [log.md](../log.md) narrates changes; neither can answer "what did we say the Hang Seng traded at, and when?" or "have we already published a Midea multiple?". This layer answers those two questions and nothing else.

## The hard rule: this is a check, never a source

**Never write a number into an article from this layer.** [style-guide.md](../style-guide.md) test 4 forbids it: fetch the live price first, always, and the 0992 Lenovo incident is what happens when a number is harvested from a prior document. A store of prior numbers is exactly the artifact that rule exists to guard against.

The sequence is fixed:

1. Fetch the number live. That number goes in the article.
2. Then open this layer and ask: does it contradict what we published before?
3. If it does, the article says so explicitly, or the prior article gets an update note. Silence is the failure mode.

A layer used as a price cache is worse than no layer, because it launders a stale figure through an internal document that looks authoritative. Read it after the fetch, never instead of it.

## Scope: published only

**Only `publish/analyses/` enters this layer.** Nothing from `DRAFT/`, nothing from [publish/drafts/](../../publish/drafts/), nothing from the [POST SUGGESTION](../../POST%20SUGGESTION/) pipeline, nothing from an expert-analysis folder.

An unpublished draft is a candidate, not a claim. Its numbers were never anchored live at publication, never went through the pre-publish checklist, and may never ship. A draft cannot contradict anything, because it has said nothing. Admitting one would make the layer a store of things the site is *considering*, which is a different artifact and a dangerous one: nothing distinguishes a live claim from an abandoned angle once both sit in the same table.

`publish/drafts/` is the sharpest case, because those articles are finished and reviewed, merely waiting on a price trigger, and they are built into `dist/drafts/` and reachable at their URL. They still stay out. **Not promoted is not published.**

**The trap this rule exists for.** A company can hold a pending draft *and* a published mention:

| Company | Draft (excluded) | Published mention (included) |
|---|---|---|
| Sun Hung Kai (0086.HK) | [publish/drafts/0086-sun-hung-kai.html](../../publish/drafts/0086-sun-hung-kai.html), awaiting the HKD 4.28 anchor | [hang-seng-gdp-paradox](../../publish/analyses/hang-seng-gdp-paradox.html), in the index's old-economy book |
| Yuexiu Property (0123.HK) | none since 2026-07-15 | [cheap-two-ways](../../publish/analyses/hong-kong-discount-cheap-two-ways.html), the unsustainable-payout example |

The published mention is in. The draft's numbers are not, however tempting, and however better sourced they may be. When a draft ships, its claims enter the layer in the same commit that publishes it, and not before.

**Deleted work does not leave a hole here.** The `DRAFT/` folder was emptied on 2026-07-15 (six stale drafts, tickers dropped from coverage: 0123 Yuexiu, 0816 Jinmao, 2050 Sanhua, Man Yue, a China consumer piece, and a second 0086). Nothing in this layer changed, because none of it was ever in. That is the rule working: an abandoned draft costs the knowledge base nothing precisely because it was never admitted.

## Two buckets, and why the split carries the weight

Every claim is one or the other. The bucket decides what a future article may do with it.

**DURABLE** does not expire. A mechanism (the peg means the FOMC sets the rate for 40% of the Hang Seng), a completed historical measurement (Alibaba fell from $230 to the $65 to $85 range), an ownership fact (Midea owns Kuka), a closed corporate event (Prada closed Versace for EUR 1.375 billion in December 2025). Cite it directly. It is why the layer exists.

**PERISHABLE** was true on one date and drifts: every current multiple, price, yield, market cap, spread, distance to a level, tracker score. It carries an `as_of` and it is re-verified before reuse, without exception. Its purpose here is comparison, not quotation.

The trap sits between them. "Gold fell 23%" reads durable and is not: it is a live drawdown that reached 26% four days later, while the headline still says 23%. A completed drawdown is durable, an ongoing one is a price in disguise.

## Pages

- [Frames](frames.md): the reusable analytical patterns. The lessons, as opposed to the numbers.
- [Macro and the HSI](macro-hsi.md): the peg, the transmission chain, the discount, China policy, flows.
- [Financials and rates](financials-rates.md): HK banks, NIM mechanics, the convexity tracker's method and thresholds.
- [Gold](gold.md): real rates, the dollar, miner leverage, the gold regime tracker, the HK miner set.
- [Peer multiples](peer-multiples.md): every peer set the site has published, by sector, each with its date and basis.
- [Levels and conventions](levels.md): the SPY structural-level framework, and the three price bases that coexist on this site.
- [Open questions](open-questions.md): published claims that contradict each other. Read before citing anything they touch.

## Provenance fields

[style-guide.md](../style-guide.md) already specifies the schema in prose: every number traceable to a source line, peer multiples carrying source and date, own calculations labelled as such, HKEX filings primary and Bloomberg acceptable for market data but not for the subject company's fundamentals. Each entry here carries what that rule demands:

- **claim**: the sentence, with the number exactly as published. Never rounded, never converted.
- **as_of**: the date the number was true. The article's pubDate unless it states a measurement date.
- **source**: the article, linked.
- **data**: where the number came from, or `not stated in article`, which is itself a finding.
- **reuse**: when a future article would cite it, and what to check first.

`not stated in article` is recorded rather than guessed. The list of recurring unsourced numbers is in [open-questions.md](open-questions.md).

## Basis discipline

EV/EBIT is not P/E. EBITDA is not EBIT. Reported is not normalised. Three of the contradictions in [open-questions.md](open-questions.md) are basis collisions, not data errors: the same figure, published twice, on two bases, with the label lost in between. When an entry gives a multiple it gives its basis, and a comparison across bases is refused rather than fudged.

Currency travels with the number. Haier and Midea report CNY, Yadea and 361 report RMB, Prada reports EUR, all four are priced in HKD, and the CNY to HKD cross is a live float. A per-share HKD target derived from foreign-currency operating profit needs the cross re-verified.

## House rule

Touch a claim, update its entry. When an article publishes a new number or reverses a prior reading, this layer is updated in the same commit, on the pattern that already works for the homepage card ([editorial.md](../editorial.md)). The two other append-after-publish rules in this repo, the banned-pendulum list and the methodology log, both drift because nothing verifies them. This one is checked at publish time by the [pre-publish checklist](../editorial.md).

---
[Wiki index](../index.md)
