---
title: "Trading852 v2, Open Questions"
tags: [trading852, wiki, knowledge, contradictions, corrections]
category: Trading/Blog
type: wiki
created: 2026-07-15
updated: 2026-07-15
---

# Open Questions

Part of the [Knowledge Layer](index.md). Published claims that contradict other published claims.

Every item here is live on trading852.com right now. **Read the relevant item before writing anything that touches these numbers.** None is resolved; this page records the conflict, it does not adjudicate it. Resolving one means either correcting an article, adding a dated update note, or recording here why both readings stand.

Found 2026-07-15 by reading all eighteen articles against each other, the first time that has been done.

## Severe

### 1. The Hang Seng's multiple, two ways, three days apart

| | Value | File | Date |
|---|---|---|---|
| A | "around **14 times** its companies' earnings" (May 2026); closing line "Hang Seng near 14x earnings, the S&P near 21x" | [cheap-two-ways](../../publish/analyses/hong-kong-discount-cheap-two-ways.html) | 2026-06-21 |
| B | "why is the Hang Seng **still at 8-9x**?" and "the **8-9x** is the price of cash flows that are real today and revocable tomorrow" | [hang-seng-gdp-paradox](../../publish/analyses/hang-seng-gdp-paradox.html) | 2026-06-24 |

B contradicts A, and B contradicts itself. Its CONFIG description and Key Takeaway frame 8-9x as a **discount to the S&P 500**; its body twice uses it as **the HSI's own multiple**. If 8-9x is a discount in turns off about 21x, it implies an HSI at 12x to 13x, close to but not equal to A's 14x. If it is the HSI's multiple, it flatly contradicts A.

Same site, same index, three days apart. **Resolve before either number is cited again.**

### 2. How many times did the 35-year trendline hold?

All inside [hsi-35-year-trendline](../../publish/analyses/hsi-35-year-trendline.html), 2026-04-11:

- Title and H1: "**Six** Bounces. One Break. Now the Retest."
- JSONLD description: "touched its 35-year trendline **five times** and bounced... the **sixth** test has begun"
- Body: "**Five times** in 35 years the market touched it from above: 1998, 2003, 2009, 2016. **Five times** it held." Claims five, enumerates four.
- Opening hook: 1998, 2003, 2009, 2016. Four.
- Chart alt text: "**Five** crisis lows: 1998, 2003, 2009, 2016, **2022**". Five, but only by counting the 2022 break as a low, which the article argues was not a hold.
- Risk callout 2: "The 35-year trendline is informative precisely because it has **never broken**". Contradicts the article's own thesis.

The enumerated bounces are **four**. The headline says six, the schema says five. The site's most-cited structural fact has no consistent count, and the error is in the title, the schema, and the homepage card.

### 17. Dickson: the HKD 7.20 offer is a floor, and is not a floor

Both readings are live in [0113-dickson-concepts.html](../../publish/analyses/0113-dickson-concepts.html), unstruck.

- **April 2026, Section 3:** "**The valuation floor is empirically demonstrated.** An offer at HKD 7.20 is not a financial model assumption. It is a real price, formally filed, accepted by 82% of potential sellers." And: "Dickson Poon himself believed HKD 7.20 was a fair price... He is not a philanthropist: if today's price of HKD 6.10 were not a discount to real value, he would never have made that offer."
- **June 2026, update notice:** "Net cash per share was about HKD 7.08, so an offer at HKD 7.20 is an offer at roughly cash value. When the family buys the minority out there, it takes the whole operating business, profitable and recovering, for close to nothing rather than closing the gap for every holder."

A published self-reversal on the same evidence. Verdict went CONVICTION to MONITOR. The update says the figures still hold and that what changed is the reading of the one signal the thesis leaned on hardest.

**The June reading supersedes** ([frames.md](frames.md) F2b). Section 3's three numbered arguments remain published above the correction. **The highest-risk item on this page for a future writer:** anyone citing a controlling-shareholder offer as evidence of value will find the April frame first.

### 16. Alibaba net cash: US$40B, then "rose to" US$36B

Same article, [9988-alibaba.html](../../publish/analyses/9988-alibaba.html).

- **US$40 billion**, "13% of market cap", Q3 FY2026 balance sheet. Key takeaway, snapshot, body, valuation table. as_of 2026-04-14.
- **"Net cash... rose to about US$36 billion"**, June 15 update, FY2026 accounts to March 2026. as_of 2026-06-15.

**The problem is the verb.** The update says the balance sheet "actually got stronger" and net cash "rose" to about US$36 billion, which is lower than the US$40B the same article published in April. Either April was overstated, or the two use different net-cash definitions, or "rose" is measured against an unstated prior. This propagates into the bear trigger (net cash below US$20B) and the 13%-of-market-cap cushion claim. **Re-derive from the FY2026 balance sheet; neither figure is usable as published.**

