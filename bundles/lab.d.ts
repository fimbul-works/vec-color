import { Vec3 } from "@fimbul-works/vec";
/**
 * Converts XYZ color to CIE LAB color space using D65 illuminant
 * LAB represents all visible colors with L for lightness (0-100), a for green-red, and b for blue-yellow
 * @param xyz - Vec3 containing XYZ values (each channel normalized)
 * @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 */
declare function xyzToLAB(xyz: Vec3): Vec3;
/**
 * Converts CIE LAB color to XYZ color space using D65 illuminant
 * Transforms perceptually uniform LAB coordinates back to device-independent XYZ
 * @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 * @returns Vec3 containing XYZ values (each channel normalized)
 */
declare function labToXYZ(lab: Vec3): Vec3;
/**
 * Converts RGB color to CIE LAB color space
 * Provides a perceptually uniform color space useful for color difference calculations
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 */
declare function rgbToLAB(rgb: Vec3): Vec3;
/**
 * Converts CIE LAB color to RGB color space
 * Transforms perceptually uniform color coordinates to display-ready RGB values
 * @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function labToRGB(lab: Vec3): Vec3;
export { labToRGB, labToXYZ, rgbToLAB, xyzToLAB };