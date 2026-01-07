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

You can import this library as `qznt`, `$`, or by namespace.

```ts
import qznt from "qznt";
// or
import { $ } from "qznt";
// or
import { obj, Loop, date } from "qznt";

// Nested object access (defaults to "dark" if mode is undefined)
const theme = qznt.obj.get(settings, "ui.theme.mode", "dark");

// Readable durations
const time = $.date.duration(Date.now() + 5000); // "in 5 seconds"
```

## 📦 Namespaces

- **`qznt.arr` (Arrays)**: Advanced `chunk`, `cluster`, `shuffle`, `unique`, and `seqMap`
- **`qznt.async` (Promises)**: `retry` logic with exponential backoff and delay
- **`qznt.date` (Time)**: Shorthand parsing (`"1h 30m"`), `duration` (digital/hms), and `eta`
- **`qznt.fn` (Functions)**: `memoize` with TTL and custom resolvers
- **`qznt.format` (Strings)**: `currency`, `memory` (bytes), `ordinal`, and `compactNumber`
- **`qznt.fs` (File System)**: Efficient recursive directory scanning with `readDir`
- **`qznt.is` (Predicates)**: Type guards: `is.today`, `is.empty`, `is.object`, and `is.sorted`
- **`qznt.math` (Calculations)**: `lerp`, `invLerp`, `remap`, `percent`, and `sum`
- **`qznt.num` (Numbers)**: Essential logic like `clamp` and range handling
- **`qznt.obj` (Data)**: Type-safe deep paths (`get`, `set`, `merge`, `pick`, `omit`)
- **`qznt.rnd` (Random)**: Seedable PRNG, `weighted` choice, `sampler`, and `chance`
- **`qznt.timing` (Execution)**: `debounce`, `throttle`, and promise-based `wait`
- **`qznt.to` (Transformations)**: Powerful data mappers like `to.record`

_These are just the highlights, there's more inside._

## ✨ Featured Utilities

### The Smart `Loop`

`qznt.Loop` ensures async tasks never overlap. It waits for execution to finish before scheduling the next interval, and supports precise pausing/resuming. _This is usually more efficient than `node-cron` for tasks that don't need scheduling._

```ts
import qznt from "qznt";

const heartbeat = new qznt.Loop<string>(async () => {
    return await syncData();
}, qznt.date.parse("10s"));

// Result is automatically inferred as 'string'
heartbeat.on("tick", res => console.log(`Synced: ${res}`));

heartbeat.pause(); // Calculates remaining time in the current cycle
heartbeat.resume(); // Resumes with the exact remaining delay
```

### Advanced Caching & Storage

`qznt` provides high-performant data persistence and memory management.

- `qznt.Cache`: An in-memory TTL cache with Sampled Passive/Active Eviction. It automatically purges expired entries to prevent memory leaks without blocking the event loop.
- `qznt.Storage`: A persistent cache. It automatically uses `localStorage` in browsers and falls back to local JSON files in Node.js environments. Think a mini, smart-Redis cache.

```ts
// Cache with a 1-minute global TTL
const userCache = new qznt.Cache<UserData>(60000);
userCache.set("user_1", data);

// Persistent storage (Browser or Node)
const settings = new qznt.Storage("app_settings");
settings.set("theme", "dark");
```

### Seedable Randomness

Every random utility in `qznt.rnd` accepts an optional seed. This allows you to generate predictable random data for testing, games, or procedural generation.

```ts
// Always returns the same item for seed 12345
const item = qznt.rnd.choice(["Sword", "Shield", "Potion"], 12345);
```

### Object Merging

A deep, recursive merge that maintains type safety across multiple sources.

```ts
const config = qznt.obj.merge(defaultConfig, userConfig, envOverrides);
```

### Type Guards

The `qznt.is` namespace provides predicates that act as type guards, ensuring type safety across your app.

```ts
if (qznt.is.today(user.lastLogin)) {
    console.log("Welcome back!");
}

if (qznt.is.empty(results)) {
    return "No data found";
}
```

### Type-Safe Transformations

The `qznt.to` and `qznt.arr` namespaces also provide _✨ exquisite ✨_ ways to transform data structures while maintaining type safety.

```ts
const userRecord = qznt.to.record(usersArray, u => ({
    key: u.id,
    value: { name: u.username, active: qznt.is.today(u.lastLogin) }
}));
```

## 👀 Mentionables

- Zero Dependencies: Lightweight and fast.
- Tree-Shakable: Only bundle the functions you actually use.
- Strictly Typed: Deep inference for everything from EventEmitter results to object paths.
- Node & Browser: Optimized for Node.js but safe for modern browsers.

## 👋 About

_Built by **@xsqu1znt** as a core library for my projects._ Published for anyone to use.

License: MIT
