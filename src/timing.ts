export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    /** Cancels the debounced function. */
    cancel: () => void;
}

/**
 * Only executes after 'wait' ms have passed since the last call.
 * @param fn The function to debounce.
 * @param wait The time to wait in milliseconds.
 * @param options Options for the debounce function.
 * @example
 * const search = debounce((str) => console.log("Searching:", str), 500);
 * // Even if called rapidly, it only logs once 500ms after the last call.
 * search('a');
 * search('ab');
 * search('abc'); // Only 'abc' will be logged.
 * // Cancel a pending execution
 * search.cancel();
 */
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number,
    options: {
        /** Calls the function immediately on the leading edge. */
        immediate?: boolean;
    } = {}
): DebouncedFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const leading = options.immediate ?? false;

    const debounced = function (this: any, ...args: Parameters<T>) {
        const callNow = leading && !timeoutId;
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            timeoutId = undefined;
            // If we aren't in leading mode, fire the function at the end
            if (!leading) fn.apply(this, args);
        }, wait);

        // If leading is true and no timer was active, fire immediately
        if (callNow) fn.apply(this, args);
    } as DebouncedFunction<T>;

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }
    };

    return debounced;
}

/**
 * Executes at most once every 'limit' ms.
 * @param fn The function to throttle.
 * @param limit The time to wait in milliseconds.
 * @example
 * const handleScroll = throttle(() => console.log('Scroll position:', window.scrollY), 200);
 * // Even if the browser fires 100 scroll events per second,
 * // this function will only execute once every 200ms.
 * window.addEventListener('scroll', handleScroll);
 */
function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

export const timing = {
    debounce,
    throttle
};
