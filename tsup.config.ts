import type { Options } from "tsup";

const config: Options = {
  entry: ["src/core/main.ts"],
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
};

export default config;
