[@fimbul-works/vec-color](README.md) / hsl

# hsl

## Functions

### hslToRGB()

```ts
function hslToRGB(hsl): Vec3;
```

Defined in: [hsl.ts:39](https://github.com/fimbul-works/vec-color/blob/main/src/hsl.ts#L39)

Converts HSL color values to RGB color space

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hsl` | `Vec3` | Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1) |

#### Returns

`Vec3`

Vec3 containing RGB values (each channel from 0 to 1)

***

### rgbToHSL()

```ts
function rgbToHSL(rgb): Vec3;
```

Defined in: [hsl.ts:8](https://github.com/fimbul-works/vec-color/blob/main/src/hsl.ts#L8)

Converts RGB color values to HSL color space

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgb` | `Vec3` | Vec3 containing RGB values (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing HSL values (h: 0-1, s: 0-1, l: 0-1)
