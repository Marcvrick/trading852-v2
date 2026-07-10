---
title: Instagram — Posts
tags: [instagram, social, posts, trading852]
category: Trading/Social
type: wiki
created: 2026-07-01
---

# Instagram — Posts

**Compte :** @trading852
**Dossier de drop :** `Trading852-v2/IG post/`
**Last updated:** 2026-07-01

---

## Structure des dossiers

```
Trading852-v2/
└── IG post/                         ← JPEG uniquement à la racine
    ├── ig-post-{N}-{slug}.jpg       ← un JPEG par post, prêt à poster
    └── HTML IG/                     ← sources HTML + images de travail
        └── ig-post-{N}-{slug}/
            ├── ig-post-{N}-{slug}.html
            └── cover.jpg            ← image source utilisée dans le post
```

**Règle absolue :** racine `IG post/` = JPEG uniquement, pas de HTML ni sous-dossiers.

---

## Procédure complète

### Étape 1 — Identifier la source

Chaque post IG est adossé à un article publié sur trading852.com. Localiser le fichier source dans `publish/analyses/{slug}.html` ou la version Markdown dans `DRAFT/` si pas encore publié.

Extraire :
- **Hook** : l'anomalie ou la tension centrale de l'article — formulée comme une question ou une contradiction, pas comme une conclusion
- **Donnée clé** : un seul fait chiffré qui confirme que quelque chose existe, sans expliquer pourquoi
- **Ticker** : symbole + bourse (`1361.HK`, `AAPL`, etc.)
- **Chemin image** : visuel de fond (ne pas reprendre les graphiques de valorisation — préférer une image évocatrice)

### Étape 2 — Générer le HTML

Créer un fichier HTML dans `IG post/HTML IG/ig-post-{N}-{slug}/` en suivant le design Trading852 (palette ci-dessous).

Variables à remplacer :

| Variable | Exemple |
|----------|---------|
| `{N}` | `01` |
| `{SLUG}` | `geely-decote-cachee` |
| `{TICKER}` | `175.HK` |
| `{TITRE_COURT}` | Geely : une décote que le marché ignore |
| `{ACCROCHE}` | 1-2 phrases directes, voix analytique |

Chemin image dans le HTML (depuis le sous-dossier `ig-post-{N}-{slug}/`) :
```
./cover.jpg
```

### Étape 3 — Générer le JPEG

```bash
# 1. Générer PNG (Puppeteer via IG Creator) — portrait par défaut
cd "/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/Knowledge-base/IG creator"
node html2ig.js \
  "/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/IG post/HTML IG/ig-post-{N}-{slug}/ig-post-{N}-{slug}.html" \
  --out="$TMPDIR/ig_out_{N}"

# 2. PNG → JPEG 90% → dossier final
sips -s format jpeg -s formatOptions 90 \
  "$TMPDIR/ig_out_{N}/ig-post-{N}-{slug}/slide_01.png" \
  --out "/Users/mc/Library/Mobile Documents/com~apple~CloudDocs/MarcOS/TRADING/Trading852-v2/IG post/ig-post-{N}-{slug}.jpg"
```

> `html2ig.js` utilise `pathToFileURL()` — les espaces dans le chemin iCloud sont encodés automatiquement.

### Étape 4 — Vérifier

- Afficher le JPEG dans la conversation
- Vérifier : lisibilité du titre, ticker visible, recadrage photo, fond cohérent
- Mauvais recadrage → ajuster `object-position` dans le HTML et relancer l'étape 3

---

## Palette Trading852

| Rôle | Hex |
|------|-----|
| Fond principal | `#0D1117` noir profond |
| Accent primaire | `#F5A623` orange Trading852 |
| Texte principal | `#FFFFFF` blanc |
| Texte secondaire | `#8B9BAE` gris ardoise |
| Badge conviction | `#1A7F4B` vert |
| Badge monitor | `#B8860B` ambre |
| Badge avoid | `#8B1A1A` rouge sombre |

**Format : portrait uniquement (1080×1350).** Ne jamais générer en carré — le format vertical maximise la surface dans le feed et les Stories. Ne pas passer `--square`.

---

## Principe narratif — Curiosity Gap (obligatoire)

