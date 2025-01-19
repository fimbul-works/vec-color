import { Vec3 } from "@fimbul-works/vec";

/**
 * Converts color temperature in Kelvin to RGB
 * Valid range is 1000K to 40000K
 * @param kelvin Temperature in Kelvin (1000-40000)
 * @returns Vec3 containing RGB values
 * @see https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
 */
export function kelvinToRGB(kelvin: number): Vec3 {
  kelvin = Math.max(1000, Math.min(40000, kelvin));

  let r: number;
  let g: number;
  let b: number;

  // Red
  if (kelvin <= 6600) {
    r = 1;
  } else {
    r = ((kelvin / 100 - 60) * -0.0132872 + 1.29293) ** 2;
  }

  // Green
  if (kelvin <= 6600) {
    g = ((kelvin / 100 - 2) * 0.017991) ** 2;
  } else {
    g = ((kelvin / 100 - 60) * -0.011679 + 1.12989) ** 2;
  }

  // Blue
  if (kelvin <= 2000) {
    b = 0;
  } else if (kelvin <= 6600) {
    b = ((kelvin / 100 - 10) * 0.0201616) ** 2;
  } else {
    b = 1;
  }

  // Clamp and normalize values
  return new Vec3(
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b)),
  );
}

/**
 * Estimates the color temperature of an RGB color
 * This is an approximation as not all colors map to a temperature
 * @param rgb Vec3 containing RGB values
 * @returns Approximate color temperature in Kelvin or null if no good match
 */
export function estimateColorTemperature(
  rgb: Vec3,
  iterations = 20,
): number | null {
  let min = 1000;
  let max = 40000;
  let closest: number | null = null;
  let minDiff = Number.POSITIVE_INFINITY;

  for (let i = 0; i < iterations; i++) {
    const mid = (min + max) / 2;
    const test = kelvinToRGB(mid);
    const diff =
      Math.abs(test.x - rgb.x) +
      Math.abs(test.y - rgb.y) +
      Math.abs(test.z - rgb.z);

    if (diff < minDiff) {
      minDiff = diff;
      closest = mid;
    }

    if (test.x / test.z > rgb.x / rgb.z) {
      max = mid;
    } else {
      min = mid;
    }
  }

  return minDiff < 0.5 ? closest : null;
}
