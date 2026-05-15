import { Vec3, Vec4 } from "@fimbul-works/vec";
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
export { adjustBrightness, adjustComplementary, adjustContrast, adjustGamma, adjustNeutrality, adjustSaturation, adjustTemperature, adjustTimeOfDay, adjustTonalRange, adjustVibrance, colorBalance, grayscale, harmonizeColor, invert, rotateHue, sepia, shade, tint, tone };