## Numbers that disagree

### 3. The September 2024 PBOC package

| | Value | File | Date |
|---|---|---|---|
| A | "reserve requirements cut 50 basis points, **RMB 800 billion** earmarked for equity stabilisation" | hsi-35-year-trendline | 2026-04-11 |
| B | "a roughly **500 billion yuan** facility for institutions to buy equities and a **dedicated re-lending line** to finance corporate buybacks directly" | hang-seng-gdp-paradox | 2026-06-24 |

Reconcilable only if the re-lending line is RMB 300bn, which neither article states. As published, a reader comparing the two sees 800 versus 500 for the same policy. Pin down the components and size the re-lending line explicitly.

### 4. When did foreign flows turn?

| | Value | File | Date |
|---|---|---|---|
| A | "Foreign institutional flows turned positive in **October 2024**, first time since February 2022" | hsi-35-year-trendline | 2026-04-11 |
| B | "Foreign long-only funds bought a net **US$1 billion** by late August 2025, against **US$17 billion of selling the year before**" | cheap-two-ways | 2026-06-21 |

If flows turned positive in October 2024, then B's "US$17 billion of selling the year before" (roughly Aug 2024 to Aug 2025) overlaps a period A calls net buying. Different instruments (all foreign institutional versus foreign long-only) may explain it, but as published the two read as the same object. Specify the fund category and the exact window on both.

### 5. Tencent's capital return

| | Value | File | Date |
|---|---|---|---|
| A | "more than **HK$100 billion of buybacks in 2024**" | hang-seng-gdp-paradox | 2026-06-24 |
| B | "returned more than **HK$120 billion** to shareholders **last year**" | cheap-two-ways | 2026-06-21 |

Likely reconcilable: A is buybacks only, B is buybacks plus dividends. But B's "last year" from a June 2026 article is ambiguous between FY2024 and FY2025, and neither article makes the buyback-versus-total-return distinction explicit. Name the year and the object. Note a third figure exists: HK$121B capital returned in FY2025 and HK$80 billion of buybacks at an average HK$521.55, both from [0700-tencent](../../publish/analyses/0700-tencent.html).

### 6. Midea's EV/EBIT: 12x versus about 11x

| | Haier article | Midea article |
|---|---|---|
| Value | **Midea 12x** | **Midea about 11x** (Shenzhen line; HK line about 10.5x) |
| pubDate | 2026-04-25 | 2026-06-02 |
| Multiple as-of label | "Peer multiples Apr 2026" | "Peer multiples Apr 2026" |
| Data | Bloomberg consensus, April 2026 | "public filings and consensus, April 2026" |

**Both date the multiple to the same month and they differ.** Not a price-drift explanation. Two candidates, neither resolvable from the articles: the Haier piece cited the A-share line at a Bloomberg consensus of 12x while the Midea piece recomputed from filings at about 11x; or the Midea piece distinguishes the HK line (about 10.5x) from the Shenzhen line (about 11x) where Haier cites a single unlabelled 12x.

**The Haier bull case is "re-rate to Midea equivalent = 12x, implying HKD 36.80."** If Midea is about 11x, that target is overstated. Any future appliance article must pick one Midea number and state its listing line and source.

### 7. Haier's EV/EBIT: 6.85x versus 7x

6.85x throughout the Haier article, with the -38% badge computed from it. 7x in the Midea article's peer table, same as-of month, rounded. The Midea piece's peer ordering and its "you pay a touch more than Gree" argument rest on the rounded value. **Prefer 6.85x**, the filing-derived number.

### 8. Gold's drawdown: 23% five times, 26% once, same article

[gold-regime.html](../../publish/analyses/gold-regime.html).

- **23%**: subtitle, CONFIG description, ogTitle ("When a 23% Correction Becomes a Buy"), Key Takeaway, closing caveat. as_of 2026-06-28. Corroborated by [gold-regime.md](../gold-regime.md).
- **26%**: the "Playing the turn from Hong Kong" section, "as of 2 July 2026, gold sits 26% below its January high".

Not a data error: the article was updated 2026-07-02 (`dateModified`) and the drawdown deepened, but the headline, title, subtitle and takeaway were not updated. The page says 23% five times and 26% once. **A future article citing "the site said gold fell 23%" is citing a stale headline.** Both need a live re-check; 23% is not the site's settled number.

### 9. Hermes: about 30x and 40x, same article, same page

[1913-prada.html](../../publish/analyses/1913-prada.html), 2026-04-12.

