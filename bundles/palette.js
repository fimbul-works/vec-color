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
* Calculates the relative luminance of a color according to WCAG 2.0 specifications
* This is used in determining contrast ratios for accessibility compliance
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns A value between 0 and 1, where 0 is darkest and 1 is brightest
* @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
*/
function relativeLuminance(color) {
	const rsRGB = color.r <= .03928 ? color.r / 12.92 : ((color.r + .055) / 1.055) ** 2.4;
	const gsRGB = color.g <= .03928 ? color.g / 12.92 : ((color.g + .055) / 1.055) ** 2.4;
	const bsRGB = color.b <= .03928 ? color.b / 12.92 : ((color.b + .055) / 1.055) ** 2.4;
	return .2126 * rsRGB + .7152 * gsRGB + .0722 * bsRGB;
}
/**
* Calculates the contrast ratio between two colors according to WCAG 2.0 specifications
* @param color1 - First color as Vec3 RGB (each channel from 0 to 1)
* @param color2 - Second color as Vec3 RGB (each channel from 0 to 1)
* @returns A value between 1 and 21, where 1 means no contrast and 21 means maximum contrast
* @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
*/
function contrastRatio(color1, color2) {
	const l1 = relativeLuminance(color1);
	const l2 = relativeLuminance(color2);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + .05) / (darker + .05);
}
/**
* Checks if a color combination meets WCAG contrast requirements for accessibility
* @param foreground - Foreground color as Vec3 RGB (each channel from 0 to 1)
* @param background - Background color as Vec3 RGB (each channel from 0 to 1)
* @param level - WCAG compliance level to check ("AA" or "AAA")
* @param isLargeText - Whether the text is considered "large" by WCAG standards
* @returns boolean indicating whether the combination meets WCAG requirements
*/
function meetsWCAGRequirements(foreground, background, level = "AA", isLargeText = false) {
	const ratio = contrastRatio(foreground, background);
	if (level === "AAA") return isLargeText ? ratio >= 4.5 : ratio >= 7;
	return isLargeText ? ratio >= 3 : ratio >= 4.5;
}
/**
* Harmonizes a color by adjusting it to the nearest harmonic relationship
* with a reference color while maintaining its character
* @param color Color to harmonize
* @param referenceColor Reference color to harmonize against
* @returns Harmonized color
*/
function harmonizeColor(color, referenceColor) {
	const colorHSL = rgbToHSL(color);
	const refHSL = rgbToHSL(referenceColor);
	const colorHue = colorHSL.x * 360;
	const refHue = refHSL.x * 360;
	const harmonicIntervals = [
		0,
		30,
		60,
		90,
		120,
		150,
		180,
		210,
		240,
		270,
		300,
		330
	];
	let minDiff = 360;
	let harmonicHue = colorHue;
	for (const interval of harmonicIntervals) {
		const targetHue = (refHue + interval) % 360;
		const diff = Math.min(Math.abs(colorHue - targetHue), Math.abs(colorHue - (targetHue + 360)), Math.abs(colorHue + 360 - targetHue));
		if (diff < minDiff) {
			minDiff = diff;
			harmonicHue = targetHue;
		}
	}
	if (minDiff <= 5) return color;
	return hslToRGB(new Vec3(harmonicHue / 360, colorHSL.y * .8 + refHSL.y * .2, colorHSL.z * .8 + refHSL.z * .2));
}
/**
* Generates the complementary color
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Vec3 containing the complementary color
*/
function complement(color) {
	const hsl = rgbToHSL(color);
	return hslToRGB(new Vec3((hsl.r + 180) % 360, hsl.y, hsl.z));
}
/**
* Generates split-complementary colors
* @param color Base color as Vec3 RGB
* @returns Array of three colors: base and two split complements
*/
function splitComplementary(color) {
	const hsl = rgbToHSL(color);
	return [
		color,
		hslToRGB(new Vec3((hsl.r + 150 / 360) % 1, hsl.y, hsl.z)),
		hslToRGB(new Vec3((hsl.r + 210 / 360) % 1, hsl.y, hsl.z))
	];
}
/**
* Generates an analogous color scheme
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Array of three Vec3 colors: the original and two analogous colors
*/
function analogous(color) {
	const hsl = rgbToHSL(color);
	return [
		color,
		hslToRGB(new Vec3((hsl.r + 30) % 360, hsl.y, hsl.z)),
		hslToRGB(new Vec3((hsl.r - 30 + 360) % 360, hsl.y, hsl.z))
	];
}
/**
* Generates a triadic color scheme
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Array of three Vec3 colors: the original and two triadic colors
*/
function triadic(color) {
	const hsl = rgbToHSL(color);
	return [
		color,
		hslToRGB(new Vec3((hsl.r + 120) % 360, hsl.y, hsl.z)),
		hslToRGB(new Vec3((hsl.r + 240) % 360, hsl.y, hsl.z))
	];
}
/**
* Generates a tetradic (double complementary) color scheme
* @param color Base color as Vec3 RGB
* @returns Array of four colors in tetradic arrangement
*/
function tetradic(color) {
	const hsl = rgbToHSL(color);
	return [
		color,
		hslToRGB(new Vec3((hsl.r + 90 / 360) % 1, hsl.y, hsl.z)),
		hslToRGB(new Vec3((hsl.r + 180 / 360) % 1, hsl.y, hsl.z)),
		hslToRGB(new Vec3((hsl.r + 270 / 360) % 1, hsl.y, hsl.z))
	];
}
/**
* Generates a monochromatic color palette
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Array of 5 colors with varying lightness (20%, 40%, original, 60%, 80%)
*/
function monochromatic(color) {
	const hsl = rgbToHSL(color);
	return [
		hslToRGB(new Vec3(hsl.x, hsl.y, 20)),
		hslToRGB(new Vec3(hsl.x, hsl.y, 40)),
		color,
		hslToRGB(new Vec3(hsl.x, hsl.y, 60)),
		hslToRGB(new Vec3(hsl.x, hsl.y, 80))
	];
}
/**
* Generates a compound color scheme
* Base color, complement, and two analogous colors to the complement
* @param color Base color as Vec3 RGB
* @returns Array of four colors in compound arrangement
*/
function compound(color) {
	const hsl = rgbToHSL(color);
	const complementHue = (hsl.r + .5) % 1;
	return [
		color,
		hslToRGB(new Vec3(complementHue, hsl.y, hsl.z)),
		hslToRGB(new Vec3((complementHue + 30 / 360) % 1, hsl.g * .9, hsl.z)),
		hslToRGB(new Vec3((complementHue - 30 / 360 + 1) % 1, hsl.g * .9, hsl.z))
	];
}
/**
* Generates a series of shades (darker variations) of a color
* @param color Base color as Vec3 RGB
* @param steps Number of shades to generate (default: 5)
* @returns Array of colors from darkest to original
*/
function shades(color, steps = 5) {
	const hsl = rgbToHSL(color);
	const result = [];
	for (let i = 0; i < steps; i++) {
		const lightness = hsl.z * (i + 1) / steps;
		result.push(hslToRGB(new Vec3(hsl.x, hsl.y, lightness)));
	}
	return result;
}
/**
* Generates a series of tints (lighter variations) of a color
* @param color Base color as Vec3 RGB
* @param steps Number of tints to generate (default: 5)
* @returns Array of colors from original to lightest
*/
function tints(color, steps = 5) {
	const hsl = rgbToHSL(color);
	const result = [];
	for (let i = 0; i < steps; i++) {
		const lightness = hsl.z + (1 - hsl.z) * i / (steps - 1);
		result.push(hslToRGB(new Vec3(hsl.x, hsl.y, lightness)));
	}
	return result;
}
/**
* Generates a series of tones (reduced saturation variations) of a color
* @param color Base color as Vec3 RGB
* @param steps Number of tones to generate (default: 5)
* @returns Array of colors from original to fully desaturated
*/
function tones(color, steps = 5) {
	const hsl = rgbToHSL(color);
	const result = [];
	for (let i = 0; i < steps; i++) {
		const saturation = hsl.y * (1 - i / (steps - 1));
		result.push(hslToRGB(new Vec3(hsl.x, saturation, hsl.z)));
	}
	return result;
}
/**
* Determines the best text color (black or white) for a given background color
* @param backgroundColor - Background color as Vec3 RGB (each channel from 0 to 1)
* @returns Vec3 containing either black or white RGB values
*/
function getTextColor(backgroundColor) {
	return relativeLuminance(backgroundColor) > .179 ? new Vec3(0, 0, 0) : new Vec3(1, 1, 1);
}
/**
* Generates an accessible color palette that meets WCAG contrast requirements
* @param baseColor - Starting color as Vec3 RGB (each channel from 0 to 1)
* @param count - Number of colors to generate (default: 5)
* @param minContrast - Minimum contrast ratio required (default: 4.5)
* @returns Array of Vec3 colors that meet contrast requirements
*/
function generateAccessiblePalette(baseColor, count = 5, minContrast = 4.5) {
	const palette = [baseColor];
	const hsl = rgbToHSL(baseColor);
	for (let i = 1; i < count; i++) {
		const newHsl = new Vec3((hsl.x + 360 / count * i) % 360, hsl.y, hsl.z);
		let color = hslToRGB(newHsl);
		while (contrastRatio(baseColor, color) < minContrast) {
			newHsl.z = Math.max(0, Math.min(100, newHsl.z + 5));
			color = hslToRGB(newHsl);
		}
		palette.push(color);
	}
	return palette;
}
/**
* Harmonizes a set of colors while maintaining WCAG compliance
* @param colors Array of colors to harmonize
* @param wcagLevel WCAG compliance level to maintain
* @returns Harmonized colors
*/
function harmonizePalette(colors, wcagLevel = "AA") {
	if (colors.length < 2) return colors;
	const harmonized = [colors[0]];
	const remaining = colors.slice(1);
	const maintainsContrast = (color) => {
		return harmonized.every((existing) => meetsWCAGRequirements(color, existing, wcagLevel));
	};
	for (const color of remaining) {
		let harmonizedColor = harmonizeColor(color, harmonized[0]);
		if (!maintainsContrast(harmonizedColor)) {
			const hsl = rgbToHSL(harmonizedColor);
			for (const adjustment of [
				-.1,
				.1,
				-.2,
				.2,
				-.3,
				.3
			]) {
				const adjusted = hslToRGB(new Vec3(hsl.x, hsl.y, Math.max(.1, Math.min(.9, hsl.z + adjustment))));
				if (maintainsContrast(adjusted)) {
					harmonizedColor = adjusted;
					break;
				}
			}
		}
		harmonized.push(harmonizedColor);
	}
	return harmonized;
}
export { analogous, complement, compound, generateAccessiblePalette, getTextColor, harmonizePalette, monochromatic, shades, splitComplementary, tetradic, tints, tones, triadic };
