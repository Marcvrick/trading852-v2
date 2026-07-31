'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC  = path.join(ROOT, 'publish');
const DIST = path.join(ROOT, 'dist');

// ── Load partials ──────────────────────────────────────────────────────────────
const P = (...args) => fs.readFileSync(path.join(SRC, '_partials', ...args), 'utf8');
const partials = {
  head:           P('head.html'),
  navbar:         P('navbar.html'),
  footerAnalysis: P('footer-analysis.html'),
  footerHome:     P('footer-home.html'),
  footerStatic:   P('footer-static.html'),
  scrollScript:   P('scroll-script.html'),
};

// ── Parse source file ──────────────────────────────────────────────────────────
function parseSource(src) {
  let text = src;

  const cfgMatch = text.match(/<!--\s*CONFIG\s*(\{[\s\S]*?\})\s*-->/);
  const config   = cfgMatch ? JSON.parse(cfgMatch[1]) : {};
  if (cfgMatch) text = text.replace(cfgMatch[0], '');

  const jldMatch = text.match(/<!--\s*JSONLD\s*(\{[\s\S]*?\})\s*-->/);
  const jsonld   = jldMatch ? jldMatch[1].trim() : '';
  if (jldMatch) text = text.replace(jldMatch[0], '');

  return { config, jsonld, content: text.trim() };
}

// ── Build BreadcrumbList JSON-LD from in-body breadcrumb ─────────────────────
const SITE_ORIGIN = 'https://trading852.com';

