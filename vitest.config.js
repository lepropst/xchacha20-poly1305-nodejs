import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/__tests__/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@utilities": resolve(__dirname, "./src/utilities"),
      "@keystore": resolve(__dirname, "./src/keystore"),
      "@encryption": resolve(__dirname, "./src/encryption"),
    },
  },
});
