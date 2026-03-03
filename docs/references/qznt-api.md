# qznt API Reference

## Array Utilities (`arr`)

### chunk

```typescript
chunk<T>(array: ReadonlyArray<T>, size: number): T[][]
```

### chunkAdj

```typescript
chunkAdj<T>(array: ReadonlyArray<T>, predicate: (prev: T, curr: T) => boolean): T[][]
```

### cluster

```typescript
cluster<T>(array: ReadonlyArray<T>, iteratee: (item: T) => string | number, maxChunkSize?: number): T[][]
```

### compact

```typescript
compact<T>(array: ReadonlyArray<T>, mode?: "nullable"): NonNullable<T>[]
compact<T>(array: ReadonlyArray<T>, mode: "falsy"): Exclude<T, null | undefined | false | 0 | "">[]
```

### forceArray

```typescript
forceArray<T>(item: T): T[]
```

### search

```typescript
search<T>(array: T[], target: T, comparator?: (a: T, b: T) => number): number
```

### seqMap

```typescript
seqMap<T, U>(array: ReadonlyArray<T>, callback: (item: T, context: SequentialMapContext<T, U>) => U): U[]
```

### shuffle

```typescript
shuffle<T>(array: ReadonlyArray<T>, seed?: number): T[]
```

### sortBy

```typescript
sortBy<T>(array: ReadonlyArray<T>, selector: (item: T) => any, order?: "asc" | "desc"): T[]
sortBy<T>(array: ReadonlyArray<T>, selectors: (item: T) => any[], order?: "asc" | "desc"): T[]
```

### unique

```typescript
unique<T>(array: T[], key: (item: T) => any): T[]
```

---

## Async Utilities (`async`)

### retry

```typescript
retry<T>(fn: (signal?: AbortSignal) => Promise<T>, options?: RetryOptions): Promise<T>
```

### wait

```typescript
wait(ms: number): Promise<boolean>
```

---

## Function Utilities (`fn`)

### memoize

```typescript
memoize<T extends (...args: any[]) => any>(fn: T, options?: {
    resolver?: (...args: Parameters<T>) => string;
    maxAge?: number;
}): MemoizedFunction<T>
```

---

## Date & Time (`date`)

### duration

```typescript
duration(target: number | Date, style?: "digital" | "hms" | "ymdhms", options?: DateOptions): string | null
```

### eta

```typescript
eta(date: Date | number, locale?: Intl.LocalesArgument): string
```

### getAge

```typescript
getAge(birthdate: Date): number
```

### parse

```typescript
parse(str: string | number, options?: ParseOptions): number
```

---

## Formatting (`format`)

### compactNumber

```typescript
compactNumber(num: number, locale?: Intl.LocalesArgument): string
```

### currency

```typescript
currency(num: number, options?: { currency?: string; locale?: Intl.LocalesArgument }): string
```

### memory

```typescript
memory(bytes: number, decimals?: number, units?: string[]): string
```

### number

```typescript
number(num: number, options?: { locale?: Intl.LocalesArgument; precision?: number }): string
```

### ordinal

```typescript
ordinal(num: number | string, locale?: Intl.LocalesArgument): string
```

---

## File System (`fs`)

### readDir

```typescript
readDir(path: string, options?: ReadDirOptions): string[]
```

---

## Logic & Predicates (`is`)

### defined

```typescript
defined<T>(val: T | undefined | null): val is T
```

### empty

```typescript
empty(val: unknown): boolean
```

### inRange

```typescript
inRange(num: number, max: number): boolean
inRange(num: number, min: number, max: number): boolean
```

### object

```typescript
object(val: unknown): val is Record<string, any>
```

### sorted

```typescript
sorted<T>(arr: T[], comparator?: (a: T, b: T) => number): boolean
```

### string

```typescript
string(val: unknown): val is string
```

### today

```typescript
today(date: number | Date): boolean
```

---

## Math Utilities (`math`)

### clamp

```typescript
clamp(num: number, max: number): number
clamp(num: number, min: number, max: number): number
```

### invLerp

```typescript
invLerp(start: number, end: number, value: number): number
```

### lerp

```typescript
lerp(start: number, end: number, t: number): number
```

### ms

```typescript
ms(num: number): number
```

### percent

```typescript
percent(a: number, b: number, round?: boolean): number
```

### remap

```typescript
remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number
```

### secs

```typescript
secs(num: number): number
```

### sum

```typescript
sum<T>(array: T[], selector?: (item: T) => number): number
```

### wrap

```typescript
wrap(num: number, max: number): number
```

---

## Object Utilities (`obj`)

### get

```typescript
get<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T
```

### has

```typescript
has(obj: Record<string, any>, path: string): boolean
```

### merge

```typescript
merge<T, S1>(target: T, s1: S1): T & S1
merge<T, S1, S2>(target: T, s1: S1, s2: S2): T & S1 & S2
merge<T, S1, S2, S3>(target: T, s1: S1, s2: S2, s3: S3): T & S1 & S2 & S3
merge(target: any, ...sources: any[]): any
```

### omit

```typescript
omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>
```

### pick

```typescript
pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
```

### set

```typescript
set(obj: Record<string, any>, path: string, value: any): void
```

---

## Randomness (`rnd`)

### chance

```typescript
chance(percent?: number, seed?: number): boolean
```

### choice

```typescript
choice<T>(array: T[], options?: RndArrayOptions<T>): T
```

### float

```typescript
float(min: number, max: number, seed?: number): number
```

### index

```typescript
index<T>(array: T[], options?: RndArrayOptions<number>): number
```

### int

```typescript
int(min: number, max: number, seed?: number): number
```

### prng

```typescript
prng(seed: number): () => number
```

### sampler

```typescript
sampler<T>(items: T[], selector: (item: T) => number, seed?: number): {
    pick: (seed?: number) => T | undefined
}
```

### str

```typescript
str(len: number, mode: "number" | "alpha" | "alphanumeric" | "custom", options?: RndStrOptions): string
```

### weighted

```typescript
weighted<T>(array: T[], selector: (item: T) => number, seed?: number): T
```

---

## String Utilities (`str`)

### escapeRegex

```typescript
escapeRegex(str: string): string
```

### getFlag

```typescript
getFlag(str: string, flag: string | RegExp, length?: number): string | null
```

### hasFlag

```typescript
hasFlag(str: string, flag: string | RegExp): boolean
```

### toTitleCase

```typescript
toTitleCase(str: string, smart?: boolean): string
```

---

## Timing (`timing`)

### debounce

```typescript
debounce<T extends (...args: any[]) => any>(fn: T, wait: number, options?: {
    immediate?: boolean
}): DebouncedFunction<T>
```

### throttle

```typescript
throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void
```

---

## Transform (`to`)

### record

```typescript
record<T, V>(array: ReadonlyArray<T>, callback: (item: T, context: ToRecordContext<T, V>) => {
    key: string | number;
    value: V
}): Record<string | number, V>
```

---

## Core

### Pipe

```typescript
Pipe<A>(value: A): A
Pipe<A, B>(value: A, fn1: (arg: A) => B): B
Pipe<A, B, C>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C): C
// ... up to 10 arguments
```

### Storage

```typescript
class Storage {
    constructor(fileName?: string, directory?: string);
    has(key: string): boolean;
    get<T>(key: string): T | null;
    set<T>(key: string, value: T, ttl?: number): void;
    remove(key: string): void;
    clear(): void;
}
```

### Cache

```typescript
class Cache<T> {
    constructor(cleanupMs?: number);
    set(key: string | number, value: T, ttlMs?: number): void;
    get(key: string | number): T | null;
    clear(): void;
}
```

### Loop

```typescript
type LoopState = "running" | "paused" | "stopped";

interface LoopEvents<T> {
    start: [];
    tick: [result: T];
    pause: [{ remaining: number }];
    resume: [];
    stop: [];
    error: [error: any];
}

class Loop<T = any> {
    constructor(fn: (loop: Loop<T>) => Promise<T> | T, delay: number, immediate?: boolean);
    readonly state: LoopState;
    start(): void;
    resume(): void;
    stop(): void;
    pause(): void;
    setDelay(ms: number): void;
    execute(): Promise<void>;
    on<K extends keyof LoopEvents<T>>(event: K, listener: (...args: LoopEvents<T>[K]) => void): any;
    once<K extends keyof LoopEvents<T>>(event: K, listener: (...args: LoopEvents<T>[K]) => void): any;
    off<K extends keyof LoopEvents<T>>(event: K, listener: (...args: LoopEvents<T>[K]) => void): any;
    emit<K extends keyof LoopEvents<T>>(event: K, ...args: LoopEvents<T>[K]): boolean;
}
```

---

## Type Definitions

```typescript
interface RetryOptions {
    retries?: number; // default: 3
    delay?: number; // default: 500 (ms)
    timeout?: number;
    signal?: AbortSignal;
}

interface DateOptions {
    since?: number | Date;
    nullIfPast?: boolean;
    ignorePast?: boolean;
}

interface ParseOptions {
    unit?: "ms" | "s";
    fromNow?: boolean;
}

interface ReadDirOptions {
    recursive?: boolean; // default: true
}

interface RndArrayOptions<T> {
    seed?: number;
    not?: ((item: T) => boolean) | (T | null | undefined);
    maxRerolls?: number; // default: 10
}

interface RndStrOptions {
    seed?: number;
    casing?: "lower" | "upper" | "mixed";
    customChars?: string;
    exclude?: string | string[];
}

interface MemoizedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    clear: () => void;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

interface SequentialMapContext<T, U> {
    index: number;
    lastElement: U | undefined;
    newArray: ReadonlyArray<U>;
    originalArray: ReadonlyArray<T>;
}

interface ToRecordContext<T, V> {
    index: number;
    lastValue: V | undefined;
    newRecord: Readonly<Record<string | number, V>>;
    originalArray: ReadonlyArray<T>;
}
```
