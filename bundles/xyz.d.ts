import { Vec3 } from "@fimbul-works/vec";
/**
 * Converts RGB color to CIE XYZ color space using D65 illuminant
 * XYZ color space is a device-independent color space that represents all visible colors
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
 */
declare function rgbToXYZ(rgb: Vec3): Vec3;
/**
 * Converts CIE XYZ color to RGB color space using D65 illuminant
 * Performs gamut mapping to ensure RGB values are within valid range
 * @param xyz - Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function xyzToRGB(xyz: Vec3): Vec3;
export { rgbToXYZ, xyzToRGB };