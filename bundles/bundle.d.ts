import { Vec3, Vec4 } from "@fimbul-works/vec";
/**
 * Adds an alpha channel to RGB
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing RGBA values
 */
declare function withAlpha(color: Vec3, alpha?: number): Vec4;
/**
 * Converts a color with alpha to premultiplied RGBA
 * @param color - Color as Vec3 RGB (each channel from 0 to 1)
 * @param alpha - Alpha value (0 to 1)
 * @returns Vec4 containing premultiplied RGBA values
 */
declare function toPremultipliedAlpha(color: Vec3, alpha?: number): Vec4;
/**
 * Converts a premultiplied RGBA color back to straight RGB and alpha
 * @param premultiplied - Premultiplied color as Vec4 RGBA
 * @returns [Vec3, number] tuple containing RGB color and alpha value
 */
declare function fromPremultipliedAlpha(premultiplied: Vec4): [Vec3, number];
type ColorClassification = {
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
declare function calculateColorSimilarityFast(A: Vec3, B: Vec3): number;
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
declare function calculateColorSimilarityLab(rgb1: Vec3, rgb2: Vec3): number;
/**
 * Calculates the relative luminance of a color according to WCAG 2.0 specifications
 * This is used in determining contrast ratios for accessibility compliance
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 0 and 1, where 0 is darkest and 1 is brightest
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
declare function relativeLuminance(color: Vec3): number;
/**
 * Calculates the contrast ratio between two colors according to WCAG 2.0 specifications
 * @param color1 - First color as Vec3 RGB (each channel from 0 to 1)
 * @param color2 - Second color as Vec3 RGB (each channel from 0 to 1)
 * @returns A value between 1 and 21, where 1 means no contrast and 21 means maximum contrast
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
declare function contrastRatio(color1: Vec3, color2: Vec3): number;
/**
 * Calculates perceived brightness based on human perception
 * Different from luminance as it accounts for human color sensitivity
 * Uses perceived brightness formula (ITU-R BT.709)
 * @param color Input color as Vec3 RGB
 * @returns Perceived brightness value (0 to 1)
 */
declare function perceivedBrightness(color: Vec3): number;
/**
 * Checks if a color combination meets WCAG contrast requirements for accessibility
 * @param foreground - Foreground color as Vec3 RGB (each channel from 0 to 1)
 * @param background - Background color as Vec3 RGB (each channel from 0 to 1)
 * @param level - WCAG compliance level to check ("AA" or "AAA")
 * @param isLargeText - Whether the text is considered "large" by WCAG standards
 * @returns boolean indicating whether the combination meets WCAG requirements
 */
declare function meetsWCAGRequirements(foreground: Vec3, background: Vec3, level?: "AA" | "AAA", isLargeText?: boolean): boolean;
/**
 * Calculate CIEDE2000 color difference
 * @param lab1 - First color as Vec3 LAB (each channel from 0 to 1)
 * @param lab2 - Second color as Vec3 LAB (each channel from 0 to 1)
 * @returns
 */
declare function deltaE2000(lab1: Vec3, lab2: Vec3): number;
/**
 * Finds dominant colors in a set of colors using k-means clustering
 * @param colors Array of colors as Vec3 RGB
 * @param count Number of dominant colors to find (default: 5)
 * @returns Array of dominant colors as Vec3 RGB
 */
declare function findDominantColors(colors: Vec3[], count?: number): Vec3[];
/**
 * Classifies a color into basic categories
 * @param color Color as Vec3 RGB
 * @returns Object containing color classifications
 */
declare function classifyColor(color: Vec3): ColorClassification;
/**
 * Sorts colors by various attributes
 * @param colors Array of colors to sort
 * @param by Attribute to sort by ('hue', 'saturation', 'lightness', 'temperature')
 * @returns Sorted array of colors
 */
declare function sortColors(colors: Vec3[], by?: "hue" | "saturation" | "lightness" | "temperature"): Vec3[];
/**
 * Creates a color distance matrix for a set of colors
 * @param colors Array of colors to analyze
 * @returns 2D array of perceptual color differences
 */
declare function colorDistanceMatrix(colors: Vec3[]): number[][];
type BlendColor = Vec3 | Vec4;
/**
 * Mix two colors with a given ratio
 * Handles both RGB and RGBA colors
 * @param color1 First color (Vec3 or Vec4)
 * @param color2 Second color (Vec3 or Vec4)
 * @param ratio Mix ratio (0 to 1)
 * @returns Mixed color in same format as inputs
 */
declare function mix<T extends BlendColor>(color1: T, color2: T, ratio: number): T;
/**
 * Blends two colors with alpha using premultiplied alpha blending
 * @param bottom - Bottom color as Vec4 RGBA
 * @param top - Top color as Vec4 RGBA
 * @returns Vec4 containing the blended RGBA color
 */
declare function blendWithAlpha(bottom: Vec4, top: Vec4): Vec4;
/**
 * Multiplies two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendMultiply<T extends BlendColor>(base: T, blend: T): T;
/**
 * Screens two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendScreen<T extends BlendColor>(base: T, blend: T): T;
/**
 * Applies overlay blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendOverlay<T extends BlendColor>(base: T, blend: T): T;
/**
 * Selects the darker color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendDarken<T extends BlendColor>(base: T, blend: T): T;
/**
 * Selects the lighter color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendLighten<T extends BlendColor>(base: T, blend: T): T;
/**
 * Brightens the base color based on the blend color using color dodge blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendColorDodge<T extends BlendColor>(base: T, blend: T): T;
/**
 * Darkens the base color based on the blend color using color burn blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendColorBurn<T extends BlendColor>(base: T, blend: T): T;
/**
 * Combines colors using hard light blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendHardLight<T extends BlendColor>(base: T, blend: T): T;
/**
 * Combines colors using soft light blend mode for a more subtle effect
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendSoftLight<T extends BlendColor>(base: T, blend: T): T;
/**
 * Calculates the absolute difference between colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendDifference<T extends BlendColor>(base: T, blend: T): T;
/**
 * Similar to difference blend mode but with lower contrast
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendExclusion<T extends BlendColor>(base: T, blend: T): T;
/**
 * Converts RGB color values to CMYK color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec4 containing CMYK values (each channel from 0 to 1)
 */
declare function rgbToCMYK(rgb: Vec3): Vec4;
/**
 * Converts CMYK color values to RGB color space
 * @param cmyk - Vec4 containing CMYK values (each channel from 0 to 1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function cmykToRGB(cmyk: Vec4): Vec3;
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
/**
 * Generates colors using cosine-based gradient
 * @param t - Interpolation parameter (0 to 1)
 * @param a - Vec3 center of oscillation
 * @param b - Vec3 amplitude
 * @param c - Vec3 frequency
 * @param d - Vec3 phase
 * @returns Vec3 containing the generated color
 * @see https://iquilezles.org/articles/palettes/
 */
declare function cosineGradient(t: number, a: Vec3, b: Vec3, c: Vec3, d: Vec3): Vec3;
type CosineGradientPreset = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
/**
 * Generates a palette using cosine gradient
 * @param steps - Number of colors to generate
 * @param preset - Preset parameters for the cosine gradient
 * @returns Array of Vec3 colors
 */
declare function generateCosinePalette(steps: number, preset: CosineGradientPreset): Vec3[];
declare const COSINE_PRESET_RAINBOW: {
  readonly a: Vec3;
  readonly b: Vec3;
  readonly c: Vec3;
  readonly d: Vec3;
};
declare const COSINE_PRESET_FIRE: {
  readonly a: Vec3;
  readonly b: Vec3;
  readonly c: Vec3;
  readonly d: Vec3;
};
declare const COSINE_PRESET_ICE: {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
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
/**
 * Options for color string formatting
 */
interface ColorStringOptions {
  format: "hex" | "rgb" | "hsl";
  alpha?: number;
  includeHash?: boolean;
}
/**
 * Converts a hex string to RGB color
 * @param hex - Hex color string (3, 6, or 8 digits with optional #)
 * @returns Vec3 containing RGB values
 * @throws Error if hex string is invalid
 */
declare function parseHex(hex: string): Vec3;
/**
 * Parses RGB/RGBA string into RGB color
 * @param rgb - RGB/RGBA string (e.g., "rgb(255, 128, 0)" or "rgba(255, 128, 0, 0.5)")
 * @returns Vec3 containing RGB values
 * @throws Error if RGB string is invalid
 */
declare function parseRGB(rgb: string): Vec3;
/**
 * Parses HSL/HSLA string into RGB color
 * @param hsl - HSL/HSLA string (e.g., "hsl(120, 100%, 50%)" or "hsla(120, 100%, 50%, 0.5)")
 * @returns Vec3 containing RGB values
 * @throws Error if HSL string is invalid
 */
declare function parseHSL(hsl: string): Vec3;
/**
 * Parses a color string in any supported format
 * @param color - Color string in hex, RGB, RGBA, HSL, or HSLA format
 * @returns Vec3 containing RGB values
 * @throws Error if color string is invalid or format is unsupported
 */
declare function parseColor(color: string): Vec3;
/**
 * Converts RGB color to hex string
 * @param color - Vec3 containing RGB values
 * @param includeHash - Whether to include # prefix (default: true)
 * @returns Hex color string
 */
declare function toHex(color: Vec3, includeHash?: boolean): string;
/**
 * Converts RGB color to RGB string
 * @param color - Vec3 containing RGB values
 * @param alpha - Optional alpha value (0 to 1)
 * @returns RGB or RGBA color string
 */
declare function toRGB(color: Vec3, alpha?: number): string;
/**
 * Converts RGB color to HSL string
 * @param color - Vec3 containing RGB values
 * @param alpha - Optional alpha value (0 to 1)
 * @returns HSL or HSLA color string
 */
declare function toHSL(color: Vec3, alpha?: number): string;
/**
 * Converts RGB color to string representation
 * @param color - Vec3 containing RGB values
 * @param options - Formatting options
 * @returns Color string in specified format
 */
declare function colorToString(color: Vec3, options: ColorStringOptions): string;
/**
 * Checks if a color is within the sRGB gamut
 * @param color Color to check
 * @returns Boolean indicating if color is in gamut
 */
declare function isInGamut(color: Vec3): boolean;
/**
 * Clips a color to the sRGB gamut
 * Simple but can lose relationships between colors
 * @param color Color to clip
 * @returns Clipped color
 */
declare function clipToGamut(color: Vec3): Vec3;
/**
 * Compresses out-of-gamut colors while preserving relationships
 * More sophisticated than clipping but more computationally expensive
 * @param color Color to compress
 * @param preserveHue Whether to preserve the color's hue (default: true)
 * @returns Compressed color within gamut
 */
declare function compressToGamut(color: Vec3, preserveHue?: boolean): Vec3;
/**
 * Projects an out-of-gamut color back into gamut while preserving lightness
 * Useful for maintaining perceived brightness while ensuring displayable colors
 * @param color Color to project
 * @returns Projected in-gamut color
 */
declare function projectToGamut(color: Vec3): Vec3;
/**
 * Converts RGB color values to HSL color space
 * @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
 * @returns Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 */
declare function rgbToHSL(rgb: Vec3): Vec3;
/**
 * Converts HSL color values to RGB color space
 * @param hsl - Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
 * @returns Vec3 containing RGB values (each channel from 0 to 1)
 */
declare function hslToRGB(hsl: Vec3): Vec3;
/**
 * Converts color temperature in Kelvin to RGB
 * Valid range is 1000K to 40000K
 * @param kelvin Temperature in Kelvin (1000-40000)
 * @returns Vec3 containing RGB values
 * @see https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
 */
declare function kelvinToRGB(kelvin: number): Vec3;
/**
 * Estimates the color temperature of an RGB color
 * This is an approximation as not all colors map to a temperature
 * @param rgb Vec3 containing RGB values
 * @returns Approximate color temperature in Kelvin or null if no good match
 */
declare function estimateColorTemperature(rgb: Vec3, iterations?: number): number | null;
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
/**
 * Generates the complementary color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing the complementary color
 */
declare function complement(color: Vec3): Vec3;
/**
 * Generates split-complementary colors
 * @param color Base color as Vec3 RGB
 * @returns Array of three colors: base and two split complements
 */
declare function splitComplementary(color: Vec3): Vec3[];
/**
 * Generates an analogous color scheme
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of three Vec3 colors: the original and two analogous colors
 */
declare function analogous(color: Vec3): Vec3[];
/**
 * Generates a triadic color scheme
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of three Vec3 colors: the original and two triadic colors
 */
declare function triadic(color: Vec3): Vec3[];
/**
 * Generates a tetradic (double complementary) color scheme
 * @param color Base color as Vec3 RGB
 * @returns Array of four colors in tetradic arrangement
 */
declare function tetradic(color: Vec3): Vec3[];
/**
 * Generates a monochromatic color palette
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Array of 5 colors with varying lightness (20%, 40%, original, 60%, 80%)
 */
declare function monochromatic(color: Vec3): Vec3[];
/**
 * Generates a compound color scheme
 * Base color, complement, and two analogous colors to the complement
 * @param color Base color as Vec3 RGB
 * @returns Array of four colors in compound arrangement
 */
declare function compound(color: Vec3): Vec3[];
/**
 * Generates a series of shades (darker variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of shades to generate (default: 5)
 * @returns Array of colors from darkest to original
 */
declare function shades(color: Vec3, steps?: number): Vec3[];
/**
 * Generates a series of tints (lighter variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of tints to generate (default: 5)
 * @returns Array of colors from original to lightest
 */
declare function tints(color: Vec3, steps?: number): Vec3[];
/**
 * Generates a series of tones (reduced saturation variations) of a color
 * @param color Base color as Vec3 RGB
 * @param steps Number of tones to generate (default: 5)
 * @returns Array of colors from original to fully desaturated
 */
declare function tones(color: Vec3, steps?: number): Vec3[];
/**
 * Determines the best text color (black or white) for a given background color
 * @param backgroundColor - Background color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing either black or white RGB values
 */
declare function getTextColor(backgroundColor: Vec3): Vec3;
/**
 * Generates an accessible color palette that meets WCAG contrast requirements
 * @param baseColor - Starting color as Vec3 RGB (each channel from 0 to 1)
 * @param count - Number of colors to generate (default: 5)
 * @param minContrast - Minimum contrast ratio required (default: 4.5)
 * @returns Array of Vec3 colors that meet contrast requirements
 */
declare function generateAccessiblePalette(baseColor: Vec3, count?: number, minContrast?: number): Vec3[];
/**
 * Harmonizes a set of colors while maintaining WCAG compliance
 * @param colors Array of colors to harmonize
 * @param wcagLevel WCAG compliance level to maintain
 * @returns Harmonized colors
 */
declare function harmonizePalette(colors: Vec3[], wcagLevel?: "AA" | "AAA"): Vec3[];
declare const ALICE_BLUE: Vec3;
declare const ANTIQUE_WHITE: Vec3;
declare const AQUA: Vec3;
declare const AQUAMARINE: Vec3;
declare const AZURE: Vec3;
declare const BEIGE: Vec3;
declare const BISQUE: Vec3;
declare const BLACK: Vec3;
declare const BLANCHED_ALMOND: Vec3;
declare const BLUE: Vec3;
declare const BLUE_VIOLET: Vec3;
declare const BROWN: Vec3;
declare const BURLYWOOD: Vec3;
declare const CADET_BLUE: Vec3;
declare const CHARTREUSE: Vec3;
declare const CHOCOLATE: Vec3;
declare const CORAL: Vec3;
declare const CORNFLOWER_BLUE: Vec3;
declare const CORNSILK: Vec3;
declare const CRIMSON: Vec3;
declare const CYAN: Vec3;
declare const DARK_BLUE: Vec3;
declare const DARK_CYAN: Vec3;
declare const DARK_GOLDENROD: Vec3;
declare const DARK_GRAY: Vec3;
declare const DARK_GREEN: Vec3;
declare const DARK_KHAKI: Vec3;
declare const DARK_MAGENTA: Vec3;
declare const DARK_OLIVE_GREEN: Vec3;
declare const DARK_ORANGE: Vec3;
declare const DARK_ORCHID: Vec3;
declare const DARK_RED: Vec3;
declare const DARK_SALMON: Vec3;
declare const DARK_SEA_GREEN: Vec3;
declare const DARK_SLATE_BLUE: Vec3;
declare const DARK_SLATE_GRAY: Vec3;
declare const DARK_TURQUOISE: Vec3;
declare const DARK_VIOLET: Vec3;
declare const DEEP_PINK: Vec3;
declare const DEEP_SKY_BLUE: Vec3;
declare const DIM_GRAY: Vec3;
declare const DODGER_BLUE: Vec3;
declare const FIREBRICK: Vec3;
declare const FLORAL_WHITE: Vec3;
declare const FOREST_GREEN: Vec3;
declare const FUCHSIA: Vec3;
declare const GAINSBORO: Vec3;
declare const GHOST_WHITE: Vec3;
declare const GOLD: Vec3;
declare const GOLDENROD: Vec3;
declare const GRAY: Vec3;
declare const GREEN: Vec3;
declare const GREEN_YELLOW: Vec3;
declare const HONEYDEW: Vec3;
declare const HOT_PINK: Vec3;
declare const INDIAN_RED: Vec3;
declare const INDIGO: Vec3;
declare const IVORY: Vec3;
declare const KHAKI: Vec3;
declare const LAVENDER: Vec3;
declare const LAVENDER_BLUSH: Vec3;
declare const LAWN_GREEN: Vec3;
declare const LEMON_CHIFFON: Vec3;
declare const LIGHT_BLUE: Vec3;
declare const LIGHT_CORAL: Vec3;
declare const LIGHT_CYAN: Vec3;
declare const LIGHT_GOLDENROD: Vec3;
declare const LIGHT_GRAY: Vec3;
declare const LIGHT_GREEN: Vec3;
declare const LIGHT_PINK: Vec3;
declare const LIGHT_SALMON: Vec3;
declare const LIGHT_SEA_GREEN: Vec3;
declare const LIGHT_SKY_BLUE: Vec3;
declare const LIGHT_SLATE_GRAY: Vec3;
declare const LIGHT_STEEL_BLUE: Vec3;
declare const LIGHT_YELLOW: Vec3;
declare const LIME: Vec3;
declare const LIME_GREEN: Vec3;
declare const LINEN: Vec3;
declare const MAGENTA: Vec3;
declare const MAROON: Vec3;
declare const MEDIUM_AQUAMARINE: Vec3;
declare const MEDIUM_BLUE: Vec3;
declare const MEDIUM_ORCHID: Vec3;
declare const MEDIUM_PURPLE: Vec3;
declare const MEDIUM_SEA_GREEN: Vec3;
declare const MEDIUM_SLATE_BLUE: Vec3;
declare const MEDIUM_SPRING_GREEN: Vec3;
declare const MEDIUM_TURQUOISE: Vec3;
declare const MEDIUM_VIOLET_RED: Vec3;
declare const MIDNIGHT_BLUE: Vec3;
declare const MINT_CREAM: Vec3;
declare const MISTY_ROSE: Vec3;
declare const MOCCASIN: Vec3;
declare const NAVAJO_WHITE: Vec3;
declare const NAVY_BLUE: Vec3;
declare const OLD_LACE: Vec3;
declare const OLIVE: Vec3;
declare const OLIVE_DRAB: Vec3;
declare const ORANGE: Vec3;
declare const ORANGE_RED: Vec3;
declare const ORCHID: Vec3;
declare const PALE_GOLDENROD: Vec3;
declare const PALE_GREEN: Vec3;
declare const PALE_TURQUOISE: Vec3;
declare const PALE_VIOLET_RED: Vec3;
declare const PAPAYA_WHIP: Vec3;
declare const PEACH_PUFF: Vec3;
declare const PERU: Vec3;
declare const PINK: Vec3;
declare const PLUM: Vec3;
declare const POWDER_BLUE: Vec3;
declare const PURPLE: Vec3;
declare const REBECCA_PURPLE: Vec3;
declare const RED: Vec3;
declare const ROSY_BROWN: Vec3;
declare const ROYAL_BLUE: Vec3;
declare const SADDLE_BROWN: Vec3;
declare const SALMON: Vec3;
declare const SANDY_BROWN: Vec3;
declare const SEA_GREEN: Vec3;
declare const SEASHELL: Vec3;
declare const SIENNA: Vec3;
declare const SILVER: Vec3;
declare const SKY_BLUE: Vec3;
declare const SLATE_BLUE: Vec3;
declare const SLATE_GRAY: Vec3;
declare const SNOW: Vec3;
declare const SPRING_GREEN: Vec3;
declare const STEEL_BLUE: Vec3;
declare const TAN: Vec3;
declare const TEAL: Vec3;
declare const THISTLE: Vec3;
declare const TOMATO: Vec3;
declare const TURQUOISE: Vec3;
declare const VIOLET: Vec3;
declare const WEB_GRAY: Vec3;
declare const WEB_GREEN: Vec3;
declare const WEB_MAROON: Vec3;
declare const WEB_PURPLE: Vec3;
declare const WHEAT: Vec3;
declare const WHITE: Vec3;
declare const WHITE_SMOKE: Vec3;
declare const YELLOW: Vec3;
declare const YELLOW_GREEN: Vec3;
/**
 * Converts a color to grayscale using luminance weights
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing grayscale RGB values
 */
declare function grayscale(color: Vec3): Vec3;
/**
 * Inverts a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing inverted RGB values
 */
declare function invert(color: Vec3): Vec3;
/**
 * Adjusts the brightness of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust brightness (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
declare function adjustBrightness(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the saturation of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust saturation (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
declare function adjustSaturation(color: Vec3, amount: number): Vec3;
/**
 * Adjusts local contrast using a combination of luminance and saturation
 * @param color Input color as Vec3 RGB
 * @param amount Amount of contrast adjustment (-1 to 1)
 * @returns Contrast adjusted color as Vec3 RGB
 */
declare function adjustContrast(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the gamma of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount of gamma adjustment
 * @returns Vec3 containing adjusted gamma values
 */
declare function adjustGamma(color: Vec3, gamma: number): Vec3;
/**
 * Selectively adjusts shadows and highlights
 * @param color Input color as Vec3 RGB
 * @param shadows Adjustment for shadows (-1 to 1)
 * @param highlights Adjustment for highlights (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustTonalRange(color: Vec3, shadows: number, highlights: number): Vec3;
/**
 * Shifts colors towards or away from pure grays
 * @param color Input color as Vec3 RGB
 * @param amount Amount of neutralization (-1 to 1, negative makes colors more neutral)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustNeutrality(color: Vec3, amount: number): Vec3;
/**
 * Adjusts color based on its complementary color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of complementary influence (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustComplementary(color: Vec3, amount: number): Vec3;
/**
 * Adds white to create a tint of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of white to add (0 to 1)
 * @returns Tinted color as Vec3 RGB
 */
declare function tint(color: Vec3, amount: number): Vec3;
/**
 * Adds black to create a shade of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of black to add (0 to 1)
 * @returns Shaded color as Vec3 RGB
 */
declare function shade(color: Vec3, amount: number): Vec3;
/**
 * Adds gray to create a tone of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of gray to add (0 to 1)
 * @returns Toned color as Vec3 RGB
 */
declare function tone(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the color temperature
 * @param color Input color as Vec3 RGB
 * @param adjustment Temperature adjustment in Kelvin (-10000 to 10000)
 * @returns Temperature adjusted color as Vec3 RGB
 */
declare function adjustTemperature(color: Vec3, adjustment: number): Vec3;
/**
 * Rotates the hue of a color
 * @param color Input color as Vec3 RGB
 * @param degrees Degrees to rotate the hue (-360 to 360)
 * @returns Color with rotated hue as Vec3 RGB
 */
declare function rotateHue(color: Vec3, degrees: number): Vec3;
/**
 * Adjusts color vibrance (saturates colors while preserving skin tones)
 * @param color Input color as Vec3 RGB
 * @param amount Amount to adjust vibrance (-1 to 1)
 * @returns Vibrance adjusted color as Vec3 RGB
 */
declare function adjustVibrance(color: Vec3, amount: number): Vec3;
/**
 * Creates a sepia tone effect
 * @param color Input color as Vec3 RGB
 * @param amount Amount of sepia effect (0 to 1)
 * @returns Sepia-toned color as Vec3 RGB
 */
declare function sepia(color: Vec3, amount: number): Vec3;
/**
 * Adjusts RGB channels independently
 * @param color Input color as Vec3 RGB
 * @param adjustments Vec3 containing adjustment values for each channel (-1 to 1)
 * @returns Color balanced color as Vec3 RGB
 */
declare function colorBalance(color: Vec3, adjustments: Vec3): Vec3;
/**
 * Adjusts color based on time of day lighting
 * @param color Input color as Vec3 RGB
 * @param timeOfDay Hour in 24-hour format (0-23)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustTimeOfDay(color: Vec3, timeOfDay: number): Vec3;
/**
 * Harmonizes a color by adjusting it to the nearest harmonic relationship
 * with a reference color while maintaining its character
 * @param color Color to harmonize
 * @param referenceColor Reference color to harmonize against
 * @returns Harmonized color
 */
declare function harmonizeColor(color: Vec3, referenceColor: Vec3): Vec3;
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
export { ALICE_BLUE, ANTIQUE_WHITE, AQUA, AQUAMARINE, AZURE, BEIGE, BISQUE, BLACK, BLANCHED_ALMOND, BLUE, BLUE_VIOLET, BROWN, BURLYWOOD, CADET_BLUE, CHARTREUSE, CHOCOLATE, CORAL, CORNFLOWER_BLUE, CORNSILK, COSINE_PRESET_FIRE, COSINE_PRESET_ICE, COSINE_PRESET_RAINBOW, CRIMSON, CYAN, ColorClassification, ColorStringOptions, ColorValidationResult, CosineGradientPreset, DARK_BLUE, DARK_CYAN, DARK_GOLDENROD, DARK_GRAY, DARK_GREEN, DARK_KHAKI, DARK_MAGENTA, DARK_OLIVE_GREEN, DARK_ORANGE, DARK_ORCHID, DARK_RED, DARK_SALMON, DARK_SEA_GREEN, DARK_SLATE_BLUE, DARK_SLATE_GRAY, DARK_TURQUOISE, DARK_VIOLET, DEEP_PINK, DEEP_SKY_BLUE, DIM_GRAY, DODGER_BLUE, FIREBRICK, FLORAL_WHITE, FOREST_GREEN, FUCHSIA, GAINSBORO, GHOST_WHITE, GOLD, GOLDENROD, GRAY, GREEN, GREEN_YELLOW, HONEYDEW, HOT_PINK, INDIAN_RED, INDIGO, IVORY, KHAKI, LAVENDER, LAVENDER_BLUSH, LAWN_GREEN, LEMON_CHIFFON, LIGHT_BLUE, LIGHT_CORAL, LIGHT_CYAN, LIGHT_GOLDENROD, LIGHT_GRAY, LIGHT_GREEN, LIGHT_PINK, LIGHT_SALMON, LIGHT_SEA_GREEN, LIGHT_SKY_BLUE, LIGHT_SLATE_GRAY, LIGHT_STEEL_BLUE, LIGHT_YELLOW, LIME, LIME_GREEN, LINEN, MAGENTA, MAROON, MEDIUM_AQUAMARINE, MEDIUM_BLUE, MEDIUM_ORCHID, MEDIUM_PURPLE, MEDIUM_SEA_GREEN, MEDIUM_SLATE_BLUE, MEDIUM_SPRING_GREEN, MEDIUM_TURQUOISE, MEDIUM_VIOLET_RED, MIDNIGHT_BLUE, MINT_CREAM, MISTY_ROSE, MOCCASIN, NAVAJO_WHITE, NAVY_BLUE, OLD_LACE, OLIVE, OLIVE_DRAB, ORANGE, ORANGE_RED, ORCHID, PALE_GOLDENROD, PALE_GREEN, PALE_TURQUOISE, PALE_VIOLET_RED, PAPAYA_WHIP, PEACH_PUFF, PERU, PINK, PLUM, POWDER_BLUE, PURPLE, REBECCA_PURPLE, RED, ROSY_BROWN, ROYAL_BLUE, SADDLE_BROWN, SALMON, SANDY_BROWN, SEASHELL, SEA_GREEN, SIENNA, SILVER, SKY_BLUE, SLATE_BLUE, SLATE_GRAY, SNOW, SPRING_GREEN, STEEL_BLUE, TAN, TEAL, THISTLE, TOMATO, TURQUOISE, VIOLET, WEB_GRAY, WEB_GREEN, WEB_MAROON, WEB_PURPLE, WHEAT, WHITE, WHITE_SMOKE, YELLOW, YELLOW_GREEN, adjustBrightness, adjustComplementary, adjustContrast, adjustGamma, adjustNeutrality, adjustSaturation, adjustTemperature, adjustTimeOfDay, adjustTonalRange, adjustVibrance, analogous, blendColorBurn, blendColorDodge, blendDarken, blendDifference, blendExclusion, blendHardLight, blendLighten, blendMultiply, blendOverlay, blendScreen, blendSoftLight, blendWithAlpha, calculateColorSimilarityFast, calculateColorSimilarityLab, classifyColor, clipToGamut, cmykToRGB, colorBalance, colorDistanceMatrix, colorToString, complement, compound, compressToGamut, contrastRatio, cosineGradient, debugColor, deltaE2000, estimateColorTemperature, findDominantColors, fromPremultipliedAlpha, generateAccessiblePalette, generateCosinePalette, getTextColor, grayscale, harmonizeColor, harmonizePalette, hslToRGB, invert, isDistinguishableForColorBlindness, isInGamut, kelvinToRGB, labToRGB, labToXYZ, meetsWCAGRequirements, mix, monochromatic, optimizeForColorBlindness, parseColor, parseHSL, parseHex, parseRGB, perceivedBrightness, projectToGamut, relativeLuminance, rgbToCMYK, rgbToHSL, rgbToLAB, rgbToXYZ, rotateHue, sepia, shade, shades, simulateColorBlindness, sortColors, splitComplementary, tetradic, tint, tints, toHSL, toHex, toPremultipliedAlpha, toRGB, tone, tones, triadic, validateColorBlindnessSafety, validateColorSpace, withAlpha, xyzToLAB, xyzToRGB };