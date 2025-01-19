import { Vec3 } from "@fimbul-works/vec";
import { rgbToHSL } from "./hsl";
import { rgbToLAB } from "./lab";
import { rgbToXYZ } from "./xyz";

export type ColorClassification = {
  temperature: "warm" | "cool" | "neutral";
  intensity: "vivid" | "pastel" | "dark" | "light" | "medium";
  category: string;
};

/**
 * Calculates an approximate perceptual color difference using a weighted RGB comparison
 * This is a fast approximation that weighs green more heavily than red or blue to match human perception
 * Trade speed for accuracy: use this when performance is critical and approximate results are acceptable
 * Based on the redmean color difference algorithm
 * @param colorA - First color as Vec3 RGB (each channel from 0 to 1)
 * @param colorB - Second color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference
 */
export function calculateColorSimilarityFast(A: Vec3, B: Vec3): number {
  const ar = Math.round(A.x * 255);
  const ag = Math.round(A.y * 255);
  const ab = Math.round(A.z * 255);
  const br = Math.round(B.x * 255);
  const bg = Math.round(B.y * 255);
  const bb = Math.round(B.z * 255);

  const rmean = (ar + br) / 2;
  const r = ar - br;
  const g = ag - bg;
  const b = ab - bb;

  return (
    1.0 -
    Math.sqrt(
      (Math.floor((512 + rmean) * r * r) >> 8) +
        4 * g * g +
        (Math.floor((767 - rmean) * b * b) >> 8),
    ) /
      765.0
  );
}

/**
 * Calculates precise perceptual color difference using CIE Delta E 2000
 * This is the most accurate color difference algorithm, accounting for human perception
 * characteristics in different color ranges. Uses LAB color space for calculations.
 * Trade accuracy for speed: use this when precision is more important than performance
 * @param colorA - First color as Vec3 RGB (each channel from 0 to 1)
 * @param colorB - Second color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference
 * Internally uses CIEDE2000 algorithm which has a non-linear relationship to human perception
 */
export function calculateColorSimilarityLab(rgb1: Vec3, rgb2: Vec3) {
  const lab1 = rgbToLAB(rgbToXYZ(rgb1));
  const lab2 = rgbToLAB(rgbToXYZ(rgb2));

  const difference = deltaE2000(lab1, lab2);
  const similarity = Math.exp(-difference / 10);

  return similarity;
}

/**
 * Calculates the relative luminance of a color according to WCAG 2.0 specifications
 * This is used in determining contrast ratios for accessibility compliance
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 0 and 1, where 0 is darkest and 1 is brightest
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function relativeLuminance(color: Vec3): number {
  const rsRGB =
    color.x <= 0.03928 ? color.x / 12.92 : ((color.x + 0.055) / 1.055) ** 2.4;
  const gsRGB =
    color.y <= 0.03928 ? color.y / 12.92 : ((color.y + 0.055) / 1.055) ** 2.4;
  const bsRGB =
    color.z <= 0.03928 ? color.z / 12.92 : ((color.z + 0.055) / 1.055) ** 2.4;

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Calculates the contrast ratio between two colors according to WCAG 2.0 specifications
 * @param color1 - First color as Vec3 RGB (each channel from 0 to 1)
 * @param color2 - Second color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 1 and 21, where 1 means no contrast and 21 means maximum contrast
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export function contrastRatio(color1: Vec3, color2: Vec3): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates perceived brightness based on human perception
 * Different from luminance as it accounts for human color sensitivity
 * Uses perceived brightness formula (ITU-R BT.709)
 * @param color Input color as Vec3 RGB
 * @returns Perceived brightness value (0 to 1)
 */
export function perceivedBrightness(color: Vec3): number {
  return Math.sqrt(
    0.299 * color.x * color.x +
      0.587 * color.y * color.y +
      0.114 * color.z * color.z,
  );
}

/**
 * Checks if a color combination meets WCAG contrast requirements for accessibility
 * @param foreground - Foreground color as Vec3 RGB (each channel from 0 to 1)
 * @param background - Background color as Vec3 RGB (each channel from 0 to 1)
 * @param level - WCAG compliance level to check ("AA" or "AAA")
 * @param isLargeText - Whether the text is considered "large" by WCAG standards
 * @returns boolean indicating whether the combination meets WCAG requirements
 */
export function meetsWCAGRequirements(
  foreground: Vec3,
  background: Vec3,
  level: "AA" | "AAA" = "AA",
  isLargeText = false,
): boolean {
  const ratio = contrastRatio(foreground, background);
  if (level === "AAA") {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Calculate CIEDE2000 color difference
 * @param lab1 - First color as Vec3 LAB (each channel from 0 to 1)
 * @param lab2 - Second color as Vec3 LAB (each channel from 0 to 1)
 * @returns
 */
export function deltaE2000(lab1: Vec3, lab2: Vec3) {
  const [l1, a1, b1] = lab1;
  const [l2, a2, b2] = lab2;

  const kL = 1;
  const kC = 1;
  const kH = 1;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cb = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));

  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
  const h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;

  const dLp = l2 - l1;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else {
    if (Math.abs(h2p - h1p) <= 180) {
      dhp = h2p - h1p;
    } else if (h2p - h1p > 180) {
      dhp = h2p - h1p - 360;
    } else {
      dhp = h2p - h1p + 360;
    }
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Lbp = (l1 + l2) / 2;
  const Cbp = (C1p + C2p) / 2;

  let hbp: number;
  if (C1p * C2p === 0) {
    hbp = h1p + h2p;
  } else {
    if (Math.abs(h1p - h2p) <= 180) {
      hbp = (h1p + h2p) / 2;
    } else if (h1p + h2p < 360) {
      hbp = (h1p + h2p + 360) / 2;
    } else {
      hbp = (h1p + h2p - 360) / 2;
    }
  }

  const T =
    1 -
    0.17 * Math.cos(((hbp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbp - 63) * Math.PI) / 180);

  const sL = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const sC = 1 + 0.045 * Cbp;
  const sH = 1 + 0.015 * Cbp * T;

  const RT =
    -2 *
    Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) *
    Math.sin((60 * Math.exp(-(((hbp - 275) / 25) ** 2)) * Math.PI) / 180);

  const dE = Math.sqrt(
    (dLp / (kL * sL)) ** 2 +
      (dCp / (kC * sC)) ** 2 +
      (dHp / (kH * sH)) ** 2 +
      RT * (dCp / (kC * sC)) * (dHp / (kH * sH)),
  );

  return dE;
}

