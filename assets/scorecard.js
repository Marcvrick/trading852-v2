/*
 * Trading852 Scorecard client
 *
 * Fetches the daily HK OHLC series for each blog recommendation via the
 * yahoo-proxy Cloudflare worker. Computes:
 *   - entry price = first close after the pub date
 *   - stop loss   = trailing 3-tier ratchet, all picks:
 *         peak ≥ +10 %  → stop = entry        (locks 0 %)
 *         peak ≥ +5 %   → stop = entry × 0.95 (locks −5 %)
 *         else          → stop = entry × 0.90  (locks −10 %)
 *       One-way ratchet: tightens only, never loosens. Triggered on intraday low.
 *   - return      = pct change from entry to last close, OR locked tier % if stopped
 *
 * Dividends: on an ex-dividend day the price gaps down by ~the payout. That drop is
 * a mechanical adjustment, not a fall in value, so it must not count as a loss. Any
 * dividend that goes ex AFTER the entry bar is adjusted out of the return (the
 * one-off ex-div drop is cancelled) and out of the price path the trailing stop
 * sees, so an ex-div gap cannot falsely trigger the stop. The dividend is NOT added
 * as income: only the artificial drop is removed. Displayed entry / last prices stay
 * raw (chart-verifiable). Dividends with an ex-date on or before the entry bar are
 * already in the entry price and are excluded.
 *
 * Two render targets supported on the same page:
 *   #scorecard-strip  : compact 1-line summary for the homepage
 *   #scorecard-table  : full table on /scorecard
 */
