# Check the article-hero ticker deep links land on a real scorecard row.
#
# build.js writes /scorecard#t-<ticker> into each article hero; scorecard.js
# writes the matching id onto each <tr> at render time. The two derive the
# anchor independently (tickerAnchor in each file), so a rename on one side
# would silently produce links that scroll to nothing. This asserts the sets
# match, then exercises one link end to end.
#
# Usage, with the preview server running (see .claude/launch.json):
#   python3 scripts/test-ticker-links.py http://localhost:3000
from playwright.sync_api import sync_playwright
import pathlib
import json
import sys
import re

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000'
DIST = pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'analyses'

anchors = {}
prose = {}
for f in sorted(DIST.glob('*.html')):
    html = f.read_text()
    m = re.search(r'class="meta-ticker" href="/scorecard#([^"]+)"', html)
    if m:
        anchors[f.stem] = m.group(1)
    hits = re.findall(r'class="ticker-link" href="/scorecard#([^"]+)"', html)
    if hits:
        prose[f.stem] = hits
    # The prose pass must not reach inside JSON-LD or the CONFIG comment, and
    # must never nest an anchor inside the hero pill it just created.
    for block in re.findall(r'<script[\s\S]*?</script>|<!--[\s\S]*?-->', html):
        assert 'ticker-link' not in block, \
            'FAIL: %s has a ticker link inside a script or comment block' % f.name
    assert not re.search(r'<a\b[^>]*>\s*<a\b', html), 'FAIL: %s has nested anchors' % f.name
    for block in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', html):
        json.loads(block)  # raises if the rewrite corrupted the structured data
assert anchors, 'FAIL: no linkified hero tickers found in dist/analyses (run node build.js first)'
print('hero links:', len(anchors))
print('prose links:', sum(len(v) for v in prose.values()), 'across', len(prose), 'articles')

# Every stock article links its own ticker in the body, at every mention.
for slug, a in anchors.items():
    assert slug in prose, 'FAIL: %s has no prose ticker link' % slug
    assert a in prose[slug], 'FAIL: %s never links its own ticker %s in the body' % (slug, a)

# The standfirst sits on the dark hero, where an inherited-colour link renders at
# 55% white and cannot be seen — and the linked pill is directly above it.
for f in sorted(DIST.glob('*.html')):
    sub = re.search(r'<p class="article-subtitle">([\s\S]*?)</p>', f.read_text())
    if sub:
        assert 'ticker-link' not in sub.group(1), \
            'FAIL: %s linked a ticker in the hero standfirst' % f.name

# No tracked ticker may be left unlinked in the body: that is the failure Dany
# hit — the only link sat in the standfirst and the section he read had none.
NON_PROSE = re.compile(
    r'<!--[\s\S]*?-->|<script\b[\s\S]*?</script>|<style\b[\s\S]*?</style>'
    r'|<title\b[\s\S]*?</title>|<p class="article-subtitle"[\s\S]*?</p>'
    r'|<a\b[\s\S]*?</a>|<h[1-6]\b[\s\S]*?</h[1-6]>|<[^>]+>', re.I)

recos = json.loads((DIST.parent / 'assets' / 'scorecard-recos.json').read_text())
tracked = {r['t'] for r in recos}
for f in sorted(DIST.glob('*.html')):
    leftover = [t for t in re.findall(r'\b\d{3,4}\.HK\b', NON_PROSE.sub(' ', f.read_text()))
                if t in tracked]
    assert not leftover, \
        'FAIL: %s leaves tracked tickers unlinked in the body: %s' % (f.name, sorted(set(leftover)))
print('every tracked ticker mention in every body is linked')

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 1000})
    pg.goto(BASE + '/static/scorecard.html', wait_until='networkidle', timeout=60000)
    pg.wait_for_selector('.sc-table tbody tr', timeout=40000)
    pg.wait_for_timeout(2000)
    rows = set(pg.eval_on_selector_all('.sc-table tbody tr[id]', 'els => els.map(e => e.id)'))
    print('rows with ids:', len(rows))

    missing = {slug: a for slug, a in anchors.items() if a not in rows}
    assert not missing, 'FAIL: hero links with no scorecard row: %s' % missing
    dead = {slug: [a for a in hits if a not in rows] for slug, hits in prose.items()}
    dead = {k: v for k, v in dead.items() if v}
    assert not dead, 'FAIL: prose links with no scorecard row: %s' % dead

    # Exercise one end to end: the hash must select the row and mark it.
    # Fresh page, not a second goto on the open one: same-URL-plus-hash is a
    # same-document navigation, which exercises the hashchange path rather than
    # the cold-load path this is meant to cover.
    target = anchors['1913-prada']
    pg.close()
    pg = b.new_page(viewport={'width': 1280, 'height': 1000})
    pg.goto(BASE + '/static/scorecard.html#' + target, wait_until='networkidle', timeout=60000)
    pg.wait_for_selector('.sc-table tbody tr', timeout=40000)
    pg.wait_for_timeout(2500)
    state = pg.evaluate("""(id) => {
      const row = document.getElementById(id);
      if (!row) return {found: false};
      const r = row.getBoundingClientRect();
      return { found: true, marked: row.classList.contains('sc-row-target'),
               ticker: row.querySelector('.sc-ticker a').innerText.trim(),
               inViewport: r.top >= 0 && r.bottom <= window.innerHeight };
    }""", target)
    print('cold load:', state)
    assert state['found'], 'FAIL: #%s not present after render' % target
    assert state['marked'], 'FAIL: target row not marked with sc-row-target'
    assert state['ticker'] == '1913.HK', 'FAIL: anchor hit the wrong row: %s' % state['ticker']
    assert state['inViewport'], 'FAIL: target row was not scrolled into view'

    # Following a second anchor from this page only changes the hash; without the
    # hashchange listener the highlight would stay stuck on the first row.
    other = anchors['0300-midea']
    pg.evaluate("(h) => { location.hash = h; }", other)
    pg.wait_for_timeout(800)
    moved = pg.evaluate(
        "(ids) => ({ marked: document.querySelectorAll('.sc-row-target').length,"
        "            onNew: document.getElementById(ids[1]).classList.contains('sc-row-target'),"
        "            offOld: !document.getElementById(ids[0]).classList.contains('sc-row-target') })",
        [target, other])
    print('after hashchange:', moved)
    assert moved['onNew'] and moved['offOld'] and moved['marked'] == 1, \
        'FAIL: hashchange did not move the highlight: %s' % moved

    print('OK: %d hero links resolve; #%s marks 1913.HK on load, and hashchange re-targets'
          % (len(anchors), target))
    b.close()
