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
updated: 2026-06-06
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
1. Claude rédige → dépose dans `DRAFT/` (jamais dans `publish/analyses/` ni `publish/drafts/`)
2. Dany relit et valide
3. Dany demande la publication → Claude déplace vers `publish/analyses/`, met à jour le README, met à jour le nav de l'article précédent, lance `node build.js`

**Claude ne publie jamais un article directement** sans que Dany ait relu la version dans `DRAFT/`.

---

## Pre-flight — quatre tests à passer avant la première phrase

Ces quatre tests prennent cinq minutes et évitent les réécritures intégrales en aval. Si l'un échoue à ce stade, l'angle de l'article doit changer — pas la prose.

**1. Test des acronymes propres à l'entreprise.**
Lister tous les noms de segments, divisions, produits ou programmes qui apparaissent en majuscules dans les sources internes (rapports FinRatios, expert analyses, retail explainers, filings). Pour chaque acronyme, écrire sur une feuille la traduction grand public en 5 mots maximum.

Exemple (0992 Lenovo) :
- IDG → the PC business
- ISG → the server business / the server segment
- SSG → the services arm

Si l'acronyme ne peut pas être traduit en 5 mots, le lecteur ne pourra pas le garder en mémoire pendant 1 200 mots de prose. L'article aura besoin d'un autre angle.

**Règle d'écriture qui découle du test :** chaque acronyme propre à l'entreprise est défini *une seule fois* à sa première occurrence dans le corps, puis *remplacé* par sa traduction grand public partout ailleurs. Pas "défini et conservé". Remplacé. La table de passe jargon (section Lite) concerne les termes financiers génériques. Cette règle-ci concerne les segments propriétaires.

> Cas réel (0992 Lenovo, mai 2026) : première version utilisait IDG / ISG / SSG plus de 30 fois dans le corps après les avoir définis à la première occurrence. À la relecture, Dany a posé la question "What does ISG mean?". La définition n'avait pas tenu. Réécriture intégrale du corps nécessaire. La règle aurait dû s'appliquer *avant* le premier jet — d'où ce pre-flight.

**2. Test du chiffre central.**
Identifier le ou les deux chiffres qui portent la thèse. Ces chiffres iront dans le titre et le hook. Tout autre chiffre de l'article doit servir ces chiffres-là, soit en les contextualisant, soit en les contredisant. Un chiffre qui se tient seul, parallèle aux chiffres centraux, n'a pas sa place dans le corps — il appartient au Data Snapshot.

**Test :** lire chaque paragraphe en se demandant *"ce chiffre aide-t-il le lecteur à comprendre les deux chiffres du titre, ou il s'aligne à côté ?"*. Si la réponse est "il s'aligne", le couper.

**3. Test de la question-fil.**
Écrire en une phrase la question que le lecteur ne pourra pas résoudre sans terminer l'article. Si la question peut être devinée après le hook, elle est trop faible. Si la question ne tient pas en une phrase, l'article n'a pas de centre.

La question-fil n'apparaît jamais en clair dans l'article — elle est implicite dans le paradoxe du hook. Mais elle doit exister, écrite quelque part avant de commencer à rédiger.

**4. Test de l'ancrage prix.**
Avant d'écrire la première phrase, fetch le **prix live actuel** du ticker. **Jamais** réutiliser un prix trouvé dans un earnings report, une press release, un rapport FinRatios antérieur, ou une analyse Claude précédente. Ces sources citent le prix de leur propre date de publication — qui peut dater de plusieurs semaines voire mois.

**Sources, par ordre de préférence :**
- HK : FinMC parquet `cache/{TICKER}.HK_daily_local.parquet` (dernière barre EOD) → si > 1 jour ouvré stale, lancer `fetch_price_robust.py {TICKER}.HK`
- US : `fetch_price_robust.py {TICKER}` (snapshot + insider + ratings en 1 call)
- Intraday réel : demander à Dany le quote TradingView Pro, ou yfinance live

**Règle d'écriture qui découle du test :** chaque chiffre de prix dans l'article est suivi de sa date adjacente. ✅ "closed at HK$13.19 on May 20, 2026". ❌ "closes at HK$10" (date implicite — invite la réutilisation stale). Cette règle s'applique à TOUS les chiffres dérivés du prix : market cap, P/E, EV, scenario targets, sum-of-parts, dividend yield, asymétries vs métriques fondamentales (order book, NAV, cash, etc.).

> Cas réel (0992 Lenovo, mai 2026) : draft Trading852 rédigé avec HK$10.00 comme close du 20 mai. Vrai close = HK$13.19. Le HK$10 venait d'un earnings report ou article ancien que Claude a scanné en recherche, puis utilisé comme "current price" sans vérifier indépendamment. Toute la thèse "$15.5B AI orders ≈ $15.9B market cap, peer discount à 7.7× P/E, bull case +35-50%" était bâtie sur une mcap fictive de US$15.9B. Réelle = US$20.7B, P/E 10.1× = en ligne avec Dell, **pas de discount**. Le bull case "+35-50%" était en réalité +2-14%. Article tué — réécriture from scratch ou pull définitif. La règle aurait dû s'appliquer *avant* le premier jet — d'où ce test.

