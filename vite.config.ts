import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

/**
 * Minimal stable Vite config after aggressive pruning.
 * Removed dynamic imports, optional visualizer, and manual chunk micromanagement
 * that referenced deleted dependencies (recharts, framer-motion, etc.).
 *
 * If you later want bundle analysis, install rollup-plugin-visualizer and
 * reintroduce it explicitly.
 */

const srcDir = path.resolve(fileURLToPath(new URL("./src", import.meta.url)));

export default defineConfig({
    base: "/graphql-bag-client/",
    plugins: [
        react(),
        // Provides a simple vendor split (react/react-dom) automatically.
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
        sourcemap: true,
        minify: "esbuild",
        rollupOptions: {
            // Keep output naming deterministic & cache-friendly + fine-grained manual chunking
            output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
                manualChunks(id) {
                    if (!id.includes("node_modules")) return;
                    // React core
                    if (id.match(/\/react(-dom)?\//)) return "react-vendor";
                    // Radix primitives actually used
                    if (
                        id.match(
                            /@radix-ui\/react-(accordion|alert-dialog|dialog|scroll-area|select|switch|tabs|label)/,
                        )
                    ) {
                        return "radix";
                    }
                    // Form & validation stack
                    if (
                        id.includes("react-hook-form") ||
                        id.includes("@hookform") ||
                        id.includes("zod")
                    ) {
                        return "forms";
                    }
                    // Date utilities
                    if (id.includes("date-fns")) return "dates";
                    // Barcode generation (heavy)
                    if (id.includes("bwip-js")) return "barcode";
                    // Icons
                    if (id.includes("lucide-react")) return "icons";
                    // Theming
                    if (id.includes("next-themes")) return "theme";
                    // Styling helpers
                    if (
                        id.includes("class-variance-authority") ||
                        id.includes("tailwind-merge")
                    ) {
                        return "styling";
                    }
                    return;
                },
            },
        },
    },
    optimizeDeps: {
        // No exclusions needed after pruning.
    },
});
