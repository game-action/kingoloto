# GameAction/kingoloto

This repository created to play on kingoloto website and play grids

## 💻 Usage

### TypeScript

```typescript
import { Kingoloto } from "@game-action/kingoloto";

// to connect
const king = await Kingoloto.init("email", "password");

// fetch summary information
const summary = await king.summary();
console.log(summary); // Summary { grid: 10, cash: 0.06, point: 6750 }

// play grid, max of 10 per day
const grid = await king.playGrid();
console.log(grid); // true or false
```

## 📄 License

- Code: [MIT](./LICENSE) © [Rémy BRUYERE](https://remy.ovh)

<p align="center">
  <sub>An open source project by <a href="https://remy.ovh">rem42</a></sub>
</p>
