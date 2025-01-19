import { labToRGB, rgbToLAB } from "./lab";

import { Vec3 } from "@fimbul-works/vec";

/**
 * Checks if a color is within the sRGB gamut
 * @param color Color to check
 * @returns Boolean indicating if color is in gamut
 */
export function isInGamut(color: Vec3): boolean {
  return (
    color.x >= 0 &&
    color.x <= 1 &&
    color.y >= 0 &&
    color.y <= 1 &&
    color.z >= 0 &&
    color.z <= 1
  );
}

/**
 * Clips a color to the sRGB gamut
 * Simple but can lose relationships between colors
 * @param color Color to clip
 * @returns Clipped color
 */
export function clipToGamut(color: Vec3): Vec3 {
  return new Vec3(
    Math.min(1, Math.max(0, color.x)),
    Math.min(1, Math.max(0, color.y)),
    Math.min(1, Math.max(0, color.z)),
  );
}

/**
 * Compresses out-of-gamut colors while preserving relationships
 * More sophisticated than clipping but more computationally expensive
 * @param color Color to compress
 * @param preserveHue Whether to preserve the color's hue (default: true)
 * @returns Compressed color within gamut
 */
export function compressToGamut(color: Vec3, preserveHue = true): Vec3 {
  if (isInGamut(color)) return color;

  const lab = rgbToLAB(color);
  let compressed: Vec3;

  if (preserveHue) {
    // Preserve hue by adjusting only lightness and chroma
    const L = lab.x;
    const a = lab.y;
    const b = lab.z;
    const chroma = Math.sqrt(a * a + b * b);

    // Binary search for maximum in-gamut chroma
    let low = 0;
    let high = chroma;
    let bestInGamut = clipToGamut(color);

    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const scale = mid / chroma;
      const testLab = new Vec3(L, a * scale, b * scale);
      const testRgb = labToRGB(testLab);

      if (isInGamut(testRgb)) {
        bestInGamut = testRgb;
        low = mid;
      } else {
        high = mid;
      }
    }

    compressed = bestInGamut;
  } else {
    // Simple compression in LAB space
    const center = new Vec3(50, 0, 0); // LAB middle gray
    const vector = lab.subtract(center);
    let scale = 1;

    while (
      !isInGamut((compressed = labToRGB(center.add(vector.scale(scale))))) &&
      scale > 0
    ) {
      scale *= 0.9;
    }
  }

  return compressed;
}

/**
 * Projects an out-of-gamut color back into gamut while preserving lightness
 * Useful for maintaining perceived brightness while ensuring displayable colors
 * @param color Color to project
 * @returns Projected in-gamut color
 */
export function projectToGamut(color: Vec3): Vec3 {
  if (isInGamut(color)) return color;

  const lab = rgbToLAB(color);
  const L = lab.x;
  let result = clipToGamut(color);
  let resultLab = rgbToLAB(result);

  // Adjust result to maintain original lightness
  const lightnessDiff = L - resultLab.x;
  if (Math.abs(lightnessDiff) > 0.01) {
    resultLab = new Vec3(L, resultLab.y, resultLab.z);
    result = clipToGamut(labToRGB(resultLab));
  }

  return result;
}
