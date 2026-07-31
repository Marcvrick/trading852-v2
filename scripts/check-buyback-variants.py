# Scores the buy-back line's re-entry trigger against the alternative, so the
# choice on the public page is a measured one rather than a preference.
#
#   A  re-enter the next time the price REACHES the entry (intraday high),
#      filled at the entry price. This is the shipped rule, confirmed by Dany
#      on 2026-07-31: "la prochaine fois que le prix monte a 12.58".
#   B  re-enter on the first CLOSE at or above the entry, filled at that close,
#      with the stop re-anchored to the higher fill.
#
# B is not simply milder. It skips 1585.HK entirely (no session ever closed back
# at 12.58) which is worth ~18pp on that pick, but re-anchoring the stop higher
# turns 1913.HK Prada from +3.51% into -9.32%. Portfolio: A -0.13%, B +0.83%.
#
# Usage: python3 scripts/check-buyback-variants.py   (hits Yahoo directly, ~15s)
import json, urllib.request, datetime
TIERS=[(10,1.00,0.0),(5,0.95,-5.0),(0,0.90,-10.0)]
def fetch(t):
    u="https://query1.finance.yahoo.com/v8/finance/chart/"+t+"?range=1y&interval=1d&events=div"
    d=json.loads(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'M/5'})).read())['chart']['result'][0]
    q=d['indicators']['quote'][0]
    return d['timestamp'],q['open'],q['close'],q['high'],q['low'],[(v['date'],v['amount']) for v in d.get('events',{}).get('dividends',{}).values()]
ds=lambda t: datetime.datetime.fromtimestamp(t,datetime.timezone.utc).strftime('%b %d')

def run(mode, ts,op,cl,hi,lo,cum, ei, entry, forced, fts):
    banked=1.0; open_=True; legopen=ei; anchor=entry
    tier=TIERS[-1]; lvl=anchor*tier[1]; lock=tier[2]; pk=anchor; f2=fts; n=0; trace=[]
    for i in range(ei,len(ts)):
        if cl[i] is None: continue
        cd=cum(ts[i])
        if open_:
            if i>legopen:
                if hi[i] is not None and hi[i]+cd>pk: pk=hi[i]+cd
                g=(pk-anchor)/anchor*100
                for tr in TIERS:
                    if g>=tr[0]: tier,lvl,lock=tr,anchor*tr[1],tr[2]; break
                bl=f2 is not None and ts[i]>=f2
                if bl or (lo[i] is not None and lo[i]+cd<=lvl):
                    lk=forced['lockedPct'] if bl else lock
                    banked*=1+lk/100; open_=False; f2=None
                    trace.append('stop %s %g%%'%(ds(ts[i]),lk)); continue
        else:
            trig = (hi[i] is not None and hi[i]+cd>=entry) if mode=='A' else (cl[i]+cd>=entry)
            if trig:
                fill = entry if mode=='A' else cl[i]+cd
                open_=True; legopen=i; n+=1; anchor=fill
                pk=anchor; tier=TIERS[-1]; lvl=anchor*tier[1]; lock=tier[2]
                trace.append('buy %s @%.2f'%(ds(ts[i]),fill))
    last=next(cl[i] for i in range(len(cl)-1,-1,-1) if cl[i] is not None)
    fin = banked*(1+(last+cum(ts[-1])-anchor)/anchor)-1 if open_ else banked-1
    return fin*100, n, ' → '.join(trace) or 'never stopped'

recos=json.loads(urllib.request.urlopen('https://trading852.com/assets/scorecard-recos.json').read())
tot={'A':0.0,'B':0.0,'act':0.0}; cnt=0
print('%-9s %8s %9s %9s   %s'%('ticker','actual','A touch','B close','B legs'))
for rec in recos:
    if rec.get('isBenchmark'): continue
    t=rec['t']
    if rec.get('reduced'):
        print('%-9s %8s %9s %9s   closed by sale, carried at actual'%(t,'+6.91','+6.91','+6.91'))
        tot['A']+=6.91; tot['B']+=6.91; tot['act']+=6.91; cnt+=1; continue
    ts,op,cl,hi,lo,divs=fetch(t)
    y,m,dd=map(int,rec['issueDate'].split('-'))
    pub=datetime.datetime(y,m,dd,tzinfo=datetime.timezone.utc).timestamp(); wk=datetime.datetime(y,m,dd).weekday()>=5
    ei=next(i for i in range(len(ts)) if ts[i]>pub and (op if wk else cl)[i] is not None)
    entry=(op if wk else cl)[ei]; ets=ts[ei]
    dv=[(a,b) for a,b in divs if a>ets]; cum=lambda bt: sum(b for a,b in dv if a<=bt)
    forced=rec.get('forcedStop')
    fts=datetime.datetime.strptime(forced['stopDate'],'%Y-%m-%d').replace(tzinfo=datetime.timezone.utc).timestamp() if forced else None
    a,na,_=run('A',ts,op,cl,hi,lo,cum,ei,entry,forced,fts)
    bb,nb,tb=run('B',ts,op,cl,hi,lo,cum,ei,entry,forced,fts)
    # actual = green
    g,_,_=run('A',ts,op,cl,hi,lo,cum,ei,entry,forced,fts) if False else (None,None,None)
    print('%-9s %8s %9.2f %9.2f   %s'%(t,'',a,bb,tb))
    tot['A']+=a; tot['B']+=bb; cnt+=1
print('\nmean over %d picks   A (intraday touch) %+.2f%%   B (close confirmation) %+.2f%%'%(cnt,tot['A']/cnt,tot['B']/cnt))
