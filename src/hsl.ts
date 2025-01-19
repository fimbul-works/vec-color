import { Vec3 } from "@fimbul-works/vec";

/**
 * Converts RGB color values to HSL color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 */
export function rgbToHSL(rgb: Vec3): Vec3 {
  const [r, g, b] = rgb.xyz;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    if (max === r) {
      h = (g - b) / diff + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    h *= 60;
  }

  return new Vec3(h / 360, s, l);
}

/**
 * Converts HSL color values to RGB color space
 * @param hsl - Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
export function hslToRGB(hsl: Vec3): Vec3 {
  const [h, s, l] = hsl.xyz;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    return new Vec3(l, l, l);
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return new Vec3(
    hue2rgb(p, q, h + 1 / 3),
    hue2rgb(p, q, h),
    hue2rgb(p, q, h - 1 / 3),
  );
}
