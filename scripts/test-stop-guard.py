# End-to-end check for the fully-exited stop guard in assets/scorecard.js.
#
# A pick whose exit fractions sum to 100% has no shares left to stop out, so the
# live trailing-stop scan must be skipped for it. Without the guard the row grows
# a "Stopped - stop hit <date>" badge on a position that was closed by sale.
#
# Stubs the Yahoo proxy for every ticker so the run is deterministic and offline:
# 0300.HK (entry 89.70, exits summing to 100%) crashes to 60, well below its stop.
#
# Usage, with the preview server running (see .claude/launch.json):
#   node build.js && python3 -m http.server --directory dist 3000 &
#   python3 scripts/test-stop-guard.py http://localhost:3000
from playwright.sync_api import sync_playwright
import sys

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000'

STUB = r"""
(() => {
  const realFetch = window.fetch;
  const series = (flat, crashTo) => {
    const start = Date.UTC(2026, 2, 20) / 1000, DAY = 86400;
    const ts = [], o = [], h = [], l = [], c = [];
    for (let i = 0; i < 130; i++) {
      ts.push(start + i * DAY);
      const px = (crashTo != null && i > 120) ? crashTo : flat;
      o.push(px); h.push(px); l.push(px); c.push(px);
    }
    return {chart:{result:[{
      meta:{regularMarketPrice: (crashTo != null ? crashTo : flat), regularMarketTime: ts[ts.length-1]},
      timestamp: ts,
      indicators:{quote:[{open:o, high:h, low:l, close:c, volume: ts.map(()=>1e6)}]},
      events:{}
    }]}};
  };
  window.fetch = async (url, opts) => {
    const u = String(url);
    if (!u.includes('yahoo-proxy')) return realFetch(url, opts);
    // 0300.HK: flat at its 89.70 entry, then a crash to 60 well below the
    // breakeven stop. Every other ticker: an inert flat line.
    const body = u.includes('0300.HK') ? series(89.70, 60.0) : series(50.0);
    return new Response(JSON.stringify(body), {status:200, headers:{'Content-Type':'application/json'}});
  };
})();
"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    pg.add_init_script(STUB)
    # cleanUrls is a Vercel rewrite; the local static server needs the .html.
    pg.goto(BASE + '/static/scorecard.html', wait_until='networkidle', timeout=30000)
    pg.wait_for_selector('.sc-table tbody tr', timeout=20000)
    pg.wait_for_timeout(1500)
    row = pg.locator('tr', has=pg.locator('td.sc-ticker', has_text='0300.HK')).first
    txt = ' '.join(row.inner_text().split())
    up = txt.upper()  # the badges are text-transform: uppercase
    cls = row.get_attribute('class') or ''
    print('row:  ', txt)
    print('class:', cls)
    assert 'STOPPED' not in up, 'FAIL: closed position rendered a Stopped badge'
    assert 'REDUCED 100%' in up, 'FAIL: expected the Reduced 100% badge'
    assert '+6.91%' in txt, 'FAIL: pct must stay frozen at the banked +6.91%'
    assert 'sc-row-reduced' in cls, 'FAIL: expected the fully-closed row tint'
    # The Last column must show the exit fill, never the (crashed) live price.
    assert '99.10' in txt, 'FAIL: Last column must show the 99.10 exit fill, got ' + txt
    assert 'exited Jul 31' in txt, 'FAIL: expected the exit date under the fill'
    assert '60.00' not in txt, 'FAIL: live price leaked into a closed row'
    print('OK: fully exited pick stays unstopped and shows its exit fill')
    b.close()
