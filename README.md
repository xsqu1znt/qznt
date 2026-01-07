# qznt

**qznt** (pronounced as in _ex-quisite_) is a strictly-typed, high-performant utility toolkit for modern TypeScript/Javascript and Node.js environments.

## 🚀 Installation

```bash
npm install qznt
# or
pnpm add qznt
# or
yarn add qznt
```

## 🛠 Quick Start

You can import the global toolkit as $, qznt, or specific namespaces.

```ts
import $ from "qznt";
// or
import { qznt } from "qznt";
// or
import { obj, Loop, date } from "qznt";

// Deep object access (defaults to "dark" if mode is undefined)
const theme = $.obj.get(settings, "ui.theme.mode", "dark");

// Human-readable durations
const timeRemaining = $.date.duration(Date.now() + 5000); // "5 seconds"
```

## 📦 Namespaces

- **`$.obj` (Data)**: Type-safe deep paths (`get`, `set`, `merge`, `pick`, `omit`)
- **`$.arr` (Lists)**: Advanced `chunk`, `cluster`, `shuffle`, `unique`, and `seqMap`
- **`$.rnd` (Random)**: Seedable PRNG, `weighted` choice, `sampler`, and `chance`
- **`$.timing` (Execution)**: `debounce`, `throttle`, and promise-based `wait`
- **`$.date` (Time)**: Shorthand parsing (`"1h 30m"`), `duration` (digital/hms), and `eta`
- **`$.is` (Predicates)**: Type guards: `is.today`, `is.empty`, `is.object`, and `is.sorted`
- **`$.format` (Strings)**: `currency`, `memory` (bytes), `ordinal`, and `compactNumber`
- **`$.math` (Calculations)**: `lerp`, `invLerp`, `remap`, `percent`, and `sum`
- **`$.fn` (Functions)**: `memoize` with TTL and custom resolvers
- **`$.async` (Promises)**: `retry` logic with exponential backoff and delay
- **`$.to` (Transformations)**: Powerful data mappers like `to.record`
- **`$.num` (Numbers)**: Essential logic like `clamp` and range handling

## ✨ Featured Utilities

### The Smart `Loop`

The `qznt.Loop` ensures asynchronous tasks never overlap. It waits for execution to finish before scheduling the next interval and supports precise pausing/resuming based on remaining time.

```ts
import $ from "qznt";

const heartbeat = new $.Loop<string>(async () => {
    return await syncData();
}, $.date.parse("10s"));

// Result is automatically inferred as 'string'
heartbeat.on("tick", res => console.log(`Synced: ${res}`));

heartbeat.pause(); // Calculates remaining time in the current cycle
heartbeat.resume(); // Resumes with the exact remaining delay
```

### Advanced Caching & Storage

`qznt` provides high-performant data persistence and memory management.

- `$.Cache`: An in-memory TTL cache with Sampled Passive/Active Eviction. It automatically cleans up expired entries to prevent memory leaks without blocking the event loop.
- `$.Storage`: A universal persistence layer. It automatically uses `localStorage` in the browser and falls back to a local JSON file in Node.js environments.

```ts
// Cache with a 1-minute global TTL
const userCache = new $.Cache<UserData>(60000);
userCache.set("user_1", data);

// Persistent storage (Browser or Node)
const settings = new $.Storage("app_settings");
settings.set("theme", "dark");
```

### Seedable Randomness

Every random utility in `qznt` accepts an optional seed. This allows you to generate predictable random data for testing, games, or procedural generation.

```ts
// Always returns the same item for seed 12345
const item = $.rnd.choice(["Sword", "Shield", "Potion"], 12345);
```

### Object Merging

A deep, recursive merge that maintains TypeScript's type safety across multiple sources.

```ts
const config = $.obj.merge(defaultConfig, userConfig, envOverrides);
```

### Type Guards

The `is` namespace provides predicates that act as TypeScript type guards, ensuring safety across your application.

```ts
if ($.is.today(user.lastLogin)) {
    console.log("Welcome back!");
}

if ($.is.empty(results)) {
    return "No data found";
}
```

### Type-Safe Transformations

The `to` and `arr` namespaces provide _exquisite_ ways to transform data structures while maintaining total type safety.

```ts
const userRecord = $.to.record(usersArray, u => ({
    key: u.id,
    value: { name: u.username, active: $.is.today(u.lastLogin) }
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