(function () {
  "use strict";

  // Pub date for the inaugural issue. Entry price = first trading session close
  // strictly AFTER this date (Monday Apr 13 for a Friday Apr 10 publish).
  var PUB_DATE_UTC = Date.UTC(2026, 3, 10); // months are 0-indexed

  // Trailing-stop tiers, ordered tightest-first. Tier activates once the
  // intraday HIGH since entry has reached `triggerPct`. One-way ratchet.
  var STOP_TIERS = [
    { triggerPct: 10, stopMul: 1.00, lockedPct:   0 },
    { triggerPct:  5, stopMul: 0.95, lockedPct:  -5 },
    { triggerPct:  0, stopMul: 0.90, lockedPct: -10 },
  ];

  // RECOS are generated at build time from the published stock articles
  // (see build.js → generateScorecardData) and fetched as scorecard-recos.json.
  // Each entry: { t, company, eyebrow, slug, issueDate, isBenchmark? }.
  var RECOS_URL = "/assets/scorecard-recos.json";

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  // range=1y (was 3mo until Jul 23, 2026). A rolling 3-month window silently rolls
  // past a pick's entry date once the pick is >3 months old: fetchOne's entry-finding
  // loop then falls back to whatever bar is now first in the window as a substitute
  // "entry", which can erase or corrupt a real historical stop (peak-since-entry
  // history is lost, so a tier that should be armed never arms). Caught 2026-07-23:
  // 1913.HK Prada's real Apr 30 stop (-10%) had silently vanished this way, and
  // 1167/1585/9988 were showing wrong stop dates/levels for the same reason. See
  // wiki/log.md. Currently-known stops are also hard-locked via scorecard-stops.json
  // (forcedStop) as a second, independent safeguard.
  function fetchOne(rec) {
    var url = PROXY + encodeURIComponent(CHART + rec.t + "?range=1y&interval=1d&events=div");
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var result = j && j.chart && j.chart.result && j.chart.result[0];
        if (!result) throw new Error("no_data");
        var ts = result.timestamp || [];
        var quote = (result.indicators && result.indicators.quote && result.indicators.quote[0]) || {};
        var opens = quote.open || [];
        var closes = quote.close || [];
        var highs = quote.high || [];
        var lows = quote.low || [];

        // Weekday pub → entry = first close strictly after pub date
        // Weekend pub  → entry = next Monday open
        var recoPubDate = rec.pubDate || PUB_DATE_UTC;
        var pubDay = new Date(recoPubDate).getUTCDay(); // 0=Sun, 6=Sat
        var isWeekendPub = (pubDay === 0 || pubDay === 6);

        var entry = null, entryDate = null, entryIdx = -1, entryIsOpen = false;
        for (var i = 0; i < ts.length; i++) {
          if (ts[i] * 1000 <= recoPubDate) continue;
          var entryVal = isWeekendPub ? opens[i] : closes[i];
          if (entryVal == null) continue;
          entry = entryVal;
          entryDate = new Date(ts[i] * 1000);
          entryIdx = i;
          entryIsOpen = isWeekendPub;
          break;
        }
        if (entry == null) throw new Error("no_entry_bar");

        // Dividends that go ex strictly AFTER the entry bar. The one-off ex-div
        // price drop is adjusted out of both the stop scan and the headline %, so
        // it is not counted as a loss against the pick.
        var entryTs = ts[entryIdx];
        var divs = [];
        var divObj = result.events && result.events.dividends;
        if (divObj) {
          Object.keys(divObj).forEach(function (key) {
            var d = divObj[key];
            if (d && d.amount != null && d.date != null && d.date > entryTs) {
              divs.push({ ts: d.date, amount: d.amount });
            }
          });
        }
        function cumDivThrough(barTs) {
          var s = 0;
          for (var di = 0; di < divs.length; di++) {
            if (divs[di].ts <= barTs) s += divs[di].amount;
          }
          return s;
        }
        var divSinceEntry = divs.reduce(function (a, d) { return a + d.amount; }, 0);

        // Trailing stop applies to stock picks only, never to the benchmark.
        // 2800.HK (Tracker Fund / HSI) is the market reference line, not a trade:
        // it has no stop, can never be "stopped", and just shows the index return
        // since the Apr-10 entry. fetchOne skips the whole stop scan for it.
        var activeTier = STOP_TIERS[STOP_TIERS.length - 1];
        var stopLevel = entry * activeTier.stopMul;
        var lockedPct = activeTier.lockedPct;
        var peakVal = entry;
        // A fully exited pick has no shares left to stop out. Its pct is already
        // frozen by the realized legs, so a late stop could not change the number,
        // but the live scan would still label the row "Stopped · stop hit <date>"
        // on a position that was closed by sale — the badge would simply be false.
        // Same skip as the benchmark, for the same reason: there is no open trade.
        var exitedPct = (reducedInfo(rec) || {}).fracPct || 0;
        var stopped = false, stopDate = null;
        if (rec.forcedStop) {
          // Permanent stop ledger override (scorecard-stops.json via build.js,
          // attached at build time). Skips the live scan below entirely: this
          // fetch's rolling window can silently corrupt or erase a real historical
          // stop once the pick's entry date rolls outside it (see the range=1y
          // comment above fetchOne). These values are hand-verified once from the
          // full from-inception price history and then frozen.
          stopped = true;
          stopDate = new Date(rec.forcedStop.stopDate + "T00:00:00Z");
          stopLevel = rec.forcedStop.stopLevel;
          lockedPct = rec.forcedStop.lockedPct;
        } else if (!rec.isBenchmark && exitedPct < 100) {
          // Scan subsequent bars: arm the tightest tier whose +pct trigger has been
          // reached by the running intraday HIGH (tiers ratchet tighter only), then
          // check if the bar's intraday LOW breaches the active stop level.
          for (var k = entryIdx + 1; k < ts.length; k++) {
            // Adjust the ex-div drop out: by this bar the price has shed any dividend
            // gone ex since entry, so add it back to keep the path continuous.
            var cd = cumDivThrough(ts[k]);
            var hi = highs[k];
            if (hi != null && (hi + cd) > peakVal) peakVal = hi + cd;
            var peakGainPct = (peakVal - entry) / entry * 100;
            for (var ti = 0; ti < STOP_TIERS.length; ti++) {
              if (peakGainPct >= STOP_TIERS[ti].triggerPct) {
                activeTier = STOP_TIERS[ti];
                stopLevel = entry * activeTier.stopMul;
                lockedPct = activeTier.lockedPct;
                break;
              }
            }
            var lo = lows[k];
            if (lo == null) continue;
            if ((lo + cd) <= stopLevel) {
              stopped = true;
              stopDate = new Date(ts[k] * 1000);
              break;
            }
          }
        }

        // Last price: meta.regularMarketPrice is always current (no OHLC lag);
        // fall back to OHLC scan if meta is absent or pre-entry.
        var last = null, lastDate = null;
        var metaPrice = result.meta && result.meta.regularMarketPrice;
        var metaTime  = result.meta && result.meta.regularMarketTime;
        if (metaPrice != null && metaTime != null && metaTime * 1000 > entryDate.getTime()) {
          last = metaPrice;
          lastDate = new Date(metaTime * 1000);
        } else {
          for (var m = closes.length - 1; m >= 0; m--) {
            if (closes[m] != null) { last = closes[m]; lastDate = new Date(ts[m] * 1000); break; }
          }
        }
        if (last == null) throw new Error("no_close");

        // Partial exit ("Reduced"): blend the frozen realized portion (priced at the
        // trim fill) with the live remainder. The banked gain survives a full
        // round-trip — if the live leg falls back to entry, the realized leg still
        // holds. v1 prices the realized leg on capital return only (no dividend
        // credit for the sold shares); the live leg keeps the ex-div adjustment.
        var exits = rec.reduced && rec.reduced.exits;
        var pct;
        if (exits && exits.length) {
          var realizedFrac = 0, realizedPctSum = 0;
          for (var ei = 0; ei < exits.length; ei++) {
            realizedFrac += exits[ei].fraction;
            realizedPctSum += exits[ei].fraction * ((exits[ei].fillPrice - entry) / entry * 100);
          }
          var remFrac = Math.max(0, 1 - realizedFrac);
          var remPct = stopped
            ? lockedPct
            : (last + divSinceEntry - entry) / entry * 100;
          pct = realizedPctSum + remFrac * remPct;
        } else if (stopped) {
          pct = lockedPct;
        } else {
          pct = (last + divSinceEntry - entry) / entry * 100;
        }

        // Daily return path for the chart: the same blend as `pct` above, but
        // evaluated bar by bar instead of only at the last bar. A leg only counts
        // from the session it happened in — the stop locks the live leg from its
        // own bar onward, and an exit freezes its fraction from its fill date —
        // so the last point of this series equals the scalar `pct` by construction.
        var stopTs = stopDate ? stopDate.getTime() / 1000 : null;
        var exitLegs = (exits || []).map(function (e) {
          return { ts: Date.parse(e.fillDate + "T00:00:00Z") / 1000, frac: e.fraction,
                   pct: (e.fillPrice - entry) / entry * 100 };
        });
        var series = [];
        for (var si = entryIdx; si < ts.length; si++) {
          if (closes[si] == null) continue;
          var barTs = ts[si];
          var livePct = (closes[si] + cumDivThrough(barTs) - entry) / entry * 100;
          if (stopTs != null && barTs >= stopTs) livePct = lockedPct;
          var realized = 0, soldFrac = 0;
          for (var li = 0; li < exitLegs.length; li++) {
            if (exitLegs[li].ts <= barTs) {
              realized += exitLegs[li].frac * exitLegs[li].pct;
              soldFrac += exitLegs[li].frac;
            }
          }
          series.push({ t: barTs, pct: realized + Math.max(0, 1 - soldFrac) * livePct });
        }

        // ── Buy-back variant ────────────────────────────────────────────────
        // "Stopped out, then the price climbs back to where we first bought, so
        // we buy again and ride." Each leg is the published rule unchanged: the
        // same 3-tier trailing ratchet, re-anchored at whatever the buy-back
        // actually cost. Legs compound.
        //
        // Re-entry fires the next time the price reaches the original entry —
        // intraday HIGH, not the close — which is a buy-stop at that level.
        // Confirmed as the intended rule by Dany on 2026-07-31 over a
        // close-confirmation variant (that one skips both 1585.HK buy-backs and
        // scores +0.83% instead, but re-anchors Prada's stop higher and costs it
        // 12.8pp — a different question, see scripts/check-buyback-variants.py).
        //
        // The fill is max(entry, open): a buy-stop fills at the entry only if the
        // session trades there, and on a gap it fills at the open instead. This
        // matters — 9988.HK gapped to 128.20 on May 22 against a 125.50 entry and
        // its low never came back, so filling at 125.50 would be buying a price
        // that was never available that day. Every leg is then measured from what
        // it actually cost, `anchor`, not from the original entry.
        //
        // Not modelled for a pick closed by sale or trimmed: the buy-back rule
        // is about being stopped out, not about a discretionary exit.
        var reSeries = [], reEntries = 0;
        if (rec.isBenchmark || exitedPct > 0) {
          reSeries = series;
        } else {
          var banked = 1;            // compounded return of the legs already closed
          var open = true;           // holding shares right now?
          var legOpenIdx = entryIdx; // bar the current leg opened on
          var anchor = entry;        // what the CURRENT leg actually cost
          var rTier = STOP_TIERS[STOP_TIERS.length - 1];
          var rLevel = anchor * rTier.stopMul, rLocked = rTier.lockedPct, rPeak = anchor;
          // Honour the frozen ledger stop for the first leg so this line starts
          // from the same history the table shows; later legs scan live.
          var forcedTs = rec.forcedStop ? Date.parse(rec.forcedStop.stopDate + "T00:00:00Z") / 1000 : null;

          // Dividends accrue to a leg only while that leg holds the shares. The
          // single-position `series` above can use "everything since entry"
          // because it never sells; this line does, and a dividend that goes ex
          // while it is out is simply not received. 1913.HK is the case: HKD
          // 1.5025 went ex on May 6, between the Apr 30 stop and the May 7
          // buy-back, so crediting it inflated every later bar — enough to push
          // the Jul 29 low (38.00, below the 38.92 entry) up to a 39.50 that
          // never came back, and buy at 39.74 instead of 38.92.
          var legOpenTs = ts[entryIdx];
          function legDiv(barTs) {
            var s = 0;
            for (var di = 0; di < divs.length; di++) {
              if (divs[di].ts > legOpenTs && divs[di].ts <= barTs) s += divs[di].amount;
            }
            return s;
          }

          for (var ri = entryIdx; ri < ts.length; ri++) {
            if (closes[ri] == null) continue;
            var rTs = ts[ri], rDiv = open ? legDiv(rTs) : 0;
            if (open) {
              if (ri > legOpenIdx) {
                var rHi = highs[ri];
                if (rHi != null && rHi + rDiv > rPeak) rPeak = rHi + rDiv;
                var rGain = (rPeak - anchor) / anchor * 100;
                for (var rt = 0; rt < STOP_TIERS.length; rt++) {
                  if (rGain >= STOP_TIERS[rt].triggerPct) {
                    rTier = STOP_TIERS[rt];
                    rLevel = anchor * rTier.stopMul;
                    rLocked = rTier.lockedPct;
                    break;
                  }
                }
                var rLo = lows[ri];
                var byLedger = forcedTs != null && rTs >= forcedTs;
                if (byLedger || (rLo != null && (rLo + rDiv) <= rLevel)) {
                  banked *= 1 + (byLedger ? rec.forcedStop.lockedPct : rLocked) / 100;
                  open = false;
                  forcedTs = null;   // the ledger records the first stop only
                  reSeries.push({ t: rTs, pct: (banked - 1) * 100 });
                  continue;
                }
              }
              reSeries.push({ t: rTs, pct: (banked * (1 + (closes[ri] + rDiv - anchor) / anchor) - 1) * 100 });
            } else {
              // Out of the market: the test is the raw print against the raw
              // entry. No dividend is credited to a position that is not held.
              var backHi = highs[ri];
              if (backHi != null && backHi >= entry) {
                // The buy-back is filled AT the entry whenever the session
                // actually trades there — that is Dany's rule, "bought again at
                // 12.58, not before". 1585.HK on Jun 8 opened 12.69 but its low
                // was 11.38, so it passed through 12.58 and fills there.
                // Only a session that never comes back down — 9988.HK on May 22,
                // open 128.20, low 126.00, against a 125.50 entry — cannot fill
                // at the entry, and pays the open instead. Filling at the entry
                // there would be buying a price that was never available.
                open = true; legOpenIdx = ri; legOpenTs = rTs; reEntries++;
                var rLoIn = lows[ri];
                anchor = (rLoIn != null && rLoIn <= entry)
                  ? entry
                  : Math.max(entry, opens[ri] != null ? opens[ri] : entry);
                rPeak = anchor;
                rTier = STOP_TIERS[STOP_TIERS.length - 1];
                rLevel = anchor * rTier.stopMul;
                rLocked = rTier.lockedPct;
                reSeries.push({ t: rTs, pct: (banked * (1 + (closes[ri] + rDiv - anchor) / anchor) - 1) * 100 });
              } else {
                reSeries.push({ t: rTs, pct: (banked - 1) * 100 });
              }
            }
          }
        }

        return Object.assign({}, rec, {
          series: series,
          reSeries: reSeries,
          reEntries: reEntries,
          entry: entry,
          entryDate: entryDate,
          entryIsOpen: entryIsOpen,
          last: stopped ? stopLevel : last,
          lastDate: stopped ? stopDate : lastDate,
          currentPrice: last,
          currentDate: lastDate,
          pct: pct,
          stopped: stopped,
          stopDate: stopDate,
          stopLevel: stopLevel,
          lockedPct: lockedPct,
          peakGainPct: (peakVal - entry) / entry * 100,
          dividendSinceEntry: divSinceEntry,
        });
      })
      .catch(function (e) {
        return Object.assign({}, rec, { error: String(e) });
      });
  }

  // Row anchor for deep links from an article hero (/scorecard#t-1913-hk).
  // build.js has the identical rule in its own tickerAnchor — keep them in step.
  function tickerAnchor(t) { return "t-" + String(t).toLowerCase().replace(/\./g, "-"); }

  // A re-entry row carries a second position in a ticker that already has a row, so
  // it ships its own `anchor` from scorecard-reentries.json (build.js enforces that
  // the two are distinct). Article hero links keep resolving to the original row.
  function rowAnchor(r) { return r.anchor || tickerAnchor(r.t); }

  // The table only exists after an async fetch, so the browser's own jump to the
  // hash has already run and found nothing. Redo it once the row is on the page.
  // Also bound to hashchange: arriving from an article is a full load, but a
  // second anchor followed from this page (or the back button) only changes the
  // hash, and the script would otherwise never run again.
  function focusHashRow() {
    var prev = document.querySelector(".sc-row-target");
    if (prev) prev.classList.remove("sc-row-target");
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    var row = document.getElementById(id);
    if (!row) return;
    row.classList.add("sc-row-target");
    row.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  window.addEventListener("hashchange", focusHashRow);

  // Bridge the moment a placeholder is replaced by fetched content. Both classes
  // are added here rather than baked into the markup, so a dead script leaves the
  // block plainly visible instead of stuck at opacity 0. Two frames: the first
  // commits the pre-transition state, the second starts the transition.
  function reveal(el) {
    if (!el) return;
    el.classList.remove("is-loaded");
    el.classList.add("async-in");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add("is-loaded"); });
    });
  }

  function fmtPrice(v) { return (v == null ? "n/a" : v.toFixed(2)); }
  function fmtPct(v) {
    if (v == null || !isFinite(v)) return "n/a";
    return (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
  }
  function fmtDate(d) {
    if (!d) return "n/a";
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m[d.getUTCMonth()] + " " + d.getUTCDate();
  }
  // Summarise a pick's partial exits for display. fracPct = % of the original
  // position sold across all exits; fill/date/label come from the single-exit case.
  function reducedInfo(r) {
    var ex = r && r.reduced && r.reduced.exits;
    if (!ex || !ex.length) return null;
    var frac = 0, fill = null, date = null;
    for (var i = 0; i < ex.length; i++) {
      frac += ex[i].fraction;
      if (ex.length === 1) { fill = ex[i].fillPrice; date = ex[i].fillDate; }
    }
    return { fracPct: Math.round(frac * 100), fill: fill, date: date };
  }

  function renderStrip(rows) {
    var el = document.getElementById("scorecard-strip");
    if (!el) return;
    var valid = rows.filter(function (r) { return r.pct != null; });
    if (!valid.length) {
      el.innerHTML = '<a href="/scorecard" class="strip-link">Scorecard: prices unavailable</a>';
      reveal(el);
      return;
    }
    var picks = valid.filter(function (r) { return !r.isBenchmark; });
    var avg = picks.length ? picks.reduce(function (a, r) { return a + r.pct; }, 0) / picks.length : null;
    var wins = picks.filter(function (r) { return !r.stopped && r.pct > 0; }).length;
    var losses = picks.filter(function (r) { return !r.stopped && r.pct < 0; }).length;
    var stoppedCount = picks.filter(function (r) { return r.stopped; }).length;
    var flats = picks.length - wins - losses - stoppedCount;
    var avgCls = avg >= 0 ? "pos" : "neg";
    var wlText = wins + 'W / ' + losses + 'L / ' + stoppedCount + ' stopped';
    if (flats) wlText += ' / ' + flats + ' flat';
    el.innerHTML =
      '<a href="/scorecard" class="strip-link" aria-label="Scorecard since April 10">' +
        '<span class="strip-label">Scorecard · April 10 issue</span>' +
        '<span class="strip-sep">·</span>' +
        '<span class="strip-avg ' + avgCls + '">' + fmtPct(avg) + ' avg</span>' +
        '<span class="strip-sep">·</span>' +
        '<span class="strip-wl">' + wlText + '</span>' +
        '<span class="strip-cta">View scorecard →</span>' +
      '</a>';
    reveal(el);
  }

  function renderTable(rows) {
    var el = document.getElementById("scorecard-table");
    if (!el) return;
    var valid = rows.filter(function (r) { return r.pct != null; });
    var picks = valid.filter(function (r) { return !r.isBenchmark; });
    var avg = picks.length ? picks.reduce(function (a, r) { return a + r.pct; }, 0) / picks.length : null;
    var wins = picks.filter(function (r) { return !r.stopped && r.pct > 0; }).length;
    var losses = picks.filter(function (r) { return !r.stopped && r.pct < 0; }).length;
    var stoppedCount = picks.filter(function (r) { return r.stopped; }).length;
    var mostRecent = null;
    rows.forEach(function (r) {
      if (r.lastDate && (!mostRecent || r.lastDate > mostRecent)) mostRecent = r.lastDate;
    });

    var summary = document.getElementById("scorecard-summary");
    if (summary) {
      summary.innerHTML =
        '<span>Average <strong class="' + (avg >= 0 ? "pos" : "neg") + '">' + fmtPct(avg) + '</strong></span>' +
        '<span>' + wins + ' winners · ' + losses + ' losers · ' + stoppedCount + ' stopped</span>' +
        '<span>As of ' + (mostRecent ? fmtDate(mostRecent) + ", 2026" : "n/a") + '</span>';
      reveal(summary);
    }

    var html =
      '<table class="sc-table">' +
        '<thead><tr>' +
          '<th>Ticker</th>' +
          '<th>Company</th>' +
          '<th class="num">Entry<br><span class="th-sub">Close (or Mon open for weekend pub)</span></th>' +
          '<th class="num">Last / Stop</th>' +
          '<th class="num">% since</th>' +
        '</tr></thead><tbody>';
    var benchmarkPct = null;
    rows.forEach(function (r) {
      var pctCls = r.pct == null ? "" : r.pct >= 0 ? "pos" : "neg";
      var red = reducedInfo(r);
      var pctCell;
      if (r.stopped) {
        pctCell = fmtPct(r.pct) + '<div class="sc-stopped-label">Stopped</div>';
      } else if (red) {
        pctCell = fmtPct(r.pct) + '<div class="sc-reduced-label">' + red.fracPct + '% banked · ' + (100 - red.fracPct) + '% live</div>';
      } else {
        pctCell = fmtPct(r.pct) + (r.dividendSinceEntry > 0
            ? '<div class="sc-div-note" title="HKD ' + r.dividendSinceEntry.toFixed(3) + ' per share went ex-dividend after entry. That one-off ex-dividend price drop is adjusted out, so it is not counted as a loss. The dividend is not added as income.">ex-div adj</div>'
            : '');
      }
      // Row background tint is reserved for a fully closed position (100% exited).
      // A partial trim still gets the badge + banked/live sub-line, but the position
      // is still open, so the row stays plain white like any other active pick.
      var fullyClosed = red && red.fracPct >= 100;
      var rowCls = fullyClosed ? "sc-row-reduced" : r.stopped ? "sc-row-stopped" : r.isBenchmark ? "sc-row-benchmark" : "";
      var badge = '';
      if (r.stopped) badge += ' <span class="sc-badge sc-badge-stopped">Stopped</span>';
      if (red) {
        var rbt = 'Reduced ' + red.fracPct + '%';
        if (red.fill != null) rbt += ' @' + fmtPrice(red.fill);
        if (red.date) rbt += ' · ' + fmtDate(new Date(red.date + 'T00:00:00Z'));
        badge += ' <span class="sc-badge sc-badge-reduced">' + rbt + '</span>';
      }
      // On a closed position the live price is not what happened to the money, so
      // the column shows the final exit fill instead — the same substitution a
      // stopped row makes when it shows its stop level. Picked by latest fillDate
      // rather than array order: scorecard-exits.json is hand-maintained, so the
      // legs are not guaranteed to be appended in chronological order.
      var finalExit = null;
      if (fullyClosed) {
        finalExit = r.reduced.exits.reduce(function (a, b) {
          return b.fillDate > a.fillDate ? b : a;
        });
      }
      var lastCell = r.stopped
        ? '<span class="sc-last-stop">' + fmtPrice(r.stopLevel) + '</span>' +
          '<div class="sc-stop-date">stop hit ' + fmtDate(r.stopDate) + '</div>'
        : finalExit
        ? fmtPrice(finalExit.fillPrice) +
          '<div class="sc-stop-date">exited ' + fmtDate(new Date(finalExit.fillDate + 'T00:00:00Z')) + '</div>'
        : fmtPrice(r.last);
      if (r.isBenchmark && r.pct != null) benchmarkPct = r.pct;
      html +=
        '<tr id="' + rowAnchor(r) + '" class="' + rowCls + '">' +
          '<td class="sc-ticker">' + (r.noLink ? r.t : '<a href="/analyses/' + r.slug + '">' + r.t + '</a>') + badge + '</td>' +
          '<td class="sc-company"><div class="sc-eyebrow">' + r.eyebrow + '</div>' + r.company + '</td>' +
          '<td class="num">' + fmtPrice(r.entry) +
            (r.entryIsOpen ? '<div class="sc-stop-date">open ' + fmtDate(r.entryDate) + '</div>' : '') +
            (r.stopped && r.currentPrice != null ? '<div class="sc-now ' + (r.currentPrice >= r.entry ? 'sc-now-pos' : 'sc-now-neg') + '">now: ' + fmtPrice(r.currentPrice) + ' / ' + fmtPct((r.currentPrice - r.entry) / r.entry * 100) + '</div>' : '') +
          '</td>' +
          '<td class="num">' + lastCell + '</td>' +
          '<td class="num ' + pctCls + '">' + pctCell + '</td>' +
        '</tr>';
    });
    if (avg != null && benchmarkPct != null) {
      var alpha = avg - benchmarkPct;
      var alphaCls = alpha >= 0 ? 'pos' : 'neg';
      html +=
        '<tr class="sc-row-alpha">' +
          '<td colspan="4" class="sc-alpha-label">Portfolio vs HSI</td>' +
          '<td class="num ' + alphaCls + '">' + (alpha >= 0 ? '+' : '') + alpha.toFixed(2) + ' pp</td>' +
        '</tr>';
    }
    html += '</tbody></table>';
    el.innerHTML = html;
    reveal(el);
  }

  // Portfolio curve = the headline average return, evaluated on every session
  // instead of only today. At each date it is the simple mean of the return of
  // every pick that has entered by then, exactly the rule renderTable uses, so
  // the right edge of the curve lands on the number in the summary.
  //
  // Consequence worth knowing before reading the line: a pick joins the mean at
  // 0% on its entry date, so publishing a new article pulls the curve toward
  // zero that day. This is an average of open positions, not the equity curve of
  // a fixed pot of money — same reason the headline average moves when a pick is
  // added. The `n picks live` line in the tooltip is there to make that visible.
  function buildPortfolioSeries(rows) {
    var bench = null, picks = [];
    rows.forEach(function (r) {
      if (!r.series || !r.series.length) return;
      if (r.isBenchmark) bench = r; else picks.push(r);
    });
    if (!bench || !picks.length) return null;
    // The benchmark trades every HK session from the Apr-10 entry, so its bars
    // are the calendar. Each pick carries its own pointer and contributes its
    // last known value at or before the current session (a pick can miss a bar).
    var ptr = picks.map(function () { return -1; });
    var out = [];
    bench.series.forEach(function (b) {
      var sum = 0, reSum = 0, n = 0;
      for (var i = 0; i < picks.length; i++) {
        var s = picks[i].series;
        while (ptr[i] + 1 < s.length && s[ptr[i] + 1].t <= b.t) ptr[i]++;
        if (ptr[i] >= 0) {
          sum += s[ptr[i]].pct;
          // reSeries is built from the same bars, so it shares the pointer.
          var rs = picks[i].reSeries;
          reSum += (rs && rs[ptr[i]] ? rs[ptr[i]].pct : s[ptr[i]].pct);
          n++;
        }
      }
      if (n) out.push({ t: b.t, port: sum / n, re: reSum / n, bench: b.pct, n: n });
    });
    return out.length ? out : null;
  }

  function renderChart(rows) {
    var canvas = document.getElementById("scorecard-chart");
    if (!canvas || typeof Chart === "undefined") return; // homepage has neither
    var data = buildPortfolioSeries(rows);
    if (!data) { canvas.parentNode.innerHTML = '<div class="sc-loading">Chart unavailable</div>'; return; }
    var last = data[data.length - 1];
    var note = document.getElementById("scorecard-chart-key");
    if (note) {
      var pp = last.port - last.bench;
      note.innerHTML =
        '<span class="sc-key sc-key-port">Portfolio ' + fmtPct(last.port) + '</span>' +
        '<span class="sc-key sc-key-bench">HSI ' + fmtPct(last.bench) + '</span>' +
        '<span class="sc-key sc-key-alpha ' + (pp >= 0 ? 'pos' : 'neg') + '">' +
          (pp >= 0 ? '+' : '') + pp.toFixed(2) + ' pp vs HSI</span>';
    }
    Chart.defaults.font.family = "'Space Grotesk',system-ui,sans-serif";
    new Chart(canvas, {
      type: 'line',
      data: { labels: data.map(function (d) { return fmtDate(new Date(d.t * 1000)); }), datasets: [
        { label: 'Portfolio', data: data.map(function (d) { return d.port; }),
          borderColor: '#0f9d66', borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff', tension: 0,
          fill: { target: { value: 0 }, above: 'rgba(15,157,102,0.09)', below: 'rgba(201,51,56,0.07)' },
          order: 1 },
        // The buy-back line is WITHHELD from the public page while its rule is
        // still being settled (2026-07-31). reSeries is still computed, so
        // scripts/check-buyback-model.py and any local work keep running; only
        // the dataset and its key are off. Re-add both together to restore it.
        { label: 'HSI', data: data.map(function (d) { return d.bench; }),
          borderColor: '#5b6478', borderWidth: 1.5, pointRadius: 0,
          pointHoverRadius: 4, pointHoverBackgroundColor: '#fff', tension: 0,
          borderDash: [5, 4], fill: false, order: 3 }
      ]},
      options: { responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false },
          tooltip: { backgroundColor: 'rgba(5,6,15,0.95)',
            titleColor: 'rgba(255,255,255,0.45)', bodyColor: '#fff',
            borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 10,
            callbacks: {
              label: function (x) { return x.dataset.label + ' ' + fmtPct(x.parsed.y); },
              afterBody: function (items) {
                var d = data[items[0].dataIndex];
                return d.n + (d.n === 1 ? ' pick live' : ' picks live');
              } } } },
        scales: {
          x: { ticks: { color: '#5b6478', font: { size: 10 },
                maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
               grid: { display: false }, border: { display: false } },
          y: { ticks: { color: '#5b6478', font: { size: 10 },
                callback: function (v) { return (v > 0 ? '+' : '') + v + '%'; } },
               grid: { color: 'rgba(0,0,0,0.07)' }, border: { display: false } }
        }},
      plugins: [{ id: 'zeroline', afterDraw: function (ch) {
        var c = ch.ctx, y = ch.scales.y.getPixelForValue(0);
        c.save();
        c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(ch.chartArea.left, y); c.lineTo(ch.chartArea.right, y); c.stroke();
        c.restore();
      } }]
    });
  }

  function boot() {
    fetch(RECOS_URL, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (recos) {
        // Convert the build-time "YYYY-MM-DD" issue date into the pubDate fetchOne expects.
        recos.forEach(function (rec) {
          var p = String(rec.issueDate || "").split("-");
          rec.pubDate = (p.length === 3) ? Date.UTC(+p[0], +p[1] - 1, +p[2]) : PUB_DATE_UTC;
        });
        return Promise.all(recos.map(fetchOne));
      })
      .then(function (rows) {
        // Benchmark always last
        rows.sort(function (a, b) {
          if (a.isBenchmark) return 1;
          if (b.isBenchmark) return -1;
          return 0;
        });
        renderStrip(rows);
        renderTable(rows);
        renderChart(rows);
        focusHashRow();
      })
      .catch(function () { renderStrip([]); renderTable([]); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/*
 * SPY ceiling alert: turns the homepage SPY card red when SPY is within 1% of the
 * advancing calculated ceiling. Ceiling model mirrors /analyses/spy-747-level.
 * No-ops on pages that don't contain #spy-zone-card.
 */
(function () {
  "use strict";
  var CARD_ID = "spy-zone-card";
  var CEIL_ANCHOR = Date.UTC(2026, 4, 29); // 2026-05-29 anchor
  var CEIL_VAL = 781;                      // calculated ceiling at the anchor date
  var CEIL_PER_TD = 0.83;                  // ceiling advance per trading day
  var WITHIN_PCT = 1.0;                    // red when within this % of the ceiling
  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  function tdays(a, b) { // weekday count a→b (approx; ignores market holidays)
    if (b <= a) return 0;
    var n = 0, c = a + 86400000;
    while (c <= b) { var w = new Date(c).getUTCDay(); if (w !== 0 && w !== 6) n++; c += 86400000; }
    return n;
  }
  function applyZone(price, d) {
    var card = document.getElementById(CARD_ID);
    if (!card) return;
    var dUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    var ceiling = CEIL_VAL + CEIL_PER_TD * tdays(CEIL_ANCHOR, dUTC);
    var withinCeiling = Math.abs(ceiling - price) / ceiling * 100 <= WITHIN_PCT;
    if (withinCeiling) card.classList.add("spy-in-zone");
    else card.classList.remove("spy-in-zone");
  }
  function boot() {
    var u = PROXY + encodeURIComponent(CHART + "SPY?range=5d&interval=1d");
    fetch(u, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var res = j && j.chart && j.chart.result && j.chart.result[0]; if (!res) return;
        var p = res.meta && res.meta.regularMarketPrice, t = res.meta && res.meta.regularMarketTime;
        if (p == null) { var q = res.indicators.quote[0].close, ts = res.timestamp; for (var i = q.length - 1; i >= 0; i--) { if (q[i] != null) { p = q[i]; t = ts[i]; break; } } }
        if (p != null) applyZone(p, t ? new Date(t * 1000) : new Date());
      })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
