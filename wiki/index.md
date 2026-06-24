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

Source pages in [src/](../src/) are assembled into `dist/` by [build.js](../build.js); Vercel serves `dist/`. Zero dependencies.

- Live site: [trading852.com](https://trading852.com)
- GitHub: [Marcvrick/trading852-v2](https://github.com/Marcvrick/trading852-v2)

## Pages

- [Build pipeline](build-pipeline.md): build.js, source format, CONFIG, layouts, folder structure, Vercel, site plumbing
- [Editorial](editorial.md): DRAFT-first workflow, the 7-section structure, hard voice rules, what to never write, pre-publish checklist
- [SEO](seo.md): the mandatory ticker-analysis pattern, BreadcrumbList, per-page checklist
- [Scorecard](scorecard.md): the auto-generated live performance tracker
- [Ops](ops.md): runbooks for build, preview, deploy, and refreshing the live HSI quote
- [Articles](articles.md): published list + drafts pending a price trigger
- [Log](log.md): changelog

## Canonical references (not duplicated here)

- Style guide: [instructions/blog-style-guide.md](../instructions/blog-style-guide.md), the single source of truth for article voice and structure
- Voice: [VOIX-Marc.md](../../../Voix%20Marc/VOIX-Marc.md)
- SEO docs: [instructions/seo/](../instructions/seo/)

## House rule

Touch a thing, update its page. When work changes how the site is built, written, or deployed, the matching wiki page is updated in the same commit. The question to ask before reporting done: which page is now stale because of what I just did?

---
Pages: [build-pipeline](build-pipeline.md) . [editorial](editorial.md) . [seo](seo.md) . [scorecard](scorecard.md) . [ops](ops.md) . [articles](articles.md) . [log](log.md)
