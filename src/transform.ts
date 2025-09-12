import { estimateColorTemperature, kelvinToRGB } from "./kelvin";
import { hslToRGB, rgbToHSL } from "./hsl";
import { labToRGB, rgbToLAB } from "./lab";

import { Vec3 } from "@fimbul-works/vec";
import { mix } from "./blend";

/**
 * Converts a color to grayscale using luminance weights
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing grayscale RGB values
 */
export function grayscale(color: Vec3): Vec3 {
  const gray = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return new Vec3(gray, gray, gray);
}

/**
 * Inverts a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing inverted RGB values
 */
export function invert(color: Vec3): Vec3 {
  return new Vec3(1 - color.r, 1 - color.g, 1 - color.b);
}

/**
 * Adjusts the brightness of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust brightness (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
export function adjustBrightness(color: Vec3, amount: number): Vec3 {
  const hsl = rgbToHSL(color);
  return hslToRGB(new Vec3(hsl.x, hsl.y, Math.max(0, Math.min(1, hsl.z + amount))));
}

/**
 * Adjusts the saturation of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust saturation (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
export function adjustSaturation(color: Vec3, amount: number): Vec3 {
  const hsl = rgbToHSL(color);
  return hslToRGB(new Vec3(hsl.x, Math.max(0, Math.min(1, hsl.y + amount)), hsl.z));
}

/**
 * Adjusts local contrast using a combination of luminance and saturation
 * @param color Input color as Vec3 RGB
 * @param amount Amount of contrast adjustment (-1 to 1)
 * @returns Contrast adjusted color as Vec3 RGB
 */
export function adjustContrast(color: Vec3, amount: number): Vec3 {
  const lab = rgbToLAB(color);
  const midpoint = 50;
  const factor = 1 + amount;

  return labToRGB(new Vec3(midpoint + (lab.x - midpoint) * factor, lab.y * factor, lab.z * factor));
}

/**
 * Adjusts the gamma of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount of gamma adjustment
 * @returns Vec3 containing adjusted gamma values
 */
export function adjustGamma(color: Vec3, gamma: number): Vec3 {
  return new Vec3(color.r ** gamma, color.g ** gamma, color.b ** gamma);
}

/**
 * Selectively adjusts shadows and highlights
 * @param color Input color as Vec3 RGB
 * @param shadows Adjustment for shadows (-1 to 1)
 * @param highlights Adjustment for highlights (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
export function adjustTonalRange(color: Vec3, shadows: number, highlights: number): Vec3 {
  const lab = rgbToLAB(color);
  const l = lab.x;

  if (l < 50) {
    lab.x = lab.x * (1 + shadows);
  } else {
    lab.x = lab.x + (100 - lab.x) * highlights;
  }

  return labToRGB(lab);
}

/**
 * Shifts colors towards or away from pure grays
 * @param color Input color as Vec3 RGB
 * @param amount Amount of neutralization (-1 to 1, negative makes colors more neutral)
 * @returns Adjusted color as Vec3 RGB
 */
export function adjustNeutrality(color: Vec3, amount: number): Vec3 {
  const lab = rgbToLAB(color);
  const factor = 1 + amount;

  // Adjust a* and b* components to move towards/away from neutral
  const newA = lab.y * factor;
  const newB = lab.z * factor;

  return labToRGB(new Vec3(lab.x, newA, newB));
}

/**
 * Adjusts color based on its complementary color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of complementary influence (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
export function adjustComplementary(color: Vec3, amount: number): Vec3 {
  const hsl = rgbToHSL(color);
  const complementHue = (hsl.x + 0.5) % 1;
  const complement = hslToRGB(new Vec3(complementHue, hsl.y, hsl.z));

  return mix(color, complement, amount * 0.5);
}

/**
 * Adds white to create a tint of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of white to add (0 to 1)
 * @returns Tinted color as Vec3 RGB
 */
export function tint(color: Vec3, amount: number): Vec3 {
  return mix(color, new Vec3(1, 1, 1), amount);
}

/**
 * Adds black to create a shade of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of black to add (0 to 1)
 * @returns Shaded color as Vec3 RGB
 */
export function shade(color: Vec3, amount: number): Vec3 {
  return mix(color, new Vec3(0, 0, 0), amount);
}

/**
 * Adds gray to create a tone of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of gray to add (0 to 1)
 * @returns Toned color as Vec3 RGB
 */
export function tone(color: Vec3, amount: number): Vec3 {
  return mix(color, new Vec3(0.5, 0.5, 0.5), amount);
}

/**
 * Adjusts the color temperature
 * @param color Input color as Vec3 RGB
 * @param adjustment Temperature adjustment in Kelvin (-10000 to 10000)
 * @returns Temperature adjusted color as Vec3 RGB
 */
export function adjustTemperature(color: Vec3, adjustment: number): Vec3 {
  const warm = kelvinToRGB(2000); // Very warm (orange)
  const cool = kelvinToRGB(12000); // Very cool (blue)

  if (adjustment > 0) {
    return mix(color, warm, Math.min(1, adjustment / 10000));
  }
  return mix(color, cool, Math.min(1, -adjustment / 10000));
}

