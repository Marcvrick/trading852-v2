/*
 * Trading852 Gold Regime tracker
 *
 * Companion to assets/convexity.js. Replaces the build-time gold-regime snapshot
 * with a live value fetched from the yahoo-proxy Cloudflare worker. Recomputes the
 * composite regime score, the three sub-signals, and the history sparkline
 * client-side, on every page load. If any fetch fails, the baked snapshot stays
 * (progressive enhancement).
 *
 * Math + geometry mirror scripts/update-gold-regime.py exactly:
 *   composite = 0.30*s_real + 0.30*s_usd + 0.40*s_trend   (range -1 .. +1)
 *   regime: >= +0.25 positive | <= -0.25 negative | else transition
 *   sparkline viewBox 720 x 160, score +1 top .. -1 bottom.
 *
 * Data (Yahoo, 1y daily): ^TNX (10Y, real-rate proxy, inverted), DX-Y.NYB (DXY,
 * inverted), GC=F (gold futures, the trend term).
 */
(function () {
  "use strict";

  var BOX = document.querySelector(".gold-gauge");
  if (!BOX) return;

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  var LB = 63;
  var W_REAL = 0.30, W_USD = 0.30, W_TREND = 0.40;
  var FULL_REAL = 0.50, FULL_USD = 5.0, FULL_TREND = 10.0;
  var POS_TH = 0.25, NEG_TH = -0.25;
  var SW = 720, SH = 160, PT = 14, PB = 14;
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function clamp(v) { return Math.max(-1, Math.min(1, v)); }

  function fetchSeries(symbol) {
    var url = PROXY + encodeURIComponent(CHART + symbol + "?range=1y&interval=1d");
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var res = j && j.chart && j.chart.result && j.chart.result[0];
        if (!res) throw new Error("no_data");
        var ts = res.timestamp || [];
        var closes = ((res.indicators && res.indicators.quote && res.indicators.quote[0]) || {}).close || [];
        var map = {};
        for (var i = 0; i < ts.length; i++) {
          if (closes[i] == null) continue;
          var d = new Date(ts[i] * 1000);
          map[d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0")] = closes[i];
        }
        return map;
      });
  }

  function regimeOf(comp) {
    if (comp >= POS_TH) return ["positive", "POSITIVE", "Accumulation regime"];
    if (comp <= NEG_TH) return ["negative", "NEGATIVE", "Headwind — correction in force"];
    return ["transition", "TRANSITION", "Drivers and price disagree"];
  }

  function compositeAt(tnx, dxy, gold, days, i) {
    var j = i - LB;
    var d10y = tnx[days[i]] - tnx[days[j]];
    var sReal = clamp(-d10y / FULL_REAL);
    var pctUsd = (dxy[days[i]] / dxy[days[j]] - 1) * 100;
    var sUsd = clamp(-pctUsd / FULL_USD);
    var pctGold = (gold[days[i]] / gold[days[j]] - 1) * 100;
    var sTrend = clamp(pctGold / FULL_TREND);
    var comp = W_REAL * sReal + W_USD * sUsd + W_TREND * sTrend;
    return { comp: comp, sReal: sReal, sUsd: sUsd, sTrend: sTrend, d10y: d10y, pctUsd: pctUsd, pctGold: pctGold };
  }

  function fmtDate(k) { var p = k.split("-"); return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function fmtMonthYear(k) { var p = k.split("-"); return MONTHS[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function sgn(v, dp) { return (v >= 0 ? "+" : "") + v.toFixed(dp == null ? 2 : dp); }

  function render(tnx, dxy, gold) {
    var keys = Object.keys(tnx).filter(function (k) { return dxy[k] != null && gold[k] != null; }).sort();
    if (keys.length < LB + 5) throw new Error("insufficient_overlap");

    var hist = [], detail = null;
    for (var i = LB; i < keys.length; i++) {
      detail = compositeAt(tnx, dxy, gold, keys, i);
      hist.push([keys[i], detail.comp]);
    }

    var comp = detail.comp;
    var reg = regimeOf(comp), cls = reg[0], label = reg[1], tagline = reg[2];

    var streak = 0;
    for (var h = hist.length - 1; h >= 0; h--) {
      if (regimeOf(hist[h][1])[0] === cls) streak++; else break;
    }
    var sinceKey = hist[hist.length - streak][0];
    var asof = keys[keys.length - 1];

    BOX.className = "gold-gauge gold-gauge--" + cls;
    BOX.setAttribute("data-asof", fmtDate(asof));

    var asofEl = BOX.querySelector(".cvx-asof");
    if (asofEl) asofEl.textContent = "as of " + fmtDate(asof);
    var labelEl = BOX.querySelector(".cvx-label");
    if (labelEl) labelEl.textContent = label;
    var scoreEl = BOX.querySelector(".cvx-score");
    if (scoreEl) scoreEl.textContent = "score " + sgn(comp);
    var tagEl = BOX.querySelector(".cvx-tagline");
    if (tagEl) tagEl.innerHTML = tagline + " &middot; this regime since " + fmtDate(sinceKey) + " (" + streak + " sessions)";

    var sigWrap = BOX.querySelector(".cvx-signals");
    if (!sigWrap) {
      sigWrap = document.createElement("div");
      sigWrap.className = "cvx-signals";
      if (tagEl && tagEl.nextSibling) BOX.insertBefore(sigWrap, tagEl.nextSibling); else BOX.appendChild(sigWrap);
    }
    var realDir = detail.d10y < -0.05 ? "yields easing" : (detail.d10y > 0.05 ? "yields rising" : "yields flat");
    var usdDir = detail.pctUsd < -0.5 ? "dollar softening" : (detail.pctUsd > 0.5 ? "dollar firming" : "dollar flat");
    var trendDir = detail.pctGold > 0.5 ? "uptrend" : (detail.pctGold < -0.5 ? "downtrend" : "flat");
    var goldStr = Math.round(gold[asof]).toLocaleString("en-US");
    sigWrap.innerHTML =
      sig("Real-rate dir", "^TNX 10Y, inv", tnx[asof].toFixed(2) + "%", sgn(detail.d10y) + "pp / 3mo &middot; " + realDir + " &middot; signal " + sgn(detail.sReal)) +
      sig("Dollar dir", "DXY, inv", dxy[asof].toFixed(1), sgn(detail.pctUsd, 1) + "% / 3mo &middot; " + usdDir + " &middot; signal " + sgn(detail.sUsd)) +
      sig("Gold trend", "GC=F", "$" + goldStr, sgn(detail.pctGold, 1) + "% / 3mo &middot; " + trendDir + " &middot; signal " + sgn(detail.sTrend));

    var plot = hist.length > 189 ? hist.slice(hist.length - 189) : hist;
    var n = plot.length;
    function fx(k) { return (k / (n - 1) * SW).toFixed(1); }
    function fy(v) { return (PT + (1 - (v + 1) / 2) * (SH - PT - PB)).toFixed(1); }
    var line = plot.map(function (p, k) { return fx(k) + "," + fy(p[1]); }).join(" ");
    var svg = BOX.querySelector(".cvx-spark");
    if (svg) {
      var poly = svg.querySelector("polyline");
      if (poly) poly.setAttribute("points", line);
      var dot = svg.querySelector("circle");
      if (dot) { dot.setAttribute("cx", fx(n - 1)); dot.setAttribute("cy", fy(plot[n - 1][1])); }
      svg.setAttribute("aria-label", "Gold regime composite score, " + fmtMonthYear(plot[0][0]) + " to " + fmtDate(asof) + ", range -1 to +1");
    }
    var axis = BOX.querySelectorAll(".cvx-axis span");
    if (axis.length === 3) { axis[0].textContent = fmtMonthYear(plot[0][0]); axis[2].textContent = fmtDate(asof); }
  }

  function sig(name, sym, val, sub) {
    return '<div class="cvx-sig">' +
      '<span class="cvx-sig__name">' + name + ' <span class="cvx-sig__sym">' + sym + '</span></span>' +
      '<span class="cvx-sig__val">' + val + '</span>' +
      '<span class="cvx-sig__sub">' + sub + '</span></div>';
  }

  Promise.all([
    fetchSeries("%5ETNX"),
    fetchSeries("DX-Y.NYB"),
    fetchSeries("GC=F")
  ])
    .then(function (s) { render(s[0], s[1], s[2]); })
    .catch(function (e) {
      if (window.console) console.warn("Gold regime live tracker unavailable, keeping baked snapshot.", e);
    });
})();
