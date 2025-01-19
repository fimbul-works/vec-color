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
export function cosineGradient(
  t: number,
  a: Vec3,
  b: Vec3,
  c: Vec3,
  d: Vec3,
): Vec3 {
  return new Vec3(
    a.x + b.x * Math.cos(6.28318 * (c.x * t + d.x)),
    a.y + b.y * Math.cos(6.28318 * (c.y * t + d.y)),
    a.z + b.z * Math.cos(6.28318 * (c.z * t + d.z)),
  );
}

export type CosineGradientPreset = { a: Vec3; b: Vec3; c: Vec3; d: Vec3 };

/**
 * Generates a palette using cosine gradient
 * @param steps - Number of colors to generate
 * @param preset - Preset parameters for the cosine gradient
 * @returns Array of Vec3 colors
 */
export function generateCosinePalette(
  steps: number,
  preset: CosineGradientPreset,
): Vec3[] {
  const palette: Vec3[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    palette.push(cosineGradient(t, preset.a, preset.b, preset.c, preset.d));
  }
  return palette;
}

export const COSINE_PRESET_RAINBOW = {
  a: new Vec3(0.5, 0.5, 0.5),
  b: new Vec3(0.5, 0.5, 0.5),
  c: new Vec3(1.0, 1.0, 1.0),
  d: new Vec3(0.0, 0.33, 0.67),
} as const;

export const COSINE_PRESET_FIRE = {
  a: new Vec3(0.5, 0.5, 0.5),
  b: new Vec3(0.5, 0.5, 0.5),
  c: new Vec3(1.0, 1.0, 1.0),
  d: new Vec3(0.0, 0.1, 0.2),
} as const;

export const COSINE_PRESET_ICE = {
  a: new Vec3(0.5, 0.5, 0.5),
  b: new Vec3(0.5, 0.5, 0.5),
  c: new Vec3(1.0, 1.0, 1.0),
  d: new Vec3(0.3, 0.2, 0.2),
};
