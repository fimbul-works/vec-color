import { Vec3 } from "@fimbul-works/vec";
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
export { clipToGamut, compressToGamut, isInGamut, projectToGamut };
