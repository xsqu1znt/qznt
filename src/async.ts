export interface RetryOptions {
    /** Maximum number of retry attempts. @default 3 */
    attempts?: number;
    /** Base retry delay in milliseconds. @default 500 */
    delay?: number;
    /** Timeout in milliseconds for each attempt. */
    timeout?: number;
    /** An AbortSignal to cancel the entire operation. */
    signal?: AbortSignal;
}

/**
 * Creates a queue that runs tasks in call order for each key, while different keys run concurrently.
 * Task errors reach their callers without blocking later tasks. Drained keys are removed automatically.
 * @example
 * const queue = keyedQueue();
 * const first = queue.run("user-1", () => saveInventory("user-1"));
 * const second = queue.run("user-1", () => readInventory("user-1"));
 * await Promise.all([first, second]); // The read runs after the save finishes
 * console.log(queue.size); // 0 active keys
 */
export function keyedQueue() {
    const queues = new Map<string | number, Promise<void>>();

    return {
        run<T>(key: string | number, work: () => T | Promise<T>): Promise<T> {
            const previous = queues.get(key) ?? Promise.resolve();
            const result = previous.then(work);

            const release = () => {
                // A completed task can only remove its key if no later task has been queued.
                if (queues.get(key) === tail) queues.delete(key);
            };

            // The tail always fulfills, while result preserves the task's value or error.
            const tail = result.then(release, release);
            queues.set(key, tail);
            return result;
        },
        get size() {
            return queues.size;
        }
    };
}

/**
 * Retries an async function until the maximum number of attempts is reached.
 *
 * Implements exponential backoff with random jitter.
 * @param fn The asynchronous function to attempt
 * @param options Options for the retry function
 */
export async function retryPromise<T>(fn: (signal?: AbortSignal) => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const { attempts = 3, delay = 500, timeout, signal } = options;

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
        if (attempts <= 0) throw error;

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
        return retryPromise(fn, { ...options, attempts: attempts - 1, delay: delay * 2 });
    }
}

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * @param ms The time to wait in milliseconds
 */
export function wait(ms: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
}