- Peer table (explicitly EV/EBIT, Bloomberg consensus Apr 2026): **"Hermes about 30x"**.
- Body, "What Prada Is Actually Worth": **"Hermes trades at 40x."**

A ten-turn gap on the same company on the same page, with no basis stated for the 40x. It could be P/E. **A live self-contradiction. Resolve before Hermes is cited again anywhere.**

### 19. Jacobio's AZ milestones: US$1.9B versus roughly US$2 billion

US$1.9 billion in the key takeaway, snapshot, JSONLD and body. "Up to roughly US$2 billion" in the "Two deals, two partners, no Novartis" callout. Almost certainly rounding, but the headline residual-value arithmetic is built on US$1.9B. **Use US$1.9B**, the sourced figure. Flagged because the site's rule is never to round a published number.

## Basis collisions

### 13. Amazon at 35x, labelled two ways

The [Alibaba](../../publish/analyses/9988-alibaba.html) peer table is titled "Tech Peers, EV/EBIT" and lists Amazon at 35x. The body prose says "Amazon at 35x **forward earnings**", which is P/E. Same article, same number, two incompatible bases. **EV/EBIT is not P/E.** Resolve which before setting it against Alibaba's EV/EBIT.

### 10. The luxury sector floor of 15x versus Kering at about 11x

[Prada](../../publish/analyses/1913-prada.html) defines 15x as "the floor of the luxury sector (what the market pays for the weakest large-cap operator)" and builds its entire base case on it, while its own peer table on the same page lists **Kering at about 11x**, a large-cap luxury operator four turns below the stated floor. The article elsewhere concedes Kering "traded between 10-11x at peak pessimism in 2024 before recovering to 14-18x", implying Kering was still at trough levels in April 2026, but never reconciles the definition. Any reuse of "the luxury sector floor is 15x" must exclude Kering explicitly or restate the floor.

### 11. Tencent's EV/EBIT: 15x versus 13.5x

- **15x**, [Alibaba](../../publish/analyses/9988-alibaba.html) peer table, key takeaway, valuation table, and the May 24 re-rating arithmetic ("at 15x parity with Tencent, HK$176"). Bloomberg consensus, April 2026.
- **13.5x** headline (11.0x ex-portfolio), [Tencent](../../publish/analyses/0700-tencent.html) snapshot, chart, body. HKEX filings FY2025 and Q1 2026, peer multiples May 2026.

Three months apart on differently-sourced bases, so not necessarily an error. But the site has published two Tencent EV/EBIT numbers and **the Alibaba re-rating call is anchored to the higher one.** Any future piece using "parity with Tencent" as a target must state which figure and which date. Note the Tencent article's own sector average (15.6x) sits almost exactly where the Alibaba article put Tencent itself.

### 12. Alibaba's EV/EBIT: 10.8x versus 10.1x

10.8x throughout the Alibaba article (Bloomberg consensus April 2026, restated at 10.8x on the May 22 close of HK$127.00). 10.1x in the Tencent article's China Internet Peers snapshot (peer market data May 2026). Different dates and price points, so likely both correct as published, but the same author has Alibaba at two multiples one month apart and neither article cross-references the other.

Compounding it: the Alibaba article calls 10.8x "forward EV/EBIT", and the June update revealed the forward denominator was a guess that missed by roughly 3x. **Before citing any Alibaba multiple, resolve which denominator** ([frames.md](frames.md) F3c).

### 18. Alibaba cloud growth: 34%, 36%, 40%

- **"Cloud Up 36%"**: title, ogTitle, H1, key takeaway. Cloud Intelligence Group Q3 FY2026 revenue RMB 43.3B, +36% YoY. as_of 2026-04-14.
- **"still grew 34%, with its own profit up 35%"**: June 15 update, and the JSONLD description.
- **Full-year Cloud external revenue +40% YoY**, with Q4 at +40%: the May 14 update.

Three cloud growth rates in one article with no stated basis for the 34%. The 36% is the December quarter; the 34% appears to be full-year, but the article never says so, and the +40% is external revenue. **State the period and whether it is external or total.**

### 14. "SPY 1.3% from $747" means two opposite things

[spy-747-level.html](../../publish/analyses/spy-747-level.html).

- Title and CONFIG: "SPY Is Now 1.3% From the Next One", SPY at $737.62, **1.3% below** the level. as_of 2026-05-11.
- Live banner (static fallback): "+1.3%", "above $747 level (+$9.48)", SPY at $756.48, **1.3% above**. as_of 2026-05-29.

Coincidental identical magnitude, opposite sign, same published page, 18 days apart. **Any future reference to "SPY 1.3% from $747" must state which side.**

### 15. SPY ceiling: $769 and $781

