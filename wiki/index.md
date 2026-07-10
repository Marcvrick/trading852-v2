---
title: "Trading852 v2, Wiki Hub"
tags: [trading852, wiki, hub, static-site, hk-stocks]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-24
---

# Trading852 v2, Wiki

Knowledge hub for the [Trading852](https://trading852.com) static site. The [README](../README.md) is a stub now: the docs live here.

Authored pages in [publish/](../publish/) are assembled into `dist/` by [build.js](../build.js); Vercel serves `dist/`. Zero dependencies.

- Live site: [trading852.com](https://trading852.com)
- GitHub: [Marcvrick/trading852-v2](https://github.com/Marcvrick/trading852-v2)

## Pages

- [Style guide](style-guide.md): the single source of truth for article voice, structure, and the 7-section template
- [Design convention](design-convention.md): visual style, typography, full color palette (brand gradient, semantic pos/neg, gauge accents), the HK-flag-red small-touch rule
- [Editorial](editorial.md): DRAFT-first workflow, hard voice rules, what to never write, pre-publish checklist
- [Build pipeline](build-pipeline.md): build.js, source format, CONFIG, layouts, folder structure, Vercel, site plumbing
- [SEO](seo/index.md): sub-hub, the mandatory ticker-analysis pattern + strategy, structure, calendar, competitors, roadmap, audit
- [Scorecard](scorecard.md): the auto-generated live performance tracker
- [Convexity tracker](convexity-tracker.md): the live rate-convexity regime gauge for HK financials (baked + client-side, free Yahoo data)
- [Gold regime tracker](gold-regime.md): the live gold regime gauge (real rates + dollar + trend), same architecture as the convexity tracker
- [Ops](ops.md): runbooks for build, preview, deploy, and refreshing the live HSI quote
- [Articles](articles.md): published list + drafts pending a price trigger
- [Instagram](instagram.md): procédure complète post IG, palette, nomenclature, drop dans `IG post/`
- [Log](log.md): changelog

## External reference

- Voice: [VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md), the cross-project voice definition. The [style guide](style-guide.md) above is the Trading852-specific layer on top of it.

## House rule

Touch a thing, update its page. When work changes how the site is built, written, or deployed, the matching wiki page is updated in the same commit. The question to ask before reporting done: which page is now stale because of what I just did?

---
Pages: [style-guide](style-guide.md) . [design-convention](design-convention.md) . [editorial](editorial.md) . [build-pipeline](build-pipeline.md) . [seo](seo/index.md) . [scorecard](scorecard.md) . [convexity-tracker](convexity-tracker.md) . [gold-regime](gold-regime.md) . [ops](ops.md) . [articles](articles.md) . [instagram](instagram.md) . [log](log.md)