function buildBreadcrumbJSONLD(content, config) {
  if (config.layout && config.layout !== 'article') return '';

  const blockMatch = content.match(/<div class="article-breadcrumb">([\s\S]*?)<\/div>/);
  if (!blockMatch) return '';

  const linkRe = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  const items = [];
  let m;
  while ((m = linkRe.exec(blockMatch[1])) !== null) {
    const url = m[1].startsWith('http') ? m[1] : `${SITE_ORIGIN}${m[1]}`;
    items.push({ name: m[2].trim().replace(/\s+/g, ' '), url });
  }
  if (items.length === 0) return '';

  const listItems = items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  }));

  const leafName = config.ogTitle || config.title;
  if (leafName) {
    listItems.push({
      '@type': 'ListItem',
      position: listItems.length + 1,
      name: leafName,
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };

  return `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`;
}

// ── Build <head> content ───────────────────────────────────────────────────────
function buildHead(config, jsonld, cssFiles, content) {
  const ogImg    = config.ogImage   || 'https://trading852.com/assets/og-image.png';
  const ogTitle  = config.ogTitle   || config.title || 'Trading852';
  const ogType   = config.ogType    || 'website';
  const canonical = config.canonical || 'https://trading852.com';

  const articleMeta = config.pubDate
    ? [
        `  <meta property="article:published_time" content="${config.pubDate}T00:00:00+08:00">`,
        config.modDate ? `  <meta property="article:modified_time" content="${config.modDate}T00:00:00+08:00">` : '',
        `  <meta property="article:author" content="Marc">`,
      ].filter(Boolean).join('\n')
    : '';

  const jsonldBlock = jsonld
    ? `  <script type="application/ld+json">\n${jsonld}\n  </script>`
    : '';

  const breadcrumbBlock = buildBreadcrumbJSONLD(content || '', config);

  const cssInlined = cssFiles
    .map(f => fs.readFileSync(path.join(SRC, 'styles', `${f}.css`), 'utf8'))
    .join('\n');
  const cssLinks = `  <style>\n${cssInlined}\n  </style>`;

  const subs = {
    '{{TITLE}}':              config.title          || 'Trading852',
    '{{OG_TITLE}}':           ogTitle,
    '{{DESCRIPTION}}':        config.description    || '',
    '{{OG_DESCRIPTION}}':     config.ogDescription  || config.description || '',
    '{{CANONICAL}}':          canonical,
    '{{OG_TYPE}}':            ogType,
    '{{OG_IMAGE}}':           ogImg,
    '{{OG_IMAGE_WIDTH}}':     config.ogImageWidth  || '1200',
    '{{OG_IMAGE_HEIGHT}}':    config.ogImageHeight || '630',
    '{{OG_IMAGE_TYPE}}':      config.ogImageType   || 'image/png',
    // The generated cover renders the headline as the image, so the headline is the alt text.
    '{{OG_IMAGE_ALT}}':       config.ogImageAlt    || ogTitle,
    '{{CSS_LINKS}}':          cssLinks,
    '{{ARTICLE_META}}':       articleMeta,
    '{{JSONLD}}':             jsonldBlock,
    '{{BREADCRUMB_JSONLD}}':  breadcrumbBlock,
  };

  let head = partials.head;
  for (const [k, v] of Object.entries(subs)) {
    head = head.split(k).join(v);
  }
  return head;
}

// ── Assemble full page ─────────────────────────────────────────────────────────
function assemblePage(config, jsonld, content) {
  const layout = config.layout || 'article';

  const cssMap = {
    index:     ['base', 'index'],
    article:   ['base', 'article'],
    static:    ['base', 'page'],
    scorecard: ['base', 'scorecard'],
  };
  const cssFiles = cssMap[layout] || ['base', 'article'];

  const head = buildHead(config, jsonld, cssFiles, content);

  const isLight = layout === 'index' || layout === 'scorecard';
  const headerModsClass = isLight ? ' page-header--scrolls-light' : '';
  const navbar = partials.navbar.split('{{HEADER_MODS_CLASS}}').join(headerModsClass);

  const footerMap = {
    index:     partials.footerHome,
    scorecard: partials.footerHome,
    article:   partials.footerAnalysis,
    static:    partials.footerStatic,
  };
  const footer = footerMap[layout] || partials.footerAnalysis;

  // Page-scoped live scripts. scorecard.js powers the homepage strip + /scorecard
  // (light layouts). hsi-quote.js refreshes the HSI tile wherever a .hsi-quote
  // block is present (the market-thesis hub), so it is never stale.
  const extraScripts = [];
  if (isLight) extraScripts.push('<script src="/assets/scorecard.js" defer></script>');
  if (content.includes('class="hsi-quote"')) extraScripts.push('<script src="/assets/hsi-quote.js" defer></script>');
  if (content.includes('class="convexity-gauge')) extraScripts.push('<script src="/assets/convexity.js" defer></script>');
  if (content.includes('class="gold-gauge')) extraScripts.push('<script src="/assets/gold-regime.js" defer></script>');
  if (content.includes('class="hkdusd-gauge')) extraScripts.push('<script src="/assets/hkdusd-swap.js" defer></script>');
  const extraScript = extraScripts.length ? '\n  ' + extraScripts.join('\n  ') : '';

  return [
    '<!DOCTYPE html>',
    '<html lang="en" dir="ltr">',
    '<head>',
    head,
    '</head>',
    '<body>',
    '',
    navbar,
    '',
    content,
    '',
    footer,
    partials.scrollScript + extraScript,
    '</body>',
    '</html>',
  ].join('\n');
}

// ── File helpers ───────────────────────────────────────────────────────────────
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function walkSrc(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    entry.isDirectory() ? walkSrc(full, files) : files.push(full);
  }
  return files;
}

// ── All articles auto-generation (Recent + Our Analyses) ───────────────────────
// Scan publish/analyses/ for all articles (excluding hubs like market-thesis.html).
// Return sorted by pubDate descending: featured card (1st), small-card stack (2-3),
// and full "Our Analyses" list (all articles with numbering).
function getAllArticles() {
  const dir = path.join(SRC, 'analyses');
  const articles = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html') || f === 'market-thesis.html') continue;
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const { config } = parseSource(raw);
    if (!config.pubDate || !config.ogTitle || !config.canonical) continue;
    const slug = f.replace(/\.html$/, '');
    const href = `/analyses/${slug}`;
    const eyebrow = (config.articleSection || 'Analysis').trim();
    articles.push({
      href, slug, title: config.ogTitle, eyebrow, date: config.pubDate,
      modDate: config.modDate || '',
      description: config.description || '',
      contextLine: config.contextLine || config.description || '', // fallback to description if no contextLine
    });
  }
  articles.sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0));
  return articles;
}

