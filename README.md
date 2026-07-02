# qznt

**qznt** (pronounced as in _ex-quisite_) is a lightweight, typed, high-performant utility toolkit for modern TypeScript/JavaScript and Node.js environments.

## 🚀 Installation

```bash
npm install qznt
# or
pnpm add qznt
# or
yarn add qznt
```

## 🛠 Quick Start

```ts
import { getProp, formatETA } from "qznt";

// Nested object access (defaults to "dark" if mode ends up being undefined)
const theme = getProp(settings, "ui.theme.mode", "dark");

// Readable durations
const time = formatETA(Date.now() + 5000); // "in 5 seconds"
```

## ✨ Featured Utilities

### The Smart `Loop`

`Loop` ensures async tasks never overlap. It waits for execution to finish before scheduling the next interval, and supports precise pausing/resuming. _This is more lightweight than using `node-cron` for tasks that don't need scheduling._

```ts
import { Loop, parseTime } from "qznt";

const heartbeat = new Loop<string>(syncData, parseTime("10s"));

// Result is inferred as 'string'
heartbeat.on("tick", res => console.log(`Synced: ${res}`));

heartbeat.pause(); // Calculates remaining time in the current cycle
heartbeat.resume(); // Resumes with the exact remaining delay
```

### Advanced Caching & Storage

`qznt` provides high-performant data persistence and memory management.

- `Cache`: An in-memory TTL cache with Sampled Passive/Active Eviction. It automatically purges expired entries to prevent memory leaks without blocking the event loop.
- `Storage`: A persistent cache. It automatically uses `localStorage` in browsers and falls back to local JSON files in Node.js environments. Think a mini, smart-Redis cache.

```ts
import { Cache, Storage } from "qznt";

// Cache with a 1-minute global TTL
const userCache = new Cache<UserData>(60000);
userCache.set("user_1", data);

// Persistent storage (Browser or NodeJS based)
const settings = new Storage("app_settings");
settings.set("theme", "dark");
```

### Seedable Randomness

Every random utility in `qznt` accepts an optional seed. This allows you to generate predictable random data for testing, games, or procedural generation.

```ts
import { rndChoice } from "qznt";

// Always returns the same item for seed 12345
const item = rndChoice(["Sword", "Shield", "Potion"], 12345);
```

### Object Merging

A deep, recursive merge that maintains type safety across multiple sources.

```ts
import { merge } from "qznt";

const config = merge(defaultConfig, userConfig, envOverrides);
```

### Type Guards

`qznt` provides predicates that act as type guards, ensuring type safety across your app.

```ts
// Check if the provided date is from today
if (isToday(user.lastLogin)) {
    console.log("Welcome back!");
}

// Check if the `results` array is empty
if (isEmpty(results)) {
    return "No data found";
}
```

## 👀 Mentionables

- Zero Dependencies: Lightweight and fast.
- Tree-Shakable: Only bundle the functions you actually use.
- Strictly Typed: Deep inference for everything from EventEmitter results to object paths.
- Node & Browser: Optimized for Node.js but safe for modern browsers.

## 👋 About

_Built by **@xsqu1znt** as a core library for my projects._ Published for anyone to use.

License: MIT
