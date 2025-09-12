import { Vec3, Vec4 } from "@fimbul-works/vec";

/**
 * Converts RGB color values to CMYK color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec4 containing CMYK values (each channel from 0 to 1)
 */
export function rgbToCMYK(rgb: Vec3): Vec4 {
  const k = 1 - Math.max(rgb.r, rgb.g, rgb.b);
  if (k === 1) return new Vec4(0, 0, 0, 1);

  const c = (1 - rgb.r - k) / (1 - k);
  const m = (1 - rgb.g - k) / (1 - k);
  const y = (1 - rgb.b - k) / (1 - k);

  return new Vec4(c, m, y, k);
}

/**
 * Converts CMYK color values to RGB color space
 * @param cmyk - Vec4 containing CMYK values (each channel from 0 to 1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
export function cmykToRGB(cmyk: Vec4): Vec3 {
  const r = (1 - cmyk.x) * (1 - cmyk.w);
  const g = (1 - cmyk.y) * (1 - cmyk.w);
  const b = (1 - cmyk.z) * (1 - cmyk.w);
  return new Vec3(r, g, b);
}
