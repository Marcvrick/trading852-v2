---
title: "Style Guide — Blog Article Conviction (modèle 0113 Dickson)"
tags:
  - style-guide
  - blog
  - conviction
  - writing
category: Trading/Blog
type: style-guide
created: 2026-04-11
updated: 2026-05-11
source: "[[0113-blog-article]]"
---

> **Référence :** [[0113-blog-article]] — modèle canonique du format blog conviction HK stocks
> **Voix de base :** [VOIX-Marc.md](/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/Voix Marc/VOIX-Marc.md) — ce guide fixe le format et les règles analytiques. VOIX-Marc fixe le ton, le rythme et les anti-patterns IA. Les deux s'appliquent simultanément.

---

## Workflow de publication — règle absolue

**Tout article rédigé par Claude est déposé dans le dossier DRAFT pour relecture avant publication.**

```
/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/DRAFT/
```

**Séquence obligatoire :**
1. Claude rédige → dépose dans `DRAFT/` (jamais dans `src/analyses/` ni `src/drafts/`)
2. Dany relit et valide
3. Dany demande la publication → Claude déplace vers `src/analyses/`, met à jour le README, met à jour le nav de l'article précédent, lance `node build.js`

**Claude ne publie jamais un article directement** sans que Dany ait relu la version dans `DRAFT/`.

---

## Principe directeur

Ce style est **journalistique-analytique** : il parle à un lecteur intelligent qui n'est pas forcément financier. Il ne vend pas — il raisonne à voix haute. Le lecteur doit sentir que l'auteur a fait le travail à sa place et lui présente une conclusion honnête, pas une pitch deck.

**Audience — décision définitive :** lecteur éduqué généraliste. Pas un professionnel de la finance. Les concepts financiers de base (EV/EBIT, NRDL, Phase I) sont expliqués brièvement la première fois qu'ils apparaissent. Pas de jargon non défini. Pas de sur-explication non plus : une phrase suffit, pas un paragraphe.

**Framing des thèses :** chaque article a une orientation — growth, valuation, special situation, cycle. Cette orientation doit rester cohérente du hook à la décision. Ne jamais faire glisser un article de growth vers un langage "bear case / bull case". Un article Jacobio parle de croissance, pas de débat entre camps.

**Ce que ce style n'est jamais :**
- Newsletter enthousiaste ("opportunité incroyable")
- Rapport institutionnel aride (tableaux sans contexte)
- Article de blog généraliste (10 conseils pour investir)

---

## L'arc narratif — règle de l'escalier

Un article de 1 200 mots sur une entreprise que le lecteur ne connaît pas est un contrat. Le lecteur investit son attention. Chaque section doit lui donner une raison de continuer — pas juste de la matière.

**L'escalier : chaque section monte d'un cran.**

| Section | Ce que le lecteur ressent en la finissant |
|---|---|
| Hook | "Attends — ça ne devrait pas être possible." |
| Ce que fait l'entreprise | "D'accord, je vois le business. Mais alors pourquoi ce prix ?" |
| Pourquoi la décote existe | "La raison existe, mais elle tient vraiment ?" |
| Catalyseur | "Ah. C'est là que ça se résout." |
| Valorisation | "Le math confirme ce que j'avais compris." |
| Risques | "Je comprends ce qui pourrait me donner tort — et je sais ce que je surveille." |
| Décision | "Je sais exactement quand j'aurais raison et quand j'aurais tort." |

Si le lecteur sort d'une section avec le même niveau de curiosité qu'en y entrant, la section n'a pas fait son travail. Réécrire à partir du fait le plus frappant de cette section.

**La question-fil — règle absolue :**
Le hook plante une question que le lecteur ne peut pas résoudre sans terminer l'article. Cette question n'est jamais formulée explicitement (jamais "on se demande alors pourquoi..."). Elle est implicite dans le paradoxe du hook. Les sections 2 et 3 l'escaladent sans y répondre. La section 4 y répond. Si le lecteur peut deviner la réponse après la section 2, la question n'est pas assez forte ou la section 4 n'est pas assez précise.

**Le test de la question-fil :** isoler la dernière phrase du hook. Est-ce qu'elle laisse le lecteur avec une question concrète et non résolue ? Si la phrase est conclusive, la réécrire pour qu'elle pointe vers la suite sans l'annoncer.

**Les fins de section — règle de continuité :**
La dernière phrase de chaque section (1 à 5) ne peut pas être une conclusion. Elle doit laisser une aspérité — un fait qui pointe vers la section suivante sans l'annoncer. Pas un teaser explicite ("nous allons voir que..."). Un fait incomplet qui ne se résout que dans la section suivante.

> Exemple : section 2 se termine sur "The business generated HKD 1.4B in free cash flow last year. The stock trades at HKD 3.1B total." Ce chiffre ne s'explique pas encore — la section 3 va l'expliquer. Le lecteur continue.

---

## Format par défaut : Lite

**À partir de maintenant, tous les articles sont écrits en format Lite.** Le format Full (dense, jargon assumé) n'est plus le standard.

**Ce qui distingue le format Lite :**
- Ratio de jargon réduit : environ 30% des termes techniques de la version Full. Le reste est remplacé par du langage courant.
- Ton narratif : on raconte la situation avant d'en faire l'arithmétique. Les termes utilisés s'appuient sur le contexte, pas sur des définitions entre parenthèses.
- Pas de définitions en parenthèses. Les termes retenus apparaissent directement, sans explication ajoutée.
- Structure identique à la version Full : mêmes sections, même Data Snapshot, mêmes tableaux.

**Ce que Lite n'est pas :**
- Simplifié à outrance — les chiffres restent précis, les sources restent citées.
- Moins rigoureux — la rigueur analytique est identique, seule la densité de jargon change.

**Passe jargon obligatoire avant soumission — termes qui doivent toujours être traduits :**

| Terme jargon | Traduction Lite |
|---|---|
| Charge-off rate / charge-off ratio | loan loss rate / % of loans written off |
| Impairment losses | losses from bad loans |
| Principal investments | direct investments / investment arm |
| FY2025 / FY2024 | 2025 / 2024 |
| Run-rate / normalized earnings | sustainable level / average annual earnings |
| P/B (price-to-book) | price vs. net assets on paper — expliquer à la première occurrence |
| ROE | annual return on shareholders' capital |
| EPS | earnings per share |
| Net gearing | debt-to-equity ratio |
| Market cap | total market value |
| Re-rating / re-rate | valuation moving higher / investors assigning a higher multiple |
| Subprime / SME borrowers | lower-income borrowers and small businesses |
| Cash cow | steady-income business |
| Investment thesis | investment case |
| Ancillary allocation | side bet |
| Range-bound | stuck in a narrow price range |

**Règle premier usage :** tout acronyme ou nom propre non universel est défini à sa première apparition en 3-5 mots inline. Exemple : "UAF (the consumer lending subsidiary)" ou "Trian Partners, an activist investment fund that buys into undervalued companies."

> Cas réel (0086, mai 2026) : l'article livré en première passe contenait charge-off rate, impairment losses, principal investments, FY2025, normalized net income, subprime borrowers, re-rating catalyst, cycle-peak datapoint — tous non traduits. La passe jargon complète a nécessité une réécriture intégrale du corps.

---

## Ponctuation — règle absolue

**Jamais de tiret long (em dash —).** Interdit dans tous les articles sans exception. Remplacer par :
- Aparté ou précision : parenthèses ( )
- Élaboration ou définition : deux-points :
- Continuation de liste ou liaison : virgule ,
- Nouvelle idée : nouvelle phrase

---

## Contenu interdit — règles absolues

**Jamais de conseil financier, même indirect.**
Ces articles présentent une thèse et des catalyseurs observables. Ils ne disent jamais au lecteur quoi faire avec son argent. Sont interdits : toute recommandation d'achat ou de vente ("entrer avant les résultats", "pas de raison de sortir"), tout conseil de timing ("4–6 semaines avant"), tout conseil de sizing ("X% du portefeuille", "seuil de renforcement"). Le lecteur lit, réfléchit, décide seul.

**Jamais mentionner les options ou les dérivés.**
Aucune référence à : call options, put options, strike price, expiry, premium, options sur actions, warrants, ou tout instrument dérivé. Ces articles parlent d'equity uniquement.

**Jamais exposer la cuisine interne — règle absolue.**
Aucun nom propre, aucune dénomination, aucun outil ou framework interne ne doit apparaître dans un article publié. Sont strictement interdits, à titre d'exemple non exhaustif : « Sophie », « Sophie kill floor », « Sophie verify », « Howard Marks lens », « Paulson lens », « Soros lens », « FinRatios v6 », « finExpert », « finvestigate », « finratios-batch », « expert-analysis », « kill scenario », « kill floor », « invalidation rules », « finvestigation », « five-doubt verification », « doubt cleared », « thesis intact » comme statut de pipeline, ou toute référence aux skills, agents, scripts ou processus de notre stack analytique.

