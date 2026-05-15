import { Vec3 } from "@fimbul-works/vec";
type ColorBlindnessType = keyof typeof SIMULATION_MATRICES;
/**
 * Simulation matrices for different types of color blindness
 * Based on color blind simulation research by Brettel, Viénot, and Mollon
 */
declare const SIMULATION_MATRICES: {
  readonly protanopia: readonly [readonly [0.567, 0.433, 0], readonly [0.558, 0.442, 0], readonly [0, 0.242, 0.758]];
  readonly deuteranopia: readonly [readonly [0.625, 0.375, 0], readonly [0.7, 0.3, 0], readonly [0, 0.3, 0.7]];
  readonly tritanopia: readonly [readonly [0.95, 0.05, 0], readonly [0, 0.433, 0.567], readonly [0, 0.475, 0.525]];
  readonly achromatopsia: readonly [readonly [0.299, 0.587, 0.114], readonly [0.299, 0.587, 0.114], readonly [0.299, 0.587, 0.114]];
};
/**
 * Simulates how a color would appear to someone with color blindness
 * @param color Input color as Vec3 RGB
 * @param type Type of color blindness to simulate
 * @returns Simulated color as Vec3 RGB
 */
declare function simulateColorBlindness(color: Vec3, type: ColorBlindnessType): Vec3;
/**
 * Checks if two colors are distinguishable for different types of color blindness
 * @param color1 First color as Vec3 RGB
 * @param color2 Second color as Vec3 RGB
 * @param type Type of color blindness to check
 * @param threshold Minimum difference threshold (0-1, default: 0.1)
 * @returns Boolean indicating if colors are distinguishable
 */
declare function isDistinguishableForColorBlindness(color1: Vec3, color2: Vec3, type: ColorBlindnessType, threshold?: number): boolean;
/**
 * Optimizes a set of colors to be distinguishable for color blind users
 * @param colors Array of colors to optimize
 * @returns Optimized colors that maintain distinctiveness across color blindness types
 */
declare function optimizeForColorBlindness(colors: Vec3[]): Vec3[];
/**
 * Validates if a color palette is safe for color blind users
 * @param colors Array of colors to validate
 * @returns Validation result with detailed issues
 */
declare function validateColorBlindnessSafety(colors: Vec3[]): {
  safe: boolean;
  issues: Array<{
    type: ColorBlindnessType;
    problematicPairs: [Vec3, Vec3][];
  }>;
};
export { isDistinguishableForColorBlindness, optimizeForColorBlindness, simulateColorBlindness, validateColorBlindnessSafety };