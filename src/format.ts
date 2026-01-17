/**
 * Formats a number as a currency string using international standards.
 * @param num - The number to process.
 * @param options - Formatting options.
 * @example
 * currency(1234.5); // "$1,234.50"
 * currency(1234.5, 'EUR', 'de-DE'); // "1.234,50 €"
 * currency(500, 'JPY'); // "¥500" (Yen has no decimals)
 */
function currency(
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
 * @param num - The number to process.
 * @param options - Formatting options.
 * @example
 * num(1000000); // "1,000,000" (en-US default)
 * num(1000, { locale: 'de-DE' }); // "1.000"
 * num(1234.567, { precision: 2 }); // "1,234.57"
 */
function number(
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

function memory(
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
 * @param num The number to process.
 * @param locale The BCP 47 language tag.
 */
function ordinal(num: number | string, locale?: Intl.LocalesArgument): string {
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
 * @param num - The number to process.
 * @param locale - The BCP 47 language tag.
 */
function compactNumber(num: number, locale?: Intl.LocalesArgument): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1
    }).format(num);
}

export { currency, number, memory, ordinal, compactNumber };
