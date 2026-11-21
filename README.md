[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/RaynaldyRyan/spot-the-difference-game/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/RaynaldyRyan/spot-the-difference-game/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# The Cloud Cartographer's Lost Forecast

A spot-the-difference game for [make.fun's best spot the difference game bounty](https://make.fun/c/best-spot-the-difference-game-20261121-0451).

Two near-identical pictures of a floating weather station, side by side. Click a
difference in either picture to mark it in both. Four connected scenes in a bold
cut-paper style — a cloud greenhouse, a storm archive, a rooftop kite observatory,
and the inside of a migrating thundercloud — with 8 differences each, 32 in all.

- Fair, describable differences: objects added or removed, counts, poses,
  patterns and states — never one-pixel tests
- Generous hit areas, a pulsing find mark on both panels, sparkles and a soft chime
- Hints that glow broadly toward a hidden difference (50 pts, never a giveaway)
- A visible countdown bar, scoring with streak bonuses, and a time bonus per scene
- Keyboard play: arrows move a mirrored cursor, Enter marks, H hints, M mutes
- All art drawn procedurally in code; all sound synthesized in code; plays fully offline

## Play

```sh
node serve.ts
```

then open http://localhost:8080 in desktop Chrome. Or serve `game/` with any
static server — `game/index.html` plays with no network request.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
