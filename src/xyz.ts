import { Vec3 } from "@fimbul-works/vec";

/**
 * Converts RGB color to CIE XYZ color space using D65 illuminant
 * XYZ color space is a device-independent color space that represents all visible colors
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
 */
export function rgbToXYZ(rgb: Vec3) {
  let [r, g, b] = rgb;

  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

  return new Vec3(
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.072175,
    r * 0.0193339 + g * 0.119192 + b * 0.9503041,
  );
}

/**
 * Converts CIE XYZ color to RGB color space using D65 illuminant
 * Performs gamut mapping to ensure RGB values are within valid range
 * @param xyz - Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
export function xyzToRGB(xyz: Vec3): Vec3 {
  const [x, y, z] = xyz;

  let r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
  let g = -x * 0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;

  r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * b ** (1 / 2.4) - 0.055 : 12.92 * b;

  return new Vec3(Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b)));
}
