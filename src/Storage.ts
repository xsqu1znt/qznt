import fs from "node:fs";
import path from "node:path";

type StorePayload<T> = {
    value: T;
    expiry: number | null;
};

export class Storage {
    private isNode = typeof window === "undefined";
    private filePath: string | null = null;
    private memoryCache = new Map<string, string>();

    private loadFromFile() {
        if (this.filePath && fs.existsSync(this.filePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
                Object.entries(data).forEach(([k, v]) => this.memoryCache.set(k, JSON.stringify(v)));
            } catch (err) {
                console.error(`Store: Failed to load file '${this.filePath}'`, err);
            }
        }
    }

    private persist() {
        if (this.isNode && this.filePath) {
            const out: Record<string, any> = {};
            this.memoryCache.forEach((v, k) => (out[k] = JSON.parse(v)));
            fs.writeFileSync(this.filePath, JSON.stringify(out, null, 2));
        }
    }

    /**
     * A lightweight, high-performant persistent storage system.
     * Uses JSON files in Node.js, localStorage in the browser.
     * @param fileName Only used in Node.js to create a persistent .json file.
     * @param directory The directory for the file. Defaults to current working directory.
     */
    constructor(fileName?: string, directory: string = process.cwd()) {
        if (this.isNode && fileName) {
            this.filePath = path.join(directory, fileName.endsWith(".json") ? fileName : `${fileName}.json`);
            this.loadFromFile();
        }
    }

    has(key: string): boolean {
        if (!this.isNode && window.localStorage) {
            return localStorage.getItem(key) !== null;
        }
        return this.memoryCache.has(key);
    }

    get<T>(key: string): T | null {
        let raw: string | null = null;

        if (!this.isNode && window.localStorage) {
            raw = localStorage.getItem(key);
        } else {
            raw = this.memoryCache.get(key) || null;
        }

        if (!raw) return null;

        const payload: StorePayload<T> = JSON.parse(raw);
        if (payload.expiry && Date.now() > payload.expiry) {
            this.remove(key);
            this.persist();
            return null;
        }
        return payload.value;
    }

    set<T>(key: string, value: T, ttl?: number): void {
        const payload: StorePayload<T> = {
            value,
            expiry: ttl ? Date.now() + ttl : null
        };
        const serialized = JSON.stringify(payload);

        if (!this.isNode && window.localStorage) {
            localStorage.setItem(key, serialized);
        } else {
            this.memoryCache.set(key, serialized);
            this.persist();
        }
    }

    remove(key: string): void {
        if (!this.isNode && window.localStorage) {
            localStorage.removeItem(key);
        } else {
            this.memoryCache.delete(key);
            this.persist();
        }
    }

    clear(): void {
        if (!this.isNode && window.localStorage) {
            localStorage.clear();
        } else {
            this.memoryCache.clear();
            this.persist();
        }
    }
}
