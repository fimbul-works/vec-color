import { Vec3, Vec4 } from "@fimbul-works/vec";

import { toPremultipliedAlpha } from "./alpha";

type BlendColor = Vec3 | Vec4;

/**
 * Type guard to check if a color is Vec4
 */
function isVec4(color: BlendColor): color is Vec4 {
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
export function mix<T extends BlendColor>(color1: T, color2: T, ratio: number): T {
  if (isVec4(color1) && isVec4(color2)) {
    const outAlpha = color1.a * (1 - ratio) + color2.a * ratio;
    if (outAlpha === 0) return new Vec4(0, 0, 0, 0) as T;

    return new Vec4(
      color1.r * (1 - ratio) + color2.r * ratio,
      color1.g * (1 - ratio) + color2.g * ratio,
      color1.b * (1 - ratio) + color2.b * ratio,
      outAlpha,
    ) as T;
  }

  return new Vec3(
    color1.r * (1 - ratio) + color2.r * ratio,
    color1.g * (1 - ratio) + color2.g * ratio,
    color1.b * (1 - ratio) + color2.b * ratio,
  ) as T;
}

/**
 * Blends two colors with alpha using premultiplied alpha blending
 * @param bottom - Bottom color as Vec4 RGBA
 * @param top - Top color as Vec4 RGBA
 * @returns Vec4 containing the blended RGBA color
 */
export function blendWithAlpha(bottom: Vec4, top: Vec4): Vec4 {
  const outAlpha = top.a + bottom.a * (1 - top.a);
  if (outAlpha === 0) return new Vec4(0, 0, 0, 0);

  return new Vec4(
    top.r + bottom.r * (1 - top.a),
    top.g + bottom.g * (1 - top.a),
    top.b + bottom.b * (1 - top.a),
    outAlpha,
  );
}

/**
 * Applies a blend operation to two colors
 * Handles both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @param blendFn Blend function to apply to RGB components
 * @returns Blended color in same format as inputs
 */
function applyBlend<T extends BlendColor>(base: T, blend: T, blendFn: (base: Vec3, blend: Vec3) => Vec3): T {
  if (isVec4(base) && isVec4(blend)) {
    const premulBase = toPremultipliedAlpha(new Vec3(base.r, base.g, base.b), base.a);

    const premulBlend = toPremultipliedAlpha(new Vec3(blend.r, blend.g, blend.b), blend.a);

    const baseVec3 = new Vec3(premulBase.r, premulBase.g, premulBase.b);
    const blendVec3 = new Vec3(premulBlend.r, premulBlend.g, premulBlend.b);
    const result = blendFn(baseVec3, blendVec3);

    const outAlpha = blend.a + base.a * (1 - blend.a);
    if (outAlpha === 0) return new Vec4(0, 0, 0, 0) as T;

    return new Vec4(result.r, result.g, result.b, outAlpha) as T;
  }

  return blendFn(base as Vec3, blend as Vec3) as T;
}

/**
 * Multiplies two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendMultiply<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(base, blend, (b, bl) => new Vec3(b.r * bl.r, b.g * bl.g, b.b * bl.b));
}

/**
 * Screens two colors together
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendScreen<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) => new Vec3(1 - (1 - b.r) * (1 - bl.r), 1 - (1 - b.g) * (1 - bl.g), 1 - (1 - b.b) * (1 - bl.b)),
  );
}

/**
 * Applies overlay blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendOverlay<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        b.r < 0.5 ? 2 * b.r * bl.r : 1 - 2 * (1 - b.r) * (1 - bl.r),
        b.g < 0.5 ? 2 * b.g * bl.g : 1 - 2 * (1 - b.g) * (1 - bl.g),
        b.b < 0.5 ? 2 * b.b * bl.b : 1 - 2 * (1 - b.b) * (1 - bl.b),
      ),
  );
}

/**
 * Selects the darker color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendDarken<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(base, blend, (b, bl) => new Vec3(Math.min(b.r, bl.r), Math.min(b.g, bl.g), Math.min(b.b, bl.b)));
}

/**
 * Selects the lighter color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendLighten<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(base, blend, (b, bl) => new Vec3(Math.max(b.r, bl.r), Math.max(b.g, bl.g), Math.max(b.b, bl.b)));
}

/**
 * Brightens the base color based on the blend color using color dodge blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendColorDodge<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        b.r === 0 ? 0 : bl.r === 1 ? 1 : Math.min(1, b.r / (1 - bl.r)),
        b.g === 0 ? 0 : bl.g === 1 ? 1 : Math.min(1, b.g / (1 - bl.g)),
        b.b === 0 ? 0 : bl.b === 1 ? 1 : Math.min(1, b.b / (1 - bl.b)),
      ),
  );
}

/**
 * Darkens the base color based on the blend color using color burn blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendColorBurn<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        b.r === 1 ? 1 : bl.r === 0 ? 0 : 1 - Math.min(1, (1 - b.r) / bl.r),
        b.g === 1 ? 1 : bl.g === 0 ? 0 : 1 - Math.min(1, (1 - b.g) / bl.g),
        b.b === 1 ? 1 : bl.b === 0 ? 0 : 1 - Math.min(1, (1 - b.b) / bl.b),
      ),
  );
}

/**
 * Combines colors using hard light blend mode
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendHardLight<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        blend.r < 0.5 ? 2 * base.r * blend.r : 1 - 2 * (1 - base.r) * (1 - blend.r),
        blend.g < 0.5 ? 2 * base.g * blend.g : 1 - 2 * (1 - base.g) * (1 - blend.g),
        blend.b < 0.5 ? 2 * base.b * blend.b : 1 - 2 * (1 - base.b) * (1 - blend.b),
      ),
  );
}

/**
 * Combines colors using soft light blend mode for a more subtle effect
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendSoftLight<T extends BlendColor>(base: T, blend: T): T {
  const softlight = (b: number, l: number) => {
    if (l <= 0.5) {
      return b - (1 - 2 * l) * b * (1 - b);
    }
    const d = b <= 0.25 ? ((16 * b - 12) * b + 4) * b : Math.sqrt(b);
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
export function blendDifference<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(base, blend, (b, bl) => new Vec3(Math.abs(b.r - bl.r), Math.abs(b.g - bl.g), Math.abs(b.b - bl.b)));
}

/**
 * Similar to difference blend mode but with lower contrast
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendExclusion<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) => new Vec3(b.r + bl.r - 2 * b.r * bl.r, b.g + bl.g - 2 * b.g * bl.g, b.b + bl.b - 2 * b.b * bl.b),
  );
}