**Référence procédure complète :** [Trading/README.md → Live Price Anchoring (MANDATORY)](/Users/mc/MarcOS/Trading/README.md) et [MEMORY.md → MANDATORY live-price fetch](/Users/mc/.claude/projects/-Users-mc/memory/MEMORY.md).

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

**Whitelist d'acronymes universellement lisibles.** Les acronymes suivants peuvent apparaître sans définition : HKEX, HK, USA, US, EBIT, EBITDA, P/E, P/B, GDP, IPO, AGM, ETF, OEM, GPU, CPU, AI, EV, HKD, USD, RMB, CNY, MOP, NYSE, SPY, HSI, IR (investor relations), ATH. Tout autre acronyme demande une définition inline à sa première occurrence — *et* doit être remplacé par sa traduction grand public ensuite si c'est un segment propre à l'entreprise (cf. règle Pre-flight au début de ce guide).

**Test exécutable avant publication :**
```bash
grep -oE '\b[A-Z]{2,4}\b' DRAFT/<file>.html | sort -u
```
Tout acronyme retourné qui n'est pas dans la whitelist ci-dessus doit avoir une justification dans le corps : soit défini une fois et traduit, soit coupé.

---

## Voix — la cadence de Marc

Le filtre précision (CLAUDE.md global) couvre la rigueur analytique. Cette section couvre la *cadence* : comment les phrases s'enchaînent pour que l'article sonne comme Marc en train d'expliquer, et non comme un analyste en train de lister. Référence de fond : [VOIX-Marc.md](/Users/mc/Library/Mobile%20Documents/com~apple~CloudDocs/MarcOS/Voix%20Marc/VOIX-Marc.md). Cette section ajoute trois règles de respiration spécifiques aux articles Trading852, où le risque structurel est l'empilement de chiffres.

### 1. Longueur de phrase : 15–25 mots, jamais plus de 30

Position 3 sur l'échelle court/long de VOIX-Marc. Une phrase de 32 mots qui empile deux idées doit être coupée en deux. Pas de "et" qui relie deux raisonnements.

**Test exécutable :**
```bash
awk '/<p>/,/<\/p>/' DRAFT/<file>.html | tr '.' '\n' | awk '{n=split($0,a," "); if(n>30) print n" mots: "$0}'
```
Retourne chaque phrase de plus de 30 mots. Réviser jusqu'à ce que l'output soit vide.

### 2. Densité de chiffres : maximum 3 phrases-chiffres consécutives

Une *phrase-chiffre* est une phrase dont la valeur principale est un nombre (revenu, marge, multiple, % de croissance, taille de pipeline, etc.). Après 3 phrases-chiffres d'affilée, le lecteur cesse de retenir les chiffres et l'article devient un tableau déguisé en prose. La 4e phrase doit être une *phrase d'interprétation* : ce que la grappe de chiffres signifie en plain English, sans nouveau chiffre.

**Forme correcte (extrait 0992 Lenovo v2) :**
> "Lenovo Group (0992.HK) closed at HK$10.00 on May 20, the day before its full-year results. At that price, the entire company is worth about US$15.9 billion in the market. Three months earlier, at its February print, Lenovo disclosed that customers had already placed orders for US$15.5 billion of AI servers. Not delivered yet. Just on the order book, waiting to be shipped. The two numbers are almost the same. One is the market's price for the entire business. The other is the order book in a single segment."

Quatre chiffres atterrissent. Entre eux, des phrases courtes qui re-cadrent le sens, pas de nouveaux chiffres. Le lecteur sort du paragraphe avec deux nombres en mémoire (15.9 et 15.5) et une compréhension de pourquoi ils comptent.

**Forme interdite (extrait 0992 Lenovo v1, corrigé) :**
> "Lenovo Group reported Q3 FY2025/26 revenue of US$22.2 billion (+18% year-on-year), a third consecutive record quarter. The Solutions & Services segment generated US$2.7 billion at a 22% operating margin. AI-related revenue across all segments grew +70% and now accounts for roughly a third of the group total. The stock closes at HK$10.00 on the day before full-year results, at 7.7 times trailing earnings against US hardware peers HP at 9.0× and Dell at 10.3×."

Huit chiffres en quatre phrases sans aucune phrase d'interprétation. Le lecteur retient la liste, pas la thèse.

> Cas réel (0992 Lenovo, mai 2026) : Key Takeaway v1 contenait 9 chiffres en 5 phrases consécutives sans phrase d'interprétation. Retour Dany : *"too many numbers and not enough sentences to actually highlight the number that count"*. V2 ouvre sur les 2 chiffres du titre, puis une phrase d'interprétation, puis le chiffre de loss, puis une autre interprétation. Les mêmes chiffres atterrissent — mais le lecteur les *voit*.

### 3. Re-formulation grand public de chaque chiffre clé

Tout chiffre qui porte la thèse est immédiatement re-cadré en langage du lecteur, dans la phrase qui suit. Ce n'est pas une explication financière. C'est un changement de registre : du chiffre brut au sens que le lecteur peut visualiser.

**Forme interdite :** *"ISG order pipeline of US$15.5B."*
**Forme correcte :** *"Customers have already placed orders for US$15.5 billion of AI servers. Not delivered yet. Just on the order book."*

