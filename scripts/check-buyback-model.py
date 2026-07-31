# Independent replication of the scorecard's buy-back line, written to cross-check
# assets/scorecard.js rather than trust one implementation of a modelled claim
# shown on a public page. Its "never stopped" picks must reproduce the live table
# exactly - that is the check that entry-finding and dividend handling match.
#
# Rules, all three settled with Dany on 2026-07-31:
#   1. Re-entry triggers the next time the RAW price reaches the original entry.
#      Raw, because a position that is not held receives no dividend, so nothing
#      may be added to the price while out of the market.
#   2. It fills AT the entry whenever the session trades there (its low comes back
#      through it) - 1585.HK on Jun 8 opened 12.69 with a low of 11.38, so it
#      fills at 12.58. Only a session that gaps and never returns pays the open:
#      9988.HK on May 22, open 128.20, low 126.00, against a 125.50 entry.
#   3. A dividend accrues to a leg only while that leg holds the shares. 1913.HK
#      is the case that matters: HKD 1.5025 went ex on May 6, between the Apr 30
#      stop and the May 7 buy-back, so the strategy never received it.
#
# Usage: python3 scripts/check-buyback-model.py   (hits Yahoo directly, ~15s)
import json
import urllib.request
import datetime

TIERS = [(10, 1.00, 0.0), (5, 0.95, -5.0), (0, 0.90, -10.0)]
ds = lambda t: datetime.datetime.fromtimestamp(t, datetime.timezone.utc).strftime('%b %d')


def fetch(t):
    u = ("https://query1.finance.yahoo.com/v8/finance/chart/" + t
         + "?range=1y&interval=1d&events=div")
    d = json.loads(urllib.request.urlopen(
        urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})).read())['chart']['result'][0]
    q = d['indicators']['quote'][0]
    divs = [(v['date'], v['amount']) for v in d.get('events', {}).get('dividends', {}).values()]
    return d['timestamp'], q['open'], q['close'], q['high'], q['low'], divs


recos = json.loads(urllib.request.urlopen(
    'https://trading852.com/assets/scorecard-recos.json').read())

total, count = 0.0, 0
print('%-9s %9s   %s' % ('ticker', 'buyback', 'legs'))
for rec in recos:
    if rec.get('isBenchmark'):
        continue
    if rec.get('reduced'):
        # Closed by a decision to sell, not by a stop: carried at its actual result.
        print('%-9s %9.2f   closed by sale, not modelled' % (rec['t'], 6.91))
        total += 6.91
        count += 1
        continue

    t = rec['t']
    ts, op, cl, hi, lo, divs = fetch(t)
    y, m, dd = map(int, rec['issueDate'].split('-'))
    pub = datetime.datetime(y, m, dd, tzinfo=datetime.timezone.utc).timestamp()
    weekend = datetime.datetime(y, m, dd).weekday() >= 5
    ei = next(i for i in range(len(ts)) if ts[i] > pub and (op if weekend else cl)[i] is not None)
    entry = (op if weekend else cl)[ei]

    forced = rec.get('forcedStop')
    forced_ts = (datetime.datetime.strptime(forced['stopDate'], '%Y-%m-%d')
                 .replace(tzinfo=datetime.timezone.utc).timestamp()) if forced else None

    banked, holding, leg_open_i, leg_open_ts, anchor = 1.0, True, ei, ts[ei], entry
    tier, level, locked, peak = TIERS[-1], entry * TIERS[-1][1], TIERS[-1][2], entry
    trace = []
    leg_div = lambda bar_ts, since: sum(b for a, b in divs if since < a <= bar_ts)

    for i in range(ei, len(ts)):
        if cl[i] is None:
            continue
        if holding:
            cd = leg_div(ts[i], leg_open_ts)
            if i > leg_open_i:
                if hi[i] is not None and hi[i] + cd > peak:
                    peak = hi[i] + cd
                gain = (peak - anchor) / anchor * 100
                for tr in TIERS:
                    if gain >= tr[0]:
                        tier, level, locked = tr, anchor * tr[1], tr[2]
                        break
                by_ledger = forced_ts is not None and ts[i] >= forced_ts
                if by_ledger or (lo[i] is not None and lo[i] + cd <= level):
                    lk = forced['lockedPct'] if by_ledger else locked
                    banked *= 1 + lk / 100
                    holding, forced_ts = False, None
                    trace.append('stop %s %g%%' % (ds(ts[i]), lk))
        else:
            if hi[i] is not None and hi[i] >= entry:
                fill = entry if (lo[i] is not None and lo[i] <= entry) else max(entry, op[i])
                holding, leg_open_i, leg_open_ts, anchor = True, i, ts[i], fill
                peak, tier = anchor, TIERS[-1]
                level, locked = anchor * TIERS[-1][1], TIERS[-1][2]
                trace.append('buy %s @%.2f' % (ds(ts[i]), fill))

    last = next(cl[i] for i in range(len(cl) - 1, -1, -1) if cl[i] is not None)
    final = (banked * (1 + (last + leg_div(ts[-1], leg_open_ts) - anchor) / anchor) - 1
             if holding else banked - 1)
    print('%-9s %9.2f   %s' % (t, final * 100, ' → '.join(trace) or 'never stopped'))
    total += final * 100
    count += 1

print('\nbuy-back portfolio mean over %d picks: %+.2f%%' % (count, total / count))
print('must match the "With buy-backs" figure in the chart key on /scorecard')