/**
 * Finds dominant colors in a set of colors using k-means clustering
 * @param colors Array of colors as Vec3 RGB
 * @param count Number of dominant colors to find (default: 5)
 * @returns Array of dominant colors as Vec3 RGB
 */
export function findDominantColors(colors: Vec3[], count = 5): Vec3[] {
  if (colors.length <= count) return colors;

  let centroids = colors
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  const maxIterations = 50;
  let iterations = 0;
  let previousCentroids: Vec3[] = [];

  while (iterations < maxIterations) {
    const clusters: Vec3[][] = Array.from({ length: count }, () => []);

    for (const color of colors) {
      let minDistance = Number.POSITIVE_INFINITY;
      let closestIndex = 0;

      centroids.forEach((centroid, index) => {
        const distance = color.subtract(centroid).magnitude;
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      clusters[closestIndex].push(color);
    }

    // Update centroids
    previousCentroids = centroids;
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return previousCentroids[0];

      const sum = cluster.reduce(
        (acc, color) => acc.add(color),
        new Vec3(0, 0, 0),
      );
      return sum.scale(1 / cluster.length);
    });

    // Check for convergence
    const hasConverged = centroids.every(
      (centroid, i) =>
        centroid.subtract(previousCentroids[i]).magnitude < 0.001,
    );

    if (hasConverged) break;
    iterations++;
  }

  return centroids;
}

/**
 * Classifies a color into basic categories
 * @param color Color as Vec3 RGB
 * @returns Object containing color classifications
 */
export function classifyColor(color: Vec3): ColorClassification {
  const hsl = rgbToHSL(color);
  const lab = rgbToLAB(color);

  // Determine temperature
  const hue = hsl.x * 360;
  const temperature =
    (hue >= 30 && hue <= 110) || (hue >= 270 && hue <= 290)
      ? "cool"
      : hue > 110 && hue < 270
        ? "neutral"
        : "warm";

  // Determine intensity
  let intensity: "vivid" | "pastel" | "dark" | "light" | "medium";
  if (hsl.z < 0.2) intensity = "dark";
  else if (hsl.z > 0.8) intensity = "light";
  else if (hsl.y > 0.8) intensity = "vivid";
  else if (hsl.y < 0.3 && hsl.z > 0.7) intensity = "pastel";
  else intensity = "medium";

  // Determine basic color category
  const hueCategories = [
    { name: "red", start: 345, end: 15 },
    { name: "orange", start: 15, end: 45 },
    { name: "yellow", start: 45, end: 75 },
    { name: "green", start: 75, end: 165 },
    { name: "cyan", start: 165, end: 195 },
    { name: "blue", start: 195, end: 255 },
    { name: "purple", start: 255, end: 315 },
    { name: "pink", start: 315, end: 345 },
  ];

  let category = "grayscale";
  if (hsl.y > 0.15) {
    category =
      hueCategories.find((cat) => {
        if (cat.start > cat.end) {
          return hue >= cat.start || hue <= cat.end;
        }
        return hue >= cat.start && hue < cat.end;
      })?.name || "grayscale";
  }

  return { temperature, intensity, category };
}

/**
 * Sorts colors by various attributes
 * @param colors Array of colors to sort
 * @param by Attribute to sort by ('hue', 'saturation', 'lightness', 'temperature')
 * @returns Sorted array of colors
 */
export function sortColors(
  colors: Vec3[],
  by: "hue" | "saturation" | "lightness" | "temperature" = "hue",
): Vec3[] {
  return [...colors].sort((a, b) => {
    const hslA = rgbToHSL(a);
    const hslB = rgbToHSL(b);

    switch (by) {
      case "hue":
        return hslA.x - hslB.x;
      case "saturation":
        return hslB.y - hslA.y;
      case "lightness":
        return hslB.z - hslA.z;
      case "temperature": {
        // Calculate temperature based on red/blue ratio
        const tempA = a.x / Math.max(0.1, a.z);
        const tempB = b.x / Math.max(0.1, b.z);
        return tempB - tempA;
      }
    }
  });
}

/**
 * Creates a color distance matrix for a set of colors
 * @param colors Array of colors to analyze
 * @returns 2D array of perceptual color differences
 */
export function colorDistanceMatrix(colors: Vec3[]): number[][] {
  return colors.map((colorA) =>
    colors.map((colorB) => calculateColorSimilarityLab(colorA, colorB)),
  );
}
