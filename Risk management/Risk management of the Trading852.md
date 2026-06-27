# Risk Management · le modèle d'exécution Trading852

Comment lire **tous** les backtests, et ce que veut dire chaque chiffre. Source canonique du standard : `FinMC screener/Backtesting/Standards per indicator/TRADING852-EXECUTION-MODEL.md`. Ce document est l'explication en clair.

---

## L'idée

Un backtest ne mesure pas « est-ce que l'indicateur est joli ». Il simule **exactement comment Dany trade**, entrée sur un événement, stop qui remonte, sortie rapide, et compte si ça aurait gagné de l'argent. Si la simulation ne colle pas à la façon de trader, elle répond à la mauvaise question (c'est ce qui avait fait passer F-XF-30 pour un FAIL : il mesurait un rendement à horizon fixe, pas le trade réel sous stop).

---

## Un « trade » = un achat simulé, du début à la fin

1. **Entrée** : un jour, l'événement se déclenche (le prix entre dans une zone, un signal apparaît). On **achète à la clôture de ce jour-là**, sur des bougies ajustées. Un seul trade à la fois par titre (non chevauchant) : tant qu'un trade est ouvert, on n'en rouvre pas un autre sur le même nom.

2. **Le stop qui remonte (ratchet, à sens unique)**: c'est ça, le risk management :
   - tant que le plus-haut atteint est **< +5%** → stop à **−10%** (on risque −10%)
   - dès que le plus-haut atteint **≥ +5%** → stop remonte à **−5%**
   - dès que le plus-haut atteint **≥ +10%** → stop remonte à **0%** (breakeven, on ne peut plus perdre)
   - le stop ne redescend **jamais**. Il est touché si le **plus-bas** de la journée passe sous le stop actif.
   - égalité même bougie (le haut touche une cible ET le bas touche le stop) → on tranche **pessimiste** : le stop d'abord, avec le plus-haut d'avant la bougie.

3. **Sortie** : au stop, ou au bout de **20 jours** (on solde à la clôture). 

---

## Ce que veulent dire les chiffres d'un backtest

### win% · le taux de réussite
**% des trades simulés qui finissent en gain.** « win = 36% » → sur 100 achats simulés dans cette zone, **36 ont fini en positif, 64 en perte** (la plupart stoppés à −5% ou −10%). Rien à voir avec un nombre de titres : c'est 100 entrées, on compte combien finissent dans le vert.

### meanRet · le gain moyen par trade
**Le rendement moyen d'un trade, gagnants ET perdants confondus**, sur sa durée (20 jours max). « meanRet = +2,62% » → si tu faisais ces 100 achats, chacun te rapporterait en moyenne +2,62%.

### Pourquoi un win% bas peut quand même être bon
Le stop coupe les pertes **petites** (−5 / −10%) et laisse **courir** les gains. Donc même avec **un tiers de gagnants**, les gros gains compensent les nombreuses petites pertes → meanRet positif. Un win% de 35-40% avec un meanRet positif est le **profil normal** d'un suivi de tendance. **Ne jamais juger une entrée sur le win% seul** : un meanRet élevé + un win% bas (20%) = tiré par la queue (quelques fusées sur une majorité de perdants) = pas fiable.

### Les juges, dans l'ordre de priorité
1. **P(+5% en ≤5 jours)** et **P(+10% en ≤5 jours)**: le mouvement doit venir **vite** (immédiateté)
2. **P(stoppé à −10% avant d'atteindre +5%)**: « mort sous la barrière »
3. **meanRet** + **win%**: le P&L réel sous le stop

---

## Le repère obligatoire : l'achat au hasard (baseline)

Un chiffre seul ne veut rien dire. On le compare **toujours** à un **achat au hasard** managé exactement pareil (même stop, même marché, même période). Une entrée n'a de valeur que si elle **bat le hasard**, sur le win% ET sur le meanRet.

**Repères actuels (période de test 2024-2026, univers à box 2020) :**

| Achat au hasard | win% | meanRet/trade |
|---|---|---|
| HK, prix > SMA200 | 35% | +1,64% |
| HK, prix < SMA200 | 34% | +0,91% |
| US, prix > SMA200 | 41% | +1,08% |
| US, prix < SMA200 | 36% | +0,99% |

Une zone qui fait 35% / +1,6% sur HK ne bat pas le hasard. C'est le hasard. Il faut faire **mieux des deux côtés**.

---

## Règles dures
- HK et US **toujours séparés** (un edge HK ne porte presque jamais tel quel sur US).
- Entrée = **événement**, pas un état permanent (pas chaque barre d'un état qui dure).
- Toujours splitter **TRAIN / TEST** (in-sample / hors échantillon) : un edge qui ne survit pas en TEST est l'artefact de la période, pas un edge.
- Les indicateurs n'embarquent **aucun** risk management. Le stop ratchet est appliqué *par-dessus* au moment du scoring, jamais codé dans le Pine ou la spec.

---
*Maj : 2026-06-11. Dérivé des tests F-XF-56/57/58/59 (HH-LL vs Decade fan, filtre SMA200). Source standard : `Backtesting/Standards per indicator/TRADING852-EXECUTION-MODEL.md`.*
