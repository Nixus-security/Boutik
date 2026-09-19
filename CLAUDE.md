# Directives UI & Design (Anti-Vibecoding)

Lors de la création ou modification de composants UI (React, Tailwind, CSS), respecte STRICTEMENT ces règles anti-vibecoding :

1. **Pas de dégradé violet vers bleu** : Préfère des fonds unis ou neutres.
2. **Pas de texte en dégradé** : Évite `bg-gradient-to-r` + `text-transparent` sur les titres.
3. **Pas d'émojis dans les titres** (`<h1>`-`<h6>`).
4. **Pas d'Inter partout** : Ne mets pas la police Inter par défaut.
5. **Pas de bordures colorées/lumineuses** sur les cartes (`border-purple-500/50`).
6. **Pas de cartes en Glassmorphism** (`backdrop-blur` semi-transparente).
7. **Mode sombre à fort contraste** : Pas de texte gris sur fond sombre peu lisible.
8. **Pas de grille de 3 icônes centrées classique** pour les fonctionnalités.
9. **Pas de petit badge/pillule** ("NEW ✨") au-dessus des titres principaux.
10. **Ne pas dépendre uniquement de Lucide React** : Varie avec Phosphor, Heroicons ou SVG custom.
11. **Personnalise shadcn/ui** : Ne laisse pas le design brut/par défaut de shadcn.
12. **Pas d'animation Fade-in-up basique** sur le scroll.
13. **Pas d'effet de lumière qui suit le curseur** (Cursor-following beam).
14. **Pas de simple `opacity-80` au survol des boutons** : Utilise de vrais changements de couleur/élévation.
15. **Espacement strictement cohérent** : Suis la grille de spacing.
16. **Pas de cadratins (Em dashes "—")** dans le texte/UI.
17. **Pas de texte d'accroche générique "IA/Buzzwords"** (ex: "Supercharge your workflow...").
18. **Pas de mots en italique serif** au milieu de titres sans-serif.
19. **Pas de combo de polices cliché** (Space Grotesk + Instrument Serif).
20. **Pas de texture de bruit (grain) sur les dégradés**.

# Directives de Copywriting & Contenu (Anti-AI SLOP)
Bannir le vocabulaire "ChatGPT/IA" clichées : Interdiction d'utiliser les mots/expressions : "Plongez dans", "Révolutionnaire", "Débloquez le potentiel", "Synergie", "Paysage numérique", "Phare d'espoir", "Tisser", "Incontournable".

Pas de transitions robotiques : Ne jamais commencer un paragraphe par "En conclusion", "Il est important de noter que", ou "Dans le monde rapide d'aujourd'hui".

Ton direct, concis et humain : Utilise la voix active. Si une idée tient en une ligne, ne génère pas un paragraphe de 4 lignes.

Limiter les listes à puces automatiques : Si un concept peut s'expliquer en deux phrases fluides, ne crée pas systématiquement une structure avec 3 puces (le syndrome classique de l'IA).

Pas de métaphores filées absurdes : Reste factuel, surtout dans les interfaces SaaS, techniques ou e-commerce.


# Directives de Sécurité (DevSecOps)
Zéro secret codé en dur : Ne JAMAIS inclure de clés d'API, de tokens ou de mots de passe dans le code (même pour des "tests"). Utilise toujours les variables d'environnement (ex: process.env, import.meta.env).

Sanitization stricte des Inputs (Anti-XSS/SQLi) : Toujours valider et nettoyer les entrées utilisateur côté serveur ET côté client (privilégier des schémas comme Zod). Ne jamais injecter de HTML brut (dangerouslySetInnerHTML) sans une librairie d'assainissement (ex: DOMPurify).

Gestion silencieuse des erreurs en production : Ne jamais exposer de Stack Traces ou de messages d'erreur de base de données à l'utilisateur final. Renvoie des messages d'erreur génériques et bienveillants.

Principe du moindre privilège pour les données : Ne renvoie au front-end que les champs strictement nécessaires. Pas de SELECT * ou de renvoi de l'objet User complet si seule la photo de profil est requise.

Politique de sécurité par défaut : Lors de la configuration de serveurs ou de middlewares, implémenter par défaut des en-têtes sécurisés (CORS restrictifs, CSP - Content Security Policy).



# Directives Design Étendu, UX & Accessibilité (Suite Anti-Vibecoding)
Accessibilité (A11y) non-négociable : Toujours utiliser du HTML sémantique (<main>, <article>, <nav>). Inclure systématiquement les attributs alt pour les images et aria-label pour les icônes sans texte.

Interdiction du outline: none sans alternative : Ne jamais supprimer le contour de focus natif sans le remplacer par un état visuel clair pour la navigation au clavier (ex: focus-visible:ring-2 focus-visible:ring-offset-2).

Tailles tactiles (Touch targets) respectées : Tout élément cliquable (bouton, lien, icône) doit avoir une zone d'interaction minimale de 44x44px pour le mobile.

Pas de spinners de chargement plein écran inutiles : Préfère des Skeleton loaders contextuels ou un état de chargement intégré au composant (ex: un petit spinner à l'intérieur du bouton cliqué qui passe en disabled).

Des "Empty States" (états vides) actionnables : Un tableau ou une liste vide ne doit pas juste dire "Aucun résultat". Il doit inclure une illustration neutre, une phrase d'explication et un bouton (Call-to-Action) pour créer le premier élément.

Respect du prefers-reduced-motion : Désactiver ou réduire drastiquement les animations CSS/Framer Motion si l'utilisateur a configuré son OS pour réduire les mouvements.

Contraste strict des couleurs : Ne jamais écrire en gris clair sur fond blanc ou gris moyen sur fond noir. Viser au minimum le standard WCAG AA (ratio de 4.5:1 pour le texte normal).



ENLEVER LE HORIZONTALE SIFTHING!!!!!!!!!!!!!