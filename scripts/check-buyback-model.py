# Independent replication of the scorecard's buy-back line, written to cross-check
# assets/scorecard.js rather than trust a single implementation of a modelled
# claim shown on a public page. Same rules: 3-tier trailing ratchet, re-enter at
# the ORIGINAL entry price when a later bar's high reaches it, legs compound.
#
# Its "never stopped" picks must equal the live table exactly - that is the check
# that the entry-finding and dividend handling match.
#
# NOTE on the headline number: this script averages only the picks it models, so
# it prints a mean over 11. The chart averages over all 12, carrying a pick that
# was closed by sale at its actual result on both lines - otherwise the two curves
# would not cover the same portfolio and could not be compared. Expect this script
# and the page to differ for that reason alone:
#     page = (script_total + <closed pick actual>) / 12
#
# Usage: python3 scripts/check-buyback-model.py   (hits Yahoo directly, ~10s)
import json, urllib.request, datetime, sys

TIERS = [(10, 1.00, 0.0), (5, 0.95, -5.0), (0, 0.90, -10.0)]
PROXY = "https://query1.finance.yahoo.com/v8/finance/chart/"

def fetch(t):
    u = PROXY + t + "?range=1y&interval=1d&events=div"
    r = json.loads(urllib.request.urlopen(
        urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})).read())
    d = r['chart']['result'][0]
    q = d['indicators']['quote'][0]
    divs = d.get('events', {}).get('dividends', {})
    return d['timestamp'], q['open'], q['close'], q['high'], q['low'], \
           [(v['date'], v['amount']) for v in divs.values()]

recos = json.loads(urllib.request.urlopen('https://trading852.com/assets/scorecard-recos.json').read())
rows = []
for rec in recos:
    if rec.get('isBenchmark'): continue
    t = rec['t']
    ts, op, cl, hi, lo, divs = fetch(t)
    y, m, dd = map(int, rec['issueDate'].split('-'))
    pub = datetime.datetime(y, m, dd, tzinfo=datetime.timezone.utc).timestamp()
    weekend = datetime.datetime(y, m, dd).weekday() >= 5
    ei = next((i for i in range(len(ts))
               if ts[i] > pub and (op if weekend else cl)[i] is not None), None)
    if ei is None: continue
    entry = (op if weekend else cl)[ei]
    entry_ts = ts[ei]
    dv = [(a, b) for a, b in divs if a > entry_ts]
    cum = lambda bt: sum(b for a, b in dv if a <= bt)

    exited = sum(e['fraction'] for e in rec.get('reduced', {}).get('exits', []))
    forced = rec.get('forcedStop')
    fts = (datetime.datetime.strptime(forced['stopDate'], '%Y-%m-%d')
           .replace(tzinfo=datetime.timezone.utc).timestamp()) if forced else None

    if exited > 0:
        rows.append((t, None, None, None, 'closed/trimmed, not modelled'))
        continue

    banked, open_, leg_open = 1.0, True, ei
    tier, lvl, locked, peak = TIERS[-1], entry * TIERS[-1][1], TIERS[-1][2], entry
    n_re, legs = 0, []
    for i in range(ei, len(ts)):
        if cl[i] is None: continue
        cd = cum(ts[i])
        if open_:
            if i > leg_open:
                if hi[i] is not None and hi[i] + cd > peak: peak = hi[i] + cd
                g = (peak - entry) / entry * 100
                for tr in TIERS:
                    if g >= tr[0]: tier, lvl, locked = tr, entry * tr[1], tr[2]; break
                byledger = fts is not None and ts[i] >= fts
                if byledger or (lo[i] is not None and lo[i] + cd <= lvl):
                    lk = forced['lockedPct'] if byledger else locked
                    banked *= 1 + lk / 100
                    legs.append(('stop', datetime.datetime.utcfromtimestamp(ts[i]).strftime('%b %d'), lk))
                    open_, fts = False, None
                    continue
        else:
            if hi[i] is not None and hi[i] + cd >= entry:
                open_, leg_open, n_re = True, i, n_re + 1
                peak, tier = entry, TIERS[-1]
                lvl, locked = entry * TIERS[-1][1], TIERS[-1][2]
                legs.append(('buy', datetime.datetime.utcfromtimestamp(ts[i]).strftime('%b %d'), entry))
    lastc = next(cl[i] for i in range(len(cl) - 1, -1, -1) if cl[i] is not None)
    final = banked * (1 + (lastc + cum(ts[-1]) - entry) / entry) - 1 if open_ else banked - 1
    actual = next((r for r in [rec]), None)
    rows.append((t, round(entry, 2), n_re, round(final * 100, 2),
                 ' → '.join('%s %s %s' % (k, d, v) for k, d, v in legs) or 'never stopped'))

print('%-9s %8s %5s %9s  %s' % ('ticker', 'entry', 're', 'buyback%', 'legs'))
tot, n = 0.0, 0
for t, e, nr, f, legs in rows:
    print('%-9s %8s %5s %9s  %s' % (t, e if e else '-', nr if nr is not None else '-',
                                    f if f is not None else '-', legs))
    if f is not None: tot += f; n += 1
print('\nbuy-back portfolio mean over %d modelled picks: %+.2f%%' % (n, tot / n))
