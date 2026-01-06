import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    target: "es2022",
    outDir: "dist",
    sourcemap: true,
    splitting: false,
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,

    // Better output naming for dual package
    outExtension({ format }) {
        return {
            js: format === "cjs" ? ".cjs" : ".js"
        };
    },

    // Ensure proper external handling
    external: ["node:fs", "node:path"],

    // Bundle analysis
    metafile: true
});