Le second exemple ne contient aucune information supplémentaire au sens factuel. Mais le lecteur voit la commande, voit l'attente de livraison, comprend que c'est de la demande non encore reconnue dans les revenus.

**Règle :** un chiffre qui apparaît sans re-cadrage immédiat reste opaque pour le lecteur retail. Soit re-cadrer, soit déplacer le chiffre dans le Data Snapshot où il vit à côté de son label.

### 4. La phrase d'observation — règle de placement renforcée

(Cette règle existe déjà plus bas dans le guide ; rappel ici parce qu'elle est centrale à la voix.) Chaque article contient *une et une seule* phrase d'observation : la chose que Marc a remarquée en lisant le filing et qui ne figure dans aucun modèle analyste. Cette phrase ne doit jamais être enterrée au milieu d'un paragraphe. Elle se tient seule, ou clôt une section, ou ouvre le hook.

Test : si la phrase d'observation est noyée entre deux paragraphes de chiffres, le lecteur ne la voit pas. Soit la déplacer en début/fin de section, soit l'isoler comme paragraphe d'une seule phrase.

---

## Humanité & humour

Ajout du 6 juin 2026. Ce qui suit assouplit délibérément quatre règles du guide pour réintroduire une présence humaine. À lire avec une tension en tête : la rigueur des sections Catalyseur, Valorisation et Risques ne bouge pas. La personnalité vit dans le hook, la description de l'entreprise, et la dernière phrase. La chaleur rationnée se lit comme de la confiance. La chaleur mur à mur se lit comme une newsletter, ce que le guide interdit par ailleurs.

> Note de version : section réversible. La version du guide d'avant cet ajout est sauvegardée dans `_backups/blog-style-guide_pre-humanite-update_2026-06-06.md`. Pour annuler, restaurer ce fichier par-dessus la version courante.

### 1. On ne fait jamais de blague. On arrange les faits.

L'humour de ce format n'est jamais une vanne. C'est du deadpan par juxtaposition : empiler le consensus paniqué, puis poser sur sa propre ligne le fait qui le contredit, sans adjectif, sans commentaire. La platitude est la chute. Le writer ne dit jamais "ironiquement" ni "fait intéressant". Il laisse les chiffres être absurdes et refuse de commenter.

**Forme de référence (déjà publiée, 1913-prada) :**
> Fund managers cut positions. Financial news ran headlines about a historic earnings disaster.
> The business grew 9%.

Trois faits. Aucune blague. La dernière ligne, isolée, fait le travail.

**Règle :** 2 à 3 deadpans maximum par article. Setup (le consensus), puis chute (le fait nu) sur une ligne isolée. Jamais dans la section Risques. Jamais signalé par un adverbe.

### 2. Carte des zones : l'humour n'est pas uniforme

Le registre doit bouger d'une section à l'autre. Un lecteur "aime" mieux une structure dont la température change : chaud, froid, chaud. Un article à température constante du début à la fin se lit comme un filing.

| Section | Humour / chaleur autorisés |
|---|---|
| Hook | Oui : deadpan, observation sèche |
| Ce que fait l'entreprise | Oui : texture, caractère, image concrète |
| Pourquoi la décote existe | Léger : ironie sèche, une seule touche |
| Catalyseur | Non : sobre |
| Valorisation | Non : sobre |
| Risques | Jamais. Une touche d'humour ici signale qu'on ne prend pas le downside au sérieux. |
| Décision | Une seule ligne sèche autorisée, en clôture |

### 3. L'aparté humain : une occurrence par article

Pas l'auteur ("I think"), mais un narrateur qui remarque l'absurde ou l'humain d'une situation. Une phrase par article où le writer recule d'un demi-pas et observe.

**Forme de référence (déjà publiée, 1913-prada) :**
> A generation learned the name from a film, not a store.

**Règle de rareté :** une seule par article. La rareté est ce qui l'empêche de devenir un tic. Si l'article en contient deux, couper la plus faible.

**Test :** l'aparté pourrait-il apparaître dans un article sur une autre entreprise ? Si oui, le réécrire à partir du fait le plus spécifique au dossier, ou le couper.

### 4. Le chiffre à échelle humaine

EUR 1,375 milliard est un nombre. "Plus que le groupe ne génère de free cash flow en deux ans" est une sensation. Chaque chiffre central porte, en plus de sa précision, un référent à échelle humaine dans la phrase qui suit. C'est le moyen le plus rapide de parler au lecteur au lieu de réciter un filing.

Cette règle complète la re-formulation grand public (section Voix) : la re-formulation change le registre, l'échelle humaine donne la taille.

**Forme :**
> Prada closed the acquisition of Versace for EUR 1.375 billion. That is roughly two years of the group's free cash flow, spent in a single transaction.

### 5. Le "you" lecteur : autorisé. Le "I" : toujours interdit.

L'auteur reste absent du corps : "I/me/my" restent interdits hors signature finale. Le "you" qui s'adresse au lecteur est le mot le plus chaud de l'anglais et il ne réintroduit pas l'auteur. Autorisé dans le hook et la décision, avec parcimonie.

**Forme de référence (déjà publiée, titre 0113) :**
> The Market Is Paying You HKD 375M to Buy This Company

**Règle :** maximum 2 "you" par article, hook et/ou décision uniquement. Jamais dans Catalyseur, Valorisation ou Risques.

### 6. Aparté long : une exception au cap de 4 mots

Le cap de 4 mots sur les parenthèses (section "Pas d'insertions mid-sentence") reste le défaut. C'est la règle qui aplatit le plus la voix quand on l'applique sans exception. Autorisation : un seul aparté plus long par article, posé avec deux-points (jamais un tiret long), et uniquement dans le hook ou la description de l'entreprise. Partout ailleurs, le cap de 4 mots tient.

### 7. Structure : trois leviers de likeability

Ces trois éléments ne portent pas la thèse. Ils donnent au lecteur un plaisir de lecture et un point de repos.

1. **Rotation du cold-open.** La plupart des hooks ouvrent sur un chiffre. Une fois sur trois, ouvrir sur une scène ou une situation humaine d'une phrase, puis poser le chiffre. La variété d'ouverture est ce que le lecteur retient. Même logique anti-template que pour la phrase-pendule : deux articles consécutifs n'ouvrent pas de la même façon.
2. **Un pull-quote par article.** Extraire la meilleure ligne (souvent le deadpan ou l'aparté humain) en gros caractères au milieu de l'article. La chute deadpan atterrit visuellement, l'œil se repose. CSS : classe `.pull-quote` à créer dans `article.css` (n'existe pas encore au 6 juin 2026).
3. **Le paragraphe d'une seule ligne.** "The business grew 9%." seul sur sa ligne. Outil rythmique sanctionné, pas un accident. Maximum 3 par article.

### Ce que cet assouplissement ne change pas

- La rigueur analytique des sections Catalyseur, Valorisation, Risques : identique.
- Aucun superlatif, aucun conditionnel mou, aucune blague explicite.
- Aucun em dash, aucune cuisine interne, aucun conseil financier.
- "I/me/my" toujours interdits hors signature.

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

**Spécialisation — jamais référencer une note de recherche interne antérieure dans l'article.** L'article publié est présenté comme la vue de l'analyste, pas comme la révision d'un document préalable. Sont interdites toutes les formulations qui impliquent l'existence d'une note non publique précédente :

- ❌ « the original valuation work »
- ❌ « our prior note »
- ❌ « since we filed »
- ❌ « in our May analysis »
- ❌ « the earlier analysis flagged »
- ❌ « the original anchor was HK$33.20 »

Les ancrages publics sont en revanche bienvenus :

- ✅ « +9% over the past three weeks »
- ✅ « since the IPO in June 2025 »
- ✅ « since the FY2025 release »
- ✅ « since the Tesla announcement in October 2025 »

> Cas réel (2050 Sanhua, 24 mai 2026) : la phrase *« The price has already moved +9% since the original valuation work was filed three weeks ago »* a survécu au premier jet. Le +9% est public (HK$33.20 → HK$36.18). La référence à « the original valuation work » trahit l'existence d'une FinRatios interne. Réécriture : *« The stock has moved +9% over the past three weeks alone. »* Mêmes faits, zéro fuite. La règle est aussi enforced dans le README `What to never write` et indexée dans MEMORY.md.

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

**Key Takeaway ≠ ouverture du hook — règle absolue (ajout 2026-06-13).** La Key Takeaway est placée avant le hook et livre les chiffres en premier. Le hook les re-livre ensuite en mode narratif. Le piège : écrire la Key Takeaway comme une compression mot-pour-mot des premières phrases du hook. Les deux portent les mêmes chiffres-clés (inévitable), mais jamais les mêmes phrases ni le même ordre.

- **Key Takeaway** : attaque par la conclusion. Angle d'entrée = le « so what », le fait le plus distinctif, ou le catalyseur nommé. Le lecteur pressé doit pouvoir s'arrêter là.
- **Hook** : attaque par une autre porte (le prix, une scène, le paradoxe), construit la révélation pas à pas, et garde souvent le catalyseur en réserve jusqu'à la section dédiée.

**Le test :** poser la première phrase de la Key Takeaway à côté de la première phrase du hook. Si elles ouvrent sur le même chiffre dans le même ordre, réécrire la Key Takeaway pour qu'elle entre par un autre angle.

> Cas réel (0700 Tencent, 13 juin 2026) : Key Takeaway et hook ouvraient tous deux sur « At HK$463.60 … about HK$4.2 trillion », puis déroulaient la même arithmétique (708B → +147B cash → un cinquième → strip out → 11x vs NetEase) dans le même ordre. Retour Dany : *« the summary is using almost the same sentences than the first sentences of the first paragraph »*. Réécriture : la Key Takeaway attaque par le portefeuille (« Inside every Tencent share sits a portfolio … ») et nomme d'emblée le précédent JD.com 2021 que le hook, lui, garde pour la section 3. Mêmes chiffres, porte d'entrée différente.

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
- **Phrase de refus explicite — recommandée pour articles framework.** Une phrase qui nomme ce que l'article *ne fait pas*, placée avant le tableau de scénarios. Elle pose la posture analytique et désamorce l'attente d'une recommandation. Formulée comme un choix structurel, pas comme une excuse.
  - Forme correcte : "This framework does not produce a buy signal or a sell signal. What it produces is a zone where the same question has been asked at every level."
  - Forme interdite : "Je ne peux pas dire si..." / "It is difficult to predict..." — sonne comme une limite de l'auteur, pas comme une discipline de la méthode.
  - Le refus de prévoir devient le positionnement. La discipline est le marketing.
- Asymétrie exprimée en chiffres concrets : upside vs downside dans chaque scénario
- Tableau de scénarios (3 lignes max) : Scénario | Signal observable | Implication cours
- Critères d'invalidation de la thèse (2–3 triggers de sortie concrets et vérifiables)
- **Dernière phrase : la phrase lapidaire est l'apex émotionnel de l'article.** Elle arrive après le tableau, après les triggers. Courte. Factuelle. Irréfutable dans le contexte de l'article. Elle ne résume pas — elle pose le verdict final. C'est la ligne que le lecteur emporte.

**INTERDIT dans cette section — conseil financier déguisé :**
Jamais de recommandation sur quand acheter, quand vendre, combien investir, ou comment structurer une position. Aucune phrase du type "pour un nouvel entrant, entrer X semaines avant les résultats", "pas de raison de sortir avant telle date", "position sizing à X% du portefeuille". L'article présente la thèse et les catalyseurs — le lecteur décide seul ce qu'il en fait.

---

## Règles de style sentence par sentence

### 0. La simplicité d'abord — le lecteur ne doit jamais se demander ce qu'on veut dire (règle qui prime)

**Avant l'élégance, avant le rythme, avant le deadpan : la clarté.** Si une phrase oblige le lecteur à s'arrêter pour décoder ce qu'elle signifie, elle a échoué, même si elle sonne bien. La phrase la plus simple qui porte le fait gagne toujours contre la phrase plus habile qui le porte aussi. On n'écrit jamais une formule pour son effet si elle coûte une seconde de compréhension.

**Le test (avant chaque phrase user-facing) :** un lecteur qui la lit une seule fois sait-il exactement ce qu'elle dit ? S'il pourrait froncer les sourcils, hésiter, ou relire — réécrire en plus direct. Pas de métaphore qui se retourne. Pas de double sens. Pas de construction qui demande au lecteur de tenir deux idées avant que la phrase se résolve.

**Deux pièges récurrents, tous deux nés d'un excès d'habileté :**

**1. La métaphore qui se retourne ou mélange deux cadres.** Une image n'aide que si elle pointe dans le bon sens. Si elle dit le contraire de ce qu'on veut, ou colle deux registres sans rapport, le lecteur trébuche.
- ❌ *"The business is growing into the discount, not out of trouble."* — "grow into" sous-entend normalement justifier un prix élevé, donc "grow into a discount" dit l'inverse de l'intention ; et "discount" et "trouble" sont deux cadres collés sans pont.
- ✅ *"That gap is not a warning. A low multiple is the price the market puts on a business that is shrinking or losing money, and this one is doing neither."*

**2. L'opposition sans rampe ("X, not Y" / "A. The opposite.").** L'antithèse est la colonne vertébrale de ce format ("two kinds of cheap"), mais elle ne fonctionne qu'avec une **rampe** : soit une structure parallèle qui sert de transition ("One is… / The other is…", "The top four… / The bottom two…"), soit une chute à deux temps **en clôture de section** où le claquement est l'effet voulu ("That is not a yield. It is a countdown."). Hors de ces deux cas, deux idées opposées posées côte à côte sans pont sont choppy, et le lecteur cherche le lien manquant.
- Bridger les deux moitiés par un connecteur ("and this one is doing neither", "yet", "which is why") au lieu de les faire entrer en collision.
- Réserver le claquement nu ("a mistake, not a verdict") à une fin de section où on veut le snap, jamais en milieu de paragraphe où on veut le flux.
- **Jamais une opposition qui ne fait que reboucler un paragraphe déjà clair** (cf. "Un concept, une passe" et "Interdiction des phrases-remplissage" ci-dessous). Si la phrase d'avant a déjà livré le contraste, l'antithèse de clôture est du remplissage : la couper.

**Économie de l'antithèse :** même bien construite, elle fatigue si on la sert à chaque paragraphe. Garder les 4-5 meilleurs claquements, lisser ou fusionner les autres. Un article où chaque section finit sur un "X, not Y" se lit comme un tic, pas comme une voix.

> Cas réel (hong-kong-discount-cheap-two-ways, 22 juin 2026) : (1) le paragraphe Green Tea fermait sur *"The business is growing into the discount, not out of trouble. The cheaper the stock gets, the wider that gap with its peers becomes."* — métaphore retournée + seconde phrase circulaire (un prix plus bas = un écart plus large, tautologie). Retour Dany : *"this paragraph conclusion is not very clear. what do you actually want to say?"*. Réécrit en deux phrases directes. (2) La section 4 fermait sur *"The price is the same kind of low. The reason is the opposite."* — opposition à deux temps qui rebouclait un paragraphe déjà clair (le contraste venait d'être livré : top four rendent du cash, bottom two le gardent). Retour Dany : *"i do not understand this sentence. why is it necessary?"*. Coupée. Le test simple : si on supprime l'antithèse et que le paragraphe ne perd aucune information, c'était du remplissage.

### Construire la phrase claire — la recette (modèle Dickson, 22 juin 2026)

La règle 0 dit ce qu'il faut ÉVITER. Voici comment CONSTRUIRE une phrase claire quand l'idée met en jeu plusieurs parties (qui contrôle, qui gagne, qui perd) — le piège le plus courant des paragraphes de thèse, parce que le lecteur doit suivre deux acteurs à la fois.

**L'ordre qui fait atterrir l'idée en une seule lecture :**
1. **La situation**, en mots concrets et physiques. *"the cash stays locked in the company"* (pas *"the cash accrues to no one"*).
2. **Qui décide de l'issue.** *"whether a minority shareholder ever sees it is decided by the same family"*.
3. **Le conflit / la bascule, sur la même clause.** *"that just tried to keep it for itself"*.

Les trois temps tiennent dans **une seule phrase**. Le lecteur lit une fois et tient la situation, le levier et le piège, sans revenir en arrière.

**Trois contraintes qui gardent la phrase nette :**
- **Fusionner quand deux phrases servent une seule idée.** Si la 2e phrase ne fait que renvoyer à la 1re (*"That is the same family…"*), le lecteur doit re-relier les parties par-dessus la frontière de phrase — c'est exactement là qu'il confond qui est qui. Une seule phrase supprime ce saut.
- **Deux parties nommées ne doivent jamais pouvoir être confondues.** *"minority shareholder"* et *"family"* restent distinctes ; aucune tournure ne doit laisser croire que l'une est l'autre.
- **Un pronom = un seul référent dans toute la phrase.** Ici *"it"* = le cash, du début à la fin. Jamais un *"it"* qui glisse d'un sens à l'autre.

**La progression réelle (chaque version corrige la précédente, et c'est la leçon) :**
- ❌ v1 : *"…whether the cash ever reaches an outside shareholder rests with the same family that tried to acquire them at a discount."* — *them* sans référent net, *at a discount* sans ancre.
- ❌ v2 : *"…a minority shareholder only ever sees it if the family decides to pay it out. That is the same family that just tried to keep it for itself."* — deux phrases ; le *"That is the same family"* fait confondre le minoritaire et la famille.
- ✅ v3 : *"So the cash stays locked in the company, and whether a minority shareholder ever sees it is decided by the same family that just tried to keep it for itself."*

Retour Dany sur la v3 : *"this is SO MUCH better"*. La leçon dure : **même un premier correctif peut réintroduire une ambiguïté ailleurs.** Le test final n'est donc pas *"ai-je retiré le pronom flou ?"* mais *"un lecteur peut-il encore confondre deux parties, ou doit-il relire pour relier l'idée ?"*. Tant que la réponse n'est pas non, la phrase n'est pas finie.

---

### Longueur des phrases
- **Phrase d'emphase** : 5-10 mots, seule sur une ligne ou après un long développement
  - "Nous l'avons fait." / "Face à un cours de HKD 6,10."
- **Triplé déclaratif** : trois phrases courtes successives qui empilent des faits pour faire atterrir un chiffre clé. Signature rythmique.
  - "The 2022 all-time high came in at $477.71. The level was $477.58. The gap was $0.13."
  - "The first level held for fourteen years and two bear markets, the second for two years. The clock at $747 is now running."
  - Maximum une ou deux occurrences par article. Au-delà, l'effet s'épuise.
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

### Forward-deferral — 2 occurrences par article maximum

**Anti-pattern :** chaque paragraphe analytique se termine par une variation de *"the next print will tell us"* / *"future quarters will answer"* / *"on saura au prochain trimestre"* / *"the next four quarters tell us"*. Ce tic verbal deflecte l'analyse vers un futur calendaire au lieu de la substantifier. Il signale que l'auteur n'a plus rien à dire sur le fond, alors il pointe le calendrier.

**Règle dure :** maximum 2 mentions de forward-deferral dans tout l'article, et uniquement aux deux endroits opérationnels :
1. La **closing punchline** (signature rythmique de fin) : *"The next four quarters tell us whether the conclusion was complete or just early."*
2. Le **trigger table** de la section Décision (où le timing est actionnable) : *"Q1 FY2026/27 print confirms server margin above 3%..."*

**Jamais dans les paragraphes du corps**, jamais en bas d'un Key Takeaway, jamais comme phrase de transition entre sections, jamais comme conclusion d'un risk callout.

**Substitution obligatoire :** chaque paragraphe qui identifie un watch point se termine par **ce qui valide ou invalide la thèse** (la métrique précise, la condition opérationnelle), pas par **quand on le saura** (le prochain print).

| Forme interdite (forward-deferral) | Forme correcte (substance) |
|---|---|
| "The next quarterly print will tell us whether the margin holds." | "The margin holds if Infinidat integration costs don't compress it below 2%." |
| "We'll know after Q1 FY26/27 if the bull case continues." | "The bull case continues if services share moves above 12% on group revenue." |
| "Future prints will resolve this question." | "The question resolves the first quarter that Rubin-platform revenue is split out separately." |
| "Until the next print confirms it, the operating profit growth is not yet validated." | "The operating profit growth implied by today's multiple assumes that it does." |
| "Each is a watch point for the next quarterly print, not a known outcome today." | "Each is a watch point, not a known outcome today." |

**Le test (à exécuter avant publication) :** grep tous les paragraphes pour `next quarterly|next print|next four|future print|coming quarter|on saura au prochain|prochain print`. Le compte total dans le fichier doit être ≤ 2. Si > 2, rewrite chaque paragraphe du corps avec la substance opérationnelle ; garde uniquement la closing punchline et la ligne du trigger table.

> Cas réel (0992 Lenovo, 22 mai 2026) : version initiale du post-print contenait **6 occurrences** de "next quarterly print / next four quarters / next print / Q1 FY2026/27 print" disséminées dans le Key Takeaway, l'intro de "What didn't prove", deux risk callouts, le trigger table, et la closing punchline. Dany a flaggué : *"Why do you repeat so many times the next four quarters throughout the article??"*. Réduit à **2 occurrences** stratégiques (trigger table + closing). Les 4 autres paragraphes du corps ont été rewrités avec la substance opérationnelle (Infinidat integration costs, services share threshold, Rubin transition), pas avec la temporalité.

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

### Récurrence de la thèse et longueur — règle anti-broderie (ajout 2026-06-13)

Un article a une thèse. Elle revient nécessairement de section en section : c'est l'escalier. Mais **chaque rappel doit porter un payload neuf et un wording neuf.** Répéter la même phrase trois fois sous trois sections différentes n'est pas de la structure, c'est du remplissage déguisé en structure.

**Deux formes à distinguer :**
- **Ré-ancrage légitime :** la section ré-énonce la thèse *sous un angle que les sections précédentes n'ont pas couvert*. Hook = la révélation. Section « pourquoi la décote » = le mécanisme. Section catalyseur = la preuve. Chaque occurrence ajoute quelque chose.
- **Broderie :** la même idée, formulée presque à l'identique, qui clôt deux ou trois sections. Le lecteur a déjà l'information. La phrase ne fait que remplir.

**Le test de la phrase-jumelle :** grep le motif central de l'article (ex. « portfolio worth nothing inside the price »). S'il apparaît trois fois en quasi-verbatim, deux de ces trois sont de la broderie. Garder celle qui porte le payload le plus fort, réécrire les autres pour qu'elles entrent par un autre angle, ou les couper.

**Ne jamais broder pour atteindre un nombre de mots.** Le word count est descriptif, pas une cible. Un article qui dit sa thèse proprement en 1 400 mots est meilleur qu'un article de 2 000 mots dont 600 reformulent les 1 400 premiers. Si une phrase répète ce qu'un tableau juste au-dessus vient d'afficher, elle est en trop, même si l'article « fait plus court » sans elle.

**Cas particulier, la phrase après un tableau.** Un tableau de valorisation affiche déjà les multiples et le discount. La phrase de prose qui suit ne re-récite jamais les chiffres du tableau. Elle ajoute ce que le tableau ne dit pas : le forward, le pourquoi, l'asymétrie. Sinon, la couper.

> Cas réel (0700 Tencent, 13 juin 2026) : sous le tableau de valorisation, la phrase *« At 11 times operating earnings, the business behind WeChat is priced below NetEase and well below the sector average, and that already credits the portfolio in full »* re-récitait les trois chiffres que le tableau venait d'afficher (11x, NetEase, portefeuille crédité). Retour Dany : *« on ne devrait pas broder pour faire un texte de X number of words… ça devient inintéressant à lire »*. Coupée. Ne sont restés que les deux faits neufs : le forward sous 10x et le multiple de tête 13,5x. Le motif central « portefeuille à ~0 » apparaissait par ailleurs en quasi-verbatim à la fin de trois sections successives ; deux réécrites pour porter un angle distinct (paradoxe cash-rich, puis « valeur verrouillée, pas détruite »).

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
- **L'auteur disparaît du corps — règle absolue.** "I/me/my" sont interdits dans le corps de l'article. La première personne du singulier n'apparaît qu'en signature finale, sous forme d'engagement de suivi : "_I will publish a follow-up once $747 is first touched._" Le corps parle au nom des données ("the signal", "the dataset", "history shows", "the framework"), jamais au nom de l'auteur. Cette absence construit l'autorité sans jamais l'affirmer — le lecteur fait confiance à la donnée, pas à la personne.

### Italiques — réservées aux distinctions conceptuelles

Les italiques ne servent jamais à appuyer un mot fort ou une émotion. Elles ne servent qu'à contraster deux axes logiques que la phrase pose en parallèle.

**Formes correctes :**
- "The three signals answer *whether* a high is a major top. The ceiling answers *how far above the level* the high can form."
- "Speed describes *how* the approach got here. Volume confirms *after* the high."

**Formes interdites :**
- "This is *really* important" — emphase émotionnelle
- "The market *finally* moved" — adverbe appuyé
- Une italique isolée sur un mot sans deuxième italique en parallèle dans la même phrase ou la suivante

**Test :** si l'italique disparaît, la phrase perd-elle une distinction logique entre deux choses ? Si non, retirer.

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

## Technical — CONFIG block (obligatoire dans chaque article)

Chaque article source commence par un bloc `<!-- CONFIG {...} -->`. Voici le template complet avec tous les champs obligatoires et optionnels :

```html
<!-- CONFIG
{
  "layout": "article",
  "title": "[Titre SEO — 60 chars max affichés]",
  "ogTitle": "[Titre OG / H1 — tension arithmétique, peut aller jusqu'à ~90 chars]",
  "description": "[Meta description — 150-160 chars]",
  "canonical": "https://trading852.com/analyses/[slug]",
  "ogType": "article",
  "ogImage": "https://trading852.com/assets/og-image.png",
  "pubDate": "YYYY-MM-DD",
  "modDate": "YYYY-MM-DD"
}
-->
```

**Règles champ par champ :**

| Champ | Obligatoire | Notes |
|-------|-------------|-------|
| `layout` | Oui | Toujours `"article"` pour les analyses |
| `title` | Oui | Title tag HTML — 60 chars affichés max (voir note ci-dessous) |
| `ogTitle` | Oui | Peut diverger du `title` — suit la formule titre Trading852 |
| `description` | Oui | Meta description — 150-160 chars |
| `canonical` | Oui | URL absolue, jamais de trailing slash |
| `ogType` | Oui | Toujours `"article"` |
| `ogImage` | Oui | Utiliser l'image OG par défaut `og-image.png` sauf chart spécifique |
| `ogImageAlt` | Si `ogImage` ≠ default | Décrire l'image en 60-125 chars ; inutile si on utilise l'image par défaut |
| `pubDate` | Oui | Date de publication initiale — YYYY-MM-DD — ne change jamais |
| `modDate` | Oui | Date de dernière modification significative du contenu — mettre à jour à chaque revision |

**Note `title` — `wc -c` vs longueur réelle :**
`echo -n "ton titre" | wc -c` retourne des octets, pas des caractères affichés. Un `×`, un `—`, un `·` ou un caractère accentué compte 2-3 octets. Pour un audit fiable :
```bash
awk '{print length}' <<< "ton titre"
```
Cette commande retourne le nombre de caractères (points de code Unicode), pas d'octets.

**`ogImageAlt` — quand l'ajouter :**
Uniquement quand `ogImage` pointe vers un chart ou une image spécifique à l'article (pas l'image OG générique `og-image.png`). La valeur doit décrire le contenu visuel en 60-125 chars.
```
"ogImageAlt": "SPY monthly chart 2020–2026 showing structural price levels at $477.58 and $747"
```

**`modDate` — règle de mise à jour :**
Mettre à jour `modDate` à chaque révision qui change le contenu analytique (chiffres, thèse, risques, décision). Ne pas mettre à jour pour des corrections typo ou de style. Le `modDate` alimente automatiquement la meta `article:modified_time` et le champ `dateModified` du JSON-LD.

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

**CONFIG / SEO**
- [ ] `pubDate` renseigné (date de publication, ne changera plus jamais)
- [ ] `modDate` renseigné (date du jour à la publication, mettre à jour à chaque révision analytique)
- [ ] `title` ≤ 60 caractères affichés — vérifier avec `awk '{print length}' <<< "titre"`, pas `wc -c`
- [ ] `ogTitle` suit la formule tension arithmétique Trading852
- [ ] `description` 150-160 chars
- [ ] `ogImageAlt` présent si `ogImage` ≠ image OG par défaut

**Jargon — passe obligatoire**
- [ ] Key Takeaway : zéro terme technique non défini (lire la box seule — si un mot nécessite un dictionnaire financier, le réécrire)
- [ ] Passe jargon complète sur le corps : vérifier chaque terme de la table "Passe jargon obligatoire" ci-dessus
- [ ] Tout acronyme ou nom propre non universel est défini à sa première occurrence (UAF, P/B, Trian Partners, HKMA, etc.)
- [ ] **Acronymes propres à l'entreprise (segments, divisions, programmes) : `grep -oE '\b[A-Z]{2,4}\b' DRAFT/<file>.html | sort -u`. Chaque acronyme retourné qui n'est pas dans la whitelist (cf. section Lite) est défini *une seule fois* puis remplacé par sa traduction grand public dans tout le reste du corps. Si l'acronyme apparaît 3+ fois après sa définition, la règle a failli — réécrire la section concernée.**
- [ ] Titre : passer le test du lecteur zéro-contexte — retirer tous les noms propres et métriques techniques, la tension tient-elle ?

**Voix — la cadence**
- [ ] **Longueur de phrases : zéro phrase de plus de 30 mots** (commande `awk` citée section Voix). Moyenne 15–25 mots.
- [ ] **Densité de chiffres : aucune grappe de 4+ phrases-chiffres consécutives sans phrase d'interprétation** entre les chiffres. Lire le Key Takeaway et le hook à voix haute : si on récite une liste de nombres, réécrire.
- [ ] Chaque chiffre clé est re-cadré en plain English dans la phrase qui suit son apparition (pas seulement défini techniquement)
- [ ] La phrase d'observation est isolée (paragraphe d'une seule phrase, ouverture ou clôture de section) — pas noyée entre deux paragraphes de chiffres

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
