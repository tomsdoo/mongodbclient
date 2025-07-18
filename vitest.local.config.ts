import { loadEnvFile } from "process";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";
import defaultConfig from "./vitest.config";

loadEnvFile(fileURLToPath(new URL("./.env.local", import.meta.url)));

export default defineConfig({
  ...defaultConfig,
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