function formatDate(dateStr) {
  return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})/, (_, y, m, d) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
  });
}

// ── Recent analyses auto-generation ──────────────────────────────────────────
// Homepage features the latest article in the featured card slot, with older
// articles pushed to the small-card stack.
function generateRecentAnalysesHTML() {
  const articles = getAllArticles();
  if (articles.length === 0) return '';

  const featured = articles[0];
  const small = articles.slice(1, 3);
  let html = `
          <article class="node-mode-recent_update node-mode-recent_update--featured">
            <a href="${featured.href}" class="recent-update__link">
              <div class="eyebrow">${featured.eyebrow} <span class="eyebrow-date">· ${formatDate(featured.date)}</span></div>
              <div class="card-key-number">${featured.contextLine}</div>
              <h3>${featured.title}</h3>
              <div class="recent-update__see-update">Read the analysis &rarr;</div>
            </a>
          </article>`;

  if (small.length > 0) {
    html += '\n          <div class="card-stack">';
    for (const s of small) {
      html += `
            <article class="node-mode-recent_update node-mode-recent_update--small">
              <a href="${s.href}" class="recent-update__link">
                <div class="eyebrow">${s.eyebrow} <span class="eyebrow-date">· ${formatDate(s.date)}</span></div>
                <h3>${s.title}</h3>
                <div class="recent-update__see-update">Read the analysis &rarr;</div>
              </a>
            </article>`;
    }
    html += '\n          </div>';
  }
  return html;
}

// An "Updated" tag on a list line means two things at once: the analysis was
// genuinely revisited (modDate well clear of pubDate, so a launch-week correction
// does not qualify), and it happened recently enough to still be news. Without the
// freshness window the tag would sit on 8 of 12 lines forever and stop meaning
// anything. Both windows are in days; tune them here.
const UPDATE_MIN_GAP_DAYS = 7;
const UPDATE_FRESH_DAYS = 30;
function isRecentUpdate(a, now = Date.now()) {
  if (!a.modDate || !a.date) return false;
  const DAY = 86400000;
  const mod = Date.parse(a.modDate + 'T00:00:00Z');
  const pub = Date.parse(a.date + 'T00:00:00Z');
  if (Number.isNaN(mod) || Number.isNaN(pub)) return false;
  if (mod - pub < UPDATE_MIN_GAP_DAYS * DAY) return false;
  return now - mod <= UPDATE_FRESH_DAYS * DAY;
}

// ── "Our Analyses" list auto-generation ─────────────────────────────────────
// Generate the full numbered list of all articles for the "Our Analyses" section.
// Skip the first 3 articles (featured + 2 small cards from Recent Analyses).
// Each remaining article shows the full title, not the contextLine.
function generateOurAnalysesHTML() {
  const articles = getAllArticles();
  if (articles.length <= 3) return ''; // Only featured + 2 small cards, nothing for list

  let html = '';
  const listArticles = articles.slice(3); // Skip first 3 (featured + small card 1 + small card 2)
  for (let i = 0; i < listArticles.length; i++) {
    const a = listArticles[i];
    // Number by position in the full catalogue, newest-first, not by position in
    // this list. The 3 newest articles sit in the hero and are not numbered, so
    // the list opens at (total - 3) and counts down to 01.
    const num = String(listArticles.length - i).padStart(2, '0');
    html += `
            <div class="node-type-experience_article">
              <a href="${a.href}" class="our-work__link">
                <hr class="our-work-hr our-work-hr--before">
                <span class="work-index">${num}</span>
                <span class="field-name--field_snippet">${a.eyebrow} · ${a.title}</span>
                ${isRecentUpdate(a) ? `<span class="updated-tag">Updated ${formatDate(a.modDate)}</span>` : ''}
                <span class="our-work__read-more">Read the analysis &rarr;</span>
                <hr class="our-work-hr our-work-hr--after">
              </a>
            </div>`;
  }
  return html;
}

