import { Vec3, Vec4 } from "@fimbul-works/vec";
/**
 * Adds an alpha channel to RGB
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing RGBA values
 */
declare function withAlpha(color: Vec3, alpha?: number): Vec4;
/**
 * Converts a color with alpha to premultiplied RGBA
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing premultiplied RGBA values
 */
declare function toPremultipliedAlpha(color: Vec3, alpha?: number): Vec4;
/**
 * Converts a premultiplied RGBA color back to straight RGB and alpha
 * @param premultiplied - Premultiplied color as Vec4 RGBA
 * @returns [Vec3, number] tuple containing RGB color and alpha value
 */
declare function fromPremultipliedAlpha(premultiplied: Vec4): [Vec3, number];
export { fromPremultipliedAlpha, toPremultipliedAlpha, withAlpha };