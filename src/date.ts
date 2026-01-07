export interface DateOptions {
    /** The reference timestamp to calculate from. Defaults to Date.now() */
    since?: number | Date;
    /** If true, returns null if the target time is in the past. */
    nullIfPast?: boolean;
    /** If true, omits the " ago" suffix for past dates. */
    ignorePast?: boolean;
}

export interface ParseOptions {
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
 * Duration formatter.
 *
 * Available styles:
 * - Digital (00:00)
 * - HMS
 * - YMDHMS.
 * @param target The target time to calculate from.
 * @param style The output style to use.
 * @param options Formatting options.
 */
function duration(
    target: number | Date,
    style: "digital" | "hms" | "ymdhms" = "hms",
    options: DateOptions = {}
): string | null {
    const targetMs = target instanceof Date ? target.getTime() : Number(target);
    const sinceMs = options.since instanceof Date ? options.since.getTime() : Number(options.since) || Date.now();
    const diff = Math.abs(targetMs - sinceMs);

    if (diff === 0) return style === "digital" ? "00:00" : "now";

    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 60000) % 60;
    const h = Math.floor(diff / 3600000) % 24;
    const d = Math.floor(diff / 86400000);

    if (style === "digital") {
        const parts = [m, s].map(v => String(v).padStart(2, "0"));
        if (h > 0 || d > 0) parts.unshift(String(h).padStart(2, "0"));
        if (d > 0) parts.unshift(String(d)); // Days don't necessarily need padding
        return parts.join(":");
    }

    const result: string[] = [];
    const push = (val: number, label: string) => {
        if (val > 0) result.push(`${val} ${label}${val === 1 ? "" : "s"}`);
    };

    if (style === "ymdhms") push(d, "day");
    push(h, "hour");
    push(m, "minute");
    push(s, "second");

    if (result.length === 0) return "0 seconds";
    if (result.length === 1) return result[0]!;

    const last = result.pop();
    return `${result.join(", ")} and ${last}`;
}

/**
 * Formats a date or timestamp into a human-readable relative string (e.g., "3 days ago").
 * @param date - The Date object or timestamp to compare.
 * @param locale - The BCP 47 language tag.
 */
function eta(date: Date | number, locale?: Intl.LocalesArgument): string {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const elapsed = (typeof date === "number" ? date : date.getTime()) - Date.now();

    // Division factors for different units
    const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
        { unit: "year", ms: 31536000000 },
        { unit: "month", ms: 2628000000 },
        { unit: "day", ms: 86400000 },
        { unit: "hour", ms: 3600000 },
        { unit: "minute", ms: 60000 },
        { unit: "second", ms: 1000 }
    ];

    // Find the largest unit that fits the elapsed time
    for (const { unit, ms } of units) {
        if (Math.abs(elapsed) >= ms || unit === "second") {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }

    return "";
}

/**
 * Parses shorthand strings (1h 30m) into milliseconds or seconds.
 */
function parse(str: string | number, options: ParseOptions = {}): number {
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

export const date = {
    duration,
    eta,
    parse
};
