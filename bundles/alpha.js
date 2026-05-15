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
export { fromPremultipliedAlpha, toPremultipliedAlpha, withAlpha };
