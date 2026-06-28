/*
 * Trading852 Rate Convexity Regime tracker
 *
 * Replaces the build-time convexity snapshot on the rate-convexity article with
 * a live value fetched from the yahoo-proxy Cloudflare worker (same source as
 * hsi-quote.js / scorecard.js). Recomputes the composite regime score, the three
 * sub-signals, and the history sparkline client-side. Updates on every page load,
 * so the gauge is never stale. If any fetch fails, the baked snapshot built into
 * the HTML stays in place (progressive enhancement).
 *
 * Math + geometry mirror scripts/update-convexity.py exactly:
 *   composite = 0.25*s_rate + 0.25*s_curve + 0.50*s_rs   (range -1 .. +1)
 *   regime: >= +0.25 positive | <= -0.25 negative | else transition
 *   sparkline viewBox 720 x 160, score +1 top .. -1 bottom.
 *
 * Data (Yahoo, 1y daily): ^IRX (13w T-bill), ^TNX (10Y), ^HSNF (HK Finance),
 * ^HSI (Hang Seng). HK is pegged to USD, so ^IRX is the HK rate driver.
 */
(function () {
  "use strict";

  var BOX = document.querySelector(".convexity-gauge");
  if (!BOX) return;

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  var LB = 63;
  var W_RATE = 0.25, W_CURVE = 0.25, W_RS = 0.50;
  var FULL_RATE = 0.50, FULL_CURVE = 0.50, FULL_RS = 5.0;
  var POS_TH = 0.25, NEG_TH = -0.25;
  var SW = 720, SH = 160, PT = 14, PB = 14;
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function clamp(v, lo, hi) { return Math.max(lo == null ? -1 : lo, Math.min(hi == null ? 1 : hi, v)); }

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
          var key = d.getUTCFullYear() + "-" +
            String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
            String(d.getUTCDate()).padStart(2, "0");
          map[key] = closes[i];
        }
        return map;
      });
  }

  function regimeOf(comp) {
    if (comp >= POS_TH) return ["positive", "POSITIVE", "Tailwind for HK financials"];
    if (comp <= NEG_TH) return ["negative", "NEGATIVE", "Headwind — fighting convexity"];
    return ["transition", "TRANSITION", "Regime unclear"];
  }

  function compositeAt(irx, tnx, hsnf, hsi, days, i) {
    var j = i - LB;
    var dRate = irx[days[i]] - irx[days[j]];
    var sRate = clamp(-dRate / FULL_RATE);
    var slopeNow = tnx[days[i]] - irx[days[i]];
    var slopePrev = tnx[days[j]] - irx[days[j]];
    var sCurve = clamp((slopeNow - slopePrev) / FULL_CURVE);
    var ratioNow = hsnf[days[i]] / hsi[days[i]];
    var ratioPrev = hsnf[days[j]] / hsi[days[j]];
    var pctRs = (ratioNow / ratioPrev - 1) * 100;
    var sRs = clamp(pctRs / FULL_RS);
    var comp = W_RATE * sRate + W_CURVE * sCurve + W_RS * sRs;
    return { comp: comp, sRate: sRate, sCurve: sCurve, sRs: sRs, slopeNow: slopeNow, dRate: dRate, pctRs: pctRs };
  }

  function fmtDate(key) {
    var p = key.split("-");
    return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function fmtMonthYear(key) {
    var p = key.split("-");
    return MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function sgn(v, dp) { return (v >= 0 ? "+" : "") + v.toFixed(dp == null ? 2 : dp); }

  function render(irx, tnx, hsnf, hsi) {
    var keys = Object.keys(irx).filter(function (k) {
      return tnx[k] != null && hsnf[k] != null && hsi[k] != null;
    }).sort();
    if (keys.length < LB + 5) throw new Error("insufficient_overlap");

    var hist = [];
    var detail = null;
    for (var i = LB; i < keys.length; i++) {
      detail = compositeAt(irx, tnx, hsnf, hsi, keys, i);
      hist.push([keys[i], detail.comp]);
    }

    var comp = detail.comp;
    var reg = regimeOf(comp);
    var cls = reg[0], label = reg[1], tagline = reg[2];

    var streak = 0;
    for (var h = hist.length - 1; h >= 0; h--) {
      if (regimeOf(hist[h][1])[0] === cls) streak++; else break;
    }
    var sinceKey = hist[hist.length - streak][0];
    var asof = keys[keys.length - 1];

    // ---- Apply to DOM --------------------------------------------------------
    BOX.className = "convexity-gauge convexity-gauge--" + cls;
    BOX.setAttribute("data-asof", fmtDate(asof));

    var asofEl = BOX.querySelector(".cvx-asof");
    if (asofEl) asofEl.textContent = "as of " + fmtDate(asof);

    var labelEl = BOX.querySelector(".cvx-label");
    if (labelEl) labelEl.textContent = label;
    var scoreEl = BOX.querySelector(".cvx-score");
    if (scoreEl) scoreEl.textContent = "score " + sgn(comp);

    var tagEl = BOX.querySelector(".cvx-tagline");
    if (tagEl) tagEl.innerHTML = tagline + " &middot; this regime since " + fmtDate(sinceKey) + " (" + streak + " sessions)";

    // Sub-signals. Rebuild the block if the baked fallback had no signals yet.
    var sigWrap = BOX.querySelector(".cvx-signals");
    if (!sigWrap) {
      sigWrap = document.createElement("div");
      sigWrap.className = "cvx-signals";
      if (tagEl && tagEl.nextSibling) BOX.insertBefore(sigWrap, tagEl.nextSibling);
      else BOX.appendChild(sigWrap);
    }
    var shortDir = detail.dRate < -0.05 ? "easing" : (detail.dRate > 0.05 ? "tightening" : "steady");
    var curveDir = detail.sCurve > 0.1 ? "steepening" : (detail.sCurve < -0.1 ? "flattening" : "flat");
    var rsDir = detail.pctRs > 0.5 ? "outperforming" : (detail.pctRs < -0.5 ? "lagging" : "tracking");
    sigWrap.innerHTML =
      sig("Short rate", "^IRX 13w", irx[asof].toFixed(2) + "%", sgn(detail.dRate) + "pp / 3mo &middot; " + shortDir + " &middot; signal " + sgn(detail.sRate)) +
      sig("Curve slope", "10Y &minus; 3M", sgn(detail.slopeNow) + "pp", curveDir + " &middot; signal " + sgn(detail.sCurve)) +
      sig("HK financials vs HSI", "^HSNF / ^HSI", sgn(detail.pctRs, 1) + "%", "3mo relative &middot; " + rsDir + " &middot; signal " + sgn(detail.sRs));

    // ---- Sparkline -----------------------------------------------------------
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
      svg.setAttribute("aria-label", "Rate convexity composite score, " + fmtMonthYear(plot[0][0]) + " to " + fmtDate(asof) + ", range -1 to +1");
    }
    var axis = BOX.querySelectorAll(".cvx-axis span");
    if (axis.length === 3) {
      axis[0].textContent = fmtMonthYear(plot[0][0]);
      axis[2].textContent = fmtDate(asof);
    }
  }

  function sig(name, sym, val, sub) {
    return '<div class="cvx-sig">' +
      '<span class="cvx-sig__name">' + name + ' <span class="cvx-sig__sym">' + sym + '</span></span>' +
      '<span class="cvx-sig__val">' + val + '</span>' +
      '<span class="cvx-sig__sub">' + sub + '</span></div>';
  }

  Promise.all([
    fetchSeries("%5EIRX"),
    fetchSeries("%5ETNX"),
    fetchSeries("%5EHSNF"),
    fetchSeries("%5EHSI")
  ])
    .then(function (s) { render(s[0], s[1], s[2], s[3]); })
    .catch(function (e) {
      if (window.console) console.warn("Convexity live tracker unavailable, keeping baked snapshot.", e);
    });
})();
