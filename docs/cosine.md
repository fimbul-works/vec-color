[@fimbul-works/vec-color](README.md) / cosine

# cosine

## Type Aliases

### CosineGradientPreset

```ts
type CosineGradientPreset = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
```

Defined in: [cosine.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L21)

#### Properties

##### a

```ts
a: Vec3;
```

Defined in: [cosine.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L21)

##### b

```ts
b: Vec3;
```

Defined in: [cosine.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L21)

##### c

```ts
c: Vec3;
```

Defined in: [cosine.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L21)

##### d

```ts
d: Vec3;
```

Defined in: [cosine.ts:21](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L21)

## Variables

### COSINE\_PRESET\_FIRE

```ts
const COSINE_PRESET_FIRE: {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
```

Defined in: [cosine.ts:45](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L45)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-a"></a> `a` | `Vec3` | [cosine.ts:46](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L46) |
| <a id="property-b"></a> `b` | `Vec3` | [cosine.ts:47](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L47) |
| <a id="property-c"></a> `c` | `Vec3` | [cosine.ts:48](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L48) |
| <a id="property-d"></a> `d` | `Vec3` | [cosine.ts:49](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L49) |

***

### COSINE\_PRESET\_ICE

```ts
const COSINE_PRESET_ICE: {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
```

Defined in: [cosine.ts:52](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L52)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-a-1"></a> `a` | `Vec3` | [cosine.ts:53](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L53) |
| <a id="property-b-1"></a> `b` | `Vec3` | [cosine.ts:54](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L54) |
| <a id="property-c-1"></a> `c` | `Vec3` | [cosine.ts:55](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L55) |
| <a id="property-d-1"></a> `d` | `Vec3` | [cosine.ts:56](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L56) |

***

### COSINE\_PRESET\_RAINBOW

```ts
const COSINE_PRESET_RAINBOW: {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
};
```

Defined in: [cosine.ts:38](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L38)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-a-2"></a> `a` | `Vec3` | [cosine.ts:39](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L39) |
| <a id="property-b-2"></a> `b` | `Vec3` | [cosine.ts:40](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L40) |
| <a id="property-c-2"></a> `c` | `Vec3` | [cosine.ts:41](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L41) |
| <a id="property-d-2"></a> `d` | `Vec3` | [cosine.ts:42](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L42) |

## Functions

### cosineGradient()

```ts
function cosineGradient(
   t, 
   a, 
   b, 
   c, 
   d): Vec3;
```

Defined in: [cosine.ts:13](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L13)

Generates colors using cosine-based gradient

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `t` | `number` | Interpolation parameter (0 to 1) |
| `a` | `Vec3` | Vec3 center of oscillation |
| `b` | `Vec3` | Vec3 amplitude |
| `c` | `Vec3` | Vec3 frequency |
| `d` | `Vec3` | Vec3 phase |

#### Returns

`Vec3`

Vec3 containing the generated color

#### See

https://iquilezles.org/articles/palettes/

***

### generateCosinePalette()

```ts
function generateCosinePalette(steps, preset): Vec3[];
```

Defined in: [cosine.ts:29](https://github.com/fimbul-works/vec-color/blob/main/src/cosine.ts#L29)

Generates a palette using cosine gradient

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `steps` | `number` | Number of colors to generate |
| `preset` | [`CosineGradientPreset`](#cosinegradientpreset) | Preset parameters for the cosine gradient |

#### Returns

`Vec3`[]

Array of Vec3 colors
