---
title: "CHECK URGENT · Trading852-v2 git state unclear"
created: 2026-04-26
priority: high
status: blocked
---

# CHECK URGENT · Where does Trading852-v2 deploy?

**Blocker:** can't commit/push the README + HSI image fix until this is answered.

## What I found

| Repo | Path | `.git` | Commits | Remote |
|---|---|---|---|---|
| **v1** | `TRADING/Trading852/` | yes | full history (latest: `2309854 README: document per-reco pubDate + stopped badge`) | `origin → github.com/Marcvrick/trading852.com` |
| **v2** | `TRADING/Trading852-v2/` | yes (initialized) | **0 commits** | **none configured** |

So v2 is a local-only working copy. Nothing has ever been pushed from it.

## Pending changes in v2 (uncommitted, un-pushed)

1. `src/analyses/images/hsi-35y-trendline.jpg`: copied from v1 to fix the broken image on `/analyses/hsi-35-year-trendline`
2. `README.md`: new v2-specific README documenting the `src/` → `dist/` build pipeline, partials, image convention, Vercel cleanUrls gotcha, editorial workflow

Both fixes are local. The live site is still v1's broken image and has no v2 README.

## What I need to know before pushing

### Q1 · What does Vercel serve today?

- Option A: `github.com/Marcvrick/trading852.com` (v1's repo), current production, no build step
- Option B: a separate v2 GitHub repo I haven't found
- Option C: Vercel is connected directly to a local folder (unlikely)

### Q2 · Is v2 supposed to replace v1?

- **If yes** → we point v2 at `Marcvrick/trading852.com`, push to a branch (e.g. `v2` or `next`), open a PR. Vercel must be reconfigured to run `node build.js` and serve `dist/`. **Do not force-push to `main`** before verifying Vercel handles the build, or the live site breaks.
- **If no, separate repo** → create `Marcvrick/trading852-v2` (or similar) on GitHub, set as `origin`, push `main`. v1 keeps running until manually retired.

## Three safe paths I can take once you answer

### Path 1 · Same repo, branch `v2`, PR for review
```bash
cd Trading852-v2
git remote add origin https://github.com/Marcvrick/trading852.com.git
git fetch origin
git checkout -b v2
git add .
git commit -m "v2: shared partials build pipeline + README + fix HSI image"
git push -u origin v2
gh pr create --title "v2: build pipeline migration" --body "..."
```
Live site untouched. You merge when Vercel + tests pass.

### Path 2 · Separate new repo
```bash
cd Trading852-v2
gh repo create Marcvrick/trading852-v2 --private --source=. --remote=origin
git add .
git commit -m "Initial v2 commit: build pipeline + README + images"
git push -u origin main
```
Then connect this new repo to a new Vercel project (or a preview environment). Zero risk to v1.

### Path 3 · Just fix the image on v1, hold v2 push
If the HSI image fix is urgent and v2 isn't deploy-ready, I commit `images/hsi-35y-trendline.jpg` to **v1** at `TRADING/Trading852/Analyses/images/` (already there, just needs commit if not pushed) and push. v2 README and pipeline migration stay local until you decide. Lowest risk.

## Recommendation

**Start with Path 2 (separate repo)**. Reasons:
- Zero risk to live site
- Lets Vercel build pipeline get tested in isolation (preview deploys)
- Easy to flip DNS later: change Vercel project's domain from v1 repo to v2 repo
- v1 stays as a working fallback until you've shipped 1–2 articles via v2

If you want speed, Path 3 + Path 2 in parallel: fix the HSI image on v1 today, set up v2 as a separate repo this week.

## Files awaiting your decision

- `/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/README.md` ← written, uncommitted
- `/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/src/analyses/images/hsi-35y-trendline.jpg` ← copied, uncommitted
- `/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/dist/` ← rebuilt locally, includes the image fix, not pushed

When you're back: tell me which path (1, 2, or 3) and I execute.
