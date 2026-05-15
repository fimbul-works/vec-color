import { Vec3, Vec4 } from "@fimbul-works/vec";
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
export { cmykToRGB, rgbToCMYK };
