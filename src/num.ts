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

export const num = {
    clamp
};
