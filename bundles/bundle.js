import { Vec3, Vec4 } from "@fimbul-works/vec";
/**
* Adds an alpha channel to RGB
* @param color - Color as Vec3 RGB (each channel from 0 to 1)
* @param alpha - Alpha value (0 to 1)
* @returns Vec4 containing RGBA values
*/
function withAlpha(color, alpha = 1) {
	return new Vec4(color.r, color.g, color.b, alpha);
}
/**
* Converts a color with alpha to premultiplied RGBA
* @param color - Color as Vec3 RGB (each channel from 0 to 1)
* @param alpha - Alpha value (0 to 1)
* @returns Vec4 containing premultiplied RGBA values
*/
function toPremultipliedAlpha(color, alpha = 1) {
	return new Vec4(color.r * alpha, color.g * alpha, color.b * alpha, alpha);
}
/**
* Converts a premultiplied RGBA color back to straight RGB and alpha
* @param premultiplied - Premultiplied color as Vec4 RGBA
* @returns [Vec3, number] tuple containing RGB color and alpha value
*/
function fromPremultipliedAlpha(premultiplied) {
	const alpha = premultiplied.a;
	if (alpha === 0) return [new Vec3(0, 0, 0), 0];
	return [new Vec3(premultiplied.r / alpha, premultiplied.g / alpha, premultiplied.b / alpha), alpha];
}
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
/**
* Converts CIE XYZ color to RGB color space using D65 illuminant
* Performs gamut mapping to ensure RGB values are within valid range
* @param xyz - Vec3 containing XYZ values (x: 0-0.95047, y: 0-1.00000, z: 0-1.08883)
* @returns Vec3 containing RGB values (each channel from 0 to 1)
*/
function xyzToRGB(xyz) {
	const [x, y, z] = xyz;
	let r = x * 3.2404542 - y * 1.5371385 - z * .4985314;
	let g = -x * .969266 + y * 1.8760108 + z * .041556;
	let b = x * .0556434 - y * .2040259 + z * 1.0572252;
	r = r > .0031308 ? 1.055 * r ** (1 / 2.4) - .055 : 12.92 * r;
	g = g > .0031308 ? 1.055 * g ** (1 / 2.4) - .055 : 12.92 * g;
	b = b > .0031308 ? 1.055 * b ** (1 / 2.4) - .055 : 12.92 * b;
	return new Vec3(Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b)));
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
* Converts CIE LAB color to XYZ color space using D65 illuminant
* Transforms perceptually uniform LAB coordinates back to device-independent XYZ
* @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
* @returns Vec3 containing XYZ values (each channel normalized)
*/
function labToXYZ(lab) {
	const [l, a, b] = lab;
	const finv = (t) => t > 6 / 29 ? t ** 3 : 3 * (6 / 29) ** 2 * (t - 4 / 29);
	const fy = (l + 16) / 116;
	const fx = fy + a / 500;
	const fz = fy - b / 200;
	return new Vec3(WHITE_POINT_X * finv(fx), WHITE_POINT_Y * finv(fy), WHITE_POINT_Z * finv(fz));
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
* Converts CIE LAB color to RGB color space
* Transforms perceptually uniform color coordinates to display-ready RGB values
* @param lab - Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
* @returns Vec3 containing RGB values (each channel from 0 to 1)
*/
function labToRGB(lab) {
	return xyzToRGB(labToXYZ(lab));
}
/**
* Calculates an approximate perceptual color difference using a weighted RGB comparison
* This is a fast approximation that weighs green more heavily than red or blue to match human perception
* Trade speed for accuracy: use this when performance is critical and approximate results are acceptable
* Based on the redmean color difference algorithm
* @param colorA - First color as Vec3 RGB (each channel from 0 to 1)
* @param colorB - Second color as Vec3 RGB (each channel from 0 to 1)
* @returns A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference
*/
function calculateColorSimilarityFast(A, B) {
	const ar = Math.round(A.r * 255);
	const ag = Math.round(A.g * 255);
	const ab = Math.round(A.b * 255);
	const br = Math.round(B.r * 255);
	const bg = Math.round(B.g * 255);
	const bb = Math.round(B.b * 255);
	const rmean = (ar + br) / 2;
	const r = ar - br;
	const g = ag - bg;
	const b = ab - bb;
	return 1 - Math.sqrt((Math.floor((512 + rmean) * r * r) >> 8) + 4 * g * g + (Math.floor((767 - rmean) * b * b) >> 8)) / 765;
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
* Calculates perceived brightness based on human perception
* Different from luminance as it accounts for human color sensitivity
* Uses perceived brightness formula (ITU-R BT.709)
* @param color Input color as Vec3 RGB
* @returns Perceived brightness value (0 to 1)
*/
function perceivedBrightness(color) {
	return Math.sqrt(.299 * color.r * color.r + .587 * color.g * color.g + .114 * color.b * color.b);
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
* Finds dominant colors in a set of colors using k-means clustering
* @param colors Array of colors as Vec3 RGB
* @param count Number of dominant colors to find (default: 5)
* @returns Array of dominant colors as Vec3 RGB
*/
function findDominantColors(colors, count = 5) {
	if (colors.length <= count) return colors;
	let centroids = colors.slice().sort(() => Math.random() - .5).slice(0, count);
	const maxIterations = 50;
	let iterations = 0;
	let previousCentroids = [];
	while (iterations < maxIterations) {
		const clusters = Array.from({ length: count }, () => []);
		for (const color of colors) {
			let minDistance = Number.POSITIVE_INFINITY;
			let closestIndex = 0;
			centroids.forEach((centroid, index) => {
				const distance = color.subtract(centroid).magnitude;
				if (distance < minDistance) {
					minDistance = distance;
					closestIndex = index;
				}
			});
			clusters[closestIndex].push(color);
		}
		previousCentroids = centroids;
		centroids = clusters.map((cluster) => {
			if (cluster.length === 0) return previousCentroids[0];
			return cluster.reduce((acc, color) => acc.add(color), new Vec3(0, 0, 0)).scale(1 / cluster.length);
		});
		if (centroids.every((centroid, i) => centroid.subtract(previousCentroids[i]).magnitude < .001)) break;
		iterations++;
	}
	return centroids;
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
* Sorts colors by various attributes
* @param colors Array of colors to sort
* @param by Attribute to sort by ('hue', 'saturation', 'lightness', 'temperature')
* @returns Sorted array of colors
*/
function sortColors(colors, by = "hue") {
	return [...colors].sort((a, b) => {
		const hslA = rgbToHSL(a);
		const hslB = rgbToHSL(b);
		switch (by) {
			case "hue": return hslA.r - hslB.r;
			case "saturation": return hslB.g - hslA.g;
			case "lightness": return hslB.b - hslA.b;
			case "temperature": {
				const tempA = a.r / Math.max(.1, a.b);
				return b.r / Math.max(.1, b.b) - tempA;
			}
		}
	});
}
/**
* Creates a color distance matrix for a set of colors
* @param colors Array of colors to analyze
* @returns 2D array of perceptual color differences
*/
function colorDistanceMatrix(colors) {
	return colors.map((colorA) => colors.map((colorB) => calculateColorSimilarityLab(colorA, colorB)));
}
/**
* Type guard to check if a color is Vec4
*/
function isVec4(color) {
	return color instanceof Vec4;
}
/**
* Mix two colors with a given ratio
* Handles both RGB and RGBA colors
* @param color1 First color (Vec3 or Vec4)
* @param color2 Second color (Vec3 or Vec4)
* @param ratio Mix ratio (0 to 1)
* @returns Mixed color in same format as inputs
*/
function mix(color1, color2, ratio) {
	if (isVec4(color1) && isVec4(color2)) {
		const outAlpha = color1.a * (1 - ratio) + color2.a * ratio;
		if (outAlpha === 0) return new Vec4(0, 0, 0, 0);
		return new Vec4(color1.r * (1 - ratio) + color2.r * ratio, color1.g * (1 - ratio) + color2.g * ratio, color1.b * (1 - ratio) + color2.b * ratio, outAlpha);
	}
	return new Vec3(color1.r * (1 - ratio) + color2.r * ratio, color1.g * (1 - ratio) + color2.g * ratio, color1.b * (1 - ratio) + color2.b * ratio);
}
/**
* Blends two colors with alpha using premultiplied alpha blending
* @param bottom - Bottom color as Vec4 RGBA
* @param top - Top color as Vec4 RGBA
* @returns Vec4 containing the blended RGBA color
*/
function blendWithAlpha(bottom, top) {
	const outAlpha = top.a + bottom.a * (1 - top.a);
	if (outAlpha === 0) return new Vec4(0, 0, 0, 0);
	return new Vec4(top.r + bottom.r * (1 - top.a), top.g + bottom.g * (1 - top.a), top.b + bottom.b * (1 - top.a), outAlpha);
}
/**
* Applies a blend operation to two colors
* Handles both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @param blendFn Blend function to apply to RGB components
* @returns Blended color in same format as inputs
*/
function applyBlend(base, blend, blendFn) {
	if (isVec4(base) && isVec4(blend)) {
		const premulBase = toPremultipliedAlpha(new Vec3(base.r, base.g, base.b), base.a);
		const premulBlend = toPremultipliedAlpha(new Vec3(blend.r, blend.g, blend.b), blend.a);
		const result = blendFn(new Vec3(premulBase.r, premulBase.g, premulBase.b), new Vec3(premulBlend.r, premulBlend.g, premulBlend.b));
		const outAlpha = blend.a + base.a * (1 - blend.a);
		if (outAlpha === 0) return new Vec4(0, 0, 0, 0);
		return new Vec4(result.r, result.g, result.b, outAlpha);
	}
	return blendFn(base, blend);
}
/**
* Multiplies two colors together
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendMultiply(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(b.r * bl.r, b.g * bl.g, b.b * bl.b));
}
/**
* Screens two colors together
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendScreen(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(1 - (1 - b.r) * (1 - bl.r), 1 - (1 - b.g) * (1 - bl.g), 1 - (1 - b.b) * (1 - bl.b)));
}
/**
* Applies overlay blend mode
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendOverlay(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(b.r < .5 ? 2 * b.r * bl.r : 1 - 2 * (1 - b.r) * (1 - bl.r), b.g < .5 ? 2 * b.g * bl.g : 1 - 2 * (1 - b.g) * (1 - bl.g), b.b < .5 ? 2 * b.b * bl.b : 1 - 2 * (1 - b.b) * (1 - bl.b)));
}
/**
* Selects the darker color between base and blend colors
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendDarken(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(Math.min(b.r, bl.r), Math.min(b.g, bl.g), Math.min(b.b, bl.b)));
}
/**
* Selects the lighter color between base and blend colors
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendLighten(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(Math.max(b.r, bl.r), Math.max(b.g, bl.g), Math.max(b.b, bl.b)));
}
/**
* Brightens the base color based on the blend color using color dodge blend mode
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendColorDodge(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(b.r === 0 ? 0 : bl.r === 1 ? 1 : Math.min(1, b.r / (1 - bl.r)), b.g === 0 ? 0 : bl.g === 1 ? 1 : Math.min(1, b.g / (1 - bl.g)), b.b === 0 ? 0 : bl.b === 1 ? 1 : Math.min(1, b.b / (1 - bl.b))));
}
/**
* Darkens the base color based on the blend color using color burn blend mode
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendColorBurn(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(b.r === 1 ? 1 : bl.r === 0 ? 0 : 1 - Math.min(1, (1 - b.r) / bl.r), b.g === 1 ? 1 : bl.g === 0 ? 0 : 1 - Math.min(1, (1 - b.g) / bl.g), b.b === 1 ? 1 : bl.b === 0 ? 0 : 1 - Math.min(1, (1 - b.b) / bl.b)));
}
/**
* Combines colors using hard light blend mode
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendHardLight(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(blend.r < .5 ? 2 * base.r * blend.r : 1 - 2 * (1 - base.r) * (1 - blend.r), blend.g < .5 ? 2 * base.g * blend.g : 1 - 2 * (1 - base.g) * (1 - blend.g), blend.b < .5 ? 2 * base.b * blend.b : 1 - 2 * (1 - base.b) * (1 - blend.b)));
}
/**
* Combines colors using soft light blend mode for a more subtle effect
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendSoftLight(base, blend) {
	const softlight = (b, l) => {
		if (l <= .5) return b - (1 - 2 * l) * b * (1 - b);
		const d = b <= .25 ? ((16 * b - 12) * b + 4) * b : Math.sqrt(b);
		return b + (2 * l - 1) * (d - b);
	};
	return applyBlend(base, blend, (b, bl) => new Vec3(softlight(b.r, bl.r), softlight(b.g, bl.g), softlight(b.b, bl.b)));
}
/**
* Calculates the absolute difference between colors
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendDifference(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(Math.abs(b.r - bl.r), Math.abs(b.g - bl.g), Math.abs(b.b - bl.b)));
}
/**
* Similar to difference blend mode but with lower contrast
* Supports both RGB and RGBA colors
* @param base Base color (Vec3 or Vec4)
* @param blend Blend color (Vec3 or Vec4)
* @returns Blended color in same format as inputs
*/
function blendExclusion(base, blend) {
	return applyBlend(base, blend, (b, bl) => new Vec3(b.r + bl.r - 2 * b.r * bl.r, b.g + bl.g - 2 * b.g * bl.g, b.b + bl.b - 2 * b.b * bl.b));
}
/**
* Converts RGB color values to CMYK color space
* @param rgb - Vec3 containing RGB values (each channel from 0 to 1)
* @returns Vec4 containing CMYK values (each channel from 0 to 1)
*/
function rgbToCMYK(rgb) {
	const k = 1 - Math.max(rgb.r, rgb.g, rgb.b);
	if (k === 1) return new Vec4(0, 0, 0, 1);
	return new Vec4((1 - rgb.r - k) / (1 - k), (1 - rgb.g - k) / (1 - k), (1 - rgb.b - k) / (1 - k), k);
}
/**
* Converts CMYK color values to RGB color space
* @param cmyk - Vec4 containing CMYK values (each channel from 0 to 1)
* @returns Vec3 containing RGB values (each channel from 0 to 1)
*/
function cmykToRGB(cmyk) {
	return new Vec3((1 - cmyk.x) * (1 - cmyk.w), (1 - cmyk.y) * (1 - cmyk.w), (1 - cmyk.z) * (1 - cmyk.w));
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
function cosineGradient(t, a, b, c, d) {
	return new Vec3(a.r + b.r * Math.cos(6.28318 * (c.r * t + d.r)), a.g + b.g * Math.cos(6.28318 * (c.g * t + d.g)), a.b + b.b * Math.cos(6.28318 * (c.b * t + d.b)));
}
/**
* Generates a palette using cosine gradient
* @param steps - Number of colors to generate
* @param preset - Preset parameters for the cosine gradient
* @returns Array of Vec3 colors
*/
function generateCosinePalette(steps, preset) {
	const palette = [];
	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		palette.push(cosineGradient(t, preset.a, preset.b, preset.c, preset.d));
	}
	return palette;
}
const COSINE_PRESET_RAINBOW = {
	a: new Vec3(.5, .5, .5),
	b: new Vec3(.5, .5, .5),
	c: new Vec3(1, 1, 1),
	d: new Vec3(0, .33, .67)
};
const COSINE_PRESET_FIRE = {
	a: new Vec3(.5, .5, .5),
	b: new Vec3(.5, .5, .5),
	c: new Vec3(1, 1, 1),
	d: new Vec3(0, .1, .2)
};
const COSINE_PRESET_ICE = {
	a: new Vec3(.5, .5, .5),
	b: new Vec3(.5, .5, .5),
	c: new Vec3(1, 1, 1),
	d: new Vec3(.3, .2, .2)
};
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
/**
* Checks if a color is within the sRGB gamut
* @param color Color to check
* @returns Boolean indicating if color is in gamut
*/
function isInGamut(color) {
	return color.r >= 0 && color.r <= 1 && color.g >= 0 && color.g <= 1 && color.b >= 0 && color.b <= 1;
}
/**
* Clips a color to the sRGB gamut
* Simple but can lose relationships between colors
* @param color Color to clip
* @returns Clipped color
*/
function clipToGamut(color) {
	return new Vec3(Math.min(1, Math.max(0, color.r)), Math.min(1, Math.max(0, color.g)), Math.min(1, Math.max(0, color.b)));
}
/**
* Compresses out-of-gamut colors while preserving relationships
* More sophisticated than clipping but more computationally expensive
* @param color Color to compress
* @param preserveHue Whether to preserve the color's hue (default: true)
* @returns Compressed color within gamut
*/
function compressToGamut(color, preserveHue = true) {
	if (isInGamut(color)) return color;
	const lab = rgbToLAB(color);
	let compressed;
	if (preserveHue) {
		const L = lab.x;
		const a = lab.y;
		const b = lab.z;
		const chroma = Math.sqrt(a * a + b * b);
		let low = 0;
		let high = chroma;
		let bestInGamut = clipToGamut(color);
		for (let i = 0; i < 8; i++) {
			const mid = (low + high) / 2;
			const scale = mid / chroma;
			const testRgb = labToRGB(new Vec3(L, a * scale, b * scale));
			if (isInGamut(testRgb)) {
				bestInGamut = testRgb;
				low = mid;
			} else high = mid;
		}
		compressed = bestInGamut;
	} else {
		const center = new Vec3(50, 0, 0);
		const vector = lab.subtract(center);
		let scale = 1;
		while (!isInGamut(compressed = labToRGB(center.add(vector.scale(scale)))) && scale > 0) scale *= .9;
	}
	return compressed;
}
/**
* Projects an out-of-gamut color back into gamut while preserving lightness
* Useful for maintaining perceived brightness while ensuring displayable colors
* @param color Color to project
* @returns Projected in-gamut color
*/
function projectToGamut(color) {
	if (isInGamut(color)) return color;
	const L = rgbToLAB(color).r;
	let result = clipToGamut(color);
	let resultLab = rgbToLAB(result);
	const lightnessDiff = L - resultLab.r;
	if (Math.abs(lightnessDiff) > .01) {
		resultLab = new Vec3(L, resultLab.g, resultLab.b);
		result = clipToGamut(labToRGB(resultLab));
	}
	return result;
}
/**
* Converts a color to grayscale using luminance weights
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Vec3 containing grayscale RGB values
*/
function grayscale(color) {
	const gray = .299 * color.r + .587 * color.g + .114 * color.b;
	return new Vec3(gray, gray, gray);
}
/**
* Inverts a color
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @returns Vec3 containing inverted RGB values
*/
function invert(color) {
	return new Vec3(1 - color.r, 1 - color.g, 1 - color.b);
}
/**
* Adjusts the brightness of a color
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @param amount - Amount to adjust brightness (-1 to 1)
* @returns Vec3 containing adjusted RGB values
*/
function adjustBrightness(color, amount) {
	const hsl = rgbToHSL(color);
	return hslToRGB(new Vec3(hsl.x, hsl.y, Math.max(0, Math.min(1, hsl.z + amount))));
}
/**
* Adjusts the saturation of a color
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @param amount - Amount to adjust saturation (-1 to 1)
* @returns Vec3 containing adjusted RGB values
*/
function adjustSaturation(color, amount) {
	const hsl = rgbToHSL(color);
	return hslToRGB(new Vec3(hsl.x, Math.max(0, Math.min(1, hsl.y + amount)), hsl.z));
}
/**
* Adjusts local contrast using a combination of luminance and saturation
* @param color Input color as Vec3 RGB
* @param amount Amount of contrast adjustment (-1 to 1)
* @returns Contrast adjusted color as Vec3 RGB
*/
function adjustContrast(color, amount) {
	const lab = rgbToLAB(color);
	const midpoint = 50;
	const factor = 1 + amount;
	return labToRGB(new Vec3(midpoint + (lab.x - midpoint) * factor, lab.y * factor, lab.z * factor));
}
/**
* Adjusts the gamma of a color
* @param color - Input color as Vec3 RGB (each channel from 0 to 1)
* @param amount - Amount of gamma adjustment
* @returns Vec3 containing adjusted gamma values
*/
function adjustGamma(color, gamma) {
	return new Vec3(color.r ** gamma, color.g ** gamma, color.b ** gamma);
}
/**
* Selectively adjusts shadows and highlights
* @param color Input color as Vec3 RGB
* @param shadows Adjustment for shadows (-1 to 1)
* @param highlights Adjustment for highlights (-1 to 1)
* @returns Adjusted color as Vec3 RGB
*/
function adjustTonalRange(color, shadows, highlights) {
	const lab = rgbToLAB(color);
	if (lab.x < 50) lab.x = lab.x * (1 + shadows);
	else lab.x = lab.x + (100 - lab.x) * highlights;
	return labToRGB(lab);
}
/**
* Shifts colors towards or away from pure grays
* @param color Input color as Vec3 RGB
* @param amount Amount of neutralization (-1 to 1, negative makes colors more neutral)
* @returns Adjusted color as Vec3 RGB
*/
function adjustNeutrality(color, amount) {
	const lab = rgbToLAB(color);
	const factor = 1 + amount;
	const newA = lab.y * factor;
	const newB = lab.z * factor;
	return labToRGB(new Vec3(lab.x, newA, newB));
}
/**
* Adjusts color based on its complementary color
* @param color Input color as Vec3 RGB
* @param amount Amount of complementary influence (-1 to 1)
* @returns Adjusted color as Vec3 RGB
*/
function adjustComplementary(color, amount) {
	const hsl = rgbToHSL(color);
	return mix(color, hslToRGB(new Vec3((hsl.x + .5) % 1, hsl.y, hsl.z)), amount * .5);
}
/**
* Adds white to create a tint of the color
* @param color Input color as Vec3 RGB
* @param amount Amount of white to add (0 to 1)
* @returns Tinted color as Vec3 RGB
*/
function tint(color, amount) {
	return mix(color, new Vec3(1, 1, 1), amount);
}
/**
* Adds black to create a shade of the color
* @param color Input color as Vec3 RGB
* @param amount Amount of black to add (0 to 1)
* @returns Shaded color as Vec3 RGB
*/
function shade(color, amount) {
	return mix(color, new Vec3(0, 0, 0), amount);
}
/**
* Adds gray to create a tone of the color
* @param color Input color as Vec3 RGB
* @param amount Amount of gray to add (0 to 1)
* @returns Toned color as Vec3 RGB
*/
function tone(color, amount) {
	return mix(color, new Vec3(.5, .5, .5), amount);
}
/**
* Adjusts the color temperature
* @param color Input color as Vec3 RGB
* @param adjustment Temperature adjustment in Kelvin (-10000 to 10000)
* @returns Temperature adjusted color as Vec3 RGB
*/
function adjustTemperature(color, adjustment) {
	const warm = kelvinToRGB(2e3);
	const cool = kelvinToRGB(12e3);
	if (adjustment > 0) return mix(color, warm, Math.min(1, adjustment / 1e4));
	return mix(color, cool, Math.min(1, -adjustment / 1e4));
}
/**
* Rotates the hue of a color
* @param color Input color as Vec3 RGB
* @param degrees Degrees to rotate the hue (-360 to 360)
* @returns Color with rotated hue as Vec3 RGB
*/
function rotateHue(color, degrees) {
	const hsl = rgbToHSL(color);
	return hslToRGB(new Vec3((hsl.r + degrees / 360 + 1) % 1, hsl.g, hsl.b));
}
/**
* Adjusts color vibrance (saturates colors while preserving skin tones)
* @param color Input color as Vec3 RGB
* @param amount Amount to adjust vibrance (-1 to 1)
* @returns Vibrance adjusted color as Vec3 RGB
*/
function adjustVibrance(color, amount) {
	const lab = rgbToLAB(color);
	const saturation = Math.sqrt(lab.g * lab.g + lab.b * lab.b);
	const skinToneFactor = color.r > color.g && color.g > color.b && color.r > .4 && color.r < .9 && color.g > .2 && color.g < .7 ? .3 : 1;
	const saturationFactor = Math.max(0, 1 - saturation / 100);
	const adjustmentFactor = 1 + amount * skinToneFactor * saturationFactor;
	const finalFactor = amount < 0 ? 1 + amount * skinToneFactor : adjustmentFactor;
	return labToRGB(new Vec3(lab.r, lab.g * finalFactor, lab.b * finalFactor));
}
/**
* Creates a sepia tone effect
* @param color Input color as Vec3 RGB
* @param amount Amount of sepia effect (0 to 1)
* @returns Sepia-toned color as Vec3 RGB
*/
function sepia(color, amount) {
	const r = color.r * .393 + color.g * .769 + color.b * .189;
	const g = color.r * .349 + color.g * .686 + color.b * .168;
	const b = color.r * .272 + color.g * .534 + color.b * .131;
	return mix(color, new Vec3(Math.min(1, r), Math.min(1, g), Math.min(1, b)), amount);
}
/**
* Adjusts RGB channels independently
* @param color Input color as Vec3 RGB
* @param adjustments Vec3 containing adjustment values for each channel (-1 to 1)
* @returns Color balanced color as Vec3 RGB
*/
function colorBalance(color, adjustments) {
	return new Vec3(Math.max(0, Math.min(1, color.r * (1 + adjustments.r))), Math.max(0, Math.min(1, color.g * (1 + adjustments.g))), Math.max(0, Math.min(1, color.b * (1 + adjustments.b))));
}
/**
* Adjusts color based on time of day lighting
* @param color Input color as Vec3 RGB
* @param timeOfDay Hour in 24-hour format (0-23)
* @returns Adjusted color as Vec3 RGB
*/
function adjustTimeOfDay(color, timeOfDay) {
	const temperatures = {
		0: 2700,
		6: 3500,
		8: 5500,
		12: 6500,
		16: 5500,
		18: 4e3,
		20: 2700
	};
	return adjustTemperature(color, temperatures[Object.keys(temperatures).map(Number).reduce((prev, curr) => Math.abs(curr - timeOfDay) < Math.abs(prev - timeOfDay) ? curr : prev)] - (estimateColorTemperature(color) || 6500));
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
const ALICE_BLUE = new Vec3(.941176, .972549, 1);
const ANTIQUE_WHITE = new Vec3(.980392, .921569, .843137);
const AQUA = new Vec3(0, 1, 1);
const AQUAMARINE = new Vec3(.498039, 1, .831373);
const AZURE = new Vec3(.941176, 1, 1);
const BEIGE = new Vec3(.960784, .960784, .862745);
const BISQUE = new Vec3(1, .894118, .768627);
const BLACK = new Vec3(0, 0, 0);
const BLANCHED_ALMOND = new Vec3(1, .921569, .803922);
const BLUE = new Vec3(0, 0, 1);
const BLUE_VIOLET = new Vec3(.541176, .168627, .886275);
const BROWN = new Vec3(.647059, .164706, .164706);
const BURLYWOOD = new Vec3(.870588, .721569, .529412);
const CADET_BLUE = new Vec3(.372549, .619608, .627451);
const CHARTREUSE = new Vec3(.498039, 1, 0);
const CHOCOLATE = new Vec3(.823529, .411765, .117647);
const CORAL = new Vec3(1, .498039, .313726);
const CORNFLOWER_BLUE = new Vec3(.392157, .584314, .929412);
const CORNSILK = new Vec3(1, .972549, .862745);
const CRIMSON = new Vec3(.862745, .0784314, .235294);
const CYAN = new Vec3(0, 1, 1);
const DARK_BLUE = new Vec3(0, 0, .545098);
const DARK_CYAN = new Vec3(0, .545098, .545098);
const DARK_GOLDENROD = new Vec3(.721569, .52549, .0431373);
const DARK_GRAY = new Vec3(.662745, .662745, .662745);
const DARK_GREEN = new Vec3(0, .392157, 0);
const DARK_KHAKI = new Vec3(.741176, .717647, .419608);
const DARK_MAGENTA = new Vec3(.545098, 0, .545098);
const DARK_OLIVE_GREEN = new Vec3(.333333, .419608, .184314);
const DARK_ORANGE = new Vec3(1, .54902, 0);
const DARK_ORCHID = new Vec3(.6, .196078, .8);
const DARK_RED = new Vec3(.545098, 0, 0);
const DARK_SALMON = new Vec3(.913725, .588235, .478431);
const DARK_SEA_GREEN = new Vec3(.560784, .737255, .560784);
const DARK_SLATE_BLUE = new Vec3(.282353, .239216, .545098);
const DARK_SLATE_GRAY = new Vec3(.184314, .309804, .309804);
const DARK_TURQUOISE = new Vec3(0, .807843, .819608);
const DARK_VIOLET = new Vec3(.580392, 0, .827451);
const DEEP_PINK = new Vec3(1, .0784314, .576471);
const DEEP_SKY_BLUE = new Vec3(0, .74902, 1);
const DIM_GRAY = new Vec3(.411765, .411765, .411765);
const DODGER_BLUE = new Vec3(.117647, .564706, 1);
const FIREBRICK = new Vec3(.698039, .133333, .133333);
const FLORAL_WHITE = new Vec3(1, .980392, .941176);
const FOREST_GREEN = new Vec3(.133333, .545098, .133333);
const FUCHSIA = new Vec3(1, 0, 1);
const GAINSBORO = new Vec3(.862745, .862745, .862745);
const GHOST_WHITE = new Vec3(.972549, .972549, 1);
const GOLD = new Vec3(1, .843137, 0);
const GOLDENROD = new Vec3(.854902, .647059, .12549);
const GRAY = new Vec3(.745098, .745098, .745098);
const GREEN = new Vec3(0, 1, 0);
const GREEN_YELLOW = new Vec3(.678431, 1, .184314);
const HONEYDEW = new Vec3(.941176, 1, .941176);
const HOT_PINK = new Vec3(1, .411765, .705882);
const INDIAN_RED = new Vec3(.803922, .360784, .360784);
const INDIGO = new Vec3(.294118, 0, .509804);
const IVORY = new Vec3(1, 1, .941176);
const KHAKI = new Vec3(.941176, .901961, .54902);
const LAVENDER = new Vec3(.901961, .901961, .980392);
const LAVENDER_BLUSH = new Vec3(1, .941176, .960784);
const LAWN_GREEN = new Vec3(.486275, .988235, 0);
const LEMON_CHIFFON = new Vec3(1, .980392, .803922);
const LIGHT_BLUE = new Vec3(.678431, .847059, .901961);
const LIGHT_CORAL = new Vec3(.941176, .501961, .501961);
const LIGHT_CYAN = new Vec3(.878431, 1, 1);
const LIGHT_GOLDENROD = new Vec3(.980392, .980392, .823529);
const LIGHT_GRAY = new Vec3(.827451, .827451, .827451);
const LIGHT_GREEN = new Vec3(.564706, .933333, .564706);
const LIGHT_PINK = new Vec3(1, .713726, .756863);
const LIGHT_SALMON = new Vec3(1, .627451, .478431);
const LIGHT_SEA_GREEN = new Vec3(.12549, .698039, .666667);
const LIGHT_SKY_BLUE = new Vec3(.529412, .807843, .980392);
const LIGHT_SLATE_GRAY = new Vec3(.466667, .533333, .6);
const LIGHT_STEEL_BLUE = new Vec3(.690196, .768627, .870588);
const LIGHT_YELLOW = new Vec3(1, 1, .878431);
const LIME = new Vec3(0, 1, 0);
const LIME_GREEN = new Vec3(.196078, .803922, .196078);
const LINEN = new Vec3(.980392, .941176, .901961);
const MAGENTA = new Vec3(1, 0, 1);
const MAROON = new Vec3(.690196, .188235, .376471);
const MEDIUM_AQUAMARINE = new Vec3(.4, .803922, .666667);
const MEDIUM_BLUE = new Vec3(0, 0, .803922);
const MEDIUM_ORCHID = new Vec3(.729412, .333333, .827451);
const MEDIUM_PURPLE = new Vec3(.576471, .439216, .858824);
const MEDIUM_SEA_GREEN = new Vec3(.235294, .701961, .443137);
const MEDIUM_SLATE_BLUE = new Vec3(.482353, .407843, .933333);
const MEDIUM_SPRING_GREEN = new Vec3(0, .980392, .603922);
const MEDIUM_TURQUOISE = new Vec3(.282353, .819608, .8);
const MEDIUM_VIOLET_RED = new Vec3(.780392, .0823529, .521569);
const MIDNIGHT_BLUE = new Vec3(.0980392, .0980392, .439216);
const MINT_CREAM = new Vec3(.960784, 1, .980392);
const MISTY_ROSE = new Vec3(1, .894118, .882353);
const MOCCASIN = new Vec3(1, .894118, .709804);
const NAVAJO_WHITE = new Vec3(1, .870588, .678431);
const NAVY_BLUE = new Vec3(0, 0, .501961);
const OLD_LACE = new Vec3(.992157, .960784, .901961);
const OLIVE = new Vec3(.501961, .501961, 0);
const OLIVE_DRAB = new Vec3(.419608, .556863, .137255);
const ORANGE = new Vec3(1, .647059, 0);
const ORANGE_RED = new Vec3(1, .270588, 0);
const ORCHID = new Vec3(.854902, .439216, .839216);
const PALE_GOLDENROD = new Vec3(.933333, .909804, .666667);
const PALE_GREEN = new Vec3(.596078, .984314, .596078);
const PALE_TURQUOISE = new Vec3(.686275, .933333, .933333);
const PALE_VIOLET_RED = new Vec3(.858824, .439216, .576471);
const PAPAYA_WHIP = new Vec3(1, .937255, .835294);
const PEACH_PUFF = new Vec3(1, .854902, .72549);
const PERU = new Vec3(.803922, .521569, .247059);
const PINK = new Vec3(1, .752941, .796078);
const PLUM = new Vec3(.866667, .627451, .866667);
const POWDER_BLUE = new Vec3(.690196, .878431, .901961);
const PURPLE = new Vec3(.627451, .12549, .941176);
const REBECCA_PURPLE = new Vec3(.4, .2, .6);
const RED = new Vec3(1, 0, 0);
const ROSY_BROWN = new Vec3(.737255, .560784, .560784);
const ROYAL_BLUE = new Vec3(.254902, .411765, .882353);
const SADDLE_BROWN = new Vec3(.545098, .270588, .0745098);
const SALMON = new Vec3(.980392, .501961, .447059);
const SANDY_BROWN = new Vec3(.956863, .643137, .376471);
const SEA_GREEN = new Vec3(.180392, .545098, .341176);
const SEASHELL = new Vec3(1, .960784, .933333);
const SIENNA = new Vec3(.627451, .321569, .176471);
const SILVER = new Vec3(.752941, .752941, .752941);
const SKY_BLUE = new Vec3(.529412, .807843, .921569);
const SLATE_BLUE = new Vec3(.415686, .352941, .803922);
const SLATE_GRAY = new Vec3(.439216, .501961, .564706);
const SNOW = new Vec3(1, .980392, .980392);
const SPRING_GREEN = new Vec3(0, 1, .498039);
const STEEL_BLUE = new Vec3(.27451, .509804, .705882);
const TAN = new Vec3(.823529, .705882, .54902);
const TEAL = new Vec3(0, .501961, .501961);
const THISTLE = new Vec3(.847059, .74902, .847059);
const TOMATO = new Vec3(1, .388235, .278431);
const TURQUOISE = new Vec3(.25098, .878431, .815686);
const VIOLET = new Vec3(.933333, .509804, .933333);
const WEB_GRAY = new Vec3(.501961, .501961, .501961);
const WEB_GREEN = new Vec3(0, .501961, 0);
const WEB_MAROON = new Vec3(.501961, 0, 0);
const WEB_PURPLE = new Vec3(.501961, 0, .501961);
const WHEAT = new Vec3(.960784, .870588, .701961);
const WHITE = new Vec3(1, 1, 1);
const WHITE_SMOKE = new Vec3(.960784, .960784, .960784);
const YELLOW = new Vec3(1, 1, 0);
const YELLOW_GREEN = new Vec3(.603922, .803922, .196078);
export { ALICE_BLUE, ANTIQUE_WHITE, AQUA, AQUAMARINE, AZURE, BEIGE, BISQUE, BLACK, BLANCHED_ALMOND, BLUE, BLUE_VIOLET, BROWN, BURLYWOOD, CADET_BLUE, CHARTREUSE, CHOCOLATE, CORAL, CORNFLOWER_BLUE, CORNSILK, COSINE_PRESET_FIRE, COSINE_PRESET_ICE, COSINE_PRESET_RAINBOW, CRIMSON, CYAN, DARK_BLUE, DARK_CYAN, DARK_GOLDENROD, DARK_GRAY, DARK_GREEN, DARK_KHAKI, DARK_MAGENTA, DARK_OLIVE_GREEN, DARK_ORANGE, DARK_ORCHID, DARK_RED, DARK_SALMON, DARK_SEA_GREEN, DARK_SLATE_BLUE, DARK_SLATE_GRAY, DARK_TURQUOISE, DARK_VIOLET, DEEP_PINK, DEEP_SKY_BLUE, DIM_GRAY, DODGER_BLUE, FIREBRICK, FLORAL_WHITE, FOREST_GREEN, FUCHSIA, GAINSBORO, GHOST_WHITE, GOLD, GOLDENROD, GRAY, GREEN, GREEN_YELLOW, HONEYDEW, HOT_PINK, INDIAN_RED, INDIGO, IVORY, KHAKI, LAVENDER, LAVENDER_BLUSH, LAWN_GREEN, LEMON_CHIFFON, LIGHT_BLUE, LIGHT_CORAL, LIGHT_CYAN, LIGHT_GOLDENROD, LIGHT_GRAY, LIGHT_GREEN, LIGHT_PINK, LIGHT_SALMON, LIGHT_SEA_GREEN, LIGHT_SKY_BLUE, LIGHT_SLATE_GRAY, LIGHT_STEEL_BLUE, LIGHT_YELLOW, LIME, LIME_GREEN, LINEN, MAGENTA, MAROON, MEDIUM_AQUAMARINE, MEDIUM_BLUE, MEDIUM_ORCHID, MEDIUM_PURPLE, MEDIUM_SEA_GREEN, MEDIUM_SLATE_BLUE, MEDIUM_SPRING_GREEN, MEDIUM_TURQUOISE, MEDIUM_VIOLET_RED, MIDNIGHT_BLUE, MINT_CREAM, MISTY_ROSE, MOCCASIN, NAVAJO_WHITE, NAVY_BLUE, OLD_LACE, OLIVE, OLIVE_DRAB, ORANGE, ORANGE_RED, ORCHID, PALE_GOLDENROD, PALE_GREEN, PALE_TURQUOISE, PALE_VIOLET_RED, PAPAYA_WHIP, PEACH_PUFF, PERU, PINK, PLUM, POWDER_BLUE, PURPLE, REBECCA_PURPLE, RED, ROSY_BROWN, ROYAL_BLUE, SADDLE_BROWN, SALMON, SANDY_BROWN, SEASHELL, SEA_GREEN, SIENNA, SILVER, SKY_BLUE, SLATE_BLUE, SLATE_GRAY, SNOW, SPRING_GREEN, STEEL_BLUE, TAN, TEAL, THISTLE, TOMATO, TURQUOISE, VIOLET, WEB_GRAY, WEB_GREEN, WEB_MAROON, WEB_PURPLE, WHEAT, WHITE, WHITE_SMOKE, YELLOW, YELLOW_GREEN, adjustBrightness, adjustComplementary, adjustContrast, adjustGamma, adjustNeutrality, adjustSaturation, adjustTemperature, adjustTimeOfDay, adjustTonalRange, adjustVibrance, analogous, blendColorBurn, blendColorDodge, blendDarken, blendDifference, blendExclusion, blendHardLight, blendLighten, blendMultiply, blendOverlay, blendScreen, blendSoftLight, blendWithAlpha, calculateColorSimilarityFast, calculateColorSimilarityLab, classifyColor, clipToGamut, cmykToRGB, colorBalance, colorDistanceMatrix, colorToString, complement, compound, compressToGamut, contrastRatio, cosineGradient, debugColor, deltaE2000, estimateColorTemperature, findDominantColors, fromPremultipliedAlpha, generateAccessiblePalette, generateCosinePalette, getTextColor, grayscale, harmonizeColor, harmonizePalette, hslToRGB, invert, isDistinguishableForColorBlindness, isInGamut, kelvinToRGB, labToRGB, labToXYZ, meetsWCAGRequirements, mix, monochromatic, optimizeForColorBlindness, parseColor, parseHSL, parseHex, parseRGB, perceivedBrightness, projectToGamut, relativeLuminance, rgbToCMYK, rgbToHSL, rgbToLAB, rgbToXYZ, rotateHue, sepia, shade, shades, simulateColorBlindness, sortColors, splitComplementary, tetradic, tint, tints, toHSL, toHex, toPremultipliedAlpha, toRGB, tone, tones, triadic, validateColorBlindnessSafety, validateColorSpace, withAlpha, xyzToLAB, xyzToRGB };
