---
title: "Trading852 v2, Ops Runbooks"
tags: [trading852, wiki, ops, runbook]
category: Trading/Blog
type: wiki
created: 2026-06-24
updated: 2026-06-27
---

# Trading852 v2, Ops Runbooks

Part of the [Trading852 wiki](index.md). Quick commands; the detail lives in [Build pipeline](build-pipeline.md).

## Build + preview locally

```bash
cd "TRADING/Trading852-v2"
node build.js
```

Or double-click [preview-trading852.command](../preview-trading852.command): it builds and serves `dist/` on http://localhost:8799 and opens the market-thesis page.

## Deploy

Commit and push `main`. Vercel runs `node build.js` and serves `dist/`. There is no manual deploy step. Never commit `dist/` by hand (gitignored, rebuilt on deploy).

## Refresh the HSI fallback snapshot

The Hang Seng tile on the [market-thesis hub](../publish/analyses/market-thesis.html) is a **live widget** ([hsi-quote.js](../assets/hsi-quote.js)): it fetches `^HSI` on every page load, so it is never stale. The HTML also carries a build-time snapshot used only as the no-JS fallback (the value shown before JS runs). Keep that fallback current before a deploy:

```bash
python3 scripts/update-hsi-quote.py && node build.js
```

[scripts/update-hsi-quote.py](../scripts/update-hsi-quote.py) re-fetches Yahoo `^HSI`, regenerates the `.hsi-quote` block in place (idempotent), and prints the new value. See [Build pipeline, Live HSI quote](build-pipeline.md) for how the widget is wired and the zsh history-expansion gotcha.

## Publish an article

Full procedure on [Editorial](editorial.md). In short: move `DRAFT/<slug>.html` to `publish/analyses/`, add the homepage card plus feed and sitemap entries, run `node build.js`, commit, push.

---
[Wiki index](index.md)