Les labels publics CONVICTION / MONITOR / AVOID affichés dans le hero font partie du design system du site et restent autorisés ; c'est leur cuisine de génération qui ne doit pas transparaître.

Si un seuil interne (ex. plancher mensuel à MOP 17B) doit apparaître dans l'article, il est reformulé en langage neutre d'analyste : « le seuil à partir duquel la thèse devrait être réévaluée », « le niveau à partir duquel le canal indirect serait considéré comme activé », etc. Le lecteur ne doit jamais soupçonner l'existence d'un appareil de scoring, d'agents IA ou d'un workflow de vérification interne. L'article est présenté comme l'analyse d'un investisseur — pas comme la sortie d'un pipeline.

---

## Structure canonique (7 blocs)

### 0. Data Snapshot (obligatoire)

**Placement — règle Lite :** pour le format Lite (audience retail), le Data Snapshot est inséré **après la section 2** ("Ce que fait l'entreprise"), pas avant le hook. Un lecteur retail qui voit deux colonnes de métriques avant de comprendre ce que fait l'entreprise ferme l'article. Le Data Snapshot a plus de sens une fois que le business est ancré. Il reste **obligatoire** — seul son placement change.

Exception : si le lecteur cible est mixte (retail + analytique), conserver le placement original après la Key Takeaway. Dans ce cas, ajouter un chapeau de deux phrases en prose avant le tableau pour contextualiser les chiffres.

**Panneau gauche — Business Snapshot · FY[année]**

| Ligne | Contenu |
|---|---|
| Revenue | CNY/HKD/USD Xb (+Y% YoY) |
| Net Profit | CNY Xb (+Y%) |
| Free Cash Flow | CNY Xb |
| Gross Margin | X% (référence historique si compression notable) |
| ROIC | X% |
| Net Cash / Net Debt | CNY Xb |
| Active Buyback | CNY Xb (si actif) |
| Dividend Yield | X% (date de paiement) |
| 52W High / Current | HKD X.XX / **X.XX** |

Lignes optionnelles selon le dossier : Interest Coverage, Payout Ratio, D/E Ratio.

**Panneau droit — Valuation vs Peers · EV/EBIT**

Pairs triés du plus élevé au plus bas. La ligne Haier/société analysée toujours en bas, en gras, avec un badge `-XX%` montrant le discount vs la moyenne des pairs.

Sourcer en dessous en 11px : `Source: [filing] [date] · Peer multiples [date]`

**CSS de référence :** `6690-haier-lite.html` — classes `.data-snapshot`, `.data-snapshot__panel`, `.snapshot-table`, `.snapshot-badge`, `.data-snapshot .snapshot-note`

> **Piège CSS :** La note source doit être ciblée par `.data-snapshot .snapshot-note` (spécificité 0,2,0), pas `.snapshot-note` seul (0,1,0). La règle `.article-body p { font-size: var(--fs-18) }` a une spécificité 0,1,1 qui l'emporterait sinon et annulerait le 0.6875rem.

**Règles :**
- Toujours deux panneaux côte à côte (flex, `gap: 1px`, fond `var(--dp-c-gray-border)`)
- Mobile : `flex-direction: column`
- Jamais plus de 9 lignes par panneau
- Le badge de discount est en noir sur blanc — visible immédiatement
- La note source est en `0.6875rem` (plus petit que `--fs-12`)

---

### 0b. Subtitle vs Key Takeaway — règle absolue de séparation

Le subtitle et la Key Takeaway ne peuvent jamais contenir la même information clé.

- **Subtitle** : pose la tension, nomme la situation, donne envie de lire. Pas de chiffres-clés, pas de conclusion. Le lecteur ne sait pas encore ce que le math révèle.
- **Key Takeaway** : livre l'arithmétique, les chiffres précis, la conclusion. C'est ici que les nombres atterrissent pour la première fois.

> Mauvais : subtitle dit "the market values everything else at US$507M" → Key Takeaway répète US$730M et US$507M.
> Bon : subtitle dit "one of the world's largest pharmaceutical companies paid nine figures for a single early-stage molecule. The math that follows is worth reading carefully." → Key Takeaway livre les chiffres.

**Key Takeaway — format et longueur :** 2 à 3 phrases maximum. Ton factuel, pas enthousiaste. La box ne compte pas dans les 80-120 mots du hook ouverture : c'est un élément structurel distinct. Elle doit pouvoir être lue seule, sans le reste de l'article, et donner au lecteur pressé les trois chiffres les plus importants.

**Key Takeaway — zéro jargon, règle absolue :** La Key Takeaway est lue avant tout le reste. Aucun terme technique non défini n'y est autorisé. Si un terme nécessite une explication, soit le remplacer par du langage courant, soit l'expliquer en ligne en 3-4 mots.

> Cas réel (0086, mai 2026) : "UAF's H1 2026 charge-off ratio" → illisible sans contexte. Réécriture : "what share of the lending arm's loans go unrecovered in the first half of 2026."

---

### 1. Hook d'ouverture (sans titre)

- Premier paragraphe sans `##` — va directement au fait surprenant
- Chiffre concret dans les deux premières phrases
- Crée l'intrigue avant d'expliquer : "les chiffres sont tellement clairs qu'on se frotte les yeux"
- **Question-fil obligatoire :** le hook pose un paradoxe que le lecteur ne peut pas résoudre à cette étape. Ne jamais l'énoncer comme une question ("pourquoi X ?"). Le poser par les chiffres, de sorte que le lecteur forme lui-même la question. Ce paradoxe reste ouvert dans les sections 2 et 3. Il se résout en section 4.
- **Dernière phrase du hook : ne se conclut pas.** Elle laisse une aspérité — un fait sans explication, une tension non résolue — qui force la lecture de la section suivante.

---

### 2. Ce que fait l'entreprise

- Pas d'enthousiasme : "Ce n'est pas une startup, pas un pari sur une technologie"
- Décrit le business model en langage concret (franchises, durées, clients)
- Une ou deux phrases sur les résultats récents avec % précis
- Ancre le lecteur dans la réalité opérationnelle avant de parler de valorisation
- **Dernière phrase obligatoire : un fait qui complique la question du hook sans y répondre.** Le lecteur comprend maintenant ce que l'entreprise fait — et se demande encore plus pourquoi le prix est là où il est. Ce fait pointe vers la section 3 sans l'annoncer.

> Exemple : "The business generated HKD 1.4B in free cash flow last year. The stock trades at HKD 3.1B total." La section 3 expliquera pourquoi.

---

### 3. Pourquoi la décote existe

- Section cruciale — explique l'inefficience avant d'en tirer parti
- **Escalade la question-fil :** maintenant le lecteur comprend d'où vient le gap, mais ne sait pas encore si le gap va se fermer. Ce n'est pas encore la réponse — c'est pourquoi la question existe.
- "Résultat : la décote existe, elle est documentable, et elle persiste parce que..."
- Termine par une phrase courte, presque arrogante, qui pose l'autorité de l'auteur
- **Dernière phrase : ne ferme pas la thèse.** Elle nomme ce qui manquerait pour que le consensus bouge — et c'est précisément l'objet de la section suivante.

---

### 4. Le catalyseur/signal principal

- Un événement réel passé utilisé comme preuve (offre de privatisation, annonce, filing HKEX)
- **C'est ici que la question plantée dans le hook reçoit sa réponse.** La décomposition en points numérotés doit suivre l'ordre logique de la résolution — pas l'ordre chronologique des événements.
- Décomposé en points numérotés : **Un. Deux. Trois.**
- Chaque point est une implication logique, pas une opinion

---

### 5. Valorisation

- Deux colonnes : actif(s) séparé(s) + activité opérationnelle
- Tableau Markdown obligatoire avec le cours actuel en bas pour le contraste visuel
- Multiple conservateur justifié par rapport aux pairs ("7x — conservateur par rapport aux pairs qui se traitent entre 8x et 15x")
- Sourcer chaque chiffre à une date et un document précis ("tiré directement du bilan au 30 septembre 2025")
- **Dernière phrase : le math a parlé. La phrase de clôture de cette section formule l'asymétrie brute** — upside vs downside dans les termes les plus simples possibles. Ce n'est pas un conseil ; c'est une arithmétique.

**Cas particulier : entreprise pré-bénéfice (biotech, early-stage)**

Pour les sociétés sans profit opérationnel (EBIT négatif), EV/EBIT ne s'applique pas. Utiliser une valorisation par somme des parties (sum-of-parts) :

