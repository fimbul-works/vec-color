import { Vec3, Vec4 } from "@fimbul-works/vec";

/**
 * Adds an alpha channel to RGB
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing RGBA values
 */
export function withAlpha(color: Vec3, alpha = 1): Vec4 {
  return new Vec4(color.x, color.y, color.z, alpha);
}

/**
 * Converts a color with alpha to premultiplied RGBA
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing premultiplied RGBA values
 */
export function toPremultipliedAlpha(color: Vec3, alpha = 1): Vec4 {
  return new Vec4(color.x * alpha, color.y * alpha, color.z * alpha, alpha);
}

/**
 * Converts a premultiplied RGBA color back to straight RGB and alpha
 * @param premultiplied - Premultiplied color as Vec4 RGBA
 * @returns [Vec3, number] tuple containing RGB color and alpha value
 */
export function fromPremultipliedAlpha(premultiplied: Vec4): [Vec3, number] {
  const alpha = premultiplied.w;
  if (alpha === 0) return [new Vec3(0, 0, 0), 0];

  return [
    new Vec3(
      premultiplied.x / alpha,
      premultiplied.y / alpha,
      premultiplied.z / alpha,
    ),
    alpha,
  ];
}
