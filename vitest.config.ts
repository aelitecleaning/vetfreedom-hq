import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Map the "@/..." alias used across the app so tests can import app modules.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