| Composante | Méthode de valorisation |
|---|---|
| Trésorerie nette | Valeur de marché directe (bilan) |
| Actif de pipeline (molécule, licence) | Coût d'acquisition par un tiers, deal de licence comparable, ou multiple de M&A sectoriel |
| Activité opérationnelle résiduelle | Multiple conservateur sur le chiffre d'affaires, ou valeur résiduelle |

Le Data Snapshot remplace EV/EBIT par les métriques pertinentes pour l'étape de développement : cash runway (combien de mois l'entreprise peut opérer sans lever des fonds), coût historique par patient, taux de succès phase-par-phase. Expliquer chaque métrique en clair — le lecteur Lite ne connaît pas "cash runway" par défaut.

---

### 6. Risques

- Section dédiée, intitulée clairement : "Les risques qu'on ne minore pas"
- **Trois risques maximum, nommés en gras**
- Chaque risque a : (1) le mécanisme concret, (2) l'historique qui le nuance, (3) pourquoi c'est le vrai risque et pas un détail
- **Reframe conviction — règle absolue :** les risques ne sont pas une liste de raisons de ne pas investir. Ce sont les conditions dans lesquelles la thèse serait fausse. Un lecteur qui finit cette section doit comprendre ce qu'il surveille — pas avoir peur d'investir. Formuler : "Si X se produit, la thèse est remise en cause parce que..." plutôt que "X pourrait nuire à l'entreprise."
- Risques opérationnels ajoutés en dernier, en un seul paragraphe, sans header propre
- Les risques présentés dans un bloc `.risk-callout` (CSS de référence : `1167-jacobio.html`)

---

### 7. Décision

- **Première ligne obligatoire :** `<p><em>Written at [PRIX] on [DATE].</em></p>` — date et cours de référence au moment de la publication. Pas de commentaire supplémentaire sur le niveau de prix.
- Rappelle la nature de la thèse et les deux ou trois catalyseurs qui la font tenir
- **Ordre dans cette section :** (1) date/prix, (2) rappel de la thèse en 2-3 phrases, (3) tableau de scénarios, (4) critères d'invalidation, (5) phrase lapidaire. Jamais fermer sur le tableau ou les triggers d'invalidation — ce sont des outils analytiques, pas une clôture.
- Asymétrie exprimée en chiffres concrets : upside vs downside dans chaque scénario
- Tableau de scénarios (3 lignes max) : Scénario | Signal observable | Implication cours
- Critères d'invalidation de la thèse (2–3 triggers de sortie concrets et vérifiables)
- **Dernière phrase : la phrase lapidaire est l'apex émotionnel de l'article.** Elle arrive après le tableau, après les triggers. Courte. Factuelle. Irréfutable dans le contexte de l'article. Elle ne résume pas — elle pose le verdict final. C'est la ligne que le lecteur emporte.

**INTERDIT dans cette section — conseil financier déguisé :**
Jamais de recommandation sur quand acheter, quand vendre, combien investir, ou comment structurer une position. Aucune phrase du type "pour un nouvel entrant, entrer X semaines avant les résultats", "pas de raison de sortir avant telle date", "position sizing à X% du portefeuille". L'article présente la thèse et les catalyseurs — le lecteur décide seul ce qu'il en fait.

---

## Règles de style sentence par sentence

### Longueur des phrases
- **Phrase d'emphase** : 5-10 mots, seule sur une ligne ou après un long développement
  - "Nous l'avons fait." / "Face à un cours de HKD 6,10."
- **Phrase analytique** : 20-35 mots maximum, une seule idée par phrase
- **Jamais** de phrase qui enchaîne deux raisonnements avec "et" ou "mais" sans que chacun mérite sa propre phrase
- **Jamais** le même mot (ou sa racine) dans la même phrase, ni dans les 2–3 phrases suivantes. Remplacer par un pronom, un synonyme, ou reformuler. Exemple fautif : "The stock has moved as though it has." → "The stock has moved as though it did."

### Un concept, une passe — règle absolue

**Exprimer chaque concept une seule fois, directement, à la première tentative.**

Ne jamais tourner autour d'une idée en plusieurs phrases avant d'arriver au point. Si le point est "A seulement s'applique quand B est vrai", écrire exactement ça — pas trois paraphrases successives qui y mènent.

**Les formes interdites :**
- Reformuler deux fois ce qui vient d'être dit avant d'arriver à la vraie conclusion
- Poser une généralité, puis une précision, puis une autre précision qui dit la même chose
- Finir par la conclusion après que le lecteur l'a déjà déduite lui-même

**Le test :** lire le paragraphe et identifier la phrase qui porte le vrai point. Si des phrases la précèdent et disent la même chose autrement, les supprimer. Le paragraphe commence par cette phrase.

> Cas réel (spy-ipo-fork-747, mai 2026) : "The correlation between approach speed and decline severity is partly structural. Fast approaches that ended in bear markets, and slow approaches that ended in breakouts, are both consistent with the indicator being observed. The more precise claim is: fast approaches arrive at the level with momentum and without a support base. If the level holds as resistance, the fall tends to be severe. If the level gives way cleanly, the approach speed tells you nothing. The signal requires the level to act as a ceiling first."
> Réécriture : "Speed only predicts when the level acts as resistance. If SPY peaks near $747 and turns lower, the fast-approach finding applies. If the level eventually gives way, approach speed tells you nothing about the move that follows."

---

### Introduire avant de référencer — règle absolue

**Ne jamais référencer quelque chose que le lecteur n'a pas encore vu.**

"The four that acted as major structural ceilings" présuppose que le lecteur sait qu'il y a quatre niveaux et ce qu'ils sont. Si le concept n'a pas été introduit dans les phrases précédentes, le remplacer par une introduction directe.

**Forme interdite :** *"The ones documented here are the four that acted as X."*
**Forme correcte :** *"A formula applied to SPY's earliest data generates a series of levels. Four of them have acted as X."*

La règle : le nom vient avant le chiffre. Le chiffre vient avant le qualifier. Si la phrase commence par un qualifier ("les quatre qui..."), les quatre n'ont pas encore été posés.

> Cas réel (spy-ipo-fork-747, mai 2026) : ouverture de la section 1 réécrite après correction — "The framework generates levels across SPY's full price history. The ones documented here are the four that acted as major structural ceilings" → réécriture : "A fixed mathematical formula applied to SPY's earliest price data generates a series of structural price levels. Four of those levels have acted as major ceilings over the last 25 years."

---

### Interdiction des phrases-remplissage — règle absolue

**Chaque phrase doit contenir une assertion précise. Les phrases qui pointent vers quelque chose sans le dire sont interdites.**

Formes interdites :
- "That is the context." — que dit-on au lecteur ? Rien. Remplacer par ce que le contexte implique concrètement.
- "This is worth noting." — noter quoi, exactement ?
- "The implications are significant." — quelles implications, pour qui, en quoi ?

**Le test :** supprimer la phrase. Si le paragraphe perd une information précise, la garder. Si le paragraphe reste entier dans son sens, la phrase est du remplissage — la supprimer.

> Cas réel (spy-ipo-fork-747, mai 2026) : "If $747 holds as resistance and SPY turns lower from here, that is the context." → corrigé → "If $747 holds as resistance and SPY turns lower from here, fast-approach history puts this in the category where corrections have averaged −37.9%."

---

### Scénarios conditionnels — toujours énoncer les deux branches

Quand un signal s'applique dans une condition mais pas dans une autre, énoncer les deux branches explicitement avec leur implication concrète.

**Forme interdite :** *"If X happens, the signal applies. If not, it tells you nothing."*
**Forme correcte :** *"If X happens, the signal implies Y. If Z happens instead, the signal has no bearing on W."*

"Tells you nothing" est acceptable uniquement si on précise sur quoi le signal n'a pas de prise.

---

### Chiffres
- Toujours précis — jamais "environ 2 milliards" sans donner le chiffre exact d'abord
- Format : HKD 2 354 millions (espace comme séparateur des milliers, pas de virgule)
- Les % incluent le signe : +14 %, -43,5 %, pas "14%" ou "moins 43%"
- Toujours contextualisés : "soit HKD 7,08 par action"

