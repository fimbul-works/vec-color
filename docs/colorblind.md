[@fimbul-works/vec-color](README.md) / colorblind

# colorblind

## Functions

### isDistinguishableForColorBlindness()

```ts
function isDistinguishableForColorBlindness(
   color1, 
   color2, 
   type, 
   threshold?): boolean;
```

Defined in: [colorblind.ts:58](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L58)

Checks if two colors are distinguishable for different types of color blindness

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color1` | `Vec3` | `undefined` | First color as Vec3 RGB |
| `color2` | `Vec3` | `undefined` | Second color as Vec3 RGB |
| `type` | `"protanopia"` \| `"deuteranopia"` \| `"tritanopia"` \| `"achromatopsia"` | `undefined` | Type of color blindness to check |
| `threshold` | `number` | `0.1` | Minimum difference threshold (0-1, default: 0.1) |

#### Returns

`boolean`

Boolean indicating if colors are distinguishable

***

### optimizeForColorBlindness()

```ts
function optimizeForColorBlindness(colors): Vec3[];
```

Defined in: [colorblind.ts:79](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L79)

Optimizes a set of colors to be distinguishable for color blind users

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colors` | `Vec3`[] | Array of colors to optimize |

#### Returns

`Vec3`[]

Optimized colors that maintain distinctiveness across color blindness types

***

### simulateColorBlindness()

```ts
function simulateColorBlindness(color, type): Vec3;
```

Defined in: [colorblind.ts:40](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L40)

Simulates how a color would appear to someone with color blindness

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Input color as Vec3 RGB |
| `type` | `"protanopia"` \| `"deuteranopia"` \| `"tritanopia"` \| `"achromatopsia"` | Type of color blindness to simulate |

#### Returns

`Vec3`

Simulated color as Vec3 RGB

***

### validateColorBlindnessSafety()

```ts
function validateColorBlindnessSafety(colors): {
  issues: {
     problematicPairs: [Vec3, Vec3][];
     type: "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
  }[];
  safe: boolean;
};
```

Defined in: [colorblind.ts:135](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L135)

Validates if a color palette is safe for color blind users

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colors` | `Vec3`[] | Array of colors to validate |

#### Returns

```ts
{
  issues: {
     problematicPairs: [Vec3, Vec3][];
     type: "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
  }[];
  safe: boolean;
}
```

Validation result with detailed issues

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `issues` | \{ `problematicPairs`: \[`Vec3`, `Vec3`\][]; `type`: `"protanopia"` \| `"deuteranopia"` \| `"tritanopia"` \| `"achromatopsia"`; \}[] | [colorblind.ts:137](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L137) |
| `safe` | `boolean` | [colorblind.ts:136](https://github.com/fimbul-works/vec-color/blob/main/src/colorblind.ts#L136) |
