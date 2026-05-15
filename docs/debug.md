[@fimbul-works/vec-color](README.md) / debug

# debug

## Interfaces

### ColorValidationResult

Defined in: [debug.ts:58](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L58)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-colorspace"></a> `colorSpace` | \{ `channelValidation`: \{ \[`channel`: `string`\]: `ColorChannelValidation`; \}; `inGamut`: `boolean`; \} | [debug.ts:62](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L62) |
| `colorSpace.channelValidation` | \{ \[`channel`: `string`\]: `ColorChannelValidation`; \} | [debug.ts:64](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L64) |
| `colorSpace.inGamut` | `boolean` | [debug.ts:63](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L63) |
| <a id="property-issues"></a> `issues` | `string`[] | [debug.ts:60](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L60) |
| <a id="property-valid"></a> `valid` | `boolean` | [debug.ts:59](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L59) |
| <a id="property-warnings"></a> `warnings` | `string`[] | [debug.ts:61](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L61) |

## Functions

### debugColor()

```ts
function debugColor(color): ColorDebugInfo;
```

Defined in: [debug.ts:75](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L75)

Provides comprehensive debug information about a color

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `Vec3` | Color to analyze |

#### Returns

`ColorDebugInfo`

Detailed color information for debugging

***

### validateColorSpace()

```ts
function validateColorSpace(color, space?): ColorValidationResult;
```

Defined in: [debug.ts:151](https://github.com/fimbul-works/vec-color/blob/main/src/debug.ts#L151)

Validates if a color is within valid ranges for its color space
and provides detailed validation information

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Color to validate |
| `space` | `"RGB"` \| `"HSL"` \| `"LAB"` | `"RGB"` | Color space to validate against |

#### Returns

[`ColorValidationResult`](#colorvalidationresult)

Validation results with detailed information
