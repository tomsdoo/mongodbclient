import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        test: {
          include: ["__test__/**/*.test.ts"],
          exclude: ["__test__/**/*.local.test.ts"],
          name: "node",
          environment: "node",
        },
      },
      {
        extends: "./vitest.local.config.ts",
        test: {
          include: ["__test__/**/*.local.test.ts"],
          name: "local",
          environment: "node",
        },
      },
    ],
  },
});
