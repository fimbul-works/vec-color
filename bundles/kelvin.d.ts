import { Vec3 } from "@fimbul-works/vec";
/**
 * Converts color temperature in Kelvin to RGB
 * Valid range is 1000K to 40000K
 * @param kelvin Temperature in Kelvin (1000-40000)
 * @returns Vec3 containing RGB values
 * @see https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
 */
declare function kelvinToRGB(kelvin: number): Vec3;
/**
 * Estimates the color temperature of an RGB color
 * This is an approximation as not all colors map to a temperature
 * @param rgb Vec3 containing RGB values
 * @returns Approximate color temperature in Kelvin or null if no good match
 */
declare function estimateColorTemperature(rgb: Vec3, iterations?: number): number | null;
export { estimateColorTemperature, kelvinToRGB };