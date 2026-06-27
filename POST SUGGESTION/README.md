---
title: "Post Suggestion · Pipeline éditorial Trading852"
tags:
  - editorial
  - pipeline
  - finratios
  - seo
category: Trading/Blog
type: editorial-pipeline
created: 2026-05-06
updated: 2026-05-06
---

# Post Suggestion · Pipeline éditorial

Sélection des prochains tickers à couvrir, croisée entre :
1. **Pipeline FinRatios**: sortie de [`/check-finreports`](../../../../.claude/skills/check-finreports/) → CONVICTION ≥ 6.0 dans [HK Stocks/Finratios/INDEX.md](../../../Trading-research/HK%20Stocks/Finratios/INDEX.md)
2. **Demande SEO**: alignement avec les thèmes de recherche actifs des investisseurs (voir `pipeline-current.md`)

Cette intersection sert de filtre : un score FinRatios élevé sans demande de recherche = trafic mort. Une demande forte sans signal fondamental = piège à clics. Les deux ensemble = post à écrire.

---

## Workflow

```
[/check-finreports daily]
        ↓
[FinRatios v6 INDEX]  ←──  CONVICTION (score ≥ 7.0)
        ↓
[POST SUGGESTION/pipeline-current.md]
        ↓                      ↑
[Filter: theme match  ←──  research themes]
+ SEO demand]               (8 active themes,
        ↓                    voir pipeline-current.md)
[Marc picks 1-2/month]
        ↓
[DRAFT/{ticker}-prada-style.html]
        ↓
[src/analyses/{ticker}-{name}.html]
```

---

## Convention de fichiers

- **`pipeline-current.md`**: l'état vivant. Mis à jour à chaque cycle `/check-finreports` significatif ou changement de thèmes de recherche.
- **`{YYYY-MM-DD}-snapshot.md`**: archive datée à chaque mise à jour majeure (pour traçabilité).
- **`themes-active.md`** *(optionnel)*: la liste des 8 thèmes courants, séparée pour pouvoir l'updater sans toucher la pipeline.

---

## Critères d'inclusion (pipeline-current.md)

Un ticker entre dans la liste si :
- ✅ Score FinRatios v6 ≥ **7.5** (CONVICTION solide)
- ✅ Pas encore publié sur trading852.com
- ✅ Pas dans la liste DRAFT en attente d'un trigger prix
- ✅ Brand recognition mesurable OU thème macro brûlant (les deux mieux)

Un ticker sort de la liste si :
- ❌ Article publié dans `/src/analyses/`
- ❌ FinRatios re-scoré < 7.0 (verdict downgradé)
- ❌ Thème macro plus pertinent (ex: AI hype refroidie → tech moins prioritaire)

---

## SEO demand · comment scorer

Faute d'Ahrefs, classement qualitatif :

| Niveau | Critère | Exemples |
|---|---|---|
| **High** | Brand reconnu globalement, ADR US existant ou écho médias internationaux | Geely, ANTA Sports, WuXi AppTec, Tencent Music |
| **Medium** | Connu de l'investisseur HK/asiatique, peu de couverture EN | Mao Geping, Tongcheng Travel, Midea |
| **Low** | Spécialiste / micro-cap / nom obscur en EN | Tradelink, Justin Allen, Xin Point |

Validation rapide : taper `{name} stock analysis` dans Google. Si autocomplete propose des variations, demand existe. Si SERP top 10 dominé par `stockanalysis.com` + Yahoo seulement, pas par contenu éditorial → opportunity.

---

## Ne pas confondre avec

- [`instructions/seo/CONTENT-CALENDAR.md`](../instructions/seo/CONTENT-CALENDAR.md): calendrier publication confirmé
- [`SEO/keywords-funnel.md`](../SEO/keywords-funnel.md): stratégie keywords TOFU/MOFU/BOFU

POST SUGGESTION = candidats. CONTENT-CALENDAR = ce qui est planifié. SEO/keywords-funnel = comment on cible.
