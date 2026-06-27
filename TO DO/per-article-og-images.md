# Per-Article OG Images

**Status:** Not started
**Effort:** 1 afternoon (7 articles + 1 HSI thesis)
**Impact:** Highest-leverage social CTR move available. Every share on X / LinkedIn / WhatsApp uses these

## Problem

Right now every article points to the same generic `/assets/og-image.png`. When a Prada article gets shared, the preview card is identical to a biotech article. Generic cards get clicked 2–4× less than data-rich cards that surface the actual hook.

## Goal

One unique 1200×630 PNG per article, surfacing:
- Ticker badge (e.g. `1913.HK`)
- Verdict tag (`CONVICTION` / `MONITOR` / `AVOID`)
- One-line data hook from the analysis (e.g. `EPS −74% · Revenue +9%`)
- Trading852 brand mark

## Articles needing OG images

| File | Ticker | Verdict | Suggested hook |
|------|--------|---------|----------------|
| `0113-dickson-concepts.html` | 0113.HK | TBD | "Market pays HKD 375M to buy this company" |
| `1167-jacobio.html` | 1167.HK | TBD | "AstraZeneca paid US$100M for one molecule" |
| `1585-yadea.html` | 1585.HK | TBD | TBD |
| `1698-tencent-music.html` | 1698.HK | TBD | TBD |
| `1913-prada.html` | 1913.HK | CONVICTION | "EPS −74% · Revenue +9%" |
| `6690-haier.html` | 6690.HK | TBD | TBD |
| `9988-alibaba.html` | 9988.HK | TBD | TBD |
| `hsi-35-year-trendline.html` | HSI | TBD | "Six bounces. One break. Now the retest." |

(Fill verdict + hook columns when picking up the task.)

## Design spec

- **Dimensions:** 1200×630px, PNG
- **Background:** Trading852 dark theme (match site palette)
- **Typography:** Space Grotesk (matches site font stack)
- **Layout:**
  ```
  ┌────────────────────────────────────┐
  │  [TICKER BADGE]      [VERDICT]     │
  │                                    │
  │   ONE-LINE DATA HOOK               │
  │   (large, ~64px)                   │
  │                                    │
  │   Sub-line (smaller, ~28px)        │
  │                                    │
  │                      Trading852 ●  │
  └────────────────────────────────────┘
  ```
- **Color verdict tags:**
  - `CONVICTION`: green accent
  - `MONITOR`: amber/yellow
  - `AVOID`: red

## Two implementation paths

### Path A: Manual (1 afternoon, fastest for 8 articles)
1. Build a Figma template with the layout above
2. Duplicate per article, swap text
3. Export PNG → save to `assets/og/{slug}.png`
4. Update each article's CONFIG: `"ogImage": "https://trading852.com/assets/og/{slug}.png"`
5. Run `node build.js`

### Path B: Auto-generated (longer setup, scales to future articles)
Build a small script that reads each article's CONFIG, renders an HTML template with the data, and uses Puppeteer (already in the repo workflow) to screenshot it as 1200×630 PNG.

Pseudo:
```js
// scripts/generate-og-images.js
// 1. Walk src/analyses/*.html
// 2. Parse CONFIG
// 3. Render scripts/og-template.html with config values
// 4. Puppeteer.screenshot({ width: 1200, height: 630 }) → assets/og/{slug}.png
// 5. Update CONFIG.ogImage automatically (or rely on naming convention)
```

Path B is the right move if we expect 20+ articles; Path A is right for the current 8.

## Verification once shipped

1. Run `node build.js`
2. For each article, paste the URL into:
   - X Card Validator: https://cards-dev.twitter.com/validator (deprecated but still works)
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
3. Confirm the new image renders and dimensions are correct.

## Don't forget

- Ticker prices/data hooks are live. Re-render if a major data point changes (rare for OG card; keep it about the thesis, not the price)
- Keep og:image:width / og:image:height meta tags at 1200/630 (already in head.html)
- Don't include ephemeral data (current price, dates) in the OG image. Those go stale and the card stays cached on social platforms for weeks
