export interface ParseTimeOptions {
    /** Return value in seconds instead of milliseconds. */
    unit?: "ms" | "s";
    /** If true, returns the absolute Unix timestamp (Date.now() + result). */
    fromNow?: boolean;
}

const MS_MAP: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    mth: 2419200000,
    y: 31536000000
};

/**
 * Calculates the age of a person based on their birthdate.
 * @param birthdate The birthdate of the person
 */
export function getAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

/**
 * Parses shorthand strings (1h 30m) into milliseconds or seconds.
 * @param str The string to parse
 * @param options Parsing options
 */
export function parseTime(str: string | number, options: ParseTimeOptions = {}): number {
    if (typeof str === "number") return str;

    const matches = str.matchAll(/(-?\d+)([a-z]+)/gi);
    let totalMs = 0;
    let found = false;

    for (const [_, value, unit] of matches) {
        if (!value || !unit) continue;
        const factor = MS_MAP[unit.toLowerCase()];
        if (factor) {
            totalMs += parseInt(value) * factor;
            found = true;
        }
    }

    if (!found) throw new Error(`parse: Invalid time format: "${str}"`);

    const result = options.unit === "s" ? totalMs / 1000 : totalMs;
    return options.fromNow ? Date.now() + result : result;
}
