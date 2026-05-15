import { Vec3 } from "@fimbul-works/vec";
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
export { ColorStringOptions, colorToString, parseColor, parseHSL, parseHex, parseRGB, toHSL, toHex, toRGB };