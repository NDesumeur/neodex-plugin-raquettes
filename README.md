# Raquettes

Un duel de raquettes contre l'ordinateur sur un terrain de nuit : renvoie la balle sans la laisser passer. Le premier à 7 points gagne, et la balle accélère à chaque échange.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** (ta raquette suit le pointeur) ou **↑ ↓** : déplacer ta raquette, à gauche du terrain.
- **Clic**, **Espace** ou **Entrée** : commencer la partie, reprendre après une pause, rejouer à la fin.
- **P** : pause.

## Règles

- La balle rebondit sur les bords du haut et du bas. Si elle passe derrière une raquette, l'autre joueur marque le point.
- Celui qui vient de perdre le point reçoit le service suivant.
- Le **bord** de la raquette renvoie la balle en biais, le **centre** la renvoie droite : vise les coins pour déborder l'ordinateur.
- La balle accélère à chaque échange : les longs échanges sont les plus durs. Le nombre d'échanges s'affiche à partir de 4.
- Le premier à **7 points** gagne.

## L'adversaire

L'ordinateur calcule où la balle va arriver, rebonds compris, avec une petite erreur, et ne réagit qu'une fois la balle assez près de son camp.

- **Facile** : lent, se trompe souvent, réagit tard.
- **Normal** : plus rapide et plus précis.
- **Difficile** : rapide, presque sans erreur, réagit très tôt.

## Statistiques

Victoires sur parties jouées, et meilleur écart de points pour le niveau choisi. En fin de partie, le score et le plus long échange sont affichés.

## Données et synchronisation

Tes victoires, ton meilleur écart par niveau et le niveau choisi sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Raquettes → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
