/*
 * Trading852 HSI live quote
 *
 * Replaces the build-time HSI snapshot on the market-thesis hub with a live
 * value fetched from the yahoo-proxy Cloudflare worker (same source as
 * scorecard.js). Renders the headline value, the day change, and the 5-year
 * weekly sparkline, recomputed client-side. Updates on every page load, so the
 * tile is never stale. If the fetch fails, the baked snapshot built into the
 * HTML stays in place (progressive enhancement).
 *
 * Data: Yahoo ^HSI, 5y weekly closes for the chart and 1mo daily for the day's
 * change. The last weekly point is aligned to meta.regularMarketPrice.
 *
 * Geometry mirrors scripts/update-hsi-quote.py (viewBox 720 x 150), so the
 * client-rendered sparkline matches the server-baked fallback exactly.
 */
(function () {
  "use strict";

  var BOX = document.querySelector(".hsi-quote");
  if (!BOX) return; // no tile on this page, nothing to do

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";
  var SYM = "^HSI";

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Sparkline geometry (must match update-hsi-quote.py: viewBox 720 x 150).
  var W = 720, H = 150, PT = 12, PB = 12;

  function fetchSeries(params) {
    var url = PROXY + encodeURIComponent(CHART + SYM + "?" + params);
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var res = j && j.chart && j.chart.result && j.chart.result[0];
        if (!res) throw new Error("no_data");
        var ts = res.timestamp || [];
        var closes = ((res.indicators && res.indicators.quote && res.indicators.quote[0]) || {}).close || [];
        var pts = [];
        for (var i = 0; i < ts.length; i++) {
          if (closes[i] != null) pts.push([ts[i], closes[i]]);
        }
        if (!pts.length) throw new Error("no_closes");
        return { pts: pts, meta: res.meta || {} };
      });
  }

  function fmtPrice(v) { return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtPct(v) { return (v >= 0 ? "+" : "") + v.toFixed(2); }
  function fmtAbs(v) { return (v >= 0 ? "+" : "") + Math.round(v).toLocaleString("en-US"); }
  function fmtDate(ts) {
    var d = new Date(ts * 1000);
    return d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  function fmtMonthYear(ts) {
    var d = new Date(ts * 1000);
    return MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }

  function render(weekly, daily, meta) {
    var price = meta.regularMarketPrice;
    if (price == null && weekly.pts.length) price = weekly.pts[weekly.pts.length - 1][1];
    if (price == null) return;

    var closes = weekly.pts.map(function (p) { return p[1]; });
    closes[closes.length - 1] = price; // align last weekly point with the live price

    var lo = Math.min.apply(null, closes);
    var hi = Math.max.apply(null, closes);
    var rng = (hi - lo) || 1;
    var n = closes.length;
    function fx(i) { return (i / (n - 1) * W).toFixed(1); }
    function fy(c) { return (PT + (1 - (c - lo) / rng) * (H - PT - PB)).toFixed(1); }

    var pts = [];
    for (var i = 0; i < n; i++) pts.push(fx(i) + "," + fy(closes[i]));
    var line = pts.join(" ");
    var area = "M0," + H + " L" + pts.join(" L") + " L" + W + "," + H + " Z";

    // Day change vs the previous daily close.
    var prev = daily.pts.length >= 2 ? daily.pts[daily.pts.length - 2][1] : price;
    var chg = price - prev;
    var pct = prev ? chg / prev * 100 : 0;
    var dir = chg >= 0 ? "pos" : "neg";
    var arrow = chg >= 0 ? "▲" : "▼"; // up / down triangle
    var dateTs = meta.regularMarketTime || weekly.pts[weekly.pts.length - 1][0];
    var dateStr = fmtDate(dateTs);
    var startStr = fmtMonthYear(weekly.pts[0][0]);

    var metaEl = BOX.querySelector(".hsi-quote__meta");
    if (metaEl) metaEl.innerHTML = "HKD &middot; close " + dateStr;

    var valEl = BOX.querySelector(".hsi-quote__value");
    if (valEl) valEl.textContent = fmtPrice(price);

    var chgEl = BOX.querySelector(".hsi-quote__chg");
    if (chgEl) {
      chgEl.className = "hsi-quote__chg hsi-quote__chg--" + dir;
      chgEl.innerHTML = arrow + " " + fmtPct(pct) + '% <span class="hsi-quote__abs">' + fmtAbs(chg) + "</span>";
    }

    var svg = BOX.querySelector(".hsi-quote__spark");
    if (svg) {
      var path = svg.querySelector("path");
      var poly = svg.querySelector("polyline");
      if (path) path.setAttribute("d", area);
      if (poly) poly.setAttribute("points", line);
      svg.setAttribute("aria-label", "Hang Seng Index five-year weekly close, " + startStr + " to " + dateStr);
    }

    var axis = BOX.querySelectorAll(".hsi-quote__axis span");
    if (axis.length === 3) {
      axis[0].textContent = startStr;
      axis[1].innerHTML = "5-year &middot; weekly close &middot; range " +
        Math.round(lo).toLocaleString("en-US") + "&ndash;" + Math.round(hi).toLocaleString("en-US");
      axis[2].textContent = dateStr;
    }
  }

  Promise.all([
    fetchSeries("range=5y&interval=1wk"),
    fetchSeries("range=1mo&interval=1d")
  ])
    .then(function (res) { render(res[0], res[1], res[0].meta); })
    .catch(function (e) {
      // Live fetch failed: leave the baked snapshot in place as the fallback.
      if (window.console) console.warn("HSI live quote unavailable, keeping baked snapshot.", e);
    });
})();
