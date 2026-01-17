/**
 * Retrieves a nested property.
 * @param obj The object to process.
 * @param path The path to retrieve (e.g., 'data.users[0].id').
 * @param defaultValue The default value to return if the property does not exist.
 */
function get<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T {
    if (!obj) throw new Error("get: Target object is null or undefined");

    // Normalize and split
    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let current: any = obj;
    const trace: string[] = [];

    for (const part of parts) {
        trace.push(part);

        // Check if the link in the chain exists
        if (current === null || typeof current !== "object" || !(part in current)) {
            // Return the default value, if provided
            if (arguments.length === 3) return defaultValue as T;

            // Else, throw a debug error with the trace path
            const reach = trace.join(".");
            throw new Error(`get: Path broken at "${reach}". ` + `Property "${part}" is missing on ${typeof current}.`);
        }

        current = current[part];
    }

    // Handle the case where the final value found is undefined
    if (current === undefined && arguments.length === 3) {
        return defaultValue as T;
    }

    return current as T;
}

/**
 * Checks if a nested path exists within an object.
 * @param obj The object to process.
 * @param path The path string (e.g., 'data.users[0].id').
 */
function has(obj: Record<string, any>, path: string): boolean {
    if (!obj || !path) return false;

    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let current: any = obj;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]!;

        // If the current level isn't an object, the path can't continue
        if (current === null || typeof current !== "object") {
            return false;
        }

        // Check if the property exists at this level
        if (!(part in current)) {
            return false;
        }

        current = current[part];
    }

    return true;
}

/**
 * Sets a nested property value. Creates missing objects/arrays along the path.
 * @param obj The object to process.
 * @param path The path to set (e.g., 'data.users[0].id').
 * @param value The value to inject.
 */
function set(obj: Record<string, any>, path: string, value: any): void {
    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let current: any = obj;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]!;
        const isLast = i === parts.length - 1;

        if (isLast) {
            current[part] = value;
            return;
        }

        // If the next part is a number, we should create an array, otherwise an object
        const nextPartIsNumber = !isNaN(Number(parts[i + 1]));

        if (!(part in current) || current[part] === null || typeof current[part] !== "object") {
            current[part] = nextPartIsNumber ? [] : {};
        }

        current = current[part];
    }
}

/**
 * Deep merges multiple objects.
 * @param target - The base object to merge into.
 * @param sources - One or more objects to merge.
 */
function merge<T, S1>(target: T, s1: S1): T & S1;
function merge<T, S1, S2>(target: T, s1: S1, s2: S2): T & S1 & S2;
function merge<T, S1, S2, S3>(target: T, s1: S1, s2: S2, s3: S3): T & S1 & S2 & S3;
function merge(target: any, ...sources: any[]): any;
function merge(target: any, ...sources: any[]) {
    // Loop through every source object provided
    for (const source of sources) {
        if (!source) continue;

        Object.keys(source).forEach(key => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                // Concat arrays
                (target as any)[key] = targetValue.concat(sourceValue);
            } else if (
                targetValue &&
                typeof targetValue === "object" &&
                sourceValue &&
                typeof sourceValue === "object" &&
                !Array.isArray(sourceValue)
            ) {
                // If both are objects, recurse
                merge(targetValue, sourceValue);
            } else {
                // Else, just set the value
                (target as any)[key] = sourceValue;
            }
        });
    }

    return target;
}

/**
 * Creates an object composed of the picked object properties.
 * @param obj The object to process.
 * @param keys The keys to pick from the object.
 */
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}

/**
 * Creates an object composed of the omitted object properties.
 * @param obj The object to process.
 * @param keys The keys to omit from the object.
 */
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}

export { get, has, set, merge, pick, omit };
