# Parity check for the "Portfolio vs the Hang Seng" chart on /scorecard.
#
# The chart is only trustworthy if its right edge is the same number the table
# reports. Both come from the same rule (mean of every entered pick's return),
# but the chart evaluates it per session and the table only at the last bar, so
# a divergence means one of the two paths drifted. This asserts they agree.
#
# Uses live prices (the real Yahoo proxy), so the values move day to day. The
# invariant does not: chart endpoint == table average, whatever the prices are.
#
# Usage, with the preview server running (see .claude/launch.json):
#   python3 scripts/test-chart-parity.py http://localhost:3000
from playwright.sync_api import sync_playwright
import sys
import re

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 1000})
    errors = []
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.goto(BASE + '/static/scorecard.html', wait_until='networkidle', timeout=60000)
    pg.wait_for_selector('.sc-table tbody tr', timeout=40000)
    pg.wait_for_timeout(3000)

    summary = ' '.join(pg.locator('#scorecard-summary').inner_text().split())
    series = pg.evaluate("""() => {
      const c = Object.values(Chart.instances)[0];
      const [port, bench] = c.data.datasets;
      return { points: port.data.length,
               first: c.data.labels[0],
               portFirst: port.data[0], benchFirst: bench.data[0],
               portLast: port.data[port.data.length - 1],
               benchLast: bench.data[bench.data.length - 1] };
    }""")
    print('summary:', summary)
    print('series :', series)

    table_avg = float(re.search(r'Average ([+-][\d.]+)%', summary).group(1))
    assert abs(series['portLast'] - table_avg) < 0.01, \
        'FAIL: chart endpoint %.4f != table average %.4f' % (series['portLast'], table_avg)
    # Both lines are returns since their own entry, so both start at zero.
    assert abs(series['portFirst']) < 1e-9, 'FAIL: portfolio must start at 0%'
    assert abs(series['benchFirst']) < 1e-9, 'FAIL: benchmark must start at 0%'
    assert series['points'] > 60, 'FAIL: expected the full Apr-10-to-date series, got %d' % series['points']
    assert series['first'].startswith('Apr'), 'FAIL: series should open in April, got ' + series['first']
    assert not errors, 'FAIL: console errors: %s' % errors
    print('OK: chart endpoint matches the table average (%.2f%%) over %d sessions'
          % (table_avg, series['points']))
    b.close()
