import { Vec3 } from "@fimbul-works/vec";
type ColorClassification = {
  temperature: "warm" | "cool" | "neutral";
  intensity: "vivid" | "pastel" | "dark" | "light" | "medium";
  category: string;
};
/**
 * Classifies a color into basic categories
 * @param color Color as Vec3 RGB
 * @returns Object containing color classifications
 */
declare function classifyColor(color: Vec3): ColorClassification;
interface ColorDebugInfo {
  original: {
    vec3: string;
    rgb: string;
    hex: string;
    hsl: string;
  };
  colorSpaces: {
    rgb: {
      r: number;
      g: number;
      b: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
    };
    lab: {
      l: number;
      a: number;
      b: number;
    };
  };
  characteristics: {
    luminance: number;
    temperature: number | null;
    classification: ReturnType<typeof classifyColor>;
  };
  accessibility: {
    contrastRatios: {
      onWhite: number;
      onBlack: number;
      onGray: number;
    };
    wcag: {
      AANormal: boolean;
      AAANormal: boolean;
      AALarge: boolean;
      AAALarge: boolean;
    };
  };
  colorBlindness: {
    protanopia: string;
    deuteranopia: string;
    tritanopia: string;
    achromatopsia: string;
  };
}
type ColorChannelValidation = {
  valid: boolean;
  value: number;
  min: number;
  max: number;
};
interface ColorValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  colorSpace: {
    inGamut: boolean;
    channelValidation: {
      [channel: string]: ColorChannelValidation;
    };
  };
}
/**
 * Provides comprehensive debug information about a color
 * @param color Color to analyze
 * @returns Detailed color information for debugging
 */
declare function debugColor(color: Vec3): ColorDebugInfo;
/**
 * Validates if a color is within valid ranges for its color space
 * and provides detailed validation information
 * @param color Color to validate
 * @param space Color space to validate against
 * @returns Validation results with detailed information
 */
declare function validateColorSpace(color: Vec3, space?: "RGB" | "HSL" | "LAB"): ColorValidationResult;
export { ColorValidationResult, debugColor, validateColorSpace };