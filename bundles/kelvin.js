import { Vec3 } from "@fimbul-works/vec";
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
export { estimateColorTemperature, kelvinToRGB };
