import { Vec3 } from "@fimbul-works/vec";
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
export { clipToGamut, compressToGamut, isInGamut, projectToGamut };