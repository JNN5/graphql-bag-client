import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

/**
 * Vite configuration (simplified)
 *
 * Changes vs previous version:
 * - Enabled source maps (build.sourcemap = true) to aid in production debugging.
 * - Removed custom manualChunks logic to avoid potential chunk ordering / evaluation issues.
 * - Kept deterministic asset naming for cache friendliness.
 * - Preserved @ alias to src.
 */

const srcDir = path.resolve(fileURLToPath(new URL("./src", import.meta.url)));

export default defineConfig({
    base: "/graphql-bag-client/",
    plugins: [
        react(),
        // Retain Vite's built-in simple vendor splitter (react/react-dom).
        splitVendorChunkPlugin(),
    ],
    resolve: {
        alias: {
            "@": srcDir,
        },
    },
    build: {
        target: "es2018",
        cssTarget: "chrome90",
        // Turn ON source maps for easier production debugging (will emit *.js.map files)
        sourcemap: true,
        minify: "esbuild",
        rollupOptions: {
            output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
                // No manualChunks override: let Rollup/Vite decide optimal splitting.
            },
        },
    },
    optimizeDeps: {
        // No exclusions needed at this stage.
    },
});
