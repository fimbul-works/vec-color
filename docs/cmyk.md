[@fimbul-works/vec-color](README.md) / cmyk

# cmyk

## Functions

### cmykToRGB()

```ts
function cmykToRGB(cmyk): Vec3;
```

Defined in: [cmyk.ts:24](https://github.com/fimbul-works/vec-color/blob/main/src/cmyk.ts#L24)

Converts CMYK color values to RGB color space

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cmyk` | `Vec4` | Vec4 containing CMYK values (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing RGB values (each channel from 0 to 1)

***

### rgbToCMYK()

```ts
function rgbToCMYK(rgb): Vec4;
```

Defined in: [cmyk.ts:8](https://github.com/fimbul-works/vec-color/blob/main/src/cmyk.ts#L8)

Converts RGB color values to CMYK color space

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgb` | `Vec3` | Vec3 containing RGB values (each channel from 0 to 1) |

#### Returns

`Vec4`

Vec4 containing CMYK values (each channel from 0 to 1)
