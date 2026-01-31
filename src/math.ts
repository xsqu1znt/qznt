/**
 * Clamps a number within a specified range.
 * @param num The number to check.
 * @param min The minimum or maximum value of the range.
 * @param max The maximum value of the range (optional).
 */
function clamp(num: number, max: number): number;
function clamp(num: number, min: number, max: number): number;
function clamp(num: number, a: number, b?: number): number {
    // If b is undefined, we are clamping [0, a]
    // If b is defined, we are clamping [a, b]
    let min = b !== undefined ? a : 0;
    let max = b !== undefined ? b : a;

    // Handles a swapped min/max
    if (min > max) [min, max] = [max, min];
    return Math.max(min, Math.min(num, max));
}

/**
 * Calculates the interpolation factor (0-1) of a value between two points.
 * @param start - The starting value (0%).
 * @param end - The ending value (100%).
 * @param value - The value to interpolate.
 * @example
 * invLerp(0, 100, 50); // 0.5
 */
function invLerp(start: number, end: number, value: number): number {
    if (start === end) return 0;
    return (value - start) / (end - start);
}

/**
 * Linearly interpolates between two values.
 * @param start - The starting value (0%).
 * @param end - The ending value (100%).
 * @param t - The interpolation factor (0 to 1).
 * @example
 * lerp(0, 100, 0.5); // 50
 * lerp(10, 20, 0.2); // 12
 */
function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Converts seconds to milliseconds and rounds it to the nearest integer.
 * @param num The number of seconds to convert.
 */
function ms(num: number): number {
    return Math.floor(num * 1000);
}

/**
 * Calculates the percentage value between two numbers.
 * @param a The numerator.
 * @param b The denominator.
 * @param round Whether to round the result to the nearest integer.
 * @example
 * percent(50, 100) --> 50 // 50%
 * percent(30, 40) --> 75 // 75%
 */
function percent(a: number, b: number, round: boolean = true): number {
    const result = (a / b) * 100;
    return round ? Math.floor(result) : result;
}

/**
 * Maps a value from one range to another.
 * @param value - The value to map.
 * @param inMin - The minimum value of the input range.
 * @param inMax - The maximum value of the input range.
 * @param outMin - The minimum value of the output range.
 * @param outMax - The maximum value of the output range.
 * @example
 * // Convert mouse X position (0-1920) to a volume level (0-1)
 * const volume = remap(mouseX, 0, 1920, 0, 1);
 */
function remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    const t = invLerp(inMin, inMax, value);
    return lerp(outMin, outMax, t);
}

/**
 * Converts milliseconds to seconds and rounds it to the nearest integer.
 * @param num The number of milliseconds to convert.
 */
function secs(num: number): number {
    return Math.floor(num / 1000);
}

/**
 * Returns the sum of an array of numbers. Negative values subtract from the total.
 * @param array The array to sum.
 * @param selector Function that selects the item's weight.
 * @param ignoreNaN If true, NaN values will not throw an error.
 */
function sum<T>(array: T[], selector?: (item: T) => number): number {
    const _array = selector ? array.map(selector) : array;
    if (!_array.every(v => typeof v === "number")) {
        throw new TypeError(`sum: Array must only contain numbers.`);
    }

    return _array.reduce((a, b) => {
        return (isNaN(b) ? 0 : b) < 0 ? a - -b : a + (b || 0);
    }, 0);
}

/**
 * Wraps a number into a modular range.
 * @param num The value to wrap.
 * @param max The upper bound.
 * @example
 * ```ts
 * wrap(12, 10); // 2
 * wrap(-1, 10); // 9 (last index)
 * ```
 */
function wrap(num: number, max: number): number {
    return ((num % max) + max) % max;
}

export { clamp, invLerp, lerp, ms, percent, remap, secs, sum, wrap };
