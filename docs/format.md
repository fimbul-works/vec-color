[@fimbul-works/vec-color](README.md) / format

# format

## Interfaces

### ColorStringOptions

Defined in: [format.ts:7](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L7)

Options for color string formatting

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-alpha"></a> `alpha?` | `number` | [format.ts:9](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L9) |
| <a id="property-format"></a> `format` | `"hex"` \| `"rgb"` \| `"hsl"` | [format.ts:8](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L8) |
| <a id="property-includehash"></a> `includeHash?` | `boolean` | [format.ts:10](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L10) |

## Functions

### colorToString()

```ts
function colorToString(color, options): string;
```

Defined in: [format.ts:155](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L155)

Converts RGB color to string representation

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Vec3 containing RGB values |
| `options` | [`ColorStringOptions`](#colorstringoptions) | Formatting options |

#### Returns

`string`

Color string in specified format

***

### parseColor()

```ts
function parseColor(color): Vec3;
```

Defined in: [format.ts:84](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L84)

Parses a color string in any supported format

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `string` | Color string in hex, RGB, RGBA, HSL, or HSLA format |

#### Returns

`Vec3`

Vec3 containing RGB values

#### Throws

Error if color string is invalid or format is unsupported

***

### parseHex()

```ts
function parseHex(hex): Vec3;
```

Defined in: [format.ts:19](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L19)

Converts a hex string to RGB color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | Hex color string (3, 6, or 8 digits with optional #) |

#### Returns

`Vec3`

Vec3 containing RGB values

#### Throws

Error if hex string is invalid

***

### parseHSL()

```ts
function parseHSL(hsl): Vec3;
```

Defined in: [format.ts:65](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L65)

Parses HSL/HSLA string into RGB color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hsl` | `string` | HSL/HSLA string (e.g., "hsl(120, 100%, 50%)" or "hsla(120, 100%, 50%, 0.5)") |

#### Returns

`Vec3`

Vec3 containing RGB values

#### Throws

Error if HSL string is invalid

***

### parseRGB()

```ts
function parseRGB(rgb): Vec3;
```

Defined in: [format.ts:46](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L46)

Parses RGB/RGBA string into RGB color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgb` | `string` | RGB/RGBA string (e.g., "rgb(255, 128, 0)" or "rgba(255, 128, 0, 0.5)") |

#### Returns

`Vec3`

Vec3 containing RGB values

#### Throws

Error if RGB string is invalid

***

### toHex()

```ts
function toHex(color, includeHash?): string;
```

Defined in: [format.ts:106](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L106)

Converts RGB color to hex string

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Vec3 containing RGB values |
| `includeHash` | `boolean` | `true` | Whether to include # prefix (default: true) |

#### Returns

`string`

Hex color string

***

### toHSL()

```ts
function toHSL(color, alpha?): string;
```

Defined in: [format.ts:140](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L140)

Converts RGB color to HSL string

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Vec3 containing RGB values |
| `alpha?` | `number` | Optional alpha value (0 to 1) |

#### Returns

`string`

HSL or HSLA color string

***

### toRGB()

```ts
function toRGB(color, alpha?): string;
```

Defined in: [format.ts:126](https://github.com/fimbul-works/vec-color/blob/main/src/format.ts#L126)

Converts RGB color to RGB string

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Vec3 containing RGB values |
| `alpha?` | `number` | Optional alpha value (0 to 1) |

#### Returns

`string`

RGB or RGBA color string
