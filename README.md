---
title: "Trading852 v2, README"
tags: [readme, trading852, static-site, hk-stocks]
category: Trading/Blog
type: readme
created: 2026-04-26
updated: 2026-06-24
---

# Trading852 v2

Static site for conviction-led HK stock analyses and market-thesis articles. Source pages in [src/](src/) are assembled into `dist/` by [build.js](build.js); Vercel serves `dist/`. Zero dependencies, pure `fs` + `path`.

- Live site: [trading852.com](https://trading852.com)
- GitHub: [Marcvrick/trading852-v2](https://github.com/Marcvrick/trading852-v2)

## Quickstart

```bash
cd "TRADING/Trading852-v2"
node build.js
```

Or double-click `preview-trading852.command` to build and preview on http://localhost:8799.

## Documentation: the wiki

Full docs moved to [wiki/](wiki/) on Jun 24 2026. Start at [wiki/index.md](wiki/index.md).

- [Build pipeline](wiki/build-pipeline.md): build.js, source format, CONFIG, layouts, Vercel, site plumbing
- [Editorial](wiki/editorial.md): DRAFT-first workflow, hard voice rules, what to never write, pre-publish checklist
- [SEO](wiki/seo.md): the mandatory ticker-analysis pattern + per-page checklist
- [Scorecard](wiki/scorecard.md): the auto-generated live performance tracker
- [Ops](wiki/ops.md): runbooks for build, preview, deploy, and the live HSI quote
- [Articles](wiki/articles.md): published list + drafts pending a trigger
- [Log](wiki/log.md): changelog

The canonical article style guide is [instructions/blog-style-guide.md](instructions/blog-style-guide.md); it is not duplicated in the wiki.
