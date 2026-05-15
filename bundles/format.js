import { Vec3 } from "@fimbul-works/vec";
/**
* Converts RGB color values to HSL color space
* @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
* @returns Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
*/
function rgbToHSL(rgb) {
	const [r, g, b] = rgb.rgb;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const diff = max - min;
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (diff !== 0) {
		s = l > .5 ? diff / (2 - max - min) : diff / (max + min);
		if (max === r) h = (g - b) / diff + (g < b ? 6 : 0);
		else if (max === g) h = (b - r) / diff + 2;
		else h = (r - g) / diff + 4;
		h *= 60;
	}
	return new Vec3(h / 360, s, l);
}
/**
* Converts HSL color values to RGB color space
* @param hsl - Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
* @returns Vec3 containing RGB values (each channel from 0 to 1)
*/
function hslToRGB(hsl) {
	const [h, s, l] = hsl.xyz;
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	if (s === 0) return new Vec3(l, l, l);
	const q = l < .5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return new Vec3(hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3));
}
/**
* Converts a hex string to RGB color
* @param hex - Hex color string (3, 6, or 8 digits with optional #)
* @returns Vec3 containing RGB values
* @throws Error if hex string is invalid
*/
function parseHex(hex) {
	hex = hex.replace(/^#/, "");
	if (hex.length === 3) hex = hex.split("").map((char) => char + char).join("");
	if (!/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) throw new Error("Invalid hex color string");
	return new Vec3(Number.parseInt(hex.slice(0, 2), 16) / 255, Number.parseInt(hex.slice(2, 4), 16) / 255, Number.parseInt(hex.slice(4, 6), 16) / 255);
}
/**
* Parses RGB/RGBA string into RGB color
* @param rgb - RGB/RGBA string (e.g., "rgb(255, 128, 0)" or "rgba(255, 128, 0, 0.5)")
* @returns Vec3 containing RGB values
* @throws Error if RGB string is invalid
*/
function parseRGB(rgb) {
	const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
	if (!match) throw new Error("Invalid RGB/RGBA string");
	return new Vec3(Number.parseInt(match[1], 10) / 255, Number.parseInt(match[2], 10) / 255, Number.parseInt(match[3], 10) / 255);
}
/**
* Parses HSL/HSLA string into RGB color
* @param hsl - HSL/HSLA string (e.g., "hsl(120, 100%, 50%)" or "hsla(120, 100%, 50%, 0.5)")
* @returns Vec3 containing RGB values
* @throws Error if HSL string is invalid
*/
function parseHSL(hsl) {
	const match = hsl.match(/^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)$/);
	if (!match) throw new Error("Invalid HSL/HSLA string");
	return hslToRGB(new Vec3(Number.parseInt(match[1], 10) / 360, Number.parseInt(match[2], 10) / 100, Number.parseInt(match[3], 10) / 100));
}
/**
* Parses a color string in any supported format
* @param color - Color string in hex, RGB, RGBA, HSL, or HSLA format
* @returns Vec3 containing RGB values
* @throws Error if color string is invalid or format is unsupported
*/
function parseColor(color) {
	color = color.trim().toLowerCase();
	if (color.startsWith("#")) return parseHex(color);
	if (color.startsWith("rgb")) return parseRGB(color);
	if (color.startsWith("hsl")) return parseHSL(color);
	throw new Error("Unsupported color format");
}
/**
* Converts RGB color to hex string
* @param color - Vec3 containing RGB values
* @param includeHash - Whether to include # prefix (default: true)
* @returns Hex color string
*/
function toHex(color, includeHash = true) {
	const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
	const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
	const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
	return `${includeHash ? "#" : ""}${r}${g}${b}`;
}
/**
* Converts RGB color to RGB string
* @param color - Vec3 containing RGB values
* @param alpha - Optional alpha value (0 to 1)
* @returns RGB or RGBA color string
*/
function toRGB(color, alpha) {
	const r = Math.round(color.r * 255);
	const g = Math.round(color.g * 255);
	const b = Math.round(color.b * 255);
	return alpha !== void 0 ? `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})` : `rgb(${r}, ${g}, ${b})`;
}
/**
* Converts RGB color to HSL string
* @param color - Vec3 containing RGB values
* @param alpha - Optional alpha value (0 to 1)
* @returns HSL or HSLA color string
*/
function toHSL(color, alpha) {
	const hsl = rgbToHSL(color);
	const h = Math.round(hsl.r * 360);
	const s = Math.round(hsl.g * 100);
	const l = Math.round(hsl.b * 100);
	return alpha !== void 0 ? `hsla(${h}, ${s}%, ${l}%, ${alpha.toFixed(3)})` : `hsl(${h}, ${s}%, ${l}%)`;
}
/**
* Converts RGB color to string representation
* @param color - Vec3 containing RGB values
* @param options - Formatting options
* @returns Color string in specified format
*/
function colorToString(color, options) {
	switch (options.format) {
		case "hex": return toHex(color, options.includeHash);
		case "rgb": return toRGB(color, options.alpha);
		case "hsl": return toHSL(color, options.alpha);
		default: throw new Error("Unsupported color format");
	}
}
export { colorToString, parseColor, parseHSL, parseHex, parseRGB, toHSL, toHex, toRGB };
