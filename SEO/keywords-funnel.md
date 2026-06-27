---
title: "Trading852 · Keyword Funnel (TOFU → MOFU → BOFU)"
tags:
  - seo
  - keywords
  - funnel
  - hk-stocks
category: Trading/Blog/SEO
type: keyword-strategy
created: 2026-05-06
updated: 2026-05-06
---

# Trading852 · Keyword Funnel

Mots-clés à cibler, organisés par étape du tunnel. Complémente [`instructions/seo/SEO-STRATEGY.md`](../instructions/seo/SEO-STRATEGY.md).

**Deux contraintes éditoriales structurantes** :
1. **Pas de pages méthode publiques.** SOTP, NAV, lecture de filings restent un moat, jamais publiés. Le MOFU se fait via *sectoral hubs*, *comparatifs*, *thesis articles*, *screens*. Aucune page `/method/`.
2. **Pas de stack Ahrefs/SEMrush.** Pipeline de validation ci-dessous repose uniquement sur du gratuit + Perplexity.

---

## Pipeline de validation (gratuit)

Avant de commiter une page, faire passer chaque mot-clé candidat par cet ordre :

| Étape | Outil | Donne quoi | Décision |
|---|---|---|---|
| 1 | **Google Search Console** | Requêtes qui amènent déjà des impressions sur trading852.com | Si déjà rank 11–30 → on défend (Tier 0) avant de produire neuf |
| 2 | **Google Keyword Planner** (compte Ads gratuit) | Volume en fourchette (10-100, 100-1k, 1k-10k, 10k+) avec filtre géo US+UK+HK+SG | < 100/mo → drop sauf si BOFU stratégique |
| 3 | **Google Suggest + People Also Ask** | Variations réelles tapées par les utilisateurs | Élargit le cluster |
| 4 | **Perplexity** (SERP scan) | Top 3 ranking + format dominant | Si top 3 = SCMP/Bloomberg/Yahoo et qu'on n'a aucun gap de format → drop |
| 5 | **Reddit / Quora search** | Threads HK stocks / r/SecurityAnalysis avec engagement | Confirme l'intent et donne du angle éditorial |

**Échelle volume** (terminologie standardisée pour ce doc) :

- **XS** : < 100/mo (très long-tail, niche)
- **S** : 100 – 1 000/mo
- **M** : 1 000 – 10 000/mo
- **L** : 10 000+/mo

Toutes les classifications dans les tableaux ci-dessous sont **à valider via le pipeline avant production**. Aucune n'est verified.

---

## Tier 0 · Défendre l'existant (priorité 60 prochains jours)

Avant tout TOFU/MOFU neuf : exporter GSC sur 90 jours, classer les requêtes par opportunité.

| Pattern GSC | Action |
|---|---|
| Page rank **11–30**, impressions ≥ 100/mo | On-page work : H1, meta description, internal links entrants, rafraîchir un chiffre récent. ROI le plus haut du site. |
| Page rank **4–10**, CTR < 3% | Réécrire title tag + meta, fix CTR, pas le rank. |
| Page rank **1–3**, CTR > 5% | Ne pas toucher. Documenter ce qui marche pour les futurs articles. |
| Requête avec impressions mais sans page dédiée | Candidat à un nouvel article ciblé. |

**À faire** : pull GSC export, lister les 10 plus grosses opportunités de défense, traiter avant tout nouveau contenu.

---

## Logique de tunnel

| Étape | Intention | Format Trading852 (sans exposer la méthode) |
|---|---|---|
| **TOFU** | Découverte du marché HK | Thesis articles macro |
| **MOFU** | Comparaison + sélection | Sectoral hubs · Comparatifs ticker vs ticker · Screens éditorialisés |
| **BOFU** | Décision sur un nom | Analyses individuelles (existantes) |

---

## TOFU · Découverte (haut du tunnel)

| Mot-clé | Volume (à valider) | Compétition | Page cible | Angle |
|---|---|---|---|---|
| `why are hong kong stocks cheap` | XS–S | Medium | `/analyses/why-hong-kong-stocks-cheap` (thesis) | AH premium + capital controls, données SCMP/Bloomberg |
| `hang seng index forecast 2026` | M | High | `/analyses/hsi-2026-outlook` (distinct du 35-year article) | Synthèse Morgan Stanley 27 500 / HSBC 31 000 / DBS 30 000 / Nomura |
| `southbound stock connect explained` | S | Low-Medium | `/analyses/southbound-flows-explained` | 23% du turnover HK, $110 Bn 2025, mécanisme |
| `is hong kong stock market a buy` | S | Medium | Thesis hub + homepage | Thèse "Be water" Trading852 |
| `hong kong stocks vs china stocks` | M | Medium | `/analyses/hk-vs-china-stocks` | H/A/red chip + accès retail |
| `how to invest hong kong stocks from US` | S | Medium | `/analyses/invest-hk-from-us` | ADR vs direct, IBKR/Fidelity coût, fiscalité dividende |

