import { Vec3 } from "@fimbul-works/vec";
/**
 * Converts RGB color values to HSL color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 */
declare function rgbToHSL(rgb: Vec3): Vec3;
/**
 * Converts HSL color values to RGB color space
 * @param hsl - Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function hslToRGB(hsl: Vec3): Vec3;
export { hslToRGB, rgbToHSL };