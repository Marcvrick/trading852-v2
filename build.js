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
    '{{OG_IMAGE_ALT}}':       config.ogImageAlt    || 'Trading852: independent equity research on HKEX-listed companies',
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

// ── "Our Analyses" list auto-generation ─────────────────────────────────────
// Generate the full numbered list of all articles for the "Our Analyses" section.
// Each article gets a sequential number, link, eyebrow, and contextLine (never repeat title).
function generateOurAnalysesHTML() {
  const articles = getAllArticles();
  if (articles.length === 0) return '';

  let html = '';
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const num = String(i + 1).padStart(2, '0');
    html += `
            <div class="node-type-experience_article">
              <a href="${a.href}" class="our-work__link">
                <hr class="our-work-hr our-work-hr--before">
                <span class="work-index">${num}</span>
                <span class="field-name--field_snippet">${a.eyebrow} · ${a.contextLine}</span>
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
    picks.push({ t: ticker, company, eyebrow, slug, issueDate });
  }
  picks.sort((a, b) => (a.issueDate < b.issueDate ? -1 : a.issueDate > b.issueDate ? 1 : (a.t < b.t ? -1 : 1)));
  return picks.concat([SCORECARD_BENCHMARK]);
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

// ── Main ───────────────────────────────────────────────────────────────────────
function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy /assets → dist/assets
  const assetsDir = path.join(ROOT, 'assets');
  if (fs.existsSync(assetsDir)) copyDir(assetsDir, path.join(DIST, 'assets'));

  let built = 0, copied = 0;

  for (const file of walkSrc(SRC)) {
    const rel     = path.relative(SRC, file);
    const outPath = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    if (file.endsWith('.html')) {
      let source = fs.readFileSync(file, 'utf8');
      const { config, jsonld, content } = parseSource(source);
      let page = assemblePage(config, jsonld, content);
      // Substitute {{RECENT_ANALYSES}} and {{OUR_ANALYSES}} tokens on the homepage.
      if (rel === 'index.html') {
        page = page.replace('{{RECENT_ANALYSES}}', generateRecentAnalysesHTML());
        page = page.replace('{{OUR_ANALYSES}}', generateOurAnalysesHTML());
      }
      fs.writeFileSync(outPath, page);
      built++;
    } else {
      fs.copyFileSync(file, outPath);
      copied++;
    }
  }

  // Auto-generate scorecard positions from published stock articles.
  try {
    const recos = generateScorecardData();
    fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
    fs.writeFileSync(path.join(DIST, 'assets', 'scorecard-recos.json'), JSON.stringify(recos, null, 2));
    console.log(`Scorecard: ${recos.length - 1} stock positions + 1 benchmark generated`);
  } catch (e) {
    console.error('Scorecard generation failed:', e.message);
  }

  console.log(`Built ${built} HTML pages, copied ${copied} files → dist/`);

  // Validate internal linking on every build.
  validateInternalLinks();
}

build();
