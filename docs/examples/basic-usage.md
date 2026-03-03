# qznt Basic Usage Examples

## Setup

```typescript
// Direct imports (preferred for tree-shaking)
import { chunk, compact } from "qznt/arr";
import { retry, wait } from "qznt/async";
import { clamp, lerp } from "qznt/math";

// Or use the default export if direct imports cause naming conflictions or is confusing
import qznt from "qznt";
```

## Array Utilities (arr)

```typescript
// Split into chunks for pagination
chunk([1, 2, 3, 4, 5], 2); // [[1,2], [3,4], [5]]

// Filter null/undefined
compact([0, 1, null, undefined, false]); // [1]

// Remove duplicates by key
unique(users, u => u.id);

// Sort by multiple properties
sortBy(users, [u => u.age, u => u.name], "desc");

// Group by key for pagination
cluster(items, i => i.category, 10);
```

## Async Utilities (async)

```typescript
// Retry with exponential backoff
await retry(fetchData, { retries: 3, delay: 500 });

// Wait/delay
await wait(1000);
```

## Function Utilities (fn)

```typescript
// Memoize with custom key and TTL
const getUser = memoize(fetchUser, {
    resolver: id => id,
    maxAge: 60000 // 1 minute cache
});
getUser.clear(); // manual cache clear
```

## Date & Time (date)

```typescript
// Parse shorthand strings
parse("1h30m"); // 5400000 ms
parse("2d", { unit: "s" }); // 172800 seconds

// Format duration
duration(3661000, "hms"); // "1h 1m 1s"
duration(3661000, "digital"); // "01:01:01"
```

## Formatting (format)

```typescript
currency(1234.56, { currency: "EUR", locale: "de-DE" }); // "1.234,56 €"
compactNumber(1500000); // "1.5M"
number(1234567, { precision: 2 }); // "1,234,567.00"
ordinal(21); // "21st"
```

## Math Utilities (math)

```typescript
clamp(15, 0, 10); // 10 (clamped)
lerp(0, 100, 0.5); // 50
remap(500, 0, 1000, 0, 1); // 0.5
percent(30, 40); // 75
```

## Object Utilities (obj)

```typescript
// Nested path access
get(data, "users[0].profile.name");
set(data, "users[0].profile.name", "New Name");
has(data, "users[0].profile"); // true

// Deep merge
merge(base, { a: 1 }, { b: 2 });

// Pick/omit keys
pick(user, ["id", "name"]);
omit(user, ["password", "token"]);
```

## Randomness (rnd)

```typescript
choice(items); // random item
int(1, 10); // random integer 1-10
str(16, "alphanumeric"); // random string
chance(0.3); // 30% chance true

// Weighted random (O(1) lookup)
const sampler = sampler(items, i => i.weight);
sampler.pick();
```

## Timing (timing)

```typescript
const debounced = debounce(fn, 300, { immediate: true });
debounced.cancel();

const throttled = throttle(fn, 100);
```

## Core Classes

```typescript
// Pipe function chaining
Pipe(user)
    .pipe(u => validate(u))
    .pipe(u => transform(u))
    .pipe(u => save(u));

// Persistent storage (Node: JSON file, Browser: localStorage)
const store = new Storage("settings");
store.set("theme", "dark");
store.get("theme");
store.has("theme");
store.remove("theme");

// In-memory cache with TTL
const cache = new Cache<string>();
cache.set("key", "value", 5000); // 5 second TTL
cache.get("key");

// Managed async interval
const loop = new Loop(async loop => {
    console.log("tick");
    return await fetchData();
}, 1000);

loop.on("tick", result => {
    console.log(result);
});
loop.on("error", err => {
    console.error(err);
});

loop.start();
loop.pause();
loop.resume();
loop.stop();
```
