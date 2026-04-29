/*
 * Trading852 — Scorecard client
 *
 * Fetches the daily HK OHLC series for each blog recommendation via the
 * yahoo-proxy Cloudflare worker. Computes:
 *   - entry price = first close after the pub date
 *   - stop loss   = −10% from entry, triggered on the intraday low
 *   - return      = pct change from entry to last close, OR −10% if stopped
 *
 * Two render targets supported on the same page:
 *   #scorecard-strip  — compact 1-line summary for the homepage
 *   #scorecard-table  — full table on /scorecard
 */
(function () {
  "use strict";

  // Pub date for the inaugural issue. Entry price = first trading session close
  // strictly AFTER this date (Monday Apr 13 for a Friday Apr 10 publish).
  var PUB_DATE_UTC = Date.UTC(2026, 3, 10); // months are 0-indexed
  var STOP_LOSS_PCT = -10;                  // −10% below entry, intraday trigger

  var RECOS = [
    { t: "0113.HK", company: "Dickson Concepts",   eyebrow: "Luxury",                  slug: "0113-dickson-concepts",   pubDate: Date.UTC(2026, 3, 10) },
    { t: "1913.HK", company: "Prada",              eyebrow: "Luxury",                  slug: "1913-prada",              pubDate: Date.UTC(2026, 3, 10) },
    { t: "1167.HK", company: "Jacobio",            eyebrow: "Biotech",                 slug: "1167-jacobio",            pubDate: Date.UTC(2026, 3, 10) },
    { t: "1585.HK", company: "Yadea",              eyebrow: "Electric Vehicles",       slug: "1585-yadea",              pubDate: Date.UTC(2026, 3, 10) },
    { t: "9988.HK", company: "Alibaba",            eyebrow: "Technology",              slug: "9988-alibaba",            pubDate: Date.UTC(2026, 3, 10) },
    { t: "2800.HK", company: "Tracker Fund (HSI)", eyebrow: "Benchmark",               slug: "hsi-35-year-trendline",   pubDate: Date.UTC(2026, 3, 10), isBenchmark: true },
    { t: "6690.HK", company: "Haier Smart Home",   eyebrow: "Consumer Discretionary",  slug: "6690-haier",              pubDate: Date.UTC(2026, 3, 25) },
  ];

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  function fetchOne(rec) {
    var url = PROXY + encodeURIComponent(CHART + rec.t + "?range=3mo&interval=1d");
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var result = j && j.chart && j.chart.result && j.chart.result[0];
        if (!result) throw new Error("no_data");
        var ts = result.timestamp || [];
        var quote = (result.indicators && result.indicators.quote && result.indicators.quote[0]) || {};
        var opens = quote.open || [];
        var closes = quote.close || [];
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

        // Scan subsequent bars for a stop trigger (intraday low ≤ entry × 0.90)
        var stopLevel = entry * (1 + STOP_LOSS_PCT / 100);
        var stopped = false, stopDate = null;
        for (var k = entryIdx + 1; k < ts.length; k++) {
          var lo = lows[k];
          if (lo == null) continue;
          if (lo <= stopLevel) {
            stopped = true;
            stopDate = new Date(ts[k] * 1000);
            break;
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

        var pct = stopped ? STOP_LOSS_PCT : (last - entry) / entry * 100;

        return Object.assign({}, rec, {
          entry: entry,
          entryDate: entryDate,
          entryIsOpen: entryIsOpen,
          last: stopped ? stopLevel : last,
          lastDate: stopped ? stopDate : lastDate,
          pct: pct,
          stopped: stopped,
          stopDate: stopDate,
          stopLevel: stopLevel,
        });
      })
      .catch(function (e) {
        return Object.assign({}, rec, { error: String(e) });
      });
  }

  function fmtPrice(v) { return (v == null ? "—" : v.toFixed(2)); }
  function fmtPct(v) {
    if (v == null || !isFinite(v)) return "—";
    return (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
  }
  function fmtDate(d) {
    if (!d) return "—";
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m[d.getUTCMonth()] + " " + d.getUTCDate();
  }

  function renderStrip(rows) {
    var el = document.getElementById("scorecard-strip");
    if (!el) return;
    var valid = rows.filter(function (r) { return r.pct != null; });
    if (!valid.length) {
      el.innerHTML = '<a href="/scorecard" class="strip-link">Scorecard — prices unavailable</a>';
      return;
    }
    var picks = valid.filter(function (r) { return !r.isBenchmark; });
    var avg = picks.length ? picks.reduce(function (a, r) { return a + r.pct; }, 0) / picks.length : null;
    var wins = picks.filter(function (r) { return !r.stopped && r.pct > 0; }).length;
    var losses = picks.filter(function (r) { return !r.stopped && r.pct < 0; }).length;
    var stoppedCount = picks.filter(function (r) { return r.stopped; }).length;
    var flats = picks.length - wins - losses - stoppedCount;
    var avgCls = avg >= 0 ? "pos" : "neg";
    var wlText = wins + 'W / ' + losses + 'L';
    if (stoppedCount) wlText += ' / ' + stoppedCount + ' stopped';
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
      var stoppedHtml = stoppedCount ? ('<span>' + stoppedCount + ' stopped @ −10%</span>') : '';
      summary.innerHTML =
        '<span>Average <strong class="' + (avg >= 0 ? "pos" : "neg") + '">' + fmtPct(avg) + '</strong></span>' +
        '<span>' + wins + ' winners · ' + losses + ' losers</span>' +
        stoppedHtml +
        '<span>As of ' + (mostRecent ? fmtDate(mostRecent) + ", 2026" : "—") + '</span>';
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
    rows.forEach(function (r) {
      var pctCls = r.pct == null ? "" : r.pct >= 0 ? "pos" : "neg";
      var pctCell = r.stopped
        ? fmtPct(r.pct) + '<div class="sc-stopped-label">Stopped</div>'
        : fmtPct(r.pct);
      var rowCls = r.stopped ? "sc-row-stopped" : r.isBenchmark ? "sc-row-benchmark" : "";
      var badge = r.stopped
        ? ' <span class="sc-badge sc-badge-stopped">Stopped</span>'
        : '';
      var lastCell = r.stopped
        ? '<span class="sc-last-stop">' + fmtPrice(r.stopLevel) + '</span>' +
          '<div class="sc-stop-date">stop hit ' + fmtDate(r.stopDate) + '</div>'
        : fmtPrice(r.last);
      html +=
        '<tr class="' + rowCls + '">' +
          '<td class="sc-ticker">' + (r.noLink ? r.t : '<a href="/analyses/' + r.slug + '">' + r.t + '</a>') + badge + '</td>' +
          '<td class="sc-company"><div class="sc-eyebrow">' + r.eyebrow + '</div>' + r.company + '</td>' +
          '<td class="num">' + fmtPrice(r.entry) + (r.entryIsOpen ? '<div class="sc-stop-date">open</div>' : '') + '</td>' +
          '<td class="num">' + lastCell + '</td>' +
          '<td class="num ' + pctCls + '">' + pctCell + '</td>' +
        '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  function boot() {
    Promise.all(RECOS.map(fetchOne)).then(function (rows) {
      // Benchmark always last
      rows.sort(function (a, b) {
        if (a.isBenchmark) return 1;
        if (b.isBenchmark) return -1;
        return 0;
      });
      renderStrip(rows);
      renderTable(rows);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
