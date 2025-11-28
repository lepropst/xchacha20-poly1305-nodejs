/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XChaCha20-Poly1305",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@noble/ciphers", "@noble/hashes"],
      output: {
        // globals: {
        //   "@noble/hashes":
        //   "@noble/ciphers": "NobleCiphers",
        // },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@utilities": resolve(__dirname, "./src/utilities"),
      "@keystore": resolve(__dirname, "./src/keystore"),
      "@encryption": resolve(__dirname, "./src/encryption"),
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
