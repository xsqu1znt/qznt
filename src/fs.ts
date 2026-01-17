import _fs from "node:fs";
import { join } from "node:path";

export interface ReadDirOptions {
    /** Whether to scan subdirectories. [default: true] */
    recursive?: boolean;
}

/**
 * Recursively (or shallowly) scans a directory and returns an array of relative file paths.
 * @param path The path to the directory.
 * @param options Options for the readDir function.
 */
function readDir(path: string, options: ReadDirOptions = {}): string[] {
    const { recursive = true } = options;

    if (!_fs.existsSync(path)) return [];

    // Shallow read
    if (!recursive) {
        return _fs.readdirSync(path).filter(fn => {
            return _fs.statSync(join(path, fn)).isFile();
        });
    }

    // Recursive walk
    const walk = (dir: string, base: string = ""): string[] => {
        const results: string[] = [];

        // Using withFileTypes is much faster as it returns Dirent objects
        const entries = _fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const relativePath = base ? join(base, entry.name) : entry.name;
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                results.push(...walk(fullPath, relativePath));
            } else if (entry.isFile()) {
                results.push(relativePath);
            }
        }

        return results;
    };

    return walk(path);
}

export { readDir };