/**
 * Rotates the hue of a color
 * @param color Input color as Vec3 RGB
 * @param degrees Degrees to rotate the hue (-360 to 360)
 * @returns Color with rotated hue as Vec3 RGB
 */
export function rotateHue(color: Vec3, degrees: number): Vec3 {
  const hsl = rgbToHSL(color);
  const newHue = (hsl.r + degrees / 360 + 1) % 1;
  return hslToRGB(new Vec3(newHue, hsl.g, hsl.b));
}

/**
 * Adjusts color vibrance (saturates colors while preserving skin tones)
 * @param color Input color as Vec3 RGB
 * @param amount Amount to adjust vibrance (-1 to 1)
 * @returns Vibrance adjusted color as Vec3 RGB
 */
export function adjustVibrance(color: Vec3, amount: number): Vec3 {
  const lab = rgbToLAB(color);

  const saturation = Math.sqrt(lab.g * lab.g + lab.b * lab.b);

  const isSkinTone =
    color.r > color.g && color.g > color.b && color.r > 0.4 && color.r < 0.9 && color.g > 0.2 && color.g < 0.7;

  const skinToneFactor = isSkinTone ? 0.3 : 1.0;
  const saturationFactor = Math.max(0, 1 - saturation / 100);
  const adjustmentFactor = 1 + amount * skinToneFactor * saturationFactor;
  const finalFactor = amount < 0 ? 1 + amount * skinToneFactor : adjustmentFactor;

  return labToRGB(new Vec3(lab.r, lab.g * finalFactor, lab.b * finalFactor));
}

/**
 * Creates a sepia tone effect
 * @param color Input color as Vec3 RGB
 * @param amount Amount of sepia effect (0 to 1)
 * @returns Sepia-toned color as Vec3 RGB
 */
export function sepia(color: Vec3, amount: number): Vec3 {
  const r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
  const g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
  const b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;

  return mix(color, new Vec3(Math.min(1, r), Math.min(1, g), Math.min(1, b)), amount);
}

/**
 * Adjusts RGB channels independently
 * @param color Input color as Vec3 RGB
 * @param adjustments Vec3 containing adjustment values for each channel (-1 to 1)
 * @returns Color balanced color as Vec3 RGB
 */
export function colorBalance(color: Vec3, adjustments: Vec3): Vec3 {
  return new Vec3(
    Math.max(0, Math.min(1, color.r * (1 + adjustments.r))),
    Math.max(0, Math.min(1, color.g * (1 + adjustments.g))),
    Math.max(0, Math.min(1, color.b * (1 + adjustments.b))),
  );
}

/**
 * Adjusts color based on time of day lighting
 * @param color Input color as Vec3 RGB
 * @param timeOfDay Hour in 24-hour format (0-23)
 * @returns Adjusted color as Vec3 RGB
 */
export function adjustTimeOfDay(color: Vec3, timeOfDay: number): Vec3 {
  const temperatures: { [hour: number]: number } = {
    0: 2700, // Night
    6: 3500, // Dawn
    8: 5500, // Morning
    12: 6500, // Noon
    16: 5500, // Afternoon
    18: 4000, // Sunset
    20: 2700, // Evening
  };

  const hours = Object.keys(temperatures).map(Number);
  const hour = hours.reduce((prev, curr) => (Math.abs(curr - timeOfDay) < Math.abs(prev - timeOfDay) ? curr : prev));

  const targetTemp = temperatures[hour];
  const currentTemp = estimateColorTemperature(color) || 6500;
  const adjustment = targetTemp - currentTemp;

  return adjustTemperature(color, adjustment);
}

/**
 * Harmonizes a color by adjusting it to the nearest harmonic relationship
 * with a reference color while maintaining its character
 * @param color Color to harmonize
 * @param referenceColor Reference color to harmonize against
 * @returns Harmonized color
 */
export function harmonizeColor(color: Vec3, referenceColor: Vec3): Vec3 {
  const colorHSL = rgbToHSL(color);
  const refHSL = rgbToHSL(referenceColor);

  const colorHue = colorHSL.x * 360;
  const refHue = refHSL.x * 360;

  const harmonicIntervals = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  let minDiff = 360;
  let harmonicHue = colorHue;

  for (const interval of harmonicIntervals) {
    const targetHue = (refHue + interval) % 360;
    const diff = Math.min(
      Math.abs(colorHue - targetHue),
      Math.abs(colorHue - (targetHue + 360)),
      Math.abs(colorHue + 360 - targetHue),
    );

    if (diff < minDiff) {
      minDiff = diff;
      harmonicHue = targetHue;
    }
  }

  if (minDiff <= 5) {
    return color;
  }

  return hslToRGB(new Vec3(harmonicHue / 360, colorHSL.y * 0.8 + refHSL.y * 0.2, colorHSL.z * 0.8 + refHSL.z * 0.2));
}
