[@fimbul-works/vec-color](README.md) / alpha

# alpha

## Functions

### fromPremultipliedAlpha()

```ts
function fromPremultipliedAlpha(premultiplied): [Vec3, number];
```

Defined in: [alpha.ts:28](https://github.com/fimbul-works/vec-color/blob/main/src/alpha.ts#L28)

Converts a premultiplied RGBA color back to straight RGB and alpha

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `premultiplied` | `Vec4` | Premultiplied color as Vec4 RGBA |

#### Returns

\[`Vec3`, `number`\]

[Vec3, number] tuple containing RGB color and alpha value

***

### toPremultipliedAlpha()

```ts
function toPremultipliedAlpha(color, alpha?): Vec4;
```

Defined in: [alpha.ts:19](https://github.com/fimbul-works/vec-color/blob/main/src/alpha.ts#L19)

Converts a color with alpha to premultiplied RGBA

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Color as Vec3 RGB (each channel from 0 to 1) |
| `alpha` | `number` | `1` | Alpha value (0 to 1) |

#### Returns

`Vec4`

Vec4 containing premultiplied RGBA values

***

### withAlpha()

```ts
function withAlpha(color, alpha?): Vec4;
```

Defined in: [alpha.ts:9](https://github.com/fimbul-works/vec-color/blob/main/src/alpha.ts#L9)

Adds an alpha channel to RGB

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `Vec3` | `undefined` | Color as Vec3 RGB (each channel from 0 to 1) |
| `alpha` | `number` | `1` | Alpha value (0 to 1) |

#### Returns

`Vec4`

Vec4 containing RGBA values
