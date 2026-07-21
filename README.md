---
title: "Trading852 v2, README"
tags: [readme, trading852, static-site, hk-stocks]
category: Trading/Blog
type: readme
created: 2026-04-26
updated: 2026-07-15
---

# Trading852 v2

Static site for conviction-led HK stock analyses and market-thesis articles. Source pages in [publish/](publish/) are assembled into `dist/` by [build.js](build.js); Vercel serves `dist/`. Zero dependencies, pure `fs` + `path`.

- Live site: [trading852.com](https://trading852.com)
- GitHub: [Marcvrick/trading852-v2](https://github.com/Marcvrick/trading852-v2)

## Quickstart

```bash
cd "TRADING/Trading852-v2"
node build.js
```

Or double-click `preview-trading852.command` to build and preview on http://localhost:8799.

## Quick Links — Wiki Navigation

Full documentation lives in [wiki/](wiki/). Pick your entry point:

**I want to...**
- **Publish an article** → [Editorial](wiki/editorial.md) (DRAFT-first workflow, voice rules, pre-publish checklist)
- **Check what we already claimed** → [Knowledge](wiki/knowledge/index.md) (frames, published peer multiples, HSI/banks/gold, cross-article contradictions)
- **Optimize for SEO** → [SEO](wiki/seo/index.md) (ticker-analysis pattern, per-page checklist)
- **Understand how the site builds** → [Build Pipeline](wiki/build-pipeline.md) (build.js, source format, CONFIG, layouts)
- **Deploy, preview, or troubleshoot** → [Ops](wiki/ops.md) (runbooks: build, preview, deploy, live HSI quote)
- **Check article status** → [Articles](wiki/articles.md) (published list + drafts waiting for trigger)
- **Track site changes** → [Log](wiki/log.md) (changelog, past updates)
- **Learn the style** → [Style Guide](wiki/style-guide.md) (canonical voice, tone, formatting rules)
- **Watch performance live** → [Scorecard](wiki/scorecard.md) (auto-generated performance tracker)

**Getting started?** Begin at [wiki/index.md](wiki/index.md).
