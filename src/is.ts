/**
 * Checks if a value is defined (not null or undefined).
 */
function defined<T>(val: T | undefined | null): val is T {
    return val !== undefined && val !== null;
}

/**
 * Checks if a value is an empty object, array, or string.
 */
function empty(val: unknown): boolean {
    if (!defined(val)) return true;
    if (string(val) || Array.isArray(val)) return val.length === 0;
    if (object(val)) return Object.keys(val).length === 0;
    return false;
}

/**
 * Checks if a number is within a specified range.
 * @param num The number to check.
 * @param min The minimum or maximum value of the range.
 * @param max The maximum value of the range (optional).
 */
function inRange(num: number, max: number): boolean;
function inRange(num: number, min: number, max: number): boolean;
function inRange(num: number, a: number, b?: number): boolean {
    // If b is undefined, we are clamping [0, a]
    // If b is defined, we are clamping [a, b]
    let min = b !== undefined ? a : 0;
    let max = b !== undefined ? b : a;

    // Handles a swapped min/max
    if (min > max) [min, max] = [max, min];
    return num >= min && num <= max;
}

/**
 * Checks if a value is a plain object (not an array, null, or function).
 */
function object(val: unknown): val is Record<string, any> {
    return val !== null && typeof val === "object" && !Array.isArray(val);
}

/**
 * Checks if an array is sorted.
 */
function sorted<T>(arr: T[], comparator?: (a: T, b: T) => number): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        const comp = comparator ? comparator(arr[i]!, arr[i + 1]!) : arr[i]! > arr[i + 1]! ? 1 : -1;
        if (comp > 0) return false;
    }
    return true;
}

/**
 * Checks if a value is a string.
 */
function string(val: unknown): val is string {
    return typeof val === "string";
}

/**
 * Checks if a date is today.
 */
function today(date: number | Date): boolean {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

export const is = {
    defined,
    empty,
    inRange,
    object,
    sorted,
    string,
    today
};
