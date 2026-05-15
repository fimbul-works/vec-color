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
* Converts RGB color to CIE XYZ color space using D65 illuminant
* XYZ color space is a device-independent color space that represents all visible colors
* @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
* @returns Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
*/
function rgbToXYZ(rgb) {
	let [r, g, b] = rgb;
	r = r > .04045 ? ((r + .055) / 1.055) ** 2.4 : r / 12.92;
	g = g > .04045 ? ((g + .055) / 1.055) ** 2.4 : g / 12.92;
	b = b > .04045 ? ((b + .055) / 1.055) ** 2.4 : b / 12.92;
	return new Vec3(r * .4124564 + g * .3575761 + b * .1804375, r * .2126729 + g * .7151522 + b * .072175, r * .0193339 + g * .119192 + b * .9503041);
}
const WHITE_POINT_X = .95047;
const WHITE_POINT_Y = 1;
const WHITE_POINT_Z = 1.08883;
/**
* Converts XYZ color to CIE LAB color space using D65 illuminant
* LAB represents all visible colors with L for lightness (0-100), a for green-red, and b for blue-yellow
* @param xyz - Vec3 containing XYZ values (each channel normalized)
* @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
*/
function xyzToLAB(xyz) {
	const [x, y, z] = xyz;
	const f = (t) => t > (6 / 29) ** 3 ? t ** (1 / 3) : 1 / 3 * (29 / 6) ** 2 * t + 4 / 29;
	return new Vec3(116 * f(y / WHITE_POINT_Y) - 16, 500 * (f(x / WHITE_POINT_X) - f(y / WHITE_POINT_Y)), 200 * (f(y / WHITE_POINT_Y) - f(z / WHITE_POINT_Z)));
}
/**
* Converts RGB color to CIE LAB color space
* Provides a perceptually uniform color space useful for color difference calculations
* @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
* @returns Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
*/
function rgbToLAB(rgb) {
	return xyzToLAB(rgbToXYZ(rgb));
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
* Classifies a color into basic categories
* @param color Color as Vec3 RGB
* @returns Object containing color classifications
*/
function classifyColor(color) {
	const hsl = rgbToHSL(color);
	const hue = hsl.r * 360;
	const temperature = hue >= 30 && hue <= 110 || hue >= 270 && hue <= 290 ? "cool" : hue > 110 && hue < 270 ? "neutral" : "warm";
	let intensity;
	if (hsl.b < .2) intensity = "dark";
	else if (hsl.b > .8) intensity = "light";
	else if (hsl.g > .8) intensity = "vivid";
	else if (hsl.g < .3 && hsl.b > .7) intensity = "pastel";
	else intensity = "medium";
	const hueCategories = [
		{
			name: "red",
			start: 345,
			end: 15
		},
		{
			name: "orange",
			start: 15,
			end: 45
		},
		{
			name: "yellow",
			start: 45,
			end: 75
		},
		{
			name: "green",
			start: 75,
			end: 165
		},
		{
			name: "cyan",
			start: 165,
			end: 195
		},
		{
			name: "blue",
			start: 195,
			end: 255
		},
		{
			name: "purple",
			start: 255,
			end: 315
		},
		{
			name: "pink",
			start: 315,
			end: 345
		}
	];
	let category = "grayscale";
	if (hsl.g > .15) category = hueCategories.find((cat) => {
		if (cat.start > cat.end) return hue >= cat.start || hue <= cat.end;
		return hue >= cat.start && hue < cat.end;
	})?.name || "grayscale";
	return {
		temperature,
		intensity,
		category
	};
}
/**
* Simulation matrices for different types of color blindness
* Based on color blind simulation research by Brettel, Viénot, and Mollon
*/
const SIMULATION_MATRICES = {
	protanopia: [
		[
			.567,
			.433,
			0
		],
		[
			.558,
			.442,
			0
		],
		[
			0,
			.242,
			.758
		]
	],
	deuteranopia: [
		[
			.625,
			.375,
			0
		],
		[
			.7,
			.3,
			0
		],
		[
			0,
			.3,
			.7
		]
	],
	tritanopia: [
		[
			.95,
			.05,
			0
		],
		[
			0,
			.433,
			.567
		],
		[
			0,
			.475,
			.525
		]
	],
	achromatopsia: [
		[
			.299,
			.587,
			.114
		],
		[
			.299,
			.587,
			.114
		],
		[
			.299,
			.587,
			.114
		]
	]
};
/**
* Simulates how a color would appear to someone with color blindness
* @param color Input color as Vec3 RGB
* @param type Type of color blindness to simulate
* @returns Simulated color as Vec3 RGB
*/
function simulateColorBlindness(color, type) {
	const matrix = SIMULATION_MATRICES[type];
	return new Vec3(color.r * matrix[0][0] + color.g * matrix[0][1] + color.b * matrix[0][2], color.r * matrix[1][0] + color.g * matrix[1][1] + color.b * matrix[1][2], color.r * matrix[2][0] + color.g * matrix[2][1] + color.b * matrix[2][2]);
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
/**
* Converts color temperature in Kelvin to RGB
* Valid range is 1000K to 40000K
* @param kelvin Temperature in Kelvin (1000-40000)
* @returns Vec3 containing RGB values
* @see https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
*/
function kelvinToRGB(kelvin) {
	kelvin = Math.max(1e3, Math.min(4e4, kelvin));
	let r;
	let g;
	let b;
	if (kelvin <= 6600) r = 1;
	else r = ((kelvin / 100 - 60) * -.0132872 + 1.29293) ** 2;
	if (kelvin <= 6600) g = ((kelvin / 100 - 2) * .017991) ** 2;
	else g = ((kelvin / 100 - 60) * -.011679 + 1.12989) ** 2;
	if (kelvin <= 2e3) b = 0;
	else if (kelvin <= 6600) b = ((kelvin / 100 - 10) * .0201616) ** 2;
	else b = 1;
	return new Vec3(Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b)));
}
/**
* Estimates the color temperature of an RGB color
* This is an approximation as not all colors map to a temperature
* @param rgb Vec3 containing RGB values
* @returns Approximate color temperature in Kelvin or null if no good match
*/
function estimateColorTemperature(rgb, iterations = 20) {
	let min = 1e3;
	let max = 4e4;
	let closest = null;
	let minDiff = Number.POSITIVE_INFINITY;
	for (let i = 0; i < iterations; i++) {
		const mid = (min + max) / 2;
		const test = kelvinToRGB(mid);
		const diff = Math.abs(test.r - rgb.r) + Math.abs(test.g - rgb.g) + Math.abs(test.b - rgb.b);
		if (diff < minDiff) {
			minDiff = diff;
			closest = mid;
		}
		if (test.r / test.b > rgb.r / rgb.b) max = mid;
		else min = mid;
	}
	return minDiff < .5 ? closest : null;
}
/**
* Provides comprehensive debug information about a color
* @param color Color to analyze
* @returns Detailed color information for debugging
*/
function debugColor(color) {
	const white = new Vec3(1, 1, 1);
	const black = new Vec3(0, 0, 0);
	const gray = new Vec3(.5, .5, .5);
	const hsl = rgbToHSL(color);
	const lab = rgbToLAB(color);
	const luminance = relativeLuminance(color);
	const temperature = estimateColorTemperature(color);
	return {
		original: {
			vec3: `Vec3(${color.r.toFixed(3)}, ${color.g.toFixed(3)}, ${color.b.toFixed(3)})`,
			rgb: colorToString(color, { format: "rgb" }),
			hex: colorToString(color, { format: "hex" }),
			hsl: colorToString(color, { format: "hsl" })
		},
		colorSpaces: {
			rgb: {
				r: Math.round(color.r * 255),
				g: Math.round(color.g * 255),
				b: Math.round(color.b * 255)
			},
			hsl: {
				h: Math.round(hsl.r * 360),
				s: Math.round(hsl.g * 100),
				l: Math.round(hsl.b * 100)
			},
			lab: {
				l: Math.round(lab.r),
				a: Math.round(lab.g),
				b: Math.round(lab.b)
			}
		},
		characteristics: {
			luminance,
			temperature,
			classification: classifyColor(color)
		},
		accessibility: {
			contrastRatios: {
				onWhite: contrastRatio(color, white),
				onBlack: contrastRatio(color, black),
				onGray: contrastRatio(color, gray)
			},
			wcag: {
				AANormal: contrastRatio(color, white) >= 4.5 || contrastRatio(color, black) >= 4.5,
				AAANormal: contrastRatio(color, white) >= 7 || contrastRatio(color, black) >= 7,
				AALarge: contrastRatio(color, white) >= 3 || contrastRatio(color, black) >= 3,
				AAALarge: contrastRatio(color, white) >= 4.5 || contrastRatio(color, black) >= 4.5
			}
		},
		colorBlindness: {
			protanopia: colorToString(simulateColorBlindness(color, "protanopia"), { format: "hex" }),
			deuteranopia: colorToString(simulateColorBlindness(color, "deuteranopia"), { format: "hex" }),
			tritanopia: colorToString(simulateColorBlindness(color, "tritanopia"), { format: "hex" }),
			achromatopsia: colorToString(simulateColorBlindness(color, "achromatopsia"), { format: "hex" })
		}
	};
}
/**
* Validates if a color is within valid ranges for its color space
* and provides detailed validation information
* @param color Color to validate
* @param space Color space to validate against
* @returns Validation results with detailed information
*/
function validateColorSpace(color, space = "RGB") {
	const issues = [];
	const warnings = [];
	let inGamut = true;
	const channelValidation = {};
	switch (space) {
		case "RGB":
			[
				"R",
				"G",
				"B"
			].forEach((channel, i) => {
				const value = color.rgb[i];
				channelValidation[channel] = {
					valid: value >= 0 && value <= 1,
					value,
					min: 0,
					max: 1
				};
				if (value < 0 || value > 1) issues.push(`${channel} channel value ${value} is outside valid range [0,1]`);
				if (value < .001 && value > 0) warnings.push(`${channel} channel has very small positive value: ${value}`);
			});
			if (color.rgb.some((v) => !Number.isFinite(v))) issues.push("Color contains NaN or Infinity values");
			break;
		case "HSL": {
			const hsl = rgbToHSL(color);
			channelValidation.H = {
				valid: Number.isFinite(hsl.r),
				value: hsl.r * 360,
				min: 0,
				max: 360
			};
			if (!Number.isFinite(hsl.r)) issues.push("Hue value is invalid (NaN or Infinity)");
			channelValidation.S = {
				valid: hsl.g >= 0 && hsl.g <= 1,
				value: hsl.g,
				min: 0,
				max: 1
			};
			if (hsl.g < 0 || hsl.g > 1) issues.push(`Saturation value ${hsl.g} is outside valid range [0,1]`);
			channelValidation.L = {
				valid: hsl.b >= 0 && hsl.b <= 1,
				value: hsl.b,
				min: 0,
				max: 1
			};
			if (hsl.b < 0 || hsl.b > 1) issues.push(`Lightness value ${hsl.b} is outside valid range [0,1]`);
			if (hsl.g === 0 && hsl.r !== 0) warnings.push("Hue value is meaningless when saturation is 0");
			if (hsl.b === 0 || hsl.b === 1) warnings.push("Saturation has no effect at lightness 0 or 1");
			break;
		}
		case "LAB": {
			const lab = rgbToLAB(color);
			channelValidation.L = {
				valid: lab.r >= 0 && lab.r <= 100,
				value: lab.r,
				min: 0,
				max: 100
			};
			if (lab.r < 0 || lab.r > 100) issues.push(`L* value ${lab.r} is outside valid range [0,100]`);
			channelValidation.a = {
				valid: lab.g >= -128 && lab.g <= 127,
				value: lab.g,
				min: -128,
				max: 127
			};
			if (lab.g < -128 || lab.g > 127) warnings.push(`a* value ${lab.g} is outside typical range [-128,127]`);
			channelValidation.b = {
				valid: lab.b >= -128 && lab.b <= 127,
				value: lab.b,
				min: -128,
				max: 127
			};
			if (lab.b < -128 || lab.b > 127) warnings.push(`b* value ${lab.b} is outside typical range [-128,127]`);
			const [r, g, b] = color.rgb;
			inGamut = r >= -1e-4 && r <= 1.0001 && g >= -1e-4 && g <= 1.0001 && b >= -1e-4 && b <= 1.0001;
			if (!inGamut) issues.push("Color is outside sRGB gamut");
			break;
		}
	}
	return {
		valid: issues.length === 0,
		issues,
		warnings,
		colorSpace: {
			inGamut,
			channelValidation
		}
	};
}
export { debugColor, validateColorSpace };
