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
* Calculates precise perceptual color difference using CIE Delta E 2000
* This is the most accurate color difference algorithm, accounting for human perception
* characteristics in different color ranges. Uses LAB color space for calculations.
* Trade accuracy for speed: use this when precision is more important than performance
* @param colorA - First color as Vec3 RGB (each channel from 0 to 1)
* @param colorB - Second color as Vec3 RGB (each channel from 0 to 1)
* @returns A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference
* Internally uses CIEDE2000 algorithm which has a non-linear relationship to human perception
*/
function calculateColorSimilarityLab(rgb1, rgb2) {
	const difference = deltaE2000(rgbToLAB(rgbToXYZ(rgb1)), rgbToLAB(rgbToXYZ(rgb2)));
	return Math.exp(-difference / 10);
}
/**
* Calculate CIEDE2000 color difference
* @param lab1 - First color as Vec3 LAB (each channel from 0 to 1)
* @param lab2 - Second color as Vec3 LAB (each channel from 0 to 1)
* @returns
*/
function deltaE2000(lab1, lab2) {
	const [l1, a1, b1] = lab1;
	const [l2, a2, b2] = lab2;
	const kL = 1;
	const kC = 1;
	const kH = 1;
	const Cb = (Math.sqrt(a1 * a1 + b1 * b1) + Math.sqrt(a2 * a2 + b2 * b2)) / 2;
	const G = .5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
	const a1p = (1 + G) * a1;
	const a2p = (1 + G) * a2;
	const C1p = Math.sqrt(a1p * a1p + b1 * b1);
	const C2p = Math.sqrt(a2p * a2p + b2 * b2);
	const h1p = Math.atan2(b1, a1p) * 180 / Math.PI;
	const h2p = Math.atan2(b2, a2p) * 180 / Math.PI;
	const dLp = l2 - l1;
	const dCp = C2p - C1p;
	let dhp;
	if (C1p * C2p === 0) dhp = 0;
	else if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p;
	else if (h2p - h1p > 180) dhp = h2p - h1p - 360;
	else dhp = h2p - h1p + 360;
	const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * Math.PI / 360);
	const Lbp = (l1 + l2) / 2;
	const Cbp = (C1p + C2p) / 2;
	let hbp;
	if (C1p * C2p === 0) hbp = h1p + h2p;
	else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
	else if (h1p + h2p < 360) hbp = (h1p + h2p + 360) / 2;
	else hbp = (h1p + h2p - 360) / 2;
	const T = 1 - .17 * Math.cos((hbp - 30) * Math.PI / 180) + .24 * Math.cos(2 * hbp * Math.PI / 180) + .32 * Math.cos((3 * hbp + 6) * Math.PI / 180) - .2 * Math.cos((4 * hbp - 63) * Math.PI / 180);
	const sL = 1 + .015 * (Lbp - 50) ** 2 / Math.sqrt(20 + (Lbp - 50) ** 2);
	const sC = 1 + .045 * Cbp;
	const sH = 1 + .015 * Cbp * T;
	const RT = -2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hbp - 275) / 25) ** 2)) * Math.PI / 180);
	return Math.sqrt((dLp / (kL * sL)) ** 2 + (dCp / (kC * sC)) ** 2 + (dHp / (kH * sH)) ** 2 + RT * (dCp / (kC * sC)) * (dHp / (kH * sH)));
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
* Checks if two colors are distinguishable for different types of color blindness
* @param color1 First color as Vec3 RGB
* @param color2 Second color as Vec3 RGB
* @param type Type of color blindness to check
* @param threshold Minimum difference threshold (0-1, default: 0.1)
* @returns Boolean indicating if colors are distinguishable
*/
function isDistinguishableForColorBlindness(color1, color2, type, threshold = .1) {
	const simulated1 = simulateColorBlindness(color1, type);
	const simulated2 = simulateColorBlindness(color2, type);
	return Math.sqrt((simulated1.r - simulated2.r) ** 2 + (simulated1.g - simulated2.g) ** 2 + (simulated1.b - simulated2.b) ** 2) > threshold;
}
/**
* Optimizes a set of colors to be distinguishable for color blind users
* @param colors Array of colors to optimize
* @returns Optimized colors that maintain distinctiveness across color blindness types
*/
function optimizeForColorBlindness(colors) {
	const optimized = [];
	const types = [
		"protanopia",
		"deuteranopia",
		"tritanopia",
		"achromatopsia"
	];
	if (colors.length > 0) optimized.push(colors[0]);
	for (const color of colors.slice(1)) {
		let bestColor = color;
		let maxMinDifference = 0;
		const hsl = rgbToHSL(color);
		for (let hueShift = 0; hueShift < 360; hueShift += 15) for (let satAdjust = -.2; satAdjust <= .2; satAdjust += .1) for (let lightAdjust = -.2; lightAdjust <= .2; lightAdjust += .1) {
			const testColor = hslToRGB(new Vec3((hsl.r * 360 + hueShift) % 360 / 360, Math.max(.1, Math.min(1, hsl.g + satAdjust)), Math.max(.1, Math.min(.9, hsl.b + lightAdjust))));
			let minDifference = 1;
			for (const type of types) {
				const simulatedTest = simulateColorBlindness(testColor, type);
				for (const existing of optimized) {
					const difference = 1 - calculateColorSimilarityLab(simulatedTest, simulateColorBlindness(existing, type));
					minDifference = Math.min(minDifference, difference);
				}
			}
			if (minDifference > maxMinDifference) {
				maxMinDifference = minDifference;
				bestColor = testColor;
			}
		}
		optimized.push(bestColor);
	}
	return optimized;
}
/**
* Validates if a color palette is safe for color blind users
* @param colors Array of colors to validate
* @returns Validation result with detailed issues
*/
function validateColorBlindnessSafety(colors) {
	const types = [
		"protanopia",
		"deuteranopia",
		"tritanopia",
		"achromatopsia"
	];
	const issues = [];
	const similarityThreshold = .1;
	for (const type of types) {
		const problematicPairs = [];
		for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) if (1 - calculateColorSimilarityLab(simulateColorBlindness(colors[i], type), simulateColorBlindness(colors[j], type)) < similarityThreshold) problematicPairs.push([colors[i], colors[j]]);
		if (problematicPairs.length > 0) issues.push({
			type,
			problematicPairs
		});
	}
	return {
		safe: issues.length === 0,
		issues
	};
}
export { isDistinguishableForColorBlindness, optimizeForColorBlindness, simulateColorBlindness, validateColorBlindnessSafety };