$769 in the article body, risk callout and scenario table (as_of 2026-05-11). $781 in the live banner and the script constant `CEIL_VAL = 781`, anchored at `CEIL_ANCHOR = 2026-05-29`. Internally consistent with the $0.83-per-trading-day advance (about 13 sessions), so **not a data conflict**, but the prose was never re-anchored when the banner was. Both are stale now. Recompute from the anchor, and remember the math resets after December 2026.

## Omissions and gaps

### 20. The Tencent in-kind precedent is incomplete

[0700-tencent.html](../../publish/analyses/0700-tencent.html) builds its bull case on **one** precedent: "Tencent has given a portfolio like this away once before, handing shareholders its JD.com stake in December 2021", and "The 2021 distribution proved the move is real, not theoretical."

[1698-tencent-music.html](../../publish/analyses/1698-tencent-music.html) documents a **second, more recent** one: Tencent transferred a 2% stake in Universal Music Group to Tencent Music shareholders in early 2025, the consortium distributing UMG shares directly to its members, booking a RMB 2.37 billion non-cash gain in TME's Q1 2025.

Not a numeric contradiction, an omission that weakens the site's own strongest argument. "Once before" is arguably understated: the mechanism ran again in Q1 2025, four years after JD, at a different level of the group. A future piece on the distribution playbook should cite both and resolve whether the UMG distribution counts as a Tencent-level precedent (it was consortium-level, distributed to consortium members) or a TME-level one.

### 21. The DXY ticker is unfetchable as published

The [gold article](../../publish/analyses/gold-regime.html) methodology table, gauge label and footer all print **`DXY`**. [gold-regime.md](../gold-regime.md) carries the real Yahoo symbol, **`DX-Y.NYB`**. `DXY` is not a valid Yahoo ticker. Low stakes for prose, but any future article that reproduces the methodology table as-is publishes an unfetchable symbol.

### 22. Tracker thresholds exist only in the wiki

Both [rate-convexity.html](../../publish/analyses/rate-convexity.html) and [gold-regime.html](../../publish/analyses/gold-regime.html) describe green, red and amber in prose with no numeric cutoff. The plus or minus 0.25 thresholds live only in [convexity-tracker.md](../convexity-tracker.md) and [gold-regime.md](../gold-regime.md). Not a contradiction, a gap: a reader cannot check "the gauge is in transition" against the published page. If a future piece states the thresholds, both gauges use plus or minus 0.25.

### 23. Adjustment basis is stated for SPY and silent everywhere else

SPY work is unadjusted with dividends off, flagged in [articles.md](../articles.md) and throughout the article. No adjustment convention is stated for the HK bank price table in the convexity article or the HK miner drawdowns in the gold article. The site has an explicit convention on one asset class and a silent one on the others. See [levels.md](levels.md) on the three bases that coexist.

## Recurring unsourced numbers

Each recurs, each is used as an input, none is sourced in its article. Source or hedge before reuse.

| Claim | Where |
|---|---|
| The 20% to 30% HK holding-company discount | Dickson |
| The 8x to 15x HK luxury peer band | Dickson |
| KRAS G12C prevalence 8-10% (China) versus 13% (West) | Jacobio |
| TME's 850M MAU, 15% conversion versus Spotify's 40% | Tencent Music |
| Qwen's 300M monthly active users | Alibaba |
| The Google I/O token figures (9.7 trillion to 480 trillion) | Alibaba |
| The agentic token multiplier (100x to 1,000x per task) | Alibaba |
| Amazon's 2012-2016 price history ($250 to $750) | Alibaba |
| Prosus's about 23% Tencent stake | Tencent |
| Dickson Poon's 60.5% | Dickson |
| ABB, Fanuc, Yaskawa at 40x to 50x trailing | Midea |
| Robotics segment gross margin north of 21% | Midea |

## Metadata hygiene

Not factual claims, noted so they are not rediscovered.

- **Prada modification dates disagree three ways:** CONFIG `modDate` 2026-05-14, JSONLD `dateModified` 2026-05-06, in-body update notice dated 2026-05-01.
- **"16 years"** appears four times in hang-seng-gdp-paradox for the Dec 2010 to Jun 2026 span. It is 15.5 years, and the S&P, Nikkei and GDP ratios are quoted against it.
- **"+77% in 18 months"** in hsi-35-year-trendline: the percentage is right (14,604 to 25,893 is +77.3%) but October 2022 to April 2026 is roughly 42 months, not 18. It overstates the recovery's velocity by more than 2x, and it sits in the subtitle, the Key Takeaway, the homepage card and the schema.
- **[articles.md](../articles.md) was missing two published articles**, 0027-galaxy and 0700-tencent, until 2026-07-15.

---
[Knowledge Layer](index.md) . [Wiki index](../index.md)
