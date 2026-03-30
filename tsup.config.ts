import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/mongodbclient.ts"],
  clean: true,
  dts: false,
  format: ["esm", "cjs"],
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
