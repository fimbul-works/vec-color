import { Vec3 } from "@fimbul-works/vec";
import { calculateColorSimilarityLab } from "./analyze";
import { hslToRGB, rgbToHSL } from "./hsl";

type ColorBlindnessType = keyof typeof SIMULATION_MATRICES;

/**
 * Simulation matrices for different types of color blindness
 * Based on color blind simulation research by Brettel, Viénot, and Mollon
 */
const SIMULATION_MATRICES = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
} as const;

/**
 * Simulates how a color would appear to someone with color blindness
 * @param color Input color as Vec3 RGB
 * @param type Type of color blindness to simulate
 * @returns Simulated color as Vec3 RGB
 */
export function simulateColorBlindness(color: Vec3, type: ColorBlindnessType): Vec3 {
  const matrix = SIMULATION_MATRICES[type];

  return new Vec3(
    color.r * matrix[0][0] + color.g * matrix[0][1] + color.b * matrix[0][2],
    color.r * matrix[1][0] + color.g * matrix[1][1] + color.b * matrix[1][2],
    color.r * matrix[2][0] + color.g * matrix[2][1] + color.b * matrix[2][2],
  );
}

/**
 * Checks if two colors are distinguishable for different types of color blindness
 * @param color1 First color as Vec3 RGB
 * @param color2 Second color as Vec3 RGB
 * @param type Type of color blindness to check
 * @param threshold Minimum difference threshold (0-1, default: 0.1)
 * @returns Boolean indicating if colors are distinguishable
 */
export function isDistinguishableForColorBlindness(
  color1: Vec3,
  color2: Vec3,
  type: ColorBlindnessType,
  threshold = 0.1,
): boolean {
  const simulated1 = simulateColorBlindness(color1, type);
  const simulated2 = simulateColorBlindness(color2, type);

  const difference = Math.sqrt(
    (simulated1.r - simulated2.r) ** 2 + (simulated1.g - simulated2.g) ** 2 + (simulated1.b - simulated2.b) ** 2,
  );

  return difference > threshold;
}

/**
 * Optimizes a set of colors to be distinguishable for color blind users
 * @param colors Array of colors to optimize
 * @returns Optimized colors that maintain distinctiveness across color blindness types
 */
export function optimizeForColorBlindness(colors: Vec3[]): Vec3[] {
  const optimized: Vec3[] = [];
  const types: ColorBlindnessType[] = ["protanopia", "deuteranopia", "tritanopia", "achromatopsia"];

  if (colors.length > 0) {
    optimized.push(colors[0]);
  }

  for (const color of colors.slice(1)) {
    let bestColor = color;
    let maxMinDifference = 0;

    const hsl = rgbToHSL(color);

    for (let hueShift = 0; hueShift < 360; hueShift += 15) {
      for (let satAdjust = -0.2; satAdjust <= 0.2; satAdjust += 0.1) {
        for (let lightAdjust = -0.2; lightAdjust <= 0.2; lightAdjust += 0.1) {
          const testColor = hslToRGB(
            new Vec3(
              ((hsl.r * 360 + hueShift) % 360) / 360,
              Math.max(0.1, Math.min(1, hsl.g + satAdjust)),
              Math.max(0.1, Math.min(0.9, hsl.b + lightAdjust)),
            ),
          );

          let minDifference = 1;

          for (const type of types) {
            const simulatedTest = simulateColorBlindness(testColor, type);

            for (const existing of optimized) {
              const simulatedExisting = simulateColorBlindness(existing, type);
              const difference = 1 - calculateColorSimilarityLab(simulatedTest, simulatedExisting);
              minDifference = Math.min(minDifference, difference);
            }
          }

          if (minDifference > maxMinDifference) {
            maxMinDifference = minDifference;
            bestColor = testColor;
          }
        }
      }
    }

    optimized.push(bestColor);
  }

  return optimized;
}

/**
 * Validates if a color palette is safe for color blind users
 * @param colors Array of colors to validate
 * @returns Validation result with detailed issues
 */
export function validateColorBlindnessSafety(colors: Vec3[]): {
  safe: boolean;
  issues: Array<{
    type: ColorBlindnessType;
    problematicPairs: [Vec3, Vec3][];
  }>;
} {
  const types: ColorBlindnessType[] = ["protanopia", "deuteranopia", "tritanopia", "achromatopsia"];
  const issues: Array<{
    type: ColorBlindnessType;
    problematicPairs: [Vec3, Vec3][];
  }> = [];

  const similarityThreshold = 0.1;

  for (const type of types) {
    const problematicPairs: [Vec3, Vec3][] = [];

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const color1 = simulateColorBlindness(colors[i], type);
        const color2 = simulateColorBlindness(colors[j], type);

        const difference = 1 - calculateColorSimilarityLab(color1, color2);

        if (difference < similarityThreshold) {
          problematicPairs.push([colors[i], colors[j]]);
        }
      }
    }

    if (problematicPairs.length > 0) {
      issues.push({ type, problematicPairs });
    }
  }

  return {
    safe: issues.length === 0,
    issues,
  };
}
