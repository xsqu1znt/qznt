export interface FormatDurationOptions {
    /** The reference timestamp to calculate from. Defaults to Date.now() */
    since?: number | Date;
    /** If true, returns null if the target time is in the past. */
    nullIfPast?: boolean;
    /** If true, omits the " ago" suffix for past dates. */
    ignorePast?: boolean;
}

/**
 * Formats a number as a currency string using international standards.
 * @param num - The number to process
 * @param options - Formatting options
 * @example
 * currency(1234.5); // "$1,234.50"
 * currency(1234.5, 'EUR', 'de-DE'); // "1.234,50 €"
 * currency(500, 'JPY'); // "¥500" (Yen has no decimals)
 */
export function formatCurrency(
    num: number,
    options: {
        /** The ISO currency code (e.g., 'USD', 'EUR', 'GBP'). */
        currency?: string;
        /** The BCP 47 language tag. */
        locale?: Intl.LocalesArgument;
    } = {}
): string {
    return new Intl.NumberFormat(options.locale, {
        style: "currency",
        currency: options.currency
    }).format(num);
}

/**
 * Formats a number with thousands separators and optional decimal precision.
 * @param num - The number to process
 * @param options - Formatting options
 * @example
 * num(1000000); // "1,000,000" (en-US default)
 * num(1000, { locale: 'de-DE' }); // "1.000"
 * num(1234.567, { precision: 2 }); // "1,234.57"
 */
export function formatNumber(
    num: number,
    options: {
        /** The BCP 47 language tag. */
        locale?: Intl.LocalesArgument;
        precision?: number;
    } = {}
): string {
    return new Intl.NumberFormat(options.locale, {
        minimumFractionDigits: options.precision,
        maximumFractionDigits: options.precision
    }).format(num);
}

export function formatMemory(
    bytes: number,
    decimals: number = 1,
    units: string[] = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
): string {
    // Handle 0 or negative numbers immediately
    if (bytes <= 0) return `0 ${units[0]}`;

    // Calculate the magnitude index (0 for B, 1 for KB, etc.)
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const val = bytes / Math.pow(1024, i);
    return `${val.toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

/**
 * Formats a number to an ordinal (e.g., 1st, 2nd, 3rd).
 * @param num The number to process
 * @param locale The BCP 47 language tag
 */
export function formatOrdinal(num: number | string, locale?: Intl.LocalesArgument): string {
    const _num = Number(num);
    if (isNaN(_num)) throw new TypeError("Invalid input");

    const pr = new Intl.PluralRules(locale, { type: "ordinal" });
    const rule = pr.select(_num);

    const suffixes: Record<string, string> = {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th"
    };

    const suffix = suffixes[rule] || "th";
    return _num.toLocaleString(locale) + suffix;
}

/**
 * Formats a number into a compact, human-readable string (e.g., 1.2k, 1M).
 * @param num - The number to process
 * @param locale - The BCP 47 language tag
 */
export function FormatNumberCompact(num: number, locale?: Intl.LocalesArgument): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1
    }).format(num);
}

/**
 * Duration formatter.
 *
 * Available styles:
 * - Digital (00:00)
 * - HMS
 * - YMDHMS.
 * @param target The target time to calculate from
 * @param style The output style to use
 * @param options Formatting options
 */
export function formatDuration(
    target: number | Date,
    style: "digital" | "hms" | "ymdhms" = "hms",
    options: FormatDurationOptions = {}
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
 * @param date - The Date object or timestamp to compare
 * @param locale - The BCP 47 language tag
 */
export function formatETA(date: Date | number, locale?: Intl.LocalesArgument): string {
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
