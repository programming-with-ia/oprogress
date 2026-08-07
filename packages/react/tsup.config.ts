import { defineConfig } from "tsup";
import { copyFileSync } from "fs";

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
          copyFileSync("../core/src/index.css", "./dist/index.css");
        });
      },
    },
  ],
});
