export interface RetryOptions {
    /** Maximum number of retry attempts. @defaultValue 3 */
    retries?: number;
    /** Initial delay in milliseconds. @defaultValue 500 */
    delay?: number;
    /** Timeout in milliseconds for each attempt. */
    timeout?: number;
    /** An AbortSignal to cancel the entire operation. */
    signal?: AbortSignal;
}

/**
 * Retries an async function until the maximum number of attempts is reached.
 *
 * Implements exponential backoff with random jitter.
 * @param fn The asynchronous function to attempt.
 * @param options Options for the retry function.
 */
async function retry<T>(fn: (signal?: AbortSignal) => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const { retries = 3, delay = 500, timeout, signal } = options;

    // Immediate exit if signal is already aborted
    if (signal?.aborted) throw new Error("Operation aborted");

    const executeWithTimeout = async (): Promise<T> => {
        if (!timeout) return fn(signal);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            // Race the function against the timeout signal
            return await fn(controller.signal);
        } catch (err) {
            if (controller.signal.aborted) throw new Error(`Attempt timed out after ${timeout}ms`);
            throw err;
        } finally {
            clearTimeout(timer);
        }
    };

    try {
        return await executeWithTimeout();
    } catch (error: any) {
        // Don't retry if the user manually cancelled the whole thing
        if (signal?.aborted) throw error;
        if (retries <= 0) throw error;

        const jitter = Math.random() * 200;
        const totalDelay = delay + jitter;

        // Wait for the delay, but stop waiting if the signal aborts
        await new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, totalDelay);
            signal?.addEventListener(
                "abort",
                () => {
                    clearTimeout(timer);
                    reject(new Error("Operation aborted"));
                },
                { once: true }
            );
        });

        // Run it back
        return retry(fn, { ...options, retries: retries - 1, delay: delay * 2 });
    }
}

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * @param ms The time to wait in milliseconds.
 */
function wait(ms: number): Promise<boolean> {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve(true);
        }, ms)
    );
}

export { retry, wait };
