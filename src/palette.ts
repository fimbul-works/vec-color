import { Vec3 } from "@fimbul-works/vec";
import { contrastRatio, meetsWCAGRequirements, relativeLuminance } from "./analyze";
import { hslToRGB, rgbToHSL } from "./hsl";
import { harmonizeColor } from "./transform";

/**
 * Generates the complementary color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing the complementary color
 */
export function complement(color: Vec3): Vec3 {
  const hsl = rgbToHSL(color);
  return hslToRGB(new Vec3((hsl.r + 180) % 360, hsl.y, hsl.z));
}

/**
 * Generates split-complementary colors
 * @param color Base color as Vec3 RGB
 * @returns Array of three colors: base and two split complements
 */
export function splitComplementary(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  return [
    color,
    hslToRGB(new Vec3((hsl.r + 150 / 360) % 1, hsl.y, hsl.z)),
    hslToRGB(new Vec3((hsl.r + 210 / 360) % 1, hsl.y, hsl.z)),
  ];
}

/**
 * Generates an analogous color scheme
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of three Vec3 colors: the original and two analogous colors
 */
export function analogous(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  return [
    color,
    hslToRGB(new Vec3((hsl.r + 30) % 360, hsl.y, hsl.z)),
    hslToRGB(new Vec3((hsl.r - 30 + 360) % 360, hsl.y, hsl.z)),
  ];
}

/**
 * Generates a triadic color scheme
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of three Vec3 colors: the original and two triadic colors
 */
export function triadic(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  return [
    color,
    hslToRGB(new Vec3((hsl.r + 120) % 360, hsl.y, hsl.z)),
    hslToRGB(new Vec3((hsl.r + 240) % 360, hsl.y, hsl.z)),
  ];
}

/**
 * Generates a tetradic (double complementary) color scheme
 * @param color Base color as Vec3 RGB
 * @returns Array of four colors in tetradic arrangement
 */
export function tetradic(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  return [
    color,
    hslToRGB(new Vec3((hsl.r + 90 / 360) % 1, hsl.y, hsl.z)),
    hslToRGB(new Vec3((hsl.r + 180 / 360) % 1, hsl.y, hsl.z)),
    hslToRGB(new Vec3((hsl.r + 270 / 360) % 1, hsl.y, hsl.z)),
  ];
}

/**
 * Generates a monochromatic color palette
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of 5 colors with varying lightness (20%, 40%, original, 60%, 80%)
 */
export function monochromatic(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  return [
    hslToRGB(new Vec3(hsl.x, hsl.y, 20)),
    hslToRGB(new Vec3(hsl.x, hsl.y, 40)),
    color,
    hslToRGB(new Vec3(hsl.x, hsl.y, 60)),
    hslToRGB(new Vec3(hsl.x, hsl.y, 80)),
  ];
}

/**
 * Generates a compound color scheme
 * Base color, complement, and two analogous colors to the complement
 * @param color Base color as Vec3 RGB
 * @returns Array of four colors in compound arrangement
 */
export function compound(color: Vec3): Vec3[] {
  const hsl = rgbToHSL(color);
  const complementHue = (hsl.r + 0.5) % 1;
  return [
    color,
    hslToRGB(new Vec3(complementHue, hsl.y, hsl.z)),
    hslToRGB(new Vec3((complementHue + 30 / 360) % 1, hsl.g * 0.9, hsl.z)),
    hslToRGB(new Vec3((complementHue - 30 / 360 + 1) % 1, hsl.g * 0.9, hsl.z)),
  ];
}

/**
 * Generates a series of shades (darker variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of shades to generate (default: 5)
 * @returns Array of colors from darkest to original
 */
export function shades(color: Vec3, steps = 5): Vec3[] {
  const hsl = rgbToHSL(color);
  const result: Vec3[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = (hsl.z * (i + 1)) / steps;
    result.push(hslToRGB(new Vec3(hsl.x, hsl.y, lightness)));
  }

  return result;
}