Le post IG n'est pas un résumé de l'article. C'est une amorce qui crée un manque.

**Règle centrale :** poser un écart entre ce que le lecteur sait et ce qu'il veut savoir. Le post ne répond pas — il ouvre la question. La réponse est sur le site.

### Structure du visuel

1. **Hook (premier plan)** : une tension, une anomalie, un chiffre qui surprend sans être expliqué. Le lecteur doit froncer les sourcils.
2. **Donnée clé (un seul fait)** : un élément concret qui confirme que quelque chose d'intéressant existe — sans livrer le raisonnement.
3. **CTA** : "Analyse complète : lien dans la bio." (deux-points, jamais de tiret cadratin)

**Ce qu'on ne met pas sur le visuel :** la conclusion, la thèse complète, les multiples de valorisation détaillés, les comparaisons de pairs. Ces éléments appartiennent à l'article.

### Exemples de formulation

| A éviter (résumé) | A utiliser (curiosity gap) |
|---|---|
| "Geely se négocie à 6x EV/EBIT, sous sa moyenne historique de 9x" | "Geely vaut moins que ses stocks de trésorerie. Le marché voit quelque chose — ou rate quelque chose." |
| "Le catalyseur est la reprise des ventes NEV en 2025" | "Les ventes NEV ont doublé. Le titre n'a pas bougé." |

### Caption IG (légende)

La légende prolonge le hook — elle ne livre pas la réponse non plus. Terminer par une question ouverte ou une tension non résolue, puis le CTA.

Structure :
```
[Tension ou anomalie en 1-2 phrases]
[Une donnée qui intrigue, sans l'expliquer]
[Question ou affirmation qui force la continuation mentale]
Analyse complète : lien dans la bio.
```

Référence : [[Curiosity & Intrigue in Storytelling]] (`Knowledge-base/Narrative Principles/`)

---

## Carousel IG — format standard par titre (template validé 2026-07-02)

> Validé sur le carousel 361 Degrees (1361.HK). La 1ʳᵉ génération (8 slides) déballait toute la
> thèse (pairs, scénarios, « BUY ») + rouge HK en accent partout — **rejeté**. Le template retenu
> combine le **design de la v1** (mood éditorial) et le **narratif + format de la v2**.
>
> **Template canonique (à réutiliser / dupliquer) :**
> `Trading852-v2/Instagram/Trading852 Carousel (standalone)-2.html`

**Le carousel est un TEASER, jamais un résumé** — son seul job est de rendre l'article nécessaire.
**Le rester court.** Le template retenu = **6 slides**, chacune mono-idée ; ne jamais dépasser 6,
viser aussi serré que l'histoire le permet. Rien ne se résout sur les slides, la réponse est sur le site.

**Arc du template (6 slides, la tension monte, rien ne se résout) :**
1. **Cover** — l'accroche : une tension / le titre + ticker + tag secteur. Pas de chiffre-argument.
2. **The Business** (narratif positif) — ce que la boîte fait bien, cadrage positif. Met en place le
   décalage à venir, sans conclure.