### Ton
- **Jamais de superlatif** : pas "excellent", "remarquable", "exceptional"
- **Jamais de conditionnel mou** : pas "pourrait potentiellement", "il est possible que"
- **Assertions directes avec réserve explicite** : "La thèse ne repose pas sur X — elle repose sur Y"
- First person pluriel **rare** et **percutant** : "Nous l'avons fait." (une seule occurrence dans tout l'article)

### Fins de section — règle de continuité

Les `---` remplacent les transitions lourdes entre sections. Mais la dernière phrase de chaque section (1 à 5) porte tout le poids de la continuité. Elle ne conclut pas. Elle laisse le lecteur avec un fait ou une tension que la section suivante va résoudre.

**Test :** retirer la dernière phrase. Si la section semble complète sans elle, elle ne faisait pas son travail de continuité — réécrire.

**Jamais :**
- "comme nous l'avons vu dans la section précédente"
- une reformulation de ce qui vient d'être dit
- une phrase de transition annonciatrice ("voyons maintenant...")

**Ce qui fonctionne :**
- Un chiffre sans explication encore ("HKD 1.4B de free cash flow. Le titre se traite à HKD 3.1B.")
- Un fait qui ne fait pleinement sens que si le lecteur continue
- Une assertion qui appelle une preuve — fournie dans la section suivante

### La phrase d'observation — règle de placement

Chaque article doit contenir **une seule phrase d'observation** : la chose que Marc a remarquée en lisant le filing et qui ne figure dans aucun modèle analyste. Pas une donnée supplémentaire — une lecture.

**Règle de placement : pas de position fixe.** La phrase va là où la tension naturelle de l'article l'exige :
- En ouverture si l'observation EST le paradoxe central (ex : Dickson — "The shareholders already voted.")
- En interruption mid-section après deux ou trois paragraphes factuels, sans annonce
- Comme pivot entre deux sections — dernière phrase avant un `<h2>`
- En clôture de la Décision, à la place d'un ratio

**Contrainte anti-template :** si deux articles consécutifs placent leur observation en ouverture, le suivant doit la placer ailleurs. La variété de placement est le style.

**Le test :** cette phrase pourrait-elle apparaître dans un article sur une autre entreprise ? Si oui, réécrire à partir du fait le plus spécifique au dossier.

### Pas d'insertions mid-sentence — règle absolue

Un qualificatif, un contexte ou une explication qui s'intercale entre virgules ou entre parenthèses au milieu d'une phrase doit devenir une phrase à part. Trois formes interdites :

**1. Parenthétique en milieu de clause**
❌ "The company holds RMB 12.7B in net cash (36% of market cap), and operating cash flow..."
✅ "The company holds RMB 12.7B in net cash, equal to 36% of market cap. Operating cash flow..."

**2. Qualificatif sandwich entre virgules**
❌ "A second year of weakness, particularly in lower-tier cities where density is highest, would compress margins..."
✅ "Yadea's dealer density is highest in lower-tier cities. A second year of weakness in those markets would compress margins..."

**3. Appositive collée en fin de phrase**
❌ "...gross margin at 19.1%, a three-year high above the pre-trough level of 16.9%."
✅ "...gross margin at 19.1%. That is a three-year high, above the 16.9% recorded before the trough."

**Le test avant de publier :** lire la phrase à voix haute sans l'insertion. Si la phrase tient seule, l'insertion est une phrase séparée. La placer avant ou après, jamais à l'intérieur.

**Règle des parenthèses : 4 mots maximum.**
Les parenthèses ne fonctionnent que pour des apartés très courts. Au-delà de 4 mots, le lecteur doit tenir le début de la phrase en mémoire pendant qu'il traverse l'insertion. Il perd le fil avant d'arriver à la fin. C'est le problème du tunnel : on entre d'un côté, on ne sait plus de quoi on parlait en sortant de l'autre.

❌ "The company makes scooters and motorcycles (not pedal-assist bicycles, not shared-mobility pods) across China..." — trop long, rompt le tunnel
✅ "(36% of market cap)" — 3 mots, acceptable
✅ Sinon : phrase séparée, avant ou après.

**Origine de la règle :** identifiée sur 1585-yadea (avril 2026), six occurrences corrigées après publication.

### Pas de clauses parallèles enchaînées — règle absolue

Ne jamais enchaîner trois actions parallèles dans une seule phrase via "before X, Y, and Z" ou "after X before A, B, and C" quand les sujets changent entre les clauses. Le lecteur doit tenir trois sous-idées en mémoire avant que la phrase se résolve. Il perd le fil.

❌ "Specialty oncology drugs in China routinely take 12 to 24 months after NRDL listing before hospital formularies are updated, physicians accumulate clinical experience, and patient volumes begin to ramp meaningfully."

✅ "Specialty oncology drugs in China routinely take 12 to 24 months after NRDL listing to reach meaningful volumes. Hospital formularies update on their own timetable. Physicians build experience. Patient flows ramp slowly."

**La règle :** poser le fait principal en une phrase. Puis une phrase par raison. Un sujet par phrase.

**Origine de la règle :** identifiée sur 1167-jacobio (avril 2026), corrigée après publication.

### Termes analytiques — règle d'usage, pas d'interdiction

Les termes financiers ou analytiques ("macro headwinds", "re-rating", "ASPs", "quality of earnings") sont acceptables quand ils apportent une précision que le langage courant ne peut pas rendre aussi bien. Ils sont à remplacer quand ils ajoutent du poids sans ajouter de sens.

**Le test :** est-ce que le terme dit quelque chose que le mot courant ne dirait pas ?

- "macro headwinds" dans une phrase sur la géopolitique ou les taux → utile, précis
- "soft macro environment" pour dire "les consommateurs dépensaient moins" → remplacer par "when consumers pulled back"
- "discretionary transport purchase" pour dire "discretionary purchase" → le mot "transport" n'ajoute rien, le couper
- "the category absorbed the impact" alors qu'on parle de deux-roues → nommer le produit : "two-wheelers took the hit"

**La règle :** utiliser le terme analytique quand il est irremplaçable. Utiliser le mot courant quand il dit la même chose. Ne jamais empiler les deux pour sonner plus rigoureux.

---

## Tables Markdown — Usage

**Deux types de tables dans ce format :**

**Table de valorisation** (section valorisation)
- Colonne gauche : Composante
- Colonne droite : Par action (monnaie)
- Dernière ligne : cours actuel, **en gras**, pour le contraste

**Table de scénarios** (section décision)
- 3 colonnes : Scénario | Signal observable | Implication cours
- 3 lignes maximum : bull / neutre / bear
- Scénario en **gras**, signal doit être actionnable (visible, vérifiable publiquement)
- Colonne "Implication cours" = fourchette de prix + état de la thèse ("thesis intact", "thesis invalidated") — jamais une action ("hold", "exit", "add", "reduce", "X% du portefeuille")

---

## Voix Howard Marks — 4 techniques à imiter

Ces techniques ont été validées sur [[1913-prada]] (avril 2026). Les appliquer systématiquement aux sections "Pourquoi la décote existe" et "Décision".

### 1. Nommer ce que le marché a pricé — pas juste ce qu'il a vu
Ne pas dire : "Most participants have processed one of these."
Dire : "The market has priced one. The other two are not in the current price."
→ Identifier explicitement le gap entre consensus et réalité. C'est la phrase qui fait que le lecteur réalise qu'il y a une opportunité.

### 2. Le pendule en une phrase
Après avoir décrit le risque, ajouter une phrase courte qui nomme où est le sentiment.
→ Ne jamais développer en paragraphe. Une phrase suffit. Elle dit : le balancier a trop oscillé.

**RÈGLE ABSOLUE : chaque phrase-pendule est à usage unique.**
Une formule utilisée dans un article ne peut jamais réapparaître dans un autre, même avec des adjectifs différents. Si la structure est reconnaissable, elle est interdite.

**Pourquoi tenir cette liste :** chaque phrase-pendule perd sa force au moment où elle devient reconnaissable. Un lecteur qui a lu plusieurs articles Trading852 et retrouve la même structure arrête d'être surpris. C'est exactement le moment où la prose cesse d'être de la prose et devient du template. La liste est le mécanisme d'application.

**Phrases-pendule déjà utilisées — bannies de tous les articles futurs :**
- "Pessimism this acute against fundamentals this durable is not a stable state." → 1913-prada
- "Pessimism this acute against a recovery this documented is not a stable state." → 1585-yadea
- "Three forces compressed the price. None of them changed the cash flow." → 6690-haier
- "The discount exists for a documented reason. The question is whether that correction has overshot." → 1167-jacobio
- "The bear case is the slow-motion one: a damaged mainland consumer, twelve months out. The April price move was the fast one: a sector selloff on a same-day narrative. They are not the same risk." → 0027-galaxy

**Comment écrire une nouvelle phrase-pendule :**
Ne pas partir d'un template. Partir du fait concret le plus frappant de l'article en cours.
Exemples de directions valides (non utilisées) :
- Nommer le gap entre le multiple actuel et le cash flow : "The price implies a business in decline. The accounts show a business accumulating cash."
- Nommer l'acheteur silencieux : "The company is buying its own shares at HKD 20.76. The market is selling them."
- Nommer le temps : "The filing is public. The price implies no one has read it."

Ajouter chaque nouvelle phrase utilisée à la liste ci-dessus après publication.

### 3. Clore sur le gap entre ce qui est pricé et ce qui est réel
Jamais finir sur une formule de prudence ("the arithmetic tolerates patience").
Finir sur l'asymétrie nue :
"The market has priced the worst. The business has not delivered it."
→ Deux phrases courtes. La première nomme le consensus. La deuxième nomme la réalité. L'écart est l'investissement.

### 4. Pronoms financiers — toujours redonner le nom
Jamais utiliser "one" ou "it" pour un concept financier clé apparu 5 mots plus tôt.
Ne pas dire : "a balance sheet that can absorb a two-year one without stress"
Dire : "a balance sheet with capacity for two"
→ Le lecteur ne doit jamais faire de lookup mental pour comprendre ce que "one" représente.

---

## Ce qu'on ne fait jamais

- Jamais d'article sans Data Snapshot (bloc §0), obligatoire même pour un article court
- Bullet points autorisés uniquement pour les listes énumérées (4+ éléments parallèles). Jamais pour du texte narratif continu.
- Jamais de phrase comme "il convient de noter que" ou "il est important de souligner"
- Jamais de disclaimer légal ("ceci n'est pas un conseil en investissement"), le format assume un lecteur adulte
- Jamais de titre de section en forme de teaser vague ("Et maintenant ?", "La suite")
- Jamais de chiffre sans sa date source ou son document d'origine
- Jamais de risque présenté comme hypothétique quand il est documenté : "ce risque est réel et il faut l'avoir en tête"

---

## YAML frontmatter obligatoire

```yaml
---
title: "{TICKER} ({TICKER}.HK) — {Titre accrocheur avec le fait surprenant}"
tags:
  - blog
  - hk-stocks
  - {company-tag}
  - conviction (ou monitor ou avoid)
  - {secteur}
  - {thèse-clé} (ex: negative-ev, privatization, special-situation)
  - {ticker-numérique}
category: Trading/Blog
type: blog-article
ticker: "{TICKER}"
created: {YYYY-MM-DD}
source: "[[{retail-explainer}]]"
finratios: "[[{finratios-file}]]"
---
```

---

## Titre — Formule

Le titre suit une formule : **[Sujet] — [Fait arithmétique ou paradoxe en langage courant]**

Exemples de la formule :
- "Dickson Concepts (0113.HK) — Le marché vous offre HKD 375 millions pour acheter cette entreprise"
- "[TICKER] — [Chiffre concret qui choque] pour [ce qu'on obtient en échange]"

**Jamais :**
- "Analyse de [société]"
- "[Société] : une opportunité à saisir"
- Titre sans chiffre

---

## Title Writer — Règles opérationnelles (Trading852)

> Référence : conversation avril 2026 — révision des titres Dickson, Prada, Why HK

### Le principe fondamental

Un titre Trading852 doit créer une **tension arithmétique** que le lecteur ne peut pas résoudre sans lire l'article. Pas un teaser. Pas une promesse. Un paradoxe factuellement vrai.

### Les 4 structures qui fonctionnent

**1. La contradiction nue** *(le plus fort)*
Deux chiffres vrais qui se contredisent en apparence. Le lecteur doit lire pour comprendre pourquoi les deux sont exacts.
> "EPS Down 74%. Revenue Up 9%. One of These Numbers Is a Distraction."
> Formule : `[Métrique A] [direction]. [Métrique B] [direction opposée]. [Résolution en suspens].`

**2. Le prix inversé**
L'arithmétique dit que le marché paie dans la mauvaise direction.
> "The Market Is Paying You HKD 375 Million to Buy This Company"
> Formule : `[Qui paie qui] + [montant exact] + [ce qu'on obtient en échange].`

**3. La séquence factuellement vraie**
Trois faits courts, chacun un mot de plus que nécessaire ne devrait être. Crée un rythme qui force la lecture.
> "Six Tests. Five Bounces. One Entry."
> Formule : `[Fait 1]. [Fait 2]. [Conclusion implicite].`

**4. La validation externe vs le prix actuel**
Un tiers a payé X pour un actif. Le marché valorise l'ensemble à Y < X.
> "AstraZeneca Paid $100M for One Molecule. The Market Forgot to Price the Rest."
> Formule : `[Tiers crédible] payé [montant] pour [partie]. [Ce que le marché a raté].`

---

### Règles de rédaction

| Règle | Exemple à éviter | Exemple Trading852 |
|---|---|---|
| Toujours un chiffre dans le titre | "Prada Trades at a Discount" | "EPS Down 74%. Revenue Up 9%." |
| Jamais de superlatif | "The Most Undervalued Stock" | "6.8× EV/EBIT. Peers at 11–24×." |
| Jamais de formule clickbait | "You Won't Believe This Trade" | "The Market Is Paying You HKD 375M" |
| Le paradoxe doit être résolvable | *(contradiction sans explication dans l'article)* | Le titre pose la tension, l'article la résout |
| Un chiffre = une date ou un document | "Revenue grew" | "Revenue +31% FY2025" |

---

### Règle d'accessibilité — le test du lecteur zéro-contexte

**Le titre doit faire sens pour un lecteur qui ne connaît ni la société, ni les acteurs cités.**

La tension arithmétique doit reposer sur des chiffres et des faits universellement lisibles — pas sur des noms qui nécessitent une introduction.

**Interdit dans les titres :**
- Noms de fonds ou d'activistes non universellement connus ("Trian Partners", "Third Point", "Elliott") → le lecteur ne sait pas ce que c'est
- Noms de personnes dont la notoriété n'est pas mondiale ("Nelson Peltz", "Bill Ackman") → même règle
- Métriques techniques isolées sans traduction ("P/B 0.38×" seul) → 0.38× ne crée pas de tension sans contexte ; "38 cents on the dollar" oui

**Autorisé :** nommer un tiers universellement reconnu quand le seul nom crée la tension. AstraZeneca, Apple, Warren Buffett → notoriété mondiale, la tension est immédiate sans explication.

**Le test :** retire tous les noms propres et toutes les métriques techniques du titre. La tension arithmétique tient-elle encore ? Si non, réécrire à partir des chiffres bruts traduits en langage courant.

> Cas réel (0086, mai 2026) : "P/B 0.38×. HK Bankruptcy Filings at a 9-Year High. Trian Partners Committed US$100M Anyway." → échoue le test. Réécriture : "Profit Up 321%. The Lending Arm Was Flat. The Recovery Came From Somewhere Else." → aucun nom propre, tension immédiate, lecture forcée.

---

### Homepage card vs article title

La card homepage et le H1 article peuvent diverger — la card est plus courte.

- **Card** : 5–10 mots max, tension ou chiffre-clé
- **H1** : peut aller jusqu'à 20 mots, plus de contexte

> Card : "Six Tests. Five Bounces. One Entry."
> H1 : "Five Times the Hang Seng Touched This Line and Bounced. At 25 893, the Sixth Test Has Begun"

La card doit teaser l'article, pas le résumer. Si la card et le H1 sont identiques, la card est probablement trop longue.

---

### Self-check avant de publier

- [ ] Le titre contient au moins un chiffre précis
- [ ] Il y a une tension ou un paradoxe (deux faits apparemment incompatibles, ou un prix qui semble impossible)
- [ ] Le titre ne donne pas la réponse, il force la lecture
- [ ] Aucun superlatif, aucun adjectif d'enthousiasme
- [ ] La card homepage est distincte du H1 (si longueur > 10 mots)

---

## Longueur cible

| Section | Mots |
|---|---|
| Data Snapshot (tableau) | — (aucun mot de prose) |
| Hook ouverture | 80-120 |
| Ce que fait l'entreprise | 120-180 |
| Pourquoi la décote existe | 100-150 |
| Catalyseur/signal principal | 200-280 |
| Valorisation | 150-200 |
| Risques | 180-250 |
| Décision | 180-250 |
| **Total prose** | **1 000-1 400** |

L'article modèle fait ~1 200 mots. En dessous de 900, la thèse n'est pas développée. Au-delà de 1 600, il y a de la répétition.

---

## Écrire sur des indicateurs propriétaires — philosophie générale

> Règle fondamentale de tout article Trading852 utilisant un indicateur interne

### Le principe

**Montrer le résultat. Ne jamais montrer la recette.**

Les indicateurs de Marc sont propriétaires. Les articles documentent ce qu'ils produisent et ce que l'historique du chart confirme — pas comment ils sont construits. Le lecteur voit la preuve. Il ne voit pas le mécanisme.

Cette contrainte n'est pas une limitation éditoriale. C'est une discipline analytique : si le seul argument est "faites-moi confiance sur la formule", l'article est faible. Si l'argument est "voici ce que ce signal a produit à chaque occurrence depuis 25 ans, avec les dates et les prix", l'article est fort — et la formule reste protégée.

---

### Ce qui peut toujours être publié

- **L'output de l'indicateur** : niveau de prix, zone, direction, signal — le résultat visible sur le chart
- **L'historique des occurrences** : dates précises, prix au moment du signal, ce qui s'est passé ensuite
- **La statistique** : taux de confirmation, amplitude moyenne des mouvements, taille d'échantillon
- **La lecture actuelle** : ce que l'indicateur montre au moment de l'article
- **Les conditions d'invalidation** : ce qui contredirait le signal, observable publiquement

### Ce qui ne doit jamais apparaître

- Les inputs de la formule (données sources, paramètres, périodes)
- La méthode de calcul (moindre détail sur comment l'output est dérivé)
- Assez d'outputs consécutifs pour permettre la reconstruction du ratio ou de la structure
- Le nom interne de l'indicateur s'il n'est pas destiné à être public
- Toute séquence de valeurs depuis laquelle un lecteur attentif pourrait déduire la logique

---

### Structure de preuve universelle

Quel que soit le type d'indicateur, chaque article suit cette structure de preuve :

**1. Le signal actuel**
Ce que l'indicateur montre maintenant. Une phrase. Un chiffre ou une zone. Pas d'explication sur comment il est calculé.

**2. L'historique**
Les occurrences précédentes du même signal. Chaque occurrence ancrée dans une date précise et un prix vérifiable publiquement. Le lecteur peut ouvrir un chart et confirmer.

**3. La statistique**
Ce qui s'est passé après chaque occurrence historique. Amplitude, durée, taux de confirmation. Taille d'échantillon explicite.

**4. Les limites**
Ce que la taille d'échantillon permet ou ne permet pas de conclure. Le contexte changeant entre les occurrences. Ce qui rendrait cette occurrence différente des précédentes.

**5. Ce qu'on surveille**
Le signal de confirmation qui viendra de l'extérieur de l'indicateur — volume, prix, durée. Ce que le lecteur peut observer lui-même pour savoir si le signal se confirme.

---

### Règles par type d'indicateur

**Indicateur de niveaux (prix fixes)**
Output : prix horizontaux précis.
Risque de reverse-engineering : élevé si plusieurs niveaux consécutifs sont publiés (le ratio entre les gaps révèle la structure).
Règle : publier au maximum 2 niveaux consécutifs. Référencer les autres par leur rôle ("le niveau précédent", "le niveau suivant") sans prix exact.

**Indicateur de tendance (lignes dynamiques)**
Output : direction, angle, zone de support/résistance mobile.
Risque : publier la pente exacte ou les points d'ancrage révèle les paramètres.
Règle : décrire la direction et les zones ("la tendance pointe vers X zone d'ici Y mois") sans donner les coordonnées exactes des points d'ancrage ni la méthode de projection.

**Indicateur de timing (cycles, dates)**
Output : dates de signal ou de changement de régime.
Risque : publier plusieurs dates consécutives révèle l'intervalle du cycle.
Règle : publier la date du signal actuel et la date du signal précédent. Pas de liste d'occurrences historiques avec leurs dates exactes si elles permettent de calculer l'intervalle.

**Indicateur composite (combinaison de signaux)**
Règle : appliquer les règles du composant le plus sensible. Ne jamais nommer les composants individuels ni leur pondération.

---

### L'historique du chart comme preuve — règle d'ancrage

Chaque claim sur le comportement passé d'un indicateur doit être ancré dans :
- Une **date précise** (mois et année minimum)
- Un **prix observable** sur les données publiques (SPY, HSI, ticker coté)
- Un **résultat mesurable** (amplitude de la correction, durée de la consolidation, % de move)

Un claim sans ancrage date+prix est une opinion. Un claim avec ancrage est une preuve vérifiable.

> Exemple correct : "En mars 2020, le signal était actif. SPY a corrigé de -35,6% en 33 jours depuis ce niveau."
> Exemple incorrect : "Le signal a précédé plusieurs grandes corrections dans le passé."

---

### Croissance de la méthodologie

Cette section s'enrichit à chaque nouvel article utilisant un indicateur propriétaire. Après publication, documenter :
- Le type d'indicateur utilisé
- La règle de disclosure appliquée
- Les formulations validées (celles qui ont bien séparé output et mécanisme)
- Les formulations à éviter (celles qui ont failli révéler trop)

---

## Analyse de niveaux structurels sur l'historique d'un chart — application niveaux

> Référence : spy-ipo-fork-747 (mai 2026) — premier article utilisant ce cadre
> Ce qui suit est l'application de la philosophie générale ci-dessus au cas spécifique des indicateurs de niveaux de prix.

Quand un article analyse le comportement d'un chart autour de niveaux de prix structurels sur un long historique, appliquer les règles suivantes. Ce cadre est réutilisable pour tout instrument (indice, action, ETF) et toute méthode de construction de niveaux (supports/résistances, niveaux Fibonacci, niveaux propriétaires, pivots annuels, etc.).

---

### 1. Définir la fenêtre d'analyse honnêtement

Un framework génère souvent des niveaux sur l'ensemble de l'historique du chart. **Ne pas confondre "niveaux générés par la formule" et "niveaux documentés dans l'article."**

- Identifier la fenêtre où les niveaux ont produit un comportement structurel observable (résistance majeure, correction significative, breakout).
- Les niveaux franchis rapidement pendant un bull run soutenu ne sont pas la même chose que les niveaux qui ont contenu le prix pendant des mois ou des années.
- Dire : "sur les X dernières années, N niveaux ont agi comme plafonds structurels majeurs" — pas "le framework a N niveaux."
- L'espacement géométrique change la densité dans le temps : plus le prix monte, plus le gap absolu entre niveaux s'élargit, donc les rencontres deviennent plus rares. Mentionner ce point si pertinent.

> Cas réel : le framework IPO Fork génère des niveaux sur tout l'historique SPY depuis 1993. Mais les 4 niveaux documentés dans l'article sont ceux des 25 dernières années — avant 1999, SPY franchissait les niveaux pendant le bull run des années 90 sans résistance structurelle majeure.

---

### 2. Taille d'échantillon : exhaustif ≠ insuffisant

Un petit échantillon n'est pas une faiblesse quand il est **exhaustif** — c'est-à-dire quand il couvre toutes les occurrences du phénomène dans la période documentée.

- Petite taille + données complètes = la limitation est statistique (précision des probabilités), pas empirique (données manquantes).
- Distinguer : "nous n'avons pas assez de données" (faiblesse réelle) vs "le phénomène est rare par nature" (propriété du framework).
- Ce qui ne peut pas être dérivé d'un petit échantillon : des probabilités précises (59% de chance de...).
- Ce qui peut l'être : des patterns directionnels cohérents, des seuils observés, une structure statistique confirmée (t-test, corrélation).

> Règle de rédaction : ne pas présenter la rareté des événements comme un défaut méthodologique. La présenter comme une propriété du phénomène, puis énoncer clairement la limitation statistique qui en découle.

---

### 3. Deux signaux réutilisables pour les articles de niveaux structurels

Ces deux signaux ont été validés sur SPY. Ils sont hypothèses testables sur tout autre instrument :

**Signal 1 — Vitesse d'approche**
Le temps entre l'entrée dans la zone de friction (définie autour du niveau) et le pic est un prédicteur de la sévérité du déclin qui suit. Approche rapide = momentum étendu, pas de base de support construite. Approche lente = base construite, downside limité.
- Seuil théorique : 252 jours de trading (1 an calendaire) — naturellement ancré, pas data-miné.
- Test statistique approprié : Welch t-test (groupes de taille inégale, variances différentes).

**Signal 2 — Volume post-pic**
Dans les 20 sessions après le sommet, le volume relatif à la moyenne 12 mois distingue distribution (volume élevé) d'accumulation (volume normal).
- Ne devient lisible qu'après que le sommet est établi — ne pas anticiper.
- Présenter comme signal de confirmation, pas de prédiction.

---

### 4. Absence de biais rétrospectif — preuve obligatoire

Pour tout niveau structurel présenté dans un article, la question "ce niveau existait-il avant les événements documentés ?" doit avoir une réponse claire.

**La formulation de référence :** "Un trader utilisant ce framework en [année antérieure aux événements] aurait produit le même output."

Si cette preuve n'est pas disponible ou ne peut pas être établie, ne pas prétendre à l'absence de biais rétrospectif. Reformuler : "ces niveaux, une fois fixés, n'ont pas été ajustés."

---

### 5. Baseline aléatoire — test de validité du framework

Comparer toujours les niveaux du framework à des niveaux horizontaux aléatoires testés avec le même protocole. Si les niveaux aléatoires produisent le même comportement, le framework n'a pas d'edge structurel.

- Minimum 500 niveaux aléatoires, même fenêtre de données, même protocole de cluster.
- Résultat à citer dans Sources, même sans détail dans le corps de l'article.

---

### 6. Disclosure des niveaux — règle de sécurité propriétaire

Quand les niveaux sont issus d'un framework propriétaire :
- Ne publier que les niveaux directement utiles à l'article (pas la séquence complète).
- Une séquence de niveaux consécutifs publiée permet la reconstruction du ratio entre eux (ex : ratio φ déductible de 3 niveaux consécutifs).
- **Règle pratique :** publier au maximum 2 niveaux consécutifs. Au-delà, le ratio entre les gaps devient calculable et la structure du framework devient reverse-engineerable.
- Référencer les autres niveaux par leur fonction ("le niveau précédent", "le niveau suivant") sans donner leur prix exact.
- **Ne jamais mentionner la fenêtre temporelle du backtest en années précises** ("32 ans", "30 ans") ni le nombre total d'approches analysées ("24 approches indépendantes") — ces chiffres permettent de déduire la périodicité des niveaux et la densité du framework. Remplacer par "l'historique complet de SPY" ou "toutes les approches documentées".

> Cas réel (spy-ipo-fork-747, mai 2026) : "A backtest across all 24 independent approaches to these structural levels in SPY's 32-year history" → corrigé → "A backtest across every approach to these structural levels in SPY's full history". Et "These levels were fixed more than thirty years ago" → supprimé.

---

### 7. Vocabulaire interdit pour les niveaux structurels

**Ne jamais écrire :**
- "résistance finale" / "final resistance" — le framework génère des niveaux au-delà du niveau en cours. Aucun niveau n'est final.
- "dernier niveau" / "last level" — même raison.
- "plafond ultime" — même raison.

**La règle de fond :** chaque niveau est soit un plafond temporaire, soit celui qui marque la fin du cycle en cours. La question est toujours laquelle des deux — jamais s'il existe des niveaux au-dessus.

**La question de clôture d'un article de niveaux structurels doit tenir les deux issues ouvertes :** "ce niveau finit-il par céder, ou est-ce le plafond du cycle en cours ?" — pas "est-ce la résistance finale avant un breakout ou le sommet du cycle ?". Le framework ne prédit pas la direction ; il identifie la zone où la question reçoit une réponse.

> Cas réel (spy-ipo-fork-747) : première version — "is this the final resistance before another breakout?" → corrigé → "is this a level that eventually gives way, or the ceiling of the current cycle?"

---

### 8. Formulations à réutiliser

Ces formulations ont été validées dans spy-ipo-fork-747. Les adapter, ne pas copier mot pour mot.

- Pour introduire un niveau : *"[Prix] est le niveau. [Prix marché] en est à [%] aujourd'hui."*
- Pour la rareté : *"Les rencontres avec ce type de niveau deviennent plus rares à mesure que le prix monte — l'espacement absolu entre niveaux s'élargit."*
- Pour le biais rétrospectif : *"Un trader utilisant ce framework en [année] aurait produit le même output."*
- Pour la limitation statistique : *"La limitation est statistique, pas empirique : [N] observations par groupe ne permettent pas de dériver des probabilités précises. Le pattern est cohérent. Il ne supporte pas une probabilité directionnelle précise."*
- Pour la zone de friction : *"Le niveau ne produit pas un signal achat ou vente. Il produit une zone où le marché cesse d'être passif sur sa direction."*

---

### Honnêteté directionnelle — règle absolue

**Si l'analyse produit une orientation claire, la nommer. Ne pas se réfugier derrière la neutralité quand les données penchent.**

"The data cannot tell you which scenario is ahead" est intellectuellement malhonnête si l'article vient de montrer que 8 approches sur 9 ont produit une correction profonde. Les données ont une orientation. La nommer est plus rigoureux, pas moins.

**Formule correcte :** "The data leans toward one scenario. [Fait quantifié]. That is the setup here."

La nuance vient après, pas à la place : citer la taille de l'échantillon, les limites de la prédiction, le signal de confirmation qui viendra confirmer. Mais la direction implicite dans les données se dit.

**Ce qui reste interdit :** conseil d'achat ou de vente, sizing, timing d'entrée. L'honnêteté directionnelle ne contredit pas la règle de non-conseil. "Le data penche vers une correction" n'est pas "vendre maintenant."

> Cas réel (spy-ipo-fork-747, mai 2026) : "The data cannot tell you which scenario is ahead" → corrigé → "The data does lean toward one scenario. A fast approach to a structural level has preceded a sharp correction eight times out of nine in this backtest. That is the setup here."

---

### Paragraphes courts pour les sections contextuelles — règle

Les sections analytiques qui traitent plusieurs points distincts (parallèles de marché, corrélations, comparaisons géographiques) doivent être découpées en paragraphes courts : **1 idée = 1 paragraphe**.

Un bloc de 15 lignes continu oblige le lecteur à tenir plusieurs fils en même temps. Couper en unités de 2-4 phrases, chaque paragraphe ayant un seul sujet.

**Structure type pour une section "parallèle" :**
1. Paragraphe d'ouverture : le fait qui justifie la comparaison (2 phrases)
2. Paragraphe données : la corrélation ou le contexte quantifié (3 phrases)
3. Paragraphe exception/limite : quand la corrélation casse (2-3 phrases)
4. Paragraphe implication : ce que ça change concrètement pour le lecteur (2-3 phrases)
5. Note de suivi (italique) : quand la prochaine mise à jour paraîtra

> Cas réel (spy-ipo-fork-747, mai 2026) : section "One parallel worth noting" — un seul bloc de 15 lignes découpé en 7 paragraphes courts après correction.

---

### Note de suivi — règle pour les analyses d'événements en cours

Quand l'article analyse une situation non résolue (un niveau non encore touché, une décision non encore rendue, une donnée non encore publiée), fermer la section concernée par une note de suivi en italique.

**Format :** `<p><em>We will publish a follow-up once [événement déclencheur précis].</em></p>`

L'événement déclencheur doit être concret et observable : "once $747 is first touched", "once the annual results are filed", "once the volume data from the 20 sessions after the high is readable."

Pas de vague "nous reviendrons sur ce sujet." Nommer l'événement exact qui déclenchera la mise à jour.

---

## Visualisations de données inline (SVG) — palette et règles

Les graphiques inline des articles Trading852 utilisent le thème sombre de la homepage, pas le fond blanc de l'article body. Cela crée un contraste visuel fort qui ancre les données dans l'identité du site.

### Palette obligatoire

| Usage | Couleur | Valeur |
|---|---|---|
| Fond de chart | Noir profond | `#05060f` |
| Négatif / tops / correction | Rouge site | `#ff6d70` |
| Positif / breakouts | Vert site | `#56d49f` |
| Accent courant / position | Bleu site | `#4760ff` |
| Zone neutre / watch | Bleu faible opacité | `rgba(71,96,255,0.18)` |
| Texte principal | Blanc fort | `rgba(255,255,255,0.9)` |
| Texte secondaire | Blanc moyen | `rgba(255,255,255,0.4)` |
| Texte axe | Blanc faible | `rgba(255,255,255,0.28)` |
| Grille / axe | Blanc très faible | `rgba(255,255,255,0.1)` |

Ces couleurs viennent de `base.css` (`--pos: #56d49f`, `--neg: #ff6d70`) et du gradient homepage `rgba(71,96,255,...)`.

### Structure SVG de référence

```html
<figure class="article-chart" style="margin:1.5rem 0 2.5rem;">
  <svg viewBox="0 0 552 [hauteur]" xmlns="http://www.w3.org/2000/svg"
       style="width:100%;max-width:552px;display:block;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;">
    <rect width="552" height="[hauteur]" rx="6" fill="#05060f"/>
    <g transform="translate(16,16)">
      <text x="0" y="14" font-size="11" font-weight="600"
            fill="rgba(255,255,255,0.4)" letter-spacing="0.07em">TITRE DU CHART</text>
      <!-- données -->
    </g>
  </svg>
  <figcaption>Description concise.</figcaption>
</figure>
```

### Règles

- `viewBox` + `width:100%` — jamais de largeur fixe en pixels
- Padding intérieur 16px via `<g transform="translate(16,16)">`, viewBox +32 en largeur et hauteur
- Titre du chart : uppercase, `letter-spacing:0.07em`, `rgba(255,255,255,0.4)` — jamais blanc plein
- `clip-path` avec `<defs>` pour les barres de progression avec coins arrondis
- `aria-label` obligatoire sur chaque SVG pour l'accessibilité
- `font-family:'Space Grotesk',Helvetica,Arial,sans-serif` inline sur chaque SVG

> Référence : spy-ipo-fork-747 (mai 2026) — 3 charts inline : bar chart vitesse d'approche, zone chart volume, progress bar approche courante.

---

## Section Sources (obligatoire en bas de chaque article)

Chaque article se termine par une section Sources, après la Décision. Ce n'est pas une formalité : c'est la preuve que chaque chiffre est traçable.

**Format HTML obligatoire (jamais `<h2>` + `<p>` plain) :**
```html
<div class="sources-section">
  <h2>Sources</h2>
  <ul>
    <li>Résultats annuels FY2025 : HKEX filing, [mois] [année]</li>
    <li>Données de valorisation pairs : Bloomberg consensus, [date]</li>
    <li>Calculs propres sur base du bilan au [date]</li>
  </ul>
</div>
```
Le CSS `.sources-section` est défini dans chaque article — copier depuis `9988-alibaba.html`. Il rend le titre en petit label gris uppercase (`--fs-12`) et chaque `<li>` avec un tiret `–` dans la même graisse. Ne jamais utiliser `<h2>Sources</h2><p>…</p>` : c'est trop grand et ne respecte pas la hiérarchie visuelle.

**Format source :** `[Société] [type de document] : [canal], [mois année]`

**Règles :**
- Chaque chiffre cité dans le corps de l'article doit être traçable à une ligne de cette section.
- Jamais "Bloomberg" seul : toujours avec la date du consensus et, si possible, le code de la série.
- Les multiples de pairs doivent citer leur source et leur date. Un multiple sans date est une estimation non vérifiable.
- Si un chiffre vient d'un calcul propre (ex : EV = capitalisation boursière + dette nette), l'indiquer explicitement : "calcul propre sur base du bilan au [date]".
- Les filings HKEX sont la source primaire. Bloomberg est acceptable pour les données de marché et les multiples de pairs, pas pour les données fondamentales de la société analysée.

---

## Navigation prev/next (obligatoire sur chaque article)

Chaque article doit inclure un bloc de navigation entre la fin de l'article body et le footer disclaimer. Il permet au lecteur de passer à l'article précédent (plus ancien) ou suivant (plus récent).

**Placement :** entre `</div>` (fermeture article-body) et `<!-- ══ ARTICLE FOOTER ══ -->`.

**Ordre chronologique des articles** (du plus ancien au plus récent) : défini dans `README.md` → table "Published articles". Mettre à jour la chaîne à chaque nouvel article publié.

**Format HTML :**
```html
<!-- ══ ARTICLE NAV ══ -->
<div class="article-nav-section">
  <div class="container">
    <nav class="article-nav" aria-label="Article navigation">
      <a href="/analyses/slug-precedent" class="article-nav__link article-nav__link--prev">
        <span class="article-nav__label">&larr; Previous</span>
        <span class="article-nav__title">Titre de l'article précédent</span>
      </a>
      <a href="/analyses/slug-suivant" class="article-nav__link article-nav__link--next">
        <span class="article-nav__label">Next &rarr;</span>
        <span class="article-nav__title">Titre de l'article suivant</span>
      </a>
    </nav>
  </div>
</div>
```
- Si l'article est le plus ancien : supprimer le bloc `--prev`.
- Si l'article est le plus récent : supprimer le bloc `--next`.
- Le CSS `.article-nav-section` est défini dans chaque article — copier depuis `9988-alibaba.html`. Titre en `--fs-16` serif noir, label en `--fs-12` sans-serif gris uppercase.
- **À chaque publication** : mettre à jour le `--next` de l'article précédent pour pointer vers le nouvel article.

---

## Checklist avant publication — contrôle inter-articles

Avant de soumettre un article, vérifier ces points contre les articles déjà publiés :

**Arc narratif**
- [ ] Le hook pose un paradoxe non résolu — la question-fil est identifiable, implicite, non formulée
- [ ] La dernière phrase des sections 1 à 5 ne conclut pas — elle laisse une aspérité qui force la section suivante
- [ ] La section 4 est celle qui répond à la question-fil du hook — pas avant, pas après
- [ ] La section 6 (risques) se termine en mode "voici ce que je surveille" et non "voici pourquoi ça pourrait mal tourner"
- [ ] La phrase lapidaire est bien la dernière phrase de l'article, après les triggers d'invalidation

**Titre**
- [ ] Le titre contient au moins un chiffre précis
- [ ] Il y a une tension ou un paradoxe (deux faits apparemment incompatibles, ou un prix qui semble impossible)
- [ ] Le titre ne donne pas la réponse, il force la lecture
- [ ] Aucun superlatif, aucun adjectif d'enthousiasme
- [ ] La card homepage est distincte du H1 (si longueur > 10 mots)

**Unicité inter-articles — vérification obligatoire par grep**

Avant de finaliser, lancer cette commande sur le dossier `analyses/` :
```bash
grep -r "PHRASE_À_VÉRIFIER" analyses/
```
Si la phrase ou sa structure apparaît dans un autre article, réécrire. Pas de discussion.

- [ ] **Pendule** : la phrase-pendule de cet article n'est pas dans la liste des phrases bannies (§ Voix Howard Marks)
- [ ] **Ouverture** : la structure de l'ouverture n'a pas été utilisée dans un article précédent ("This is not...", "The filing is public...", "The math is worth reading...")
- [ ] **Subtitle** : la structure du subtitle est unique à cet article (pas la même formule qu'un subtitle existant)
- [ ] **Clôture Décision** : la dernière phrase est spécifique à cette entreprise, pas une variante d'une clôture déjà publiée
- [ ] **Lead paragraph** (`<p class="lead">`) : grep sur les 5 premiers mots — aucune occurrence dans un autre article
- [ ] **Toutes les phrases de section 2 et 3** : aucune formule rhétorique commune avec un article existant

**Dispositifs rhétoriques — quota maximum sur tout le blog :**

Ces constructions sont fortes mais épuisent leur effet rapidement. Dépasser le quota = signal AI immédiat.

| Dispositif | Quota blog | Quota par article | Utilisé dans |
|---|---|---|---|
| "The market has priced X. It has not priced Y." | 2 fois max | 1 fois max | Alibaba (key takeaway) + Haier ✓ |
| "Three Facts Operating Simultaneously" | 1 fois puis retraite | 1 fois | Prada ✓ — interdit partout ailleurs |
| "Until one of these appears" | 1 fois puis retraite | 1 fois | Prada ✓ — remplacer par une phrase spécifique à l'entreprise |
| "The arithmetic deserves a second look" | retraite (3 usages) | — | Yadea subtitle, Jacobio, Prada meta |

**Phrases bannies — déjà utilisées, ne jamais réutiliser :**
- "the discount exists, it is documentable" — Dickson + Prada (corrigé avr. 2026)
- "The discount exists for a documented reason" — Jacobio (corrigé avr. 2026)
- "The market has priced one. The other two are not in the current price." — Yadea + Prada (corrigé avr. 2026)
- "Most market participants have processed one of these." — Jacobio (corrigé avr. 2026)
- "Three Facts Operating Simultaneously" — retraité après Prada. Ne jamais réutiliser avant 10 articles.
- "The math is worth reading" — Jacobio subtitle
- "Pessimism this acute against fundamentals this durable is not a stable state." — Prada

**Jargon — passe obligatoire**
- [ ] Key Takeaway : zéro terme technique non défini (lire la box seule — si un mot nécessite un dictionnaire financier, le réécrire)
- [ ] Passe jargon complète sur le corps : vérifier chaque terme de la table "Passe jargon obligatoire" ci-dessus
- [ ] Tout acronyme ou nom propre non universel est défini à sa première occurrence (UAF, P/B, Trian Partners, HKMA, etc.)
- [ ] Titre : passer le test du lecteur zéro-contexte — retirer tous les noms propres et métriques techniques, la tension tient-elle ?

**Style**
- [ ] Aucun em dash dans l'article
- [ ] Aucune insertion mid-sentence (test : lire la phrase sans l'insertion, si elle tient, l'insertion devient une phrase séparée)
- [ ] Aucune parenthèse de plus de 4 mots
- [ ] Aucune phrase-remplissage ("That is the context", "This is worth noting", "The implications are significant") — chaque phrase contient une assertion précise
- [ ] Tout concept est introduit avant d'être référencé — "les quatre niveaux" ne peut apparaître qu'après "quatre niveaux" ou "four of those levels" ont été posés

**Honnêteté analytique**
- [ ] Si l'analyse produit une orientation claire, elle est nommée — pas de "the data cannot tell you" quand les données penchent dans une direction
- [ ] Chaque scénario conditionnel ("si X, alors Y") énonce les deux branches avec leur implication concrète
- [ ] Pour les analyses d'événements en cours : une note de suivi italique précise l'événement déclencheur de la prochaine mise à jour

**Protection de la méthode (articles avec indicateurs propriétaires)**
- [ ] Aucune mention du nombre d'années de backtest précis ni du nombre total d'approches/occurrences analysées
- [ ] Maximum 2 niveaux consécutifs publiés
- [ ] Aucun input de formule, paramètre, ou ancrage temporel dans le corps de l'article

Si un point échoue : réécrire à partir du fait le plus concret et spécifique à l'entreprise. Jamais partir d'un template existant.
