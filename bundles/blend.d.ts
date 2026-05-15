import { Vec3, Vec4 } from "@fimbul-works/vec";
type BlendColor = Vec3 | Vec4;
/**
 * Mix two colors with a given ratio
 * Handles both RGB and RGBA colors
 * @param color1 First color (Vec3 or Vec4)
 * @param color2 Second color (Vec3 or Vec4)
 * @param ratio Mix ratio (0 to 1)
 * @returns Mixed color in same format as inputs
 */
declare function mix<T extends BlendColor>(color1: T, color2: T, ratio: number): T;
/**
 * Blends two colors with alpha using premultiplied alpha blending
 * @param bottom - Bottom color as Vec4 RGBA
 * @param top - Top color as Vec4 RGBA
 * @returns Vec4 containing the blended RGBA color
 */
declare function blendWithAlpha(bottom: Vec4, top: Vec4): Vec4;
/**
 * Multiplies two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendMultiply<T extends BlendColor>(base: T, blend: T): T;
/**
 * Screens two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendScreen<T extends BlendColor>(base: T, blend: T): T;
/**
 * Applies overlay blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendOverlay<T extends BlendColor>(base: T, blend: T): T;
/**
 * Selects the darker color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendDarken<T extends BlendColor>(base: T, blend: T): T;
/**
 * Selects the lighter color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendLighten<T extends BlendColor>(base: T, blend: T): T;
/**
 * Brightens the base color based on the blend color using color dodge blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendColorDodge<T extends BlendColor>(base: T, blend: T): T;
/**
 * Darkens the base color based on the blend color using color burn blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendColorBurn<T extends BlendColor>(base: T, blend: T): T;
/**
 * Combines colors using hard light blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendHardLight<T extends BlendColor>(base: T, blend: T): T;
/**
 * Combines colors using soft light blend mode for a more subtle effect
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendSoftLight<T extends BlendColor>(base: T, blend: T): T;
/**
 * Calculates the absolute difference between colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendDifference<T extends BlendColor>(base: T, blend: T): T;
/**
 * Similar to difference blend mode but with lower contrast
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
declare function blendExclusion<T extends BlendColor>(base: T, blend: T): T;
export { blendColorBurn, blendColorDodge, blendDarken, blendDifference, blendExclusion, blendHardLight, blendLighten, blendMultiply, blendOverlay, blendScreen, blendSoftLight, blendWithAlpha, mix };