**Pages prioritaires (impact / effort / différenciation)** :
1. `/analyses/why-hong-kong-stocks-cheap` : pierre angulaire macro
2. `/analyses/hsi-2026-outlook` : capte la curiosité d'un visiteur arrivé via le 35-year article
3. `/analyses/southbound-flows-explained` : créneau ouvert, peu de contenu EN sérieux

**Ce qu'on drop volontairement** : `hong kong stock market explained`, `hong kong stocks for beginners`, `how to read HKEX annual report`, toutes des intents méthode/onboarding qui exposent trop ou n'apportent pas de différenciation. Si Search Console montre des impressions sur ces requêtes, on reconsidère.

---

## MOFU · Sectoral hubs · Comparatifs · Screens

Le MOFU se fait via 3 formats qui ne révèlent **rien de la méthode** :

### Format 1 · Sectoral hubs (déjà créés Apr 27, 2026)

| Hub existant | URL | Mots-clés à viser |
|---|---|---|
| Luxury | `/analyses/luxury` | `hong kong luxury stocks`, `luxury stocks asia` |
| Special Situations | `/analyses/special-situations` | `hong kong privatization plays`, `HK special situations` |
| Biotech | `/analyses/biotech` | `china biotech undervalued`, `hong kong biotech stocks` |
| Technology | `/analyses/technology` | `hong kong tech stocks 2026`, `china tech HK listed` |
| Consumer Discretionary | `/analyses/consumer-discretionary` | `hong kong consumer stocks`, `china consumer HK` |
| Electric Vehicles | `/analyses/electric-vehicles` | `china EV stocks hong kong`, `e-bike scooter stocks china` |
| Market Thesis | `/analyses/market-thesis` | `hong kong market thesis`, `HSI long-term outlook` |

**Action** : pour chaque hub, optimiser title tag + meta description sur le mot-clé primaire, et garantir au moins 3 articles internes liés. Aujourd'hui plusieurs hubs n'ont qu'1–2 articles.

### Format 2 · Comparatifs ticker vs peer

Format à créer pour les analyses où un peer naturel existe. Ne révèle aucune méthode, montre juste le résultat de comparaison.

| Page à créer | Mot-clé visé | Source data |
|---|---|---|
| `/analyses/tencent-music-vs-spotify` | `tencent music vs spotify`, `TME vs SPOT valuation` | Article 1698 existant + multiples Spotify |
| `/analyses/haier-vs-midea-vs-electrolux` | `haier vs midea`, `appliance stocks valuation` | Article 6690 existant + multiples peer |
| `/analyses/alibaba-vs-amazon-2014` | `alibaba 2026 vs amazon 2014` | Article 9988 existant, angle déjà dans le titre |
| `/analyses/yadea-vs-niu` | `yadea vs niu`, `china e-bike stocks comparison` | Article 1585 existant |

Effort faible (recyclage des analyses existantes en angle comparatif), volume cumulé moyen, intent commercial.

### Format 3 · Screens éditorialisés

Page liste avec verdict éditorial, **sans expliquer comment on a screené**. Le screening reste interne.

| Page à créer | Mot-clé visé | Volume (à valider) |
|---|---|---|
| `/analyses/hk-stocks-trading-below-cash` | `hong kong stocks below cash`, `negative enterprise value HK` | XS–S |
| `/analyses/hk-deep-value-2026` | `hong kong undervalued stocks 2026`, `cheap HK stocks` | M |
| `/analyses/hk-stocks-with-special-dividend` | `hong kong special dividend stocks` | S |
| `/analyses/hk-privatization-watch` | `hong kong privatization plays 2026` | XS–S |

Format : intro courte (200 mots de thèse), table 5–10 lignes avec ticker / verdict / lien vers analyse si publiée. Mise à jour trimestrielle.

---

## BOFU · Articles publiés (mots-clés à dominer)

