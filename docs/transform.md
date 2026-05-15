[@fimbul-works/vec-color](README.md) / transform

# transform

## Functions

### adjustBrightness()

```ts
function adjustBrightness(color, amount): Vec3;
```

Defined in: [transform.ts:32](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L32)

Adjusts the brightness of a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |
| `amount` | `number` | Amount to adjust brightness (-1 to 1) |

#### Returns

`Vec3`

Vec3 containing adjusted RGB values

***

### adjustComplementary()

```ts
function adjustComplementary(color, amount): Vec3;
```

Defined in: [transform.ts:115](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L115)

Adjusts color based on its complementary color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of complementary influence (-1 to 1) |

#### Returns

`Vec3`

Adjusted color as Vec3 RGB

***

### adjustContrast()

```ts
function adjustContrast(color, amount): Vec3;
```

Defined in: [transform.ts:54](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L54)

Adjusts local contrast using a combination of luminance and saturation

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of contrast adjustment (-1 to 1) |

#### Returns

`Vec3`

Contrast adjusted color as Vec3 RGB

***

### adjustGamma()

```ts
function adjustGamma(color, gamma): Vec3;
```

Defined in: [transform.ts:68](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L68)

Adjusts the gamma of a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |
| `gamma` | `number` | - |

#### Returns

`Vec3`

Vec3 containing adjusted gamma values

***

### adjustNeutrality()

```ts
function adjustNeutrality(color, amount): Vec3;
```

Defined in: [transform.ts:98](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L98)

Shifts colors towards or away from pure grays

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of neutralization (-1 to 1, negative makes colors more neutral) |

#### Returns

`Vec3`

Adjusted color as Vec3 RGB

***

### adjustSaturation()

```ts
function adjustSaturation(color, amount): Vec3;
```

Defined in: [transform.ts:43](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L43)

Adjusts the saturation of a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |
| `amount` | `number` | Amount to adjust saturation (-1 to 1) |

#### Returns

`Vec3`

Vec3 containing adjusted RGB values

***

### adjustTemperature()

```ts
function adjustTemperature(color, adjustment): Vec3;
```

Defined in: [transform.ts:159](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L159)

Adjusts the color temperature

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `adjustment` | `number` | Temperature adjustment in Kelvin (-10000 to 10000) |

#### Returns

`Vec3`

Temperature adjusted color as Vec3 RGB

***

### adjustTimeOfDay()

```ts
function adjustTimeOfDay(color, timeOfDay): Vec3;
```

Defined in: [transform.ts:237](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L237)

Adjusts color based on time of day lighting

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `timeOfDay` | `number` | Hour in 24-hour format (0-23) |

#### Returns

`Vec3`

Adjusted color as Vec3 RGB

***

### adjustTonalRange()

```ts
function adjustTonalRange(
   color, 
   shadows, 
   highlights): Vec3;
```

Defined in: [transform.ts:79](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L79)

Selectively adjusts shadows and highlights

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `shadows` | `number` | Adjustment for shadows (-1 to 1) |
| `highlights` | `number` | Adjustment for highlights (-1 to 1) |

#### Returns

`Vec3`

Adjusted color as Vec3 RGB

***

### adjustVibrance()

```ts
function adjustVibrance(color, amount): Vec3;
```

Defined in: [transform.ts:187](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L187)

Adjusts color vibrance (saturates colors while preserving skin tones)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount to adjust vibrance (-1 to 1) |

#### Returns

`Vec3`

Vibrance adjusted color as Vec3 RGB

***

### colorBalance()

```ts
function colorBalance(color, adjustments): Vec3;
```

Defined in: [transform.ts:223](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L223)

Adjusts RGB channels independently

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `adjustments` | `Vec3` | Vec3 containing adjustment values for each channel (-1 to 1) |

#### Returns

`Vec3`

Color balanced color as Vec3 RGB

***

### grayscale()

```ts
function grayscale(color): Vec3;
```

Defined in: [transform.ts:12](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L12)

Converts a color to grayscale using luminance weights

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing grayscale RGB values

***

### harmonizeColor()

```ts
function harmonizeColor(color, referenceColor): Vec3;
```

Defined in: [transform.ts:265](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L265)

Harmonizes a color by adjusting it to the nearest harmonic relationship
with a reference color while maintaining its character

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color to harmonize |
| `referenceColor` | `Vec3` | Reference color to harmonize against |

#### Returns

`Vec3`

Harmonized color

***

### invert()

```ts
function invert(color): Vec3;
```

Defined in: [transform.ts:22](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L22)

Inverts a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing inverted RGB values

***

### rotateHue()

```ts
function rotateHue(color, degrees): Vec3;
```

Defined in: [transform.ts:175](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L175)

Rotates the hue of a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `degrees` | `number` | Degrees to rotate the hue (-360 to 360) |

#### Returns

`Vec3`

Color with rotated hue as Vec3 RGB

***

### sepia()

```ts
function sepia(color, amount): Vec3;
```

Defined in: [transform.ts:209](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L209)

Creates a sepia tone effect

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of sepia effect (0 to 1) |

#### Returns

`Vec3`

Sepia-toned color as Vec3 RGB

***

### shade()

```ts
function shade(color, amount): Vec3;
```

Defined in: [transform.ts:139](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L139)

Adds black to create a shade of the color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of black to add (0 to 1) |

#### Returns

`Vec3`

Shaded color as Vec3 RGB

***

### tint()

```ts
function tint(color, amount): Vec3;
```

Defined in: [transform.ts:129](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L129)

Adds white to create a tint of the color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of white to add (0 to 1) |

#### Returns

`Vec3`

Tinted color as Vec3 RGB

***

### tone()

```ts
function tone(color, amount): Vec3;
```

Defined in: [transform.ts:149](https://github.com/fimbul-works/vec-color/blob/main/src/transform.ts#L149)

Adds gray to create a tone of the color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `amount` | `number` | Amount of gray to add (0 to 1) |

#### Returns

`Vec3`

Toned color as Vec3 RGB
