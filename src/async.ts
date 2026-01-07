/**
 * Retries an async function with exponential backoff.
 * @param fn The async function to attempt.
 * @param retries Maximum number of retry attempts. [default: 3]
 * @param delay Initial delay in milliseconds. [default: 500ms]
 */
async function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 500): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        const jitter = Math.random() * 200;
        return await new Promise(resolve => setTimeout(resolve, delay + jitter));
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

export const async = {
    retry,
    wait
};
