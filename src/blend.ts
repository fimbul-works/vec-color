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
export function mix<T extends BlendColor>(
  color1: T,
  color2: T,
  ratio: number,
): T {
  if (isVec4(color1) && isVec4(color2)) {
    const outAlpha = color1.w * (1 - ratio) + color2.w * ratio;
    if (outAlpha === 0) return new Vec4(0, 0, 0, 0) as T;

    return new Vec4(
      color1.x * (1 - ratio) + color2.x * ratio,
      color1.y * (1 - ratio) + color2.y * ratio,
      color1.z * (1 - ratio) + color2.z * ratio,
      outAlpha,
    ) as T;
  }

  return new Vec3(
    color1.x * (1 - ratio) + color2.x * ratio,
    color1.y * (1 - ratio) + color2.y * ratio,
    color1.z * (1 - ratio) + color2.z * ratio,
  ) as T;
}

/**
 * Blends two colors with alpha using premultiplied alpha blending
 * @param bottom - Bottom color as Vec4 RGBA
 * @param top - Top color as Vec4 RGBA
 * @returns Vec4 containing the blended RGBA color
 */
export function blendWithAlpha(bottom: Vec4, top: Vec4): Vec4 {
  const outAlpha = top.w + bottom.w * (1 - top.w);
  if (outAlpha === 0) return new Vec4(0, 0, 0, 0);

  return new Vec4(
    top.x + bottom.x * (1 - top.w),
    top.y + bottom.y * (1 - top.w),
    top.z + bottom.z * (1 - top.w),
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
function applyBlend<T extends BlendColor>(
  base: T,
  blend: T,
  blendFn: (base: Vec3, blend: Vec3) => Vec3,
): T {
  if (isVec4(base) && isVec4(blend)) {
    const premulBase = toPremultipliedAlpha(
      new Vec3(base.x, base.y, base.z),
      base.w,
    );

    const premulBlend = toPremultipliedAlpha(
      new Vec3(blend.x, blend.y, blend.z),
      blend.w,
    );

    const baseVec3 = new Vec3(premulBase.x, premulBase.y, premulBase.z);
    const blendVec3 = new Vec3(premulBlend.x, premulBlend.y, premulBlend.z);
    const result = blendFn(baseVec3, blendVec3);

    const outAlpha = blend.w + base.w * (1 - blend.w);
    if (outAlpha === 0) return new Vec4(0, 0, 0, 0) as T;

    return new Vec4(result.x, result.y, result.z, outAlpha) as T;
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
  return applyBlend(
    base,
    blend,
    (b, bl) => new Vec3(b.x * bl.x, b.y * bl.y, b.z * bl.z),
  );
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
    (b, bl) =>
      new Vec3(
        1 - (1 - b.x) * (1 - bl.x),
        1 - (1 - b.y) * (1 - bl.y),
        1 - (1 - b.z) * (1 - bl.z),
      ),
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
        b.x < 0.5 ? 2 * b.x * bl.x : 1 - 2 * (1 - b.x) * (1 - bl.x),
        b.y < 0.5 ? 2 * b.y * bl.y : 1 - 2 * (1 - b.y) * (1 - bl.y),
        b.z < 0.5 ? 2 * b.z * bl.z : 1 - 2 * (1 - b.z) * (1 - bl.z),
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
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(Math.min(b.x, bl.x), Math.min(b.y, bl.y), Math.min(b.z, bl.z)),
  );
}

/**
 * Selects the lighter color between base and blend colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendLighten<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(Math.max(b.x, bl.x), Math.max(b.y, bl.y), Math.max(b.z, bl.z)),
  );
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
        b.x === 0 ? 0 : bl.x === 1 ? 1 : Math.min(1, b.x / (1 - bl.x)),
        b.y === 0 ? 0 : bl.y === 1 ? 1 : Math.min(1, b.y / (1 - bl.y)),
        b.z === 0 ? 0 : bl.z === 1 ? 1 : Math.min(1, b.z / (1 - bl.z)),
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
        b.x === 1 ? 1 : bl.x === 0 ? 0 : 1 - Math.min(1, (1 - b.x) / bl.x),
        b.y === 1 ? 1 : bl.y === 0 ? 0 : 1 - Math.min(1, (1 - b.y) / bl.y),
        b.z === 1 ? 1 : bl.z === 0 ? 0 : 1 - Math.min(1, (1 - b.z) / bl.z),
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
        blend.x < 0.5
          ? 2 * base.x * blend.x
          : 1 - 2 * (1 - base.x) * (1 - blend.x),
        blend.y < 0.5
          ? 2 * base.y * blend.y
          : 1 - 2 * (1 - base.y) * (1 - blend.y),
        blend.z < 0.5
          ? 2 * base.z * blend.z
          : 1 - 2 * (1 - base.z) * (1 - blend.z),
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

  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        softlight(b.x, bl.x),
        softlight(b.y, bl.y),
        softlight(b.z, bl.z),
      ),
  );
}

/**
 * Calculates the absolute difference between colors
 * Supports both RGB and RGBA colors
 * @param base Base color (Vec3 or Vec4)
 * @param blend Blend color (Vec3 or Vec4)
 * @returns Blended color in same format as inputs
 */
export function blendDifference<T extends BlendColor>(base: T, blend: T): T {
  return applyBlend(
    base,
    blend,
    (b, bl) =>
      new Vec3(
        Math.abs(b.x - bl.x),
        Math.abs(b.y - bl.y),
        Math.abs(b.z - bl.z),
      ),
  );
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
    (b, bl) =>
      new Vec3(
        b.x + bl.x - 2 * b.x * bl.x,
        b.y + bl.y - 2 * b.y * bl.y,
        b.z + bl.z - 2 * b.z * bl.z,
      ),
  );
}
