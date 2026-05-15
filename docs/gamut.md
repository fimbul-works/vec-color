[@fimbul-works/vec-color](README.md) / gamut

# gamut

## Functions

### clipToGamut()

```ts
function clipToGamut(color): Vec3;
```

Defined in: [gamut.ts:19](https://github.com/fimbul-works/vec-color/blob/main/src/gamut.ts#L19)

Clips a color to the sRGB gamut
Simple but can lose relationships between colors

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color to clip |

#### Returns

`Vec3`

Clipped color

***

### compressToGamut()

```ts
function compressToGamut(color, preserveHue?): Vec3;
```

Defined in: [gamut.ts:34](https://github.com/fimbul-works/vec-color/blob/main/src/gamut.ts#L34)

Compresses out-of-gamut colors while preserving relationships
More sophisticated than clipping but more computationally expensive

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Color to compress |
| `preserveHue` | `boolean` | `true` | Whether to preserve the color's hue (default: true) |

#### Returns

`Vec3`

Compressed color within gamut

***

### isInGamut()

```ts
function isInGamut(color): boolean;
```

Defined in: [gamut.ts:9](https://github.com/fimbul-works/vec-color/blob/main/src/gamut.ts#L9)

Checks if a color is within the sRGB gamut

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color to check |

#### Returns

`boolean`

Boolean indicating if color is in gamut

***

### projectToGamut()

```ts
function projectToGamut(color): Vec3;
```

Defined in: [gamut.ts:87](https://github.com/fimbul-works/vec-color/blob/main/src/gamut.ts#L87)

Projects an out-of-gamut color back into gamut while preserving lightness
Useful for maintaining perceived brightness while ensuring displayable colors

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color to project |

#### Returns

`Vec3`

Projected in-gamut color
