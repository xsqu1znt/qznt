/**
 * Escapes regex characters in the given string.
 * @param str The string to process
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Retrieves a substring following a specific flag.
 * @param str The string to process
 * @param flag A string or regex to look for
 */
export function getFlag(str: string, flag: string | RegExp, length?: number): string | null {
    // NOTE: Using \b ensures we don't match "flag" inside "flagpole"
    const regex = flag instanceof RegExp ? flag : new RegExp(`${escapeRegex(flag)}\\b`, "g");

    const match = regex.exec(str);
    if (!match) return null;

    const startIndex = match.index + match[0].length;
    let result = str.slice(startIndex).trimStart();

    // If length is provided, limit by word count
    if (length !== undefined) {
        return result.split(/\s+/).slice(0, length).join(" ");
    }

    return result || null;
}

/**
 * Checks if a string contains a specific flag.
 * @param str The string to process
 * @param flag A string or regex to look for
 */
export function hasFlag(str: string, flag: string | RegExp): boolean {
    if (flag instanceof RegExp) return flag.test(str);

    // NOTE: Using \b ensures we don't match "flag" inside "flagpole"
    const pattern = new RegExp(`${escapeRegex(flag)}\\b`);
    return pattern.test(str);
}

/**
 * Returns the singular or plural form based on the given count.
 * @param count The amount to compare against 1
 * @param singular The word to use when count is exactly 1
 * @param plural The word to use otherwise [default: `${singular}s`]
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
    return count === 1 ? singular : plural;
}

/**
 * Formats a string to Title Case, optionally keeping acronyms and skipping minor words (the, and, of, etc.).
 * @param str The string to process
 * @param smart If true, will keep acronyms and skip minor words [default: true]
 */
export function toTitleCase(str: string, smart = true): string {
    const minorWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v\.?|via)$/i;

    return str.replace(/\w\S*/g, (txt, index) => {
        // Always capitalize the first word, otherwise check if it's a minor word
        if (smart && index !== 0 && minorWords.test(txt)) {
            return txt.toLowerCase();
        }

        // If it's already uppercase (more than 1 letter), assume it's an acronym
        if (smart && txt.length > 1 && txt === txt.toUpperCase()) {
            return txt;
        }

        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}
