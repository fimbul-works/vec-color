import { Vec3 } from "@fimbul-works/vec";
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
export { analogous, complement, compound, generateAccessiblePalette, getTextColor, harmonizePalette, monochromatic, shades, splitComplementary, tetradic, tints, tones, triadic };