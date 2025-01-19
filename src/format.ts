import { hslToRGB, rgbToHSL } from "./hsl";

import { Vec3 } from "@fimbul-works/vec";

/**
 * Options for color string formatting
 */
export interface ColorStringOptions {
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
export function parseHex(hex: string): Vec3 {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
    throw new Error("Invalid hex color string");
  }

  const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(hex.slice(4, 6), 16) / 255;

  return new Vec3(r, g, b);
}

/**
 * Parses RGB/RGBA string into RGB color
 * @param rgb - RGB/RGBA string (e.g., "rgb(255, 128, 0)" or "rgba(255, 128, 0, 0.5)")
 * @returns Vec3 containing RGB values
 * @throws Error if RGB string is invalid
 */
export function parseRGB(rgb: string): Vec3 {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (!match) {
    throw new Error("Invalid RGB/RGBA string");
  }

  return new Vec3(
    Number.parseInt(match[1], 10) / 255,
    Number.parseInt(match[2], 10) / 255,
    Number.parseInt(match[3], 10) / 255,
  );
}

/**
 * Parses HSL/HSLA string into RGB color
 * @param hsl - HSL/HSLA string (e.g., "hsl(120, 100%, 50%)" or "hsla(120, 100%, 50%, 0.5)")
 * @returns Vec3 containing RGB values
 * @throws Error if HSL string is invalid
 */
export function parseHSL(hsl: string): Vec3 {
  const match = hsl.match(
    /^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)$/,
  );
  if (!match) {
    throw new Error("Invalid HSL/HSLA string");
  }

  const h = Number.parseInt(match[1], 10) / 360;
  const s = Number.parseInt(match[2], 10) / 100;
  const l = Number.parseInt(match[3], 10) / 100;

  return hslToRGB(new Vec3(h, s, l));
}

/**
 * Parses a color string in any supported format
 * @param color - Color string in hex, RGB, RGBA, HSL, or HSLA format
 * @returns Vec3 containing RGB values
 * @throws Error if color string is invalid or format is unsupported
 */
export function parseColor(color: string): Vec3 {
  color = color.trim().toLowerCase();

  if (color.startsWith("#")) {
    return parseHex(color);
  }
  if (color.startsWith("rgb")) {
    return parseRGB(color);
  }
  if (color.startsWith("hsl")) {
    return parseHSL(color);
  }

  throw new Error("Unsupported color format");
}

/**
 * Converts RGB color to hex string
 * @param color - Vec3 containing RGB values
 * @param includeHash - Whether to include # prefix (default: true)
 * @returns Hex color string
 */
export function toHex(color: Vec3, includeHash = true): string {
  const r = Math.round(color.x * 255)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(color.y * 255)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(color.z * 255)
    .toString(16)
    .padStart(2, "0");

  return `${includeHash ? "#" : ""}${r}${g}${b}`;
}

/**
 * Converts RGB color to RGB string
 * @param color - Vec3 containing RGB values
 * @param alpha - Optional alpha value (0 to 1)
 * @returns RGB or RGBA color string
 */
export function toRGB(color: Vec3, alpha?: number): string {
  const r = Math.round(color.x * 255);
  const g = Math.round(color.y * 255);
  const b = Math.round(color.z * 255);

  return alpha !== undefined
    ? `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
    : `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts RGB color to HSL string
 * @param color - Vec3 containing RGB values
 * @param alpha - Optional alpha value (0 to 1)
 * @returns HSL or HSLA color string
 */
export function toHSL(color: Vec3, alpha?: number): string {
  const hsl = rgbToHSL(color);
  const h = Math.round(hsl.x * 360);
  const s = Math.round(hsl.y * 100);
  const l = Math.round(hsl.z * 100);

  return alpha !== undefined
    ? `hsla(${h}, ${s}%, ${l}%, ${alpha.toFixed(3)})`
    : `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Converts RGB color to string representation
 * @param color - Vec3 containing RGB values
 * @param options - Formatting options
 * @returns Color string in specified format
 */
export function colorToString(
  color: Vec3,
  options: ColorStringOptions,
): string {
  switch (options.format) {
    case "hex":
      return toHex(color, options.includeHash);
    case "rgb":
      return toRGB(color, options.alpha);
    case "hsl":
      return toHSL(color, options.alpha);
    default:
      throw new Error("Unsupported color format");
  }
}
