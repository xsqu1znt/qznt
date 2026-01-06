export class Cache<T> {
    private cache = new Map<string | number, { value: T; expiresAt: number | null }>();
    private interval: any;

    /**
     * A lightweight, high-performant in-memory cache.
     * Uses Map for O(1) lookups and an optional cleanup interval.
     * @param cleanupMs The interval in milliseconds to run the cleanup function. [default: 60000 (1 minute)]
     */
    constructor(cleanupMs: number = 60_000) {
        // Only run cleanup if the interval is positive
        if (cleanupMs > 0) {
            this.interval = setInterval(() => this.cleanup(), cleanupMs);
            // In Node.js, allow the process to exit even if this interval is running
            if (this.interval.unref) this.interval.unref();
        }
    }

    set(key: string | number, value: T, ttlMs?: number): void {
        this.cache.set(key, {
            value,
            expiresAt: ttlMs ? Date.now() + ttlMs : null
        });
    }

    get(key: string | number): T | null {
        const data = this.cache.get(key);
        if (!data) return null;

        if (data.expiresAt && Date.now() > data.expiresAt) {
            // Passive cleanup
            this.cache.delete(key);
            return null;
        }
        return data.value;
    }

    private cleanup(): void {
        if (this.cache.size === 0) return;

        const now = Date.now();
        let keysProcessed = 0;
        const maxKeysToScan = 20; // Limit per cycle to avoid CPU spikes

        // Iterate through the map
        for (const [key, data] of this.cache) {
            if (data.expiresAt && now > data.expiresAt) {
                this.cache.delete(key);
            }

            keysProcessed++;
            if (keysProcessed >= maxKeysToScan) break;
        }
    }

    clear(): void {
        this.cache.clear();
    }
}
