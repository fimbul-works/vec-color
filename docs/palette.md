[@fimbul-works/vec-color](README.md) / palette

# palette

## Functions

### analogous()

```ts
function analogous(color): Vec3[];
```

Defined in: [palette.ts:35](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L35)

Generates an analogous color scheme

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`[]

Array of three Vec3 colors: the original and two analogous colors

***

### complement()

```ts
function complement(color): Vec3;
```

Defined in: [palette.ts:11](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L11)

Generates the complementary color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing the complementary color

***

### compound()

```ts
function compound(color): Vec3[];
```

Defined in: [palette.ts:95](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L95)

Generates a compound color scheme
Base color, complement, and two analogous colors to the complement

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Base color as Vec3 RGB |

#### Returns

`Vec3`[]

Array of four colors in compound arrangement

***

### generateAccessiblePalette()

```ts
function generateAccessiblePalette(
   baseColor, 
   count?, 
   minContrast?): Vec3[];
```

Defined in: [palette.ts:177](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L177)

Generates an accessible color palette that meets WCAG contrast requirements

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `baseColor` | `Vec3` | `undefined` | Starting color as Vec3 RGB (each channel from 0 to 1) |
| `count` | `number` | `5` | Number of colors to generate (default: 5) |
| `minContrast` | `number` | `4.5` | Minimum contrast ratio required (default: 4.5) |

#### Returns

`Vec3`[]

Array of Vec3 colors that meet contrast requirements

***

### getTextColor()

```ts
function getTextColor(backgroundColor): Vec3;
```

Defined in: [palette.ts:165](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L165)

Determines the best text color (black or white) for a given background color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `backgroundColor` | `Vec3` | Background color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`

Vec3 containing either black or white RGB values

***

### harmonizePalette()

```ts
function harmonizePalette(colors, wcagLevel?): Vec3[];
```

Defined in: [palette.ts:202](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L202)

Harmonizes a set of colors while maintaining WCAG compliance

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `colors` | `Vec3`[] | `undefined` | Array of colors to harmonize |
| `wcagLevel` | `"AA"` \| `"AAA"` | `"AA"` | WCAG compliance level to maintain |

#### Returns

`Vec3`[]

Harmonized colors

***

### monochromatic()

```ts
function monochromatic(color): Vec3[];
```

Defined in: [palette.ts:78](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L78)

Generates a monochromatic color palette

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`[]

Array of 5 colors with varying lightness (20%, 40%, original, 60%, 80%)

***

### shades()

```ts
function shades(color, steps?): Vec3[];
```

Defined in: [palette.ts:112](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L112)

Generates a series of shades (darker variations) of a color

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Base color as Vec3 RGB |
| `steps` | `number` | `5` | Number of shades to generate (default: 5) |

#### Returns

`Vec3`[]

Array of colors from darkest to original

***

### splitComplementary()

```ts
function splitComplementary(color): Vec3[];
```

Defined in: [palette.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L21)

Generates split-complementary colors

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Base color as Vec3 RGB |

#### Returns

`Vec3`[]

Array of three colors: base and two split complements

***

### tetradic()

```ts
function tetradic(color): Vec3[];
```

Defined in: [palette.ts:63](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L63)

Generates a tetradic (double complementary) color scheme

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Base color as Vec3 RGB |

#### Returns

`Vec3`[]

Array of four colors in tetradic arrangement

***

### tints()

```ts
function tints(color, steps?): Vec3[];
```

Defined in: [palette.ts:130](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L130)

Generates a series of tints (lighter variations) of a color

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Base color as Vec3 RGB |
| `steps` | `number` | `5` | Number of tints to generate (default: 5) |

#### Returns

`Vec3`[]

Array of colors from original to lightest

***

### tones()

```ts
function tones(color, steps?): Vec3[];
```

Defined in: [palette.ts:148](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L148)

Generates a series of tones (reduced saturation variations) of a color

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Base color as Vec3 RGB |
| `steps` | `number` | `5` | Number of tones to generate (default: 5) |

#### Returns

`Vec3`[]

Array of colors from original to fully desaturated

***

### triadic()

```ts
function triadic(color): Vec3[];
```

Defined in: [palette.ts:49](https://github.com/fimbul-works/vec-color/blob/main/src/palette.ts#L49)

Generates a triadic color scheme

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB (each channel from 0 to 1) |

#### Returns

`Vec3`[]

Array of three Vec3 colors: the original and two triadic colors
