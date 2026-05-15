[@fimbul-works/vec-color](README.md) / kelvin

# kelvin

## Functions

### estimateColorTemperature()

```ts
function estimateColorTemperature(rgb, iterations?): number | null;
```

Defined in: [kelvin.ts:50](https://github.com/fimbul-works/vec-color/blob/main/src/kelvin.ts#L50)

Estimates the color temperature of an RGB color
This is an approximation as not all colors map to a temperature

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `rgb` | `Vec3` | `undefined` | Vec3 containing RGB values |
| `iterations` | `number` | `20` | - |

#### Returns

`number` \| `null`

Approximate color temperature in Kelvin or null if no good match

***

### kelvinToRGB()

```ts
function kelvinToRGB(kelvin): Vec3;
```

Defined in: [kelvin.ts:10](https://github.com/fimbul-works/vec-color/blob/main/src/kelvin.ts#L10)

Converts color temperature in Kelvin to RGB
Valid range is 1000K to 40000K

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `kelvin` | `number` | Temperature in Kelvin (1000-40000) |

#### Returns

`Vec3`

Vec3 containing RGB values

#### See

https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
