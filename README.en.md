# Raquettes (Paddles)

A paddle duel against the computer on a night-time court: return the ball without letting it past. The first to 7 points wins, and the ball speeds up with every exchange.

*Version française : [README.md](README.md)*

## Controls

- **Mouse** (your paddle follows the pointer) or **↑ ↓**: move your paddle, on the left of the court.
- **Click**, **Space** or **Enter**: start the game, resume after a pause, play again at the end.
- **P**: pause.

## Rules

- The ball bounces off the top and bottom edges. If it gets past a paddle, the other player scores.
- Whoever just lost the point receives the next serve.
- The **edge** of the paddle sends the ball back at an angle, the **centre** sends it straight: aim for the corners to get past the computer.
- The ball speeds up with every exchange: long rallies are the hardest. The rally count shows from 4 exchanges.
- The first to **7 points** wins.

## The opponent

The computer works out where the ball will arrive, bounces included, with a small error, and only reacts once the ball is close enough to its side.

- **Easy**: slow, often wrong, reacts late.
- **Normal**: faster and more accurate.
- **Hard**: fast, almost error-free, reacts very early.

## Statistics

Wins out of games played, and the best point margin for the chosen level. At the end of a game, the score and the longest rally are shown.

## Data and sync

Your wins, best margin per level and chosen level are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Raquettes → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
