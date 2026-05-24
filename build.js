'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC  = path.join(ROOT, 'src');
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

  const extraScript = isLight
    ? '\n  <script src="/assets/scorecard.js" defer></script>'
    : '';

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
      const { config, jsonld, content } = parseSource(fs.readFileSync(file, 'utf8'));
      fs.writeFileSync(outPath, assemblePage(config, jsonld, content));
      built++;
    } else {
      fs.copyFileSync(file, outPath);
      copied++;
    }
  }

  console.log(`Built ${built} HTML pages, copied ${copied} files → dist/`);
}

build();
