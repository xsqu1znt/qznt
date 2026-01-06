import { rnd } from "./rnd";

export type SequentialMapContext<T, U> = {
    index: number;
    lastElement: U | undefined;
    newArray: ReadonlyArray<U>;
    originalArray: ReadonlyArray<T>;
};

/**
 * Splits an array into sub-arrays (chunks) of a maximum size.
 * @param array Array to process.
 * @param size The maximum size of each chunk.
 */
function chunk<T>(array: ReadonlyArray<T>, size: number): T[][] {
    if (size <= 0) throw new Error("chunk: Size must be a positive integer.");

    const result: T[][] = [];
    const len = array.length;

    for (let i = 0; i < len; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
}

/**
 * Groups adjacent elements of an array together based on a predicate.
 * @param array Array to process.
 * @param predicate A function that returns true if two adjacent elements belong in the same chunk.
 * @example
 * // Group consecutive identical numbers
 * chunkBy([1, 1, 2, 3, 3, 3], (a, b) => a === b);
 * // [[1, 1], [2], [3, 3, 3]]
 */
function chunkAdj<T>(array: ReadonlyArray<T>, predicate: (prev: T, curr: T) => boolean): T[][] {
    if (array.length === 0) return [];

    const results: T[][] = [];
    const len = array.length;
    let currentChunk: T[] = [array[0]!];

    for (let i = 1; i < len; i++) {
        const prev = array[i - 1]!;
        const curr = array[i]!;

        if (predicate(prev, curr)) {
            currentChunk.push(curr);
        } else {
            results.push(currentChunk);
            currentChunk = [curr];
        }
    }

    results.push(currentChunk);
    return results;
}

/**
 * Groups elements by a key.
 * @param array Array to process.
 * @param iteratee Function to determine the key to group by.
 * @param maxChunkSize Optionally chunk groups and flatten them (useful for pagination).
 */
function cluster<T>(array: ReadonlyArray<T>, iteratee: (item: T) => string | number, maxChunkSize?: number): T[][] {
    const groups = new Map<string | number, T[]>();

    for (const item of array) {
        const key = iteratee(item);
        const collection = groups.get(key);
        if (!collection) {
            groups.set(key, [item]);
        } else {
            collection.push(item);
        }
    }

    const result: T[][] = [];

    for (const group of groups.values()) {
        if (maxChunkSize && maxChunkSize > 0) {
            // If chunking is enabled, split this specific group
            for (let i = 0; i < group.length; i += maxChunkSize) {
                result.push(group.slice(i, i + maxChunkSize));
            }
        } else {
            // Otherwise, just push the whole group as one chunk
            result.push(group);
        }
    }

    return result;
}

/**
 * Removes unwanted values from an array.
 * @param array Array to process.
 * @param mode 'nullable' (default) removes null/undefined. 'falsy' removes null, undefined, 0, "", false, and NaN.
 */
function compact<T>(array: ReadonlyArray<T>, mode?: "nullable"): NonNullable<T>[];
function compact<T>(array: ReadonlyArray<T>, mode: "falsy"): Exclude<T, null | undefined | false | 0 | "">[];
function compact<T>(array: ReadonlyArray<T>, mode: "nullable" | "falsy" = "nullable"): any[] {
    if (mode === "falsy") {
        // Boolean constructor handles all falsy values
        return array.filter(Boolean);
    }

    // Only removes null and undefined
    return array.filter(item => item !== null && item !== undefined);
}

/**
 * Forces a given item to be an array.
 * @param item The item to force into an array.
 */
function forceArray<T>(item: T): T[] {
    return Array.isArray(item) ? item : [item];
}

/**
 * Searches a sorted array for a value using the binary search method.
 * Returns the index if found, or the bitwise complement (~index) of the
 * position where the value should be inserted to keep it sorted.
 * @param array The array to process.
 * @param target The value to search for.
 * @param comparator Optional comparator function.
 */
function search<T>(
    array: T[],
    target: T,
    comparator: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0)
): number {
    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
        const mid = (low + high) >>> 1;
        const comp = comparator(array[mid]!, target);

        if (comp < 0) low = mid + 1;
        else if (comp > 0) high = mid - 1;
        else return mid;
    }

    return ~low;
}

/**
 * Maps over an array with access to the previously mapped elements.
 * @param array Array to process.
 * @param callback Function to map over the array.
 */
function seqMap<T, U>(array: ReadonlyArray<T>, callback: (item: T, context: SequentialMapContext<T, U>) => U): U[] {
    const len = array.length;
    const result: U[] = new Array(len);

    for (let i = 0; i < len; i++) {
        result[i] = callback(array[i]!, {
            index: i,
            lastElement: i > 0 ? result[i - 1] : undefined,
            // NOTE: This is a reference to the array currently being built
            newArray: result,
            originalArray: array
        });
    }

    return result;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @param seed Optional seed for RNG.
 */
function shuffle<T>(array: ReadonlyArray<T>, seed?: number): T[] {
    const random = seed !== undefined ? rnd.prng(seed) : Math.random;
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        const temp = result[i]!;
        result[i] = result[j]!;
        result[j] = temp;
    }

    return result;
}

/**
 * Sorts an array by a single property in order.
 * @param order 'asc' for ascending (default) or 'desc' for descending.
 * @param array Array to process.
 * @param selector Function to determine the key to sort by.
 */
function sortBy<T>(array: ReadonlyArray<T>, selector: (item: T) => any, order?: "asc" | "desc"): T[];
/**
 * Sorts an array by one or more properties in order.
 * @param order 'asc' for ascending (default) or 'desc' for descending.
 * @param array Array to process.
 * @param selectors Functions to determine the keys to sort by.
 */
function sortBy<T>(array: ReadonlyArray<T>, selectors: (item: T) => any[], order?: "asc" | "desc"): T[];
function sortBy<T>(
    array: ReadonlyArray<T>,
    selectorOrSelectors: (item: T) => any | ((item: T) => any)[],
    order: "asc" | "desc" = "asc"
): T[] {
    const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];

    if (array.length === 0 || selectors.length === 0) {
        return [...array];
    }

    const modifier = order === "desc" ? -1 : 1;
    const memos = array.map(item => ({ item, keys: selectors.map(s => s(item)) }));

    memos.sort((a, b) => {
        for (let i = 0; i < selectors.length; i++) {
            const valA = a.keys[i];
            const valB = b.keys[i];

            if (valA === valB) continue;

            // Nullish values are pushed to the end regardless of order
            if (valA == null) return 1;
            if (valB == null) return -1;

            if (valA < valB) return -1 * modifier;
            if (valA > valB) return 1 * modifier;
        }
        return 0;
    });

    return memos.map(m => m.item);
}

/**
 * Returns an array of unique elements from the given array.
 * Uniqueness is determined by the given key function.
 * @param array Array to process.
 * @param key Function to determine the keys to filter by
 */
function unique<T>(array: T[], key: (item: T) => any): T[] {
    return Array.from(new Map(array.map(item => [key(item), item])).values());
}

export const arr = {
    chunk,
    chunkAdj,
    cluster,
    compact,
    forceArray,
    search,
    seqMap,
    shuffle,
    sortBy,
    unique
};
