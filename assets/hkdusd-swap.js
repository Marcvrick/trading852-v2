/*
 * Trading852 HKD/USD Swap Regime tracker
 *
 * Companion to assets/gold-regime.js and assets/convexity.js. Replaces the
 * build-time snapshot with live values fetched from the yahoo-proxy Cloudflare
 * worker. Recomputes the composite regime score, the three sub-signals, and
 * the history sparkline client-side, on every page load. If any fetch fails,
 * the baked snapshot stays (progressive enhancement).
 *
 * Math + geometry mirror scripts/update-hkdusd-swap.py exactly:
 *   composite = 0.40*s_band + 0.30*s_rate + 0.30*s_dxy   (range -1 .. +1)
 *   regime: >= +0.25 USD favorable | <= -0.25 HKD favorable | else mixed
 *   sparkline viewBox 720 x 160, score +1 top .. -1 bottom.
 *
 * Data (Yahoo, 1y daily): HKD=X (spot, band position within 7.75-7.85,
 * absolute level not a change), ^IRX (13-week T-bill, US short rate, 3mo
 * change), DX-Y.NYB (DXY, 3mo change).
 */
(function () {
  "use strict";

  var BOX = document.querySelector(".hkdusd-gauge");
  if (!BOX) return;

  var PROXY = "https://yahoo-proxy.marccharnal.workers.dev/?url=";
  var CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

  var LB = 63;
  var W_BAND = 0.40, W_RATE = 0.30, W_DXY = 0.30;
  var BAND_LO = 7.75, BAND_HI = 7.85, BAND_MID = 7.80;
  var BAND_HALF = (BAND_HI - BAND_LO) / 2;
  var FULL_RATE = 0.50, FULL_DXY = 5.0;
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
    if (comp >= POS_TH) return ["positive", "USD FAVORABLE", "Swap HKD to USD looks attractive"];
    if (comp <= NEG_TH) return ["negative", "HKD FAVORABLE", "Swap back to HKD looks attractive"];
    return ["transition", "MIXED SIGNAL", "Drivers disagree, no clean read"];
  }

  function compositeAt(spot, irx, dxy, days, i) {
    var j = i - LB;
    var sBand = clamp((spot[days[i]] - BAND_MID) / BAND_HALF);
    var dIrx = irx[days[i]] - irx[days[j]];
    var sRate = clamp(dIrx / FULL_RATE);
    var pctDxy = (dxy[days[i]] / dxy[days[j]] - 1) * 100;
    var sDxy = clamp(pctDxy / FULL_DXY);
    var comp = W_BAND * sBand + W_RATE * sRate + W_DXY * sDxy;
    return { comp: comp, sBand: sBand, sRate: sRate, sDxy: sDxy, dIrx: dIrx, pctDxy: pctDxy };
  }

  function fmtDate(k) { var p = k.split("-"); return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function fmtMonthYear(k) { var p = k.split("-"); return MONTHS[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function sgn(v, dp) { return (v >= 0 ? "+" : "") + v.toFixed(dp == null ? 2 : dp); }

  function render(spot, irx, dxy) {
    var keys = Object.keys(spot).filter(function (k) { return irx[k] != null && dxy[k] != null; }).sort();
    if (keys.length < LB + 5) throw new Error("insufficient_overlap");

    var hist = [], detail = null;
    for (var i = LB; i < keys.length; i++) {
      detail = compositeAt(spot, irx, dxy, keys, i);
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

    BOX.className = "hkdusd-gauge hkdusd-gauge--" + cls;
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
    var bandPos = detail.sBand > 0.5 ? "near the 7.85 weak-HKD edge" : (detail.sBand < -0.5 ? "near the 7.75 strong-HKD edge" : "mid-band");
    var rateDir = detail.dIrx > 0.05 ? "yield rising" : (detail.dIrx < -0.05 ? "yield falling" : "yield flat");
    var dxyDir = detail.pctDxy > 0.5 ? "dollar firming" : (detail.pctDxy < -0.5 ? "dollar softening" : "dollar flat");
    sigWrap.innerHTML =
      sig("Band position", "HKD=X, 7.75-7.85", spot[asof].toFixed(4), bandPos + " &middot; signal " + sgn(detail.sBand)) +
      sig("US short rate", "^IRX 13W", irx[asof].toFixed(2) + "%", sgn(detail.dIrx) + "pp / 3mo &middot; " + rateDir + " &middot; signal " + sgn(detail.sRate)) +
      sig("Dollar trend", "DXY", dxy[asof].toFixed(1), sgn(detail.pctDxy, 1) + "% / 3mo &middot; " + dxyDir + " &middot; signal " + sgn(detail.sDxy));

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
      svg.setAttribute("aria-label", "HKD/USD swap regime composite score, " + fmtMonthYear(plot[0][0]) + " to " + fmtDate(asof) + ", range -1 to +1");
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
    fetchSeries("HKD=X"),
    fetchSeries("%5EIRX"),
    fetchSeries("DX-Y.NYB")
  ])
    .then(function (s) { render(s[0], s[1], s[2]); })
    .catch(function (e) {
      if (window.console) console.warn("HKD/USD swap regime live tracker unavailable, keeping baked snapshot.", e);
    });
})();
