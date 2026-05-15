import { Vec3, Vec4 } from "@fimbul-works/vec";
/**
 * Converts RGB color values to CMYK color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec4 containing CMYK values (each channel from 0 to 1)
 */
declare function rgbToCMYK(rgb: Vec3): Vec4;
/**
 * Converts CMYK color values to RGB color space
 * @param cmyk - Vec4 containing CMYK values (each channel from 0 to 1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function cmykToRGB(cmyk: Vec4): Vec3;
export { cmykToRGB, rgbToCMYK };