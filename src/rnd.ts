export type AlphaCasing = "lower" | "upper" | "mixed";

export interface RndArrayOptions<T> {
    /** Optional seed for RNG. */
    seed?: number;
    /** Reroll if the result is equal to this value. */
    not?: ((item: T) => boolean) | (T | null | undefined);
    /** Maximum number of times to reroll if `not` is specified. [default: 10] */
    maxRerolls?: number;
}

export interface RndStrOptions {
    /** Optional seed for RNG. */
    seed?: number;
    /** Character casing mode. */
    casing?: AlphaCasing;
    /** Custom character pool. */
    customChars?: string;
    /** Characters to exclude from the pool. */
    exclude?: string | string[];
}

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";

/**
 * Returns true based on a percentage probability.
 * @param percent A value between 0 and 1. [default: 0.5]
 * @param seed Optional seed for RNG.
 */
function chance(percent: number = 0.5, seed?: number): boolean {
    if (percent <= 0) return false;
    if (percent >= 1) return true;
    const random = seed !== undefined ? prng(seed) : Math.random;
    return random() < percent;
}

/**
 * Returns a random item from the given array.
 * @param array Array of items to choose from.
 * @param options Options for the choice function.
 */
function choice<T>(array: T[], options: RndArrayOptions<T> = {}): T {
    const { seed, not, maxRerolls = 10 } = options;
    const random = seed !== undefined ? prng(seed) : Math.random;
    const rnd = () => array[Math.floor(random() * array.length)]!;

    let result: T = rnd();

    // NOTE: Ignores rerolling if seed is set and result is equal to `not`
    // to prevent infinite loops
    if (seed === undefined && array.length > 1 && not !== undefined) {
        let rerolls = 0;

        const shouldReroll = () => (typeof not === "function" ? (not as (item: T) => boolean)(result) : result === not);
        while (shouldReroll() && rerolls < maxRerolls) {
            result = rnd();
            rerolls++;
        }
    }

    return result;
}

/**
 * Returns a random item from the given array based on their corresponding weights.
 * @param array Array of items to choose from.
 * @param selector Function that selects the item's weight.
 * @param seed Optional seed for RNG.
 */
function weighted<T>(array: T[], selector: (item: T) => number, seed?: number): T {
    const random = seed !== undefined ? prng(seed) : Math.random;

    const cumulativeWeights: number[] = [];
    let currentSum = 0;

    // Calculate cumulative weights
    for (const item of array) {
        const weight = selector(item);
        currentSum += weight;
        cumulativeWeights.push(currentSum);
    }

    const decider = random() * currentSum;

    let index: number;

    // Linear search | O(n)
    if (array.length < 20) {
        index = cumulativeWeights.findIndex(w => w >= decider);
    }
    // Binary Search | O(log n)
    else {
        let low = 0;
        let high = cumulativeWeights.length - 1;

        while (low < high) {
            const mid = (low + high) >>> 1;
            if (decider > cumulativeWeights[mid]!) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        index = low;
    }

    return array[index]!;
}

/**
 * Returns an object with a single method, `pick`, which returns a random item from the given array in O(1) time.
 * The probability of each item being picked is determined by the corresponding weight in the `weights` array.
 * @param items Array of items to choose from.
 * @param selector Function that selects the item's weight.
 * @param seed Optional seed for RNG.
 */
function sampler<T>(items: T[], selector: (item: T) => number, seed?: number) {
    const callRandom = seed ? prng(seed) : undefined;
    const len = items.length;

    const prob = new Array(len);
    const alias = new Array(len);

    const weights = items.map(selector);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const scaledWeights = weights.map(w => (w * len) / totalWeight);

    const small: number[] = [];
    const large: number[] = [];

    scaledWeights.forEach((w, i) => (w < 1 ? small : large).push(i));

    while (small.length && large.length) {
        const s = small.pop()!;
        const l = large.pop()!;
        prob[s] = scaledWeights[s];
        alias[s] = l;
        scaledWeights[l] = scaledWeights[l]! + scaledWeights[s]! - 1;
        (scaledWeights[l] < 1 ? small : large).push(l);
    }

    while (large.length) prob[large.pop()!] = 1;
    while (small.length) prob[small.pop()!] = 1;

    return {
        /**
         * Returns a random item from the given array in O(1) time.
         * @param seed Optional seed for RNG.
         */
        pick: (seed?: number) => {
            const random = seed !== undefined ? prng(seed) : callRandom || Math.random;
            const i = Math.floor(random() * len);
            return random() < prob[i] ? items[i] : items[alias[i]];
        }
    };
}

/**
 * Creates a deterministic pseudo-random number generator (PRNG) using the Mulberry32 algorithm.
 * @param seed An integer seed value.
 * @example
 * const rng = prng(123);
 * const val1 = rng(); // Always the same for seed 123
 */
function prng(seed: number): () => number {
    return () => {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generates a random float between the given minimum and maximum values.
 * @param min The minimum value (inclusive) for the random float.
 * @param max The maximum value (inclusive) for the random float.
 * @param seed Optional seed for RNG.
 */
function float(min: number, max: number, seed?: number): number {
    const random = seed !== undefined ? prng(seed) : Math.random;
    return random() * (max - min) + min;
}

/**
 * Returns a random index from the given array.
 * @param array The array to generate an index for.
 * @param options Options for the index function.
 */
function index<T>(array: T[], options: RndArrayOptions<number> = {}): number {
    const { seed, not, maxRerolls = 10 } = options;
    const random = seed !== undefined ? prng(seed) : Math.random;
    const rnd = () => Math.floor(random() * array.length);

    let result: number = rnd();

    // NOTE: Ignores rerolling if seed is set and result is equal to `not`
    // to prevent infinite loops
    if (seed === undefined && array.length > 1 && not !== undefined) {
        let rerolls = 0;

        const shouldReroll = () => (typeof not === "function" ? (not as (item: number) => boolean)(result) : result === not);
        while (shouldReroll() && rerolls < maxRerolls) {
            result = rnd();
            rerolls++;
        }
    }

    return result;
}

/**
 * Generates a random integer between the given minimum and maximum values.
 * @param min The minimum value (inclusive) for the random integer.
 * @param max The maximum value (inclusive) for the random integer.
 * @param seed Optional seed for RNG.
 */
function int(min: number, max: number, seed?: number): number {
    const random = seed !== undefined ? prng(seed) : Math.random;
    return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Generates a random string of the given length using the specified character pool.
 * @param len The length of the random string.
 * @param mode The character pool to use. Can be "number", "alpha", "alphanumeric", or "custom".
 * @param options Options for the rndStr function.
 */
function str(len: number, mode: "number" | "alpha" | "alphanumeric" | "custom", options: RndStrOptions = {}) {
    const { casing = "lower", seed, customChars = "", exclude = "" } = options;
    const random = seed !== undefined ? prng(seed) : Math.random;

    const alphaPool = { lower: LOWER, upper: UPPER, mixed: LOWER + UPPER }[casing];
    let pool = { number: NUM, alpha: alphaPool, alphanumeric: alphaPool + NUM, custom: customChars }[mode];

    if (exclude.length > 0) {
        const excludeSet = new Set(Array.isArray(exclude) ? exclude : exclude.split(""));
        pool = pool
            .split("")
            .filter(char => !excludeSet.has(char))
            .join("");
    }

    // Safety check
    if (pool.length === 0) throw new Error("rndStr: Character pool is empty after exclusions.");

    const result = new Array(len);
    const poolLen = pool.length;

    for (let i = 0; i < len; i++) {
        result[i] = pool[Math.floor(random() * poolLen)];
    }

    return result.join("");
}

export { chance, choice, weighted, sampler, prng, float, index, int, str };