| Article | URL | Mot-clé primaire | Long-tails à viser dans H2/meta |
|---|---|---|---|
| Tencent Music | `/analyses/1698-tencent-music` | `tencent music stock analysis`, `1698 HK` | `tencent music vs spotify valuation`, `1698 dividend special`, `tencent music profit growth 66` |
| Haier | `/analyses/6690-haier` | `haier smart home stock analysis`, `6690 HK` | `haier vs midea valuation`, `appliance stocks undervalued`, `haier EV/EBIT 2026` |
| Alibaba | `/analyses/9988-alibaba` | `alibaba thesis 2026`, `9988 HK analysis` | `alibaba vs amazon 2014`, `alibaba EBITA 2026`, `9988 cloud growth` |
| Yadea | `/analyses/1585-yadea` | `yadea stock analysis`, `1585 HK` | `china e-bike market leader`, `yadea profit 129`, `yadea EV/EBIT` |
| Jacobio | `/analyses/1167-jacobio` | `jacobio pharmaceuticals analysis`, `1167 HK` | `astrazeneca jacobio deal`, `KRAS G12C china`, `jacobio cash burn` |
| Prada | `/analyses/1913-prada` | `prada stock analysis`, `1913 HK` | `prada miu miu growth`, `luxury stocks hong kong 2026`, `prada EPS drop` |
| Dickson Concepts | `/analyses/0113-dickson-concepts` | `dickson concepts stock`, `0113 HK NAV` | `dickson concepts cash per share`, `negative enterprise value HK`, `dickson family stake` |
| HSI 35-year | `/analyses/hsi-35-year-trendline` | `hang seng monthly chart support`, `HSI long-term trendline` | `HSI 35 year analysis`, `hang seng support level` *(reste sur l'angle technique, pas sur le forecast 2026)* |

### Drafts (à publier quand le trigger se déclenche)

| Draft | Mot-clé pré-positionné | Trigger |
|---|---|---|
| `6160-beone` | `beone medicines stock`, `6160 HK`, `BTK inhibitor china`, `imbruvica competitor` | HKD ~132 |

### Pattern BOFU réutilisable (chaque nouveau ticker)

Pour chaque analyse, viser ces 6 long-tails dans le H2 ou le corps. Ces formats exploitent la différenciation Trading852 (narrative + filings + NAV) et évitent la concurrence directe avec Simply Wall St / Yahoo (DCF auto-générés).

1. `{name} thesis 2026` : narrative-first, jamais auto-généré
2. `{name} NAV vs market cap` : filing-grounded, hard to replicate
3. `{name} vs {peer}` : comparatif (Haier vs Midea, Tencent Music vs Spotify)
4. `{name} {catalyst} explained` : où `{catalyst}` = "privatization", "spin-off", "buyback", "dividend special", "AstraZeneca deal"
5. `{ticker} dividend yield sustainability` : pas juste le yield, la durabilité
6. `{name} undervalued reason` : pourquoi le marché se trompe (positionnement Trading852)

**À éviter** : `{ticker} fair value 2026`, `{ticker} buy or sell`, `{ticker} stock price prediction`, formats dominés par Simply Wall St / Yahoo / Stock Analysis avec lesquels Trading852 ne peut pas rivaliser sur la fraîcheur de la donnée.

---

## Tier 3 · Têtes de gondole (à mériter, pas à cibler)

| Mot-clé | Volume | Stratégie |
|---|---|---|
| `hong kong stocks` | L | Earned via topic authority sur 12 mois, pas via on-page |
| `HKEX analysis` | M | Idem |
| `hang seng undervalued` | M | Atteignable à ~20 analyses indexées + 5 hubs sectoriels actifs |
| `hong kong value stocks` | M | Idem |

---

## Plan d'attaque (12 mois)

### Mois 1 · Tier 0 + audit
- [ ] Pull GSC 90 jours
- [ ] Identifier les 10 plus grosses opportunités de défense (rank 11–30, impressions ≥ 100)
- [ ] On-page sweep sur ces 10 pages avant tout contenu neuf
- [ ] Configurer Google Keyword Planner (compte Ads gratuit) pour valider volumes

### Mois 2–3 · TOFU prioritaires
- [ ] `/analyses/why-hong-kong-stocks-cheap` (thesis)
- [ ] `/analyses/hsi-2026-outlook` (thesis, distinct du 35-year article)
- [ ] `/analyses/southbound-flows-explained` (thesis)

### Mois 3–4 · MOFU sectoral + comparatifs
- [ ] Optimiser les 7 sector hubs existants (title tag, meta, ≥ 3 articles internes liés chacun)
- [ ] `/analyses/tencent-music-vs-spotify`
- [ ] `/analyses/haier-vs-midea-vs-electrolux`
- [ ] `/analyses/yadea-vs-niu`

### Mois 4–6 · Screens
- [ ] `/analyses/hk-deep-value-2026`
- [ ] `/analyses/hk-privatization-watch`
- [ ] Cadence trimestrielle de mise à jour

### Mois 6–12 · BOFU au rythme de 2 analyses/mois
- Appliquer le pattern BOFU réutilisable systématiquement
- Lier chaque nouvelle analyse aux hubs sectoriels et aux thesis articles concernés

### Métriques de validation
- 10 nouvelles requêtes ranking top 20 / mois (GSC)
- 1 article TOFU classé top 5 sur sa requête principale d'ici mois 6
- Au moins un sector hub classé top 10 sur son mot-clé primaire d'ici mois 9

---

## À faire avant la prochaine session de production

1. **Pull GSC 90 jours.** Sans la donnée existante, tout le reste est aveugle.
2. **Configurer Google Keyword Planner** (compte Ads, pas de spend) pour valider les fourchettes volume des 6 TOFU candidats.
3. **Pour chaque TOFU prioritaire**, faire un SERP scan via Perplexity : qui ranke top 3, quel format, quel angle Trading852 peut prendre que les concurrents ne couvrent pas.
4. **Mettre à jour [`instructions/seo/CONTENT-CALENDAR.md`](../instructions/seo/CONTENT-CALENDAR.md)** avec le plan mois 1-3 ci-dessus.
5. **Décider du fate de [`instructions/seo/SEO-STRATEGY.md`](../instructions/seo/SEO-STRATEGY.md)** : l'ancien doc liste plusieurs `/method/*` pages comme cibles Tier 1. Soit on les retire, soit on note qu'elles sont volontairement abandonnées.
