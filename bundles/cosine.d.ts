import { Vec3 } from "@fimbul-works/vec";
/**
 * Generates colors using cosine-based gradient
 * @param t - Interpolation parameter (0 to 1)
 * @param a - Vec3 center of oscillation
 * @param b - Vec3 amplitude
 * @param c - Vec3 frequency
 * @param d - Vec3 phase
 * @returns Vec3 containing the generated color
 * @see https://iquilezles.org/articles/palettes/
 */
declare function cosineGradient(t: number, a: Vec3, b: Vec3, c: Vec3, d: Vec3): Vec3;
type CosineGradientPreset = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
/**
 * Generates a palette using cosine gradient
 * @param steps - Number of colors to generate
 * @param preset - Preset parameters for the cosine gradient
 * @returns Array of Vec3 colors
 */
declare function generateCosinePalette(steps: number, preset: CosineGradientPreset): Vec3[];
declare const COSINE_PRESET_RAINBOW: {
  readonly a: Vec3;
  readonly b: Vec3;
  readonly c: Vec3;
  readonly d: Vec3;
};
declare const COSINE_PRESET_FIRE: {
  readonly a: Vec3;
  readonly b: Vec3;
  readonly c: Vec3;
  readonly d: Vec3;
};
declare const COSINE_PRESET_ICE: {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
export { COSINE_PRESET_FIRE, COSINE_PRESET_ICE, COSINE_PRESET_RAINBOW, CosineGradientPreset, cosineGradient, generateCosinePalette };