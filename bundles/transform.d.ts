import { Vec3 } from "@fimbul-works/vec";
/**
 * Converts a color to grayscale using luminance weights
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing grayscale RGB values
 */
declare function grayscale(color: Vec3): Vec3;
/**
 * Inverts a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @returns Vec3 containing inverted RGB values
 */
declare function invert(color: Vec3): Vec3;
/**
 * Adjusts the brightness of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust brightness (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
declare function adjustBrightness(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the saturation of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount to adjust saturation (-1 to 1)
 * @returns Vec3 containing adjusted RGB values
 */
declare function adjustSaturation(color: Vec3, amount: number): Vec3;
/**
 * Adjusts local contrast using a combination of luminance and saturation
 * @param color Input color as Vec3 RGB
 * @param amount Amount of contrast adjustment (-1 to 1)
 * @returns Contrast adjusted color as Vec3 RGB
 */
declare function adjustContrast(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the gamma of a color
 * @param color - Input color as Vec3 RGB (each channel from 0 to 1)
 * @param amount - Amount of gamma adjustment
 * @returns Vec3 containing adjusted gamma values
 */
declare function adjustGamma(color: Vec3, gamma: number): Vec3;
/**
 * Selectively adjusts shadows and highlights
 * @param color Input color as Vec3 RGB
 * @param shadows Adjustment for shadows (-1 to 1)
 * @param highlights Adjustment for highlights (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustTonalRange(color: Vec3, shadows: number, highlights: number): Vec3;
/**
 * Shifts colors towards or away from pure grays
 * @param color Input color as Vec3 RGB
 * @param amount Amount of neutralization (-1 to 1, negative makes colors more neutral)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustNeutrality(color: Vec3, amount: number): Vec3;
/**
 * Adjusts color based on its complementary color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of complementary influence (-1 to 1)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustComplementary(color: Vec3, amount: number): Vec3;
/**
 * Adds white to create a tint of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of white to add (0 to 1)
 * @returns Tinted color as Vec3 RGB
 */
declare function tint(color: Vec3, amount: number): Vec3;
/**
 * Adds black to create a shade of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of black to add (0 to 1)
 * @returns Shaded color as Vec3 RGB
 */
declare function shade(color: Vec3, amount: number): Vec3;
/**
 * Adds gray to create a tone of the color
 * @param color Input color as Vec3 RGB
 * @param amount Amount of gray to add (0 to 1)
 * @returns Toned color as Vec3 RGB
 */
declare function tone(color: Vec3, amount: number): Vec3;
/**
 * Adjusts the color temperature
 * @param color Input color as Vec3 RGB
 * @param adjustment Temperature adjustment in Kelvin (-10000 to 10000)
 * @returns Temperature adjusted color as Vec3 RGB
 */
declare function adjustTemperature(color: Vec3, adjustment: number): Vec3;
/**
 * Rotates the hue of a color
 * @param color Input color as Vec3 RGB
 * @param degrees Degrees to rotate the hue (-360 to 360)
 * @returns Color with rotated hue as Vec3 RGB
 */
declare function rotateHue(color: Vec3, degrees: number): Vec3;
/**
 * Adjusts color vibrance (saturates colors while preserving skin tones)
 * @param color Input color as Vec3 RGB
 * @param amount Amount to adjust vibrance (-1 to 1)
 * @returns Vibrance adjusted color as Vec3 RGB
 */
declare function adjustVibrance(color: Vec3, amount: number): Vec3;
/**
 * Creates a sepia tone effect
 * @param color Input color as Vec3 RGB
 * @param amount Amount of sepia effect (0 to 1)
 * @returns Sepia-toned color as Vec3 RGB
 */
declare function sepia(color: Vec3, amount: number): Vec3;
/**
 * Adjusts RGB channels independently
 * @param color Input color as Vec3 RGB
 * @param adjustments Vec3 containing adjustment values for each channel (-1 to 1)
 * @returns Color balanced color as Vec3 RGB
 */
declare function colorBalance(color: Vec3, adjustments: Vec3): Vec3;
/**
 * Adjusts color based on time of day lighting
 * @param color Input color as Vec3 RGB
 * @param timeOfDay Hour in 24-hour format (0-23)
 * @returns Adjusted color as Vec3 RGB
 */
declare function adjustTimeOfDay(color: Vec3, timeOfDay: number): Vec3;
/**
 * Harmonizes a color by adjusting it to the nearest harmonic relationship
 * with a reference color while maintaining its character
 * @param color Color to harmonize
 * @param referenceColor Reference color to harmonize against
 * @returns Harmonized color
 */
declare function harmonizeColor(color: Vec3, referenceColor: Vec3): Vec3;
export { adjustBrightness, adjustComplementary, adjustContrast, adjustGamma, adjustNeutrality, adjustSaturation, adjustTemperature, adjustTimeOfDay, adjustTonalRange, adjustVibrance, colorBalance, grayscale, harmonizeColor, invert, rotateHue, sepia, shade, tint, tone };