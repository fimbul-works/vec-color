import { Vec3 } from "@fimbul-works/vec";
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
export { COSINE_PRESET_FIRE, COSINE_PRESET_ICE, COSINE_PRESET_RAINBOW, cosineGradient, generateCosinePalette };
