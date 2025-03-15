import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable TypeScript support
    typecheck: {
      enabled: true,
    },
    // Environment configuration
    environment: "node",
    // Include all test files
    include: ["test/**/*.test.ts"],
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
