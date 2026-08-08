import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "OProgressJS",
  dts: true,
  outDir: "dist",
  esbuildPlugins: [
    {
      name: "copy-css",
      setup(build) {
        build.onEnd(() => {
          mkdirSync("./dist", { recursive: true });
          copyFileSync("./src/index.css", "./dist/index.css");
        });
      },
    },
  ],
});