// ── Scorecard auto-generation ────────────────────────────────────────────────
// The scorecard tracks every published stock article automatically. A pick is any
// article in /analyses with an HK ticker (NNNN.HK) AND a verdict in its hero.
// ticker / verdict / sector / slug are read from the article; entry date defaults
// to its pubDate. Curated short names and the Apr-10 inaugural-issue entry dates are
// preserved via OVERRIDES; a new article can also override via CONFIG.scorecardName
// and CONFIG.scorecardEntryDate. The HSI Tracker Fund benchmark is a fixed entry.
const SCORECARD_OVERRIDES = {
  '0113-dickson-concepts': { name: 'Dickson Concepts', entryDate: '2026-04-10' },
  '1913-prada':            { name: 'Prada',            entryDate: '2026-04-10' },
  '1167-jacobio':          { name: 'Jacobio',          entryDate: '2026-04-10' },
  '1585-yadea':            { name: 'Yadea',            entryDate: '2026-04-10' },
  '9988-alibaba':          { name: 'Alibaba',          entryDate: '2026-04-10' },
  '6690-haier':            { name: 'Haier Smart Home' },
  '1698-tencent-music':    { name: 'Tencent Music' },
  '0300-midea':            { name: 'Midea Group' },
};
const SCORECARD_BENCHMARK = {
  t: '2800.HK', company: 'Tracker Fund (HSI)', eyebrow: 'Benchmark',
  slug: 'hsi-35-year-trendline', issueDate: '2026-04-10', isBenchmark: true,
};
// Partial-exit ("Reduced") trade log. Hand-maintained at ROOT/scorecard-exits.json,
// keyed by ticker, one exits[] entry per trim: { fraction, fillPrice, fillDate, label }.
// Attached to a pick as `reduced`; scorecard.js blends the frozen realized portion
// with the live remainder so a round-trip cannot give the banked gain back.
// See wiki/scorecard.md → "Partial exits (Reduced state)".
let SCORECARD_EXITS = {};
try {
  SCORECARD_EXITS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scorecard-exits.json'), 'utf8'));
} catch (e) { /* missing or invalid file = no reduced state on any pick */ }

