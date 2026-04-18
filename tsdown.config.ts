import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/mongodbclient.ts"],
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  target: false,
});
