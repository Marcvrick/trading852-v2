# Independent replication of the scorecard's buy-back line, written to cross-check
# assets/scorecard.js rather than trust one implementation of a modelled claim on
# a public page. Rules: 3-tier trailing ratchet; re-entry is a BUY-STOP at the
# ORIGINAL entry, so it fills there only if the session trades there and fills at
# the OPEN on a gap; each leg is measured from what it actually cost; legs compound.
#
# Its "never stopped" picks must reproduce the live table exactly - that is the
# check that entry-finding and dividend handling match.
#
# Prints both columns so the gap correction stays visible: "no gap fix" is the
# earlier, too-generous version that filled every re-entry at the entry price
# even when the session opened above it and never traded back down.
#
# Usage: python3 scripts/check-buyback-model.py   (hits Yahoo directly, ~15s)
import json, urllib.request, datetime
TIERS=[(10,1.00,0.0),(5,0.95,-5.0),(0,0.90,-10.0)]
ds=lambda t: datetime.datetime.fromtimestamp(t,datetime.timezone.utc).strftime('%b %d')
def fetch(t):
    u="https://query1.finance.yahoo.com/v8/finance/chart/"+t+"?range=1y&interval=1d&events=div"
    d=json.loads(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'M/5'})).read())['chart']['result'][0]
    q=d['indicators']['quote'][0]
    return d['timestamp'],q['open'],q['close'],q['high'],q['low'],[(v['date'],v['amount']) for v in d.get('events',{}).get('dividends',{}).values()]

def run(gapfix, ts,op,cl,hi,lo,cum,ei,entry,forced,fts):
    banked=1.0; open_=True; legopen=ei; anchor=entry
    tier=TIERS[-1]; lvl=anchor*tier[1]; lock=tier[2]; pk=anchor; f2=fts; trace=[]
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
            if hi[i] is not None and hi[i]+cd>=entry:
                # buy-stop at `entry`: a gap-open above it fills at the open
                fill = max(entry, op[i]+cd) if gapfix else entry
                open_=True; legopen=i; anchor=fill
                pk=anchor; tier=TIERS[-1]; lvl=anchor*tier[1]; lock=tier[2]
                trace.append('buy %s @%.2f%s'%(ds(ts[i]),fill,'*' if gapfix and fill>entry+1e-9 else ''))
    last=next(cl[i] for i in range(len(cl)-1,-1,-1) if cl[i] is not None)
    fin=banked*(1+(last+cum(ts[-1])-anchor)/anchor)-1 if open_ else banked-1
    return fin*100, ' → '.join(trace) or 'never stopped'

recos=json.loads(urllib.request.urlopen('https://trading852.com/assets/scorecard-recos.json').read())
old=new=0.0; n=0
print('%-9s %9s %9s   %s'%('ticker','no gapfix','SHIPPED','legs (* = filled at a gap-open, above the entry)'))
for rec in recos:
    if rec.get('isBenchmark'): continue
    if rec.get('reduced'):
        print('%-9s %9.2f %9.2f   closed by sale'%(rec['t'],6.91,6.91)); old+=6.91; new+=6.91; n+=1; continue
    t=rec['t']; ts,op,cl,hi,lo,divs=fetch(t)
    y,m,dd=map(int,rec['issueDate'].split('-'))
    pub=datetime.datetime(y,m,dd,tzinfo=datetime.timezone.utc).timestamp(); wk=datetime.datetime(y,m,dd).weekday()>=5
    ei=next(i for i in range(len(ts)) if ts[i]>pub and (op if wk else cl)[i] is not None)
    entry=(op if wk else cl)[ei]; dv=[(a,b) for a,b in divs if a>ts[ei]]
    cum=lambda bt: sum(b for a,b in dv if a<=bt)
    forced=rec.get('forcedStop')
    fts=datetime.datetime.strptime(forced['stopDate'],'%Y-%m-%d').replace(tzinfo=datetime.timezone.utc).timestamp() if forced else None
    a,_=run(False,ts,op,cl,hi,lo,cum,ei,entry,forced,fts)
    b,tb=run(True,ts,op,cl,hi,lo,cum,ei,entry,forced,fts)
    print('%-9s %9.2f %9.2f   %s'%(t,a,b,tb)); old+=a; new+=b; n+=1
print('\nportfolio   without the gap fix %+.2f%%   SHIPPED %+.2f%%'%(old/n,new/n))
