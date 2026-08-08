import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  entry: ["src/index.tsx"],
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  external: ["react", "react-dom"],
  esbuildPlugins: [
    {
      name: "copy-css",
      setup(build) {
        build.onEnd(() => {
          mkdirSync("./dist", { recursive: true });
          copyFileSync("../core/src/index.css", "./dist/index.css");
        });
      },
    },
  ],
});