// Permanent stop-loss ledger. Hand-maintained at ROOT/scorecard-stops.json, keyed by
// ticker: { stopDate, stopLevel, lockedPct }, computed once from full from-inception
// history. Attached to a pick as `forcedStop`; scorecard.js skips its own live
// trailing-stop scan for these tickers and uses these frozen values instead, so a
// price recovery (or the live fetch's rolling 3-month window rolling past the entry
// date) can never silently erase or corrupt a real historical stop.
// See wiki/scorecard.md -> "Permanent stop ledger".
let SCORECARD_STOPS = {};
try {
  SCORECARD_STOPS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scorecard-stops.json'), 'utf8'));
} catch (e) { /* missing or invalid file = no forced stop on any pick */ }
function cleanCompanyName(s) {
  if (!s) return '';
  return s.replace(/\s*(Group Holdings? Ltd\.?|Holdings? Ltd\.?|International Ltd\.?|Co\.,?\s*Ltd\.?|S\.p\.A\.|Inc\.?|,?\s*Ltd\.?)\s*$/i, '').trim() || s;
}
function generateScorecardData() {
  const dir = path.join(SRC, 'analyses');
  const picks = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const ticker  = (raw.match(/class="meta-ticker">([^<]+)</)  || [])[1] || '';
    const verdict = (raw.match(/class="meta-verdict">([^<]+)</) || [])[1] || '';
    if (!/^\d{3,4}\.HK$/.test(ticker) || !verdict) continue; // only HK stock picks
    const { config } = parseSource(raw);
    const slug = f.replace(/\.html$/, '');
    const sector = ((raw.match(/\/analyses\/[a-z-]+"[^>]*>([^<]+)<\/a>\s*<\/div>/) || [])[1] || '').trim();
    const about  = (raw.match(/"about":\s*\{[^}]*?"name":\s*"([^"]+)"/) || [])[1] || '';
    const ov = SCORECARD_OVERRIDES[slug] || {};
    const company   = config.scorecardName || ov.name || cleanCompanyName(about) || slug;
    const issueDate = config.scorecardEntryDate || ov.entryDate || config.pubDate || '';
    const eyebrow   = sector + (verdict.trim().toUpperCase() === 'MONITOR' ? ' · Monitor' : '');
    const reduced = SCORECARD_EXITS[ticker];
    const forcedStop = SCORECARD_STOPS[ticker];
    picks.push({ t: ticker, company, eyebrow, slug, issueDate, ...(reduced ? { reduced } : {}), ...(forcedStop ? { forcedStop } : {}) });
  }
  picks.sort((a, b) => (a.issueDate < b.issueDate ? -1 : a.issueDate > b.issueDate ? 1 : (a.t < b.t ? -1 : 1)));
  return picks.concat([SCORECARD_BENCHMARK]);
}

// The ticker in an article's hero names the same position the scorecard tracks,
// so it links straight to that row. Both sides derive the anchor from the ticker
// through this one function — scorecard.js has the identical rule — so the link
// and its target cannot drift apart.
function tickerAnchor(ticker) {
  return 't-' + ticker.toLowerCase().replace(/\./g, '-');
}

// Only linkify a ticker the scorecard actually carries a row for. An article
// without a verdict (or a sector hub) has no row, and would otherwise get a
// link that lands on the scorecard and highlights nothing.
function linkifyHeroTicker(page, tickers) {
  return page.replace(/<span class="meta-ticker">([^<]+)<\/span>/,
    function (whole, ticker) {
      var t = ticker.trim();
      if (!tickers.has(t)) return whole;
      return '<a class="meta-ticker" href="/scorecard#' + tickerAnchor(t) +
             '" title="' + t + ' on the scorecard">' + ticker + '</a>';
    });
}

// ── Validate internal linking ─────────────────────────────────────────────────
// Warn if any published article has zero internal links to other articles.
function validateInternalLinks() {
  const dir = path.join(SRC, 'analyses');
  const articles = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'market-thesis.html');
  const warnings = [];
  for (const f of articles) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    // Check for href="/analyses/*.html" links (excludes market-thesis, self-links)
    const links = raw.match(/href="\/analyses\/([^"]+)"/g) || [];
    const otherLinks = links.filter(link => !link.includes(f.replace(/\.html$/, '')));
    if (otherLinks.length === 0) {
      warnings.push(`  ⚠️  ${f} has zero internal links to other articles`);
    }
  }
  if (warnings.length > 0) {
    console.warn('\nInternal linking check:');
    warnings.forEach(w => console.warn(w));
    console.warn('(Every article should link to at least one other article for SEO & navigation)\n');
  }
}

// ── sitemap.xml + feed.xml auto-generation ────────────────────────────────────
// Both were hand-maintained and drifted (3 articles missing from the sitemap,
// 7 from the feed). Generated from disk on every build instead.
const STATIC_PAGES = ['/about', '/scorecard', '/disclaimer', '/legal-notice'];

// ── Social cover auto-wiring ──────────────────────────────────────────────────
// scripts/make_og.py writes assets/og/{slug}.png. Use it for the article's
// og:image unless CONFIG names a real bespoke image (not the shared placeholder).
const GENERIC_OG = `${SITE_ORIGIN}/assets/og-image.png`;

function resolveOgImage(rel, config) {
  const m = rel.match(/^analyses[/\\](.+)\.html$/);
  if (!m || (config.ogImage && config.ogImage !== GENERIC_OG)) return config.ogImage;
  const cover = path.join(ROOT, 'assets', 'og', `${m[1]}.png`);
  return fs.existsSync(cover) ? `${SITE_ORIGIN}/assets/og/${m[1]}.png` : config.ogImage;
}
const FEED_MAX_ITEMS = 20;

const xmlEscape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// "2026-07-27" → "Mon, 27 Jul 2026 00:00:00 +0800" (HK time, matches existing feed)
function rfc822(dateStr) {
  const d = new Date(`${dateStr}T00:00:00+08:00`);
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y, m, day] = dateStr.split('-');
  return `${days[d.getUTCDay()]}, ${day} ${months[parseInt(m) - 1]} ${y} 00:00:00 +0800`;
}

