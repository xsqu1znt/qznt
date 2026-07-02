/**
 * Checks if a value is defined (not null or undefined).
 * @param val The value to check
 */
export function isDefined<T>(val: T | undefined | null): val is T {
    return val !== undefined && val !== null;
}

/**
 * Checks if a value is an empty object, array, or string.
 * @param val The value to check
 */
export function isEmpty(val: unknown): boolean {
    if (!isDefined(val)) return true;
    if (isString(val) || Array.isArray(val)) return val.length === 0;
    if (isObject(val)) return Object.keys(val).length === 0;
    return false;
}

/**
 * Checks if a value is a plain object (not an array, null, or function).
 * @param val The value to check
 */
export function isObject(val: unknown): val is Record<string, any> {
    return val !== null && typeof val === "object" && !Array.isArray(val);
}

/**
 * Checks if a value is a string.
 * @param val The value to check
 */
export function isString(val: unknown): val is string {
    return typeof val === "string";
}

/**
 * Checks if a number is within a specified range.
 * @param num The number to check
 * @param min The minimum or maximum value of the range
 * @param max The maximum value of the range (optional)
 */
export function isInRange(num: number, max: number): boolean;
export function isInRange(num: number, min: number, max: number): boolean;
export function isInRange(num: number, a: number, b?: number): boolean {
    // If b is undefined, we are clamping [0, a]
    // If b is defined, we are clamping [a, b]
    let min = b !== undefined ? a : 0;
    let max = b !== undefined ? b : a;

    // Handles a swapped min/max
    if (min > max) [min, max] = [max, min];
    return num >= min && num <= max;
}

/**
 * Checks if an array is sorted.
 * @param arr The array to check
 * @param comparator Optional comparator function
 */
export function isSortedArray<T>(arr: T[], comparator?: (a: T, b: T) => number): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        const comp = comparator ? comparator(arr[i]!, arr[i + 1]!) : arr[i]! > arr[i + 1]! ? 1 : -1;
        if (comp > 0) return false;
    }
    return true;
}

/**
 * Checks if a date is today.
 * @param date The date to check
 */
export function isToday(date: number | Date): boolean {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}
