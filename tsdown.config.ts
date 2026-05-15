import { defineConfig, type UserConfig } from "tsdown";

const entryPoints = {
  bundle: "src/index.ts",
  alpha: "src/alpha.ts",
  blend: "src/blend.ts",
  cmyk: "src/cmyk.ts",
  colorblind: "src/colorblind.ts",
  cosine: "src/cosine.ts",
  debug: "src/debug.ts",
  format: "src/format.ts",
  gamut: "src/gamut.ts",
  hsl: "src/hsl.ts",
  kelvin: "src/kelvin.ts",
  lab: "src/lab.ts",
  palette: "src/palette.ts",
  preset: "src/preset.ts",
  transform: "src/transform.ts",
  xyz: "src/xyz.ts",
};

const commonConfig: UserConfig = {
  platform: "browser",
  format: ["esm"],
  target: "es2022",
  dts: true,
  treeshake: true,
  outDir: "bundles",
  inputOptions: {
    optimization: {
      inlineConst: false,
    },
    experimental: {
      attachDebugInfo: "none",
    },
  },
  deps: {
    neverBundle: "@fimbul-works/vec",
  },
};

export default defineConfig(
  Object.entries(entryPoints).map(([key, entry]) => ({
    entry: {
      [key]: entry,
    },
    ...commonConfig,
  })),
);