// Every .html under publish/analyses/, dated or not. Sector hubs and
// market-thesis carry no CONFIG.pubDate, so getAllArticles() skips them —
// they still belong in the sitemap.
function getAllAnalysisPages() {
  const dir = path.join(SRC, 'analyses');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => {
      const { config } = parseSource(fs.readFileSync(path.join(dir, f), 'utf8'));
      return { href: `/analyses/${f.replace(/\.html$/, '')}`, date: config.pubDate || null };
    })
    .sort((a, b) => a.href.localeCompare(b.href));
}

function generateSitemap(pages, newest) {
  // ponytail: <priority> is ignored by Google, so one value for all analyses.
  const url = (loc, lastmod, changefreq, priority) => [
    '  <url>',
    `    <loc>${SITE_ORIGIN}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');

  const entries = [
    url('/', newest, 'weekly', '1.0'),
    ...pages.map(p => url(p.href, p.date, 'monthly', '0.8')),
    ...STATIC_PAGES.map(p => url(p, null, 'yearly', '0.5')),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries.join('\n\n')}

</urlset>
`;
}

function generateFeed(articles) {
  const items = articles.slice(0, FEED_MAX_ITEMS).map(a => `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${SITE_ORIGIN}${a.href}</link>
      <guid>${SITE_ORIGIN}${a.href}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <description>${xmlEscape(a.description)}</description>
    </item>`).join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Trading852</title>
    <link>${SITE_ORIGIN}</link>
    <description>Independent English-language research on HKEX-listed companies. Special situations, documented NAV discounts, identifiable catalysts.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(articles[0].date)}</lastBuildDate>
    <atom:link href="${SITE_ORIGIN}/feed.xml" rel="self" type="application/rss+xml"/>

${items}

  </channel>
</rss>
`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy /assets → dist/assets
  const assetsDir = path.join(ROOT, 'assets');
  if (fs.existsSync(assetsDir)) copyDir(assetsDir, path.join(DIST, 'assets'));

  let built = 0, copied = 0;

  // Computed before the page loop so hero tickers can be linked to their row,
  // and reused below for the JSON so both come from one scan.
  let recos = [];
  try { recos = generateScorecardData(); } catch (e) { console.error('Scorecard generation failed:', e.message); }
  const scorecardTickers = new Set(recos.map(r => r.t));

  for (const file of walkSrc(SRC)) {
    const rel     = path.relative(SRC, file);
    const outPath = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    if (file.endsWith('.html')) {
      let source = fs.readFileSync(file, 'utf8');
      const { config, jsonld, content } = parseSource(source);
      config.ogImage = resolveOgImage(rel, config);
      let page = assemblePage(config, jsonld, content);
      // Substitute {{RECENT_ANALYSES}} and {{OUR_ANALYSES}} tokens on the homepage.
      if (rel === 'index.html') {
        page = page.replace('{{RECENT_ANALYSES}}', generateRecentAnalysesHTML());
        page = page.replace('{{OUR_ANALYSES}}', generateOurAnalysesHTML());
      }
      page = linkifyHeroTicker(page, scorecardTickers);
      fs.writeFileSync(outPath, page);
      built++;
    } else {
      fs.copyFileSync(file, outPath);
      copied++;
    }
  }

  // Auto-generate scorecard positions from published stock articles.
  if (recos.length) {
    fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
    fs.writeFileSync(path.join(DIST, 'assets', 'scorecard-recos.json'), JSON.stringify(recos, null, 2));
    console.log(`Scorecard: ${recos.length - 1} stock positions + 1 benchmark generated`);
  }

  // Regenerate sitemap.xml + feed.xml from disk (never hand-edit them).
  const articles = getAllArticles();
  const pages = getAllAnalysisPages();
  fs.mkdirSync(path.join(DIST, 'static'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'static', 'sitemap.xml'), generateSitemap(pages, articles[0].date));
  fs.writeFileSync(path.join(DIST, 'feed.xml'), generateFeed(articles));
  console.log(`Sitemap: ${pages.length + STATIC_PAGES.length + 1} URLs · Feed: ${Math.min(articles.length, FEED_MAX_ITEMS)} items`);

  console.log(`Built ${built} HTML pages, copied ${copied} files → dist/`);

  // Validate internal linking on every build.
  validateInternalLinks();
}

if (require.main === module) build();

module.exports = { isRecentUpdate };
