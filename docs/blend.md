[@fimbul-works/vec-color](README.md) / blend

# blend

## Functions

### blendColorBurn()

```ts
function blendColorBurn<T>(base, blend): T;
```

Defined in: [blend.ts:182](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L182)

Darkens the base color based on the blend color using color burn blend mode
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendColorDodge()

```ts
function blendColorDodge<T>(base, blend): T;
```

Defined in: [blend.ts:162](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L162)

Brightens the base color based on the blend color using color dodge blend mode
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendDarken()

```ts
function blendDarken<T>(base, blend): T;
```

Defined in: [blend.ts:140](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L140)

Selects the darker color between base and blend colors
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendDifference()

```ts
function blendDifference<T>(base, blend): T;
```

Defined in: [blend.ts:241](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L241)

Calculates the absolute difference between colors
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendExclusion()

```ts
function blendExclusion<T>(base, blend): T;
```

Defined in: [blend.ts:252](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L252)

Similar to difference blend mode but with lower contrast
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendHardLight()

```ts
function blendHardLight<T>(base, blend): T;
```

Defined in: [blend.ts:202](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L202)

Combines colors using hard light blend mode
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendLighten()

```ts
function blendLighten<T>(base, blend): T;
```

Defined in: [blend.ts:151](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L151)

Selects the lighter color between base and blend colors
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendMultiply()

```ts
function blendMultiply<T>(base, blend): T;
```

Defined in: [blend.ts:94](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L94)

Multiplies two colors together
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendOverlay()

```ts
function blendOverlay<T>(base, blend): T;
```

Defined in: [blend.ts:120](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L120)

Applies overlay blend mode
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendScreen()

```ts
function blendScreen<T>(base, blend): T;
```

Defined in: [blend.ts:105](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L105)

Screens two colors together
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendSoftLight()

```ts
function blendSoftLight<T>(base, blend): T;
```

Defined in: [blend.ts:222](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L222)

Combines colors using soft light blend mode for a more subtle effect
Supports both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | Base color (Vec3 or Vec4) |
| `blend` | `T` | Blend color (Vec3 or Vec4) |

#### Returns

`T`

Blended color in same format as inputs

***

### blendWithAlpha()

```ts
function blendWithAlpha(bottom, top): Vec4;
```

Defined in: [blend.ts:48](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L48)

Blends two colors with alpha using premultiplied alpha blending

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bottom` | `Vec4` | Bottom color as Vec4 RGBA |
| `top` | `Vec4` | Top color as Vec4 RGBA |

#### Returns

`Vec4`

Vec4 containing the blended RGBA color

***

### mix()

```ts
function mix<T>(
   color1, 
   color2, 
   ratio): T;
```

Defined in: [blend.ts:22](https://github.com/fimbul-works/vec-color/blob/main/src/blend.ts#L22)

Mix two colors with a given ratio
Handles both RGB and RGBA colors

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `BlendColor` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color1` | `T` | First color (Vec3 or Vec4) |
| `color2` | `T` | Second color (Vec3 or Vec4) |
| `ratio` | `number` | Mix ratio (0 to 1) |

#### Returns

`T`

Mixed color in same format as inputs
