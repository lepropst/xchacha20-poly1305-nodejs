import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XChaCha20Poly1305",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Externalize dependencies to avoid bundling them
      external: ["@noble/ciphers"],
      output: {
        // Provide globals for UMD build (if you add 'umd' format later)
        globals: {
          "@noble/ciphers": "NobleCiphers",
        },
      },
    },
    sourcemap: true,
    // Let consumers handle minification
    minify: false,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
