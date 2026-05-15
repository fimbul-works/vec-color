[@fimbul-works/vec-color](README.md) / lab

# lab

## Functions

### labToRGB()

```ts
function labToRGB(lab): Vec3;
```

Defined in: [lab.ts:61](https://github.com/fimbul-works/vec-color/blob/main/src/lab.ts#L61)

Converts CIE LAB color to RGB color space
Transforms perceptually uniform color coordinates to display-ready RGB values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lab` | `Vec3` | Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127) |

#### Returns

`Vec3`

Vec3 containing RGB values (each channel from 0 to 1)

***

### labToXYZ()

```ts
function labToXYZ(lab): Vec3;
```

Defined in: [lab.ts:33](https://github.com/fimbul-works/vec-color/blob/main/src/lab.ts#L33)

Converts CIE LAB color to XYZ color space using D65 illuminant
Transforms perceptually uniform LAB coordinates back to device-independent XYZ

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lab` | `Vec3` | Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127) |

#### Returns

`Vec3`

Vec3 containing XYZ values (each channel normalized)

***

### rgbToLAB()

```ts
function rgbToLAB(rgb): Vec3;
```

Defined in: [lab.ts:51](https://github.com/fimbul-works/vec-color/blob/main/src/lab.ts#L51)

Converts RGB color to CIE LAB color space
Provides a perceptually uniform color space useful for color difference calculations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgb` | `Vec3` | Vec3 containing RGB values (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)

***

### xyzToLAB()

```ts
function xyzToLAB(xyz): Vec3;
```

Defined in: [lab.ts:15](https://github.com/fimbul-works/vec-color/blob/main/src/lab.ts#L15)

Converts XYZ color to CIE LAB color space using D65 illuminant
LAB represents all visible colors with L for lightness (0-100), a for green-red, and b for blue-yellow

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `xyz` | `Vec3` | Vec3 containing XYZ values (each channel normalized) |

#### Returns

`Vec3`

Vec3 containing LAB values (l: 0-100, a: -128-127, b: -128-127)
