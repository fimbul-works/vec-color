[@fimbul-works/vec-color](README.md) / analyze

# analyze

## Type Aliases

### ColorClassification

```ts
type ColorClassification = {
  category: string;
  intensity: "vivid" | "pastel" | "dark" | "light" | "medium";
  temperature: "warm" | "cool" | "neutral";
};
```

Defined in: [analyze.ts:6](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L6)

#### Properties

##### category

```ts
category: string;
```

Defined in: [analyze.ts:9](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L9)

##### intensity

```ts
intensity: "vivid" | "pastel" | "dark" | "light" | "medium";
```

Defined in: [analyze.ts:8](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L8)

##### temperature

```ts
temperature: "warm" | "cool" | "neutral";
```

Defined in: [analyze.ts:7](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L7)

## Functions

### calculateColorSimilarityFast()

```ts
function calculateColorSimilarityFast(A, B): number;
```

Defined in: [analyze.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L21)

Calculates an approximate perceptual color difference using a weighted RGB comparison
This is a fast approximation that weighs green more heavily than red or blue to match human perception
Trade speed for accuracy: use this when performance is critical and approximate results are acceptable
Based on the redmean color difference algorithm

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `A` | `Vec3` |
| `B` | `Vec3` |

#### Returns

`number`

A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference

***

### calculateColorSimilarityLab()

```ts
function calculateColorSimilarityLab(rgb1, rgb2): number;
```

Defined in: [analyze.ts:50](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L50)

Calculates precise perceptual color difference using CIE Delta E 2000
This is the most accurate color difference algorithm, accounting for human perception
characteristics in different color ranges. Uses LAB color space for calculations.
Trade accuracy for speed: use this when precision is more important than performance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rgb1` | `Vec3` |
| `rgb2` | `Vec3` |

#### Returns

`number`

A value between 0 and 1, where 1 means identical colors and 0 means maximum perceptual difference
Internally uses CIEDE2000 algorithm which has a non-linear relationship to human perception

***

### classifyColor()

```ts
function classifyColor(color): ColorClassification;
```

Defined in: [analyze.ts:271](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L271)

Classifies a color into basic categories

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color as Vec3 RGB |

#### Returns

[`ColorClassification`](#colorclassification)

Object containing color classifications

***

### colorDistanceMatrix()

```ts
function colorDistanceMatrix(colors): number[][];
```

Defined in: [analyze.ts:346](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L346)

Creates a color distance matrix for a set of colors

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colors` | `Vec3`[] | Array of colors to analyze |

#### Returns

`number`[][]

2D array of perceptual color differences

***

### contrastRatio()

```ts
function contrastRatio(color1, color2): number;
```

Defined in: [analyze.ts:82](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L82)

Calculates the contrast ratio between two colors according to WCAG 2.0 specifications

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color1` | `Vec3` | First color as Vec3 RGB (each channel from 0 to 1) |
| `color2` | `Vec3` | Second color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`number`

A value between 1 and 21, where 1 means no contrast and 21 means maximum contrast

#### See

https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

***

### deltaE2000()

```ts
function deltaE2000(lab1, lab2): number;
```

Defined in: [analyze.ts:128](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L128)

Calculate CIEDE2000 color difference

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lab1` | `Vec3` | First color as Vec3 LAB (each channel from 0 to 1) |
| `lab2` | `Vec3` | Second color as Vec3 LAB (each channel from 0 to 1) |

#### Returns

`number`

***

### findDominantColors()

```ts
function findDominantColors(colors, count?): Vec3[];
```

Defined in: [analyze.ts:217](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L217)

Finds dominant colors in a set of colors using k-means clustering

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `colors` | `Vec3`[] | `undefined` | Array of colors as Vec3 RGB |
| `count` | `number` | `5` | Number of dominant colors to find (default: 5) |

#### Returns

`Vec3`[]

Array of dominant colors as Vec3 RGB

***

### meetsWCAGRequirements()

```ts
function meetsWCAGRequirements(
   foreground, 
   background, 
   level?, 
   isLargeText?): boolean;
```

Defined in: [analyze.ts:109](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L109)

Checks if a color combination meets WCAG contrast requirements for accessibility

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `foreground` | `Vec3` | `undefined` | Foreground color as Vec3 RGB (each channel from 0 to 1) |
| `background` | `Vec3` | `undefined` | Background color as Vec3 RGB (each channel from 0 to 1) |
| `level` | `"AA"` \| `"AAA"` | `"AA"` | WCAG compliance level to check ("AA" or "AAA") |
| `isLargeText` | `boolean` | `false` | Whether the text is considered "large" by WCAG standards |

#### Returns

`boolean`

boolean indicating whether the combination meets WCAG requirements

***

### perceivedBrightness()

```ts
function perceivedBrightness(color): number;
```

Defined in: [analyze.ts:97](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L97)

Calculates perceived brightness based on human perception
Different from luminance as it accounts for human color sensitivity
Uses perceived brightness formula (ITU-R BT.709)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |

#### Returns

`number`

Perceived brightness value (0 to 1)

***

### relativeLuminance()

```ts
function relativeLuminance(color): number;
```

Defined in: [analyze.ts:67](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L67)

Calculates the relative luminance of a color according to WCAG 2.0 specifications
This is used in determining contrast ratios for accessibility compliance

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`number`

A value between 0 and 1, where 0 is darkest and 1 is brightest

#### See

https://www.w3.org/WAI/GL/wiki/Relative_luminance

***

### sortColors()

```ts
function sortColors(colors, by?): Vec3[];
```

Defined in: [analyze.ts:319](https://github.com/fimbul-works/vec-color/blob/main/src/analyze.ts#L319)

Sorts colors by various attributes

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `colors` | `Vec3`[] | `undefined` | Array of colors to sort |
| `by` | `"hue"` \| `"saturation"` \| `"lightness"` \| `"temperature"` | `"hue"` | Attribute to sort by ('hue', 'saturation', 'lightness', 'temperature') |

#### Returns

`Vec3`[]

Sorted array of colors