3. **The Turn** (le prix) — ce qu'a fait le marché / le prix. Le déconnecté business ↔ cours.
4. **The Twist** — la contradiction la plus nette (l'anomalie), sans l'expliquer.
5. **The Question** — la question ouverte, non résolue. Le lecteur doit vouloir la réponse.
6. **Closer / CTA** — « Analyse complète : lien dans la bio. » + wordmark + ticker.

**Ne JAMAIS mettre sur les slides** (ça appartient à l'article) : le verdict / la reco (« BUY »,
« sous-évalué », une note), le POURQUOI de l'anomalie (catalyseur expliqué, « parce que… »), la
thèse complète, les multiples de valorisation **en argument**, les cibles de prix, les tableaux de
pairs / scénarios / risques. **Test :** si on peut lire le carousel et connaître la conclusion sans
ouvrir l'article, c'est raté.

**Specs visuelles exactes (extraites du template) :**
- Portrait **1080×1350** par slide, un `<section>` par slide, HTML autonome. Fond **`#0D1117`** sur
  les 6 slides (canvas cohérent).
- Type : **Newsreader** (serif, fallback `Georgia, serif`) pour les phrases héro · **IBM Plex Mono**
  pour eyebrow / ticker / meta / index. Texture dot-grid discrète + chiffre-fantôme surdimensionné.
- Couleurs : texte primaire crème **`#EDE8DB`**, secondaire **`#8B9BAE`**, tertiaire/faint `#565661`.
  **Accent = orange Trading852 `#F5A623`** (eyebrow, filet, soulignement CTA, petits repères).
  **Rouge drapeau HK `#DE2910` = touche d'identité RARE** (marqueur/dot), jamais l'accent de travail,
  jamais près d'un prix / % / ticker (se lit « perte »).
- Une seule idée dominante par slide : eyebrow (mono) → phrase héro (serif, ~120px+) → une ligne
  d'appui. Marges ~72–80px, beaucoup de noir, le fait respire.
- Footer constant : ticker + wordmark + index (`01/06`). Petit « → » de swipe sauf sur le closer.
  Lisible sous compression IG (corps ≥ ~36px, pas de graisses fines sur fond sombre).

### Génération des JPEG (automatique)

> **Le plus simple : la skill `/ig-852`** enchaîne tout (sourcer l'article → écrire les 6 slides
> teaser → remplir le template → générer les JPEG → vérifier). Le script ci-dessous est l'étape de
> rendu qu'elle appelle, utilisable seule.

**Un dossier par projet** sous `Instagram/IG slides/{slug}/`, contenant le HTML + les JPEG (+ les
PNG source dans `_png/`). `{slug}` = `{ticker}-{société-kebab}` (ex. `1361-361-degrees`).

```bash
cd "…/Trading852-v2/Instagram"
./generate-carousel.command <chemin-du-html> [slug] [--2x]
# ex : ./generate-carousel.command "Trading852 Carousel (standalone)-2.html" 1361-361-degrees
```

Ce que fait le script (`generate-carousel.command`) :
1. crée `IG slides/{slug}/` et y **copie le HTML** en `{slug}.html` (dossier auto-suffisant) ;
2. rend chaque `<section>` en PNG via `html2ig.js` (Puppeteer / Chrome for Testing, sélecteur
   `section`, rendu ×2 pour la netteté) ;
3. convertit chaque PNG en `{slug}-NN.jpg` (sips, qualité 92), **ré-échantillonné à 1080×1350 par
   défaut** ;
4. garde les PNG source dans `_png/` pour ré-export.

Sortie : `IG slides/{slug}/{slug}-01.jpg … -06.jpg` en **1080×1350** (format IG par défaut ; ajouter
`--2x` pour un export retina 2160×2700). Double-cliquable depuis le Finder (demande le chemin du HTML
si lancé sans argument). Pré-requis : `~/node_modules/puppeteer-core` + Chrome for Testing (déjà
installés). iCloud → sandbox off. Vérifier : afficher `{slug}-01.jpg` (lisibilité titre, ticker,
accent orange, recadrage).

---

## Règles de rédaction

- **Ton analytique, direct** — jamais de conditionnel mou ni de superlatif
- **Pas de conseil financier** — pas de "acheter", "vendre", "position"
- **CTA fixe :** "Analyse complète : lien dans la bio." (jamais "link in bio", jamais de tiret cadratin)
- **Pas d'emojis dans le visuel** (ok dans la légende IG, pas dans le graphisme)
- **Toujours le ticker** sur le visuel — format `HKEX:175` ou `175.HK` selon contexte
- **Pas de références internes** (FinRatios, Sophie, "notre analyse précédente")
- **Pas de tiret cadratin** (—) nulle part

---

## Nomenclature des fichiers

```
ig-post-{N}-{slug}.jpg
```

- `{N}` : numéro séquentiel à 2 chiffres (`01`, `02`, ...)
- `{slug}` : slug de l'article adossé, en kebab-case (`geely-decote-cachee`)

---

## Fallback si html2ig.js indisponible

Script de secours Puppeteer dans `Knowledge-base/IG creator/` (voir `html2ig.js` — le script accepte n'importe quel HTML, pas seulement les templates pharma).

---

## Related pages

- [[editorial]]
- [[style-guide]]
- [[articles]]