/**
 * Generates a series of tints (lighter variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of tints to generate (default: 5)
 * @returns Array of colors from original to lightest
 */
export function tints(color: Vec3, steps = 5): Vec3[] {
  const hsl = rgbToHSL(color);
  const result: Vec3[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = hsl.z + ((1 - hsl.z) * i) / (steps - 1);
    result.push(hslToRGB(new Vec3(hsl.x, hsl.y, lightness)));
  }

  return result;
}

/**
 * Generates a series of tones (reduced saturation variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of tones to generate (default: 5)
 * @returns Array of colors from original to fully desaturated
 */
export function tones(color: Vec3, steps = 5): Vec3[] {
  const hsl = rgbToHSL(color);
  const result: Vec3[] = [];

  for (let i = 0; i < steps; i++) {
    const saturation = hsl.y * (1 - i / (steps - 1));
    result.push(hslToRGB(new Vec3(hsl.x, saturation, hsl.z)));
  }

  return result;
}

/**
 * Determines the best text color (black or white) for a given background color
 * @param backgroundColor - Background color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing either black or white RGB values
 */
export function getTextColor(backgroundColor: Vec3): Vec3 {
  const luminance = relativeLuminance(backgroundColor);
  return luminance > 0.179 ? new Vec3(0, 0, 0) : new Vec3(1, 1, 1);
}

/**
 * Generates an accessible color palette that meets WCAG contrast requirements
 * @param baseColor - Starting color as Vec3 RGB (each channel from 0 to 1)
 * @param count - Number of colors to generate (default: 5)
 * @param minContrast - Minimum contrast ratio required (default: 4.5)
 * @returns Array of Vec3 colors that meet contrast requirements
 */
export function generateAccessiblePalette(baseColor: Vec3, count = 5, minContrast = 4.5): Vec3[] {
  const palette: Vec3[] = [baseColor];
  const hsl = rgbToHSL(baseColor);

  for (let i = 1; i < count; i++) {
    const newHsl = new Vec3((hsl.x + (360 / count) * i) % 360, hsl.y, hsl.z);

    let color = hslToRGB(newHsl);
    while (contrastRatio(baseColor, color) < minContrast) {
      newHsl.z = Math.max(0, Math.min(100, newHsl.z + 5));
      color = hslToRGB(newHsl);
    }

    palette.push(color);
  }

  return palette;
}

/**
 * Harmonizes a set of colors while maintaining WCAG compliance
 * @param colors Array of colors to harmonize
 * @param wcagLevel WCAG compliance level to maintain
 * @returns Harmonized colors
 */
export function harmonizePalette(colors: Vec3[], wcagLevel: "AA" | "AAA" = "AA"): Vec3[] {
  if (colors.length < 2) return colors;

  // Start with the first color as reference
  const harmonized: Vec3[] = [colors[0]];
  const remaining = colors.slice(1);

  // Helper to check if a color maintains contrast with existing colors
  const maintainsContrast = (color: Vec3): boolean => {
    return harmonized.every((existing) => meetsWCAGRequirements(color, existing, wcagLevel));
  };

  // Process each remaining color
  for (const color of remaining) {
    let harmonizedColor = harmonizeColor(color, harmonized[0]);

    // If the harmonized color doesn't meet contrast requirements,
    // adjust its lightness until it does
    if (!maintainsContrast(harmonizedColor)) {
      const hsl = rgbToHSL(harmonizedColor);
      const attempts = [-0.1, 0.1, -0.2, 0.2, -0.3, 0.3];

      for (const adjustment of attempts) {
        const adjusted = hslToRGB(new Vec3(hsl.x, hsl.y, Math.max(0.1, Math.min(0.9, hsl.z + adjustment))));

        if (maintainsContrast(adjusted)) {
          harmonizedColor = adjusted;
          break;
        }
      }
    }

    harmonized.push(harmonizedColor);
  }

  return harmonized;
}
