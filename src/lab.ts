import { rgbToXYZ, xyzToRGB } from "./xyz";

import { Vec3 } from "@fimbul-works/vec";

// D65 reference white point
const WHITE_POINT_X = 0.95047;
const WHITE_POINT_Y = 1.0;
const WHITE_POINT_Z = 1.08883;

/**
 * Converts XYZ color to CIE LAB color space using D65 illuminant
 * LAB represents all visible colors with L for lightness (0-100), a for green-red, and b for blue-yellow
 * @param xyz - Vec3 containing XYZ values (each channel normalized)
 * @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 */
export function xyzToLAB(xyz: Vec3) {
  const [x, y, z] = xyz;

  const f = (t: number) => (t > (6 / 29) ** 3 ? t ** (1 / 3) : (1 / 3) * (29 / 6) ** 2 * t + 4 / 29);

  return new Vec3(
    116 * f(y / WHITE_POINT_Y) - 16,
    500 * (f(x / WHITE_POINT_X) - f(y / WHITE_POINT_Y)),
    200 * (f(y / WHITE_POINT_Y) - f(z / WHITE_POINT_Z)),
  );
}

/**
 * Converts CIE LAB color to XYZ color space using D65 illuminant
 * Transforms perceptually uniform LAB coordinates back to device-independent XYZ
 * @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 * @returns Vec3 containing XYZ values (each channel normalized)
 */
export function labToXYZ(lab: Vec3) {
  const [l, a, b] = lab;

  const finv = (t: number) => (t > 6 / 29 ? t ** 3 : 3 * (6 / 29) ** 2 * (t - 4 / 29));

  const fy = (l + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;

  return new Vec3(WHITE_POINT_X * finv(fx), WHITE_POINT_Y * finv(fy), WHITE_POINT_Z * finv(fz));
}

/**
 * Converts RGB color to CIE LAB color space
 * Provides a perceptually uniform color space useful for color difference calculations
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 */
export function rgbToLAB(rgb: Vec3) {
  return xyzToLAB(rgbToXYZ(rgb));
}

/**
 * Converts CIE LAB color to RGB color space
 * Transforms perceptually uniform color coordinates to display-ready RGB values
 * @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
export function labToRGB(lab: Vec3): Vec3 {
  return xyzToRGB(labToXYZ(lab));
}
