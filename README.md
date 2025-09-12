# @fimbul-works/vec-color

A comprehensive, type-safe color manipulation library for TypeScript that provides a wide range of color space conversions, blending operations, and accessibility utilities.

[![npm version](https://badge.fury.io/js/%40fimbul-works%2Fvec-color.svg)](https://www.npmjs.com/package/@fimbul-works/vec-color)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/microsoft/TypeScript)

## Features

- 🎨 Multiple color space support (RGB, HSL, CMYK, XYZ, LAB)
- 🎯 Fully type-safe with TypeScript
- 🎭 Advanced color blending modes
- ♿ WCAG accessibility utilities
- 🌈 Color palette generation
- 🪶 Lightweight with single dependency on @fimbul-works/vec
- 📐 Built on Vec3 and Vec4 classes for consistent vector operations
- 🎪 Cosine gradient generation

## Installation

```bash
npm install @fimbul-works/vec @fimbul-works/vec-color
```

or

```bash
yarn add @fimbul-works/vec @fimbul-works/vec-color
```

## Quick Start

```typescript
import { Vec3 } from '@fimbul-works/vec';
import { parseColor, adjustBrightness, getTextColor, colorToString } from '@fimbul-works/vec-color';

// Create and manipulate colors using intuitive accessors
const brandColor = parseColor('#0066cc');
brandColor.r *= 1.2;  // Increase red component
brandColor.g *= 0.8;  // Reduce green component

// Or work with the full RGB array
const [r, g, b] = brandColor.rgb;
brandColor.rgb = [r, g * 1.1, b];  // Boost green by 10%

// Make it 20% brighter
const brightBrand = adjustBrightness(brandColor, 0.2);

// Get appropriate text color for contrast
const textColor = getTextColor(brightBrand);

// Convert back to hex
console.log(colorToString(brightBrand, { format: 'hex' })); // #0080ff
```

## Usage

This library builds on top of [`@fimbul-works/vec`](https://github.com/fimbul-works/vec), using [Vec3](https://github.com/fimbul-works/vec/blob/main/VEC3.md) and [Vec4](https://github.com/fimbul-works/vec/blob/main/VEC4.md) classes for all color operations. Each color is represented as a Vec3 (RGB, HSL, LAB, XYZ) or Vec4 (RGBA/CMYK) with values ranging from 0 to 1.

## Core Concepts

### Color Representation

Colors in vec-color are represented using Vec3 (RGB) or Vec4 (RGBA/CMYK) with values ranging from 0 to 1. The library provides convenient color-specific accessors for intuitive color manipulation:

```typescript
// RGB color using standard coordinates
const red = new Vec3(1, 0, 0);

// RGB color using color accessors - more intuitive for color work
const blue = new Vec3();
blue.r = 0;    // Red component
blue.g = 0;    // Green component
blue.b = 1;    // Blue component

// Get/set all RGB values at once
const orange = new Vec3();
orange.rgb = [1, 0.5, 0];  // Set RGB values as array
const [r, g, b] = orange.rgb;  // Get RGB values as array

// RGBA color with transparency
const transBlue = new Vec4(0, 0, 1, 0.5);
// Or using color accessors
transBlue.r = 0;
transBlue.g = 0;
transBlue.b = 1;
transBlue.a = 0.5;  // Alpha (transparency)

// Get/set all RGBA values at once
const semiRed = new Vec4();
semiRed.rgba = [1, 0, 0, 0.8];  // 80% opaque red
const [r, g, b, a] = semiRed.rgba;
```

The color accessors (`.r`, `.g`, `.b`, `.a`, `.rgb`, `.rgba`) are aliases for the vector components, making color manipulation more intuitive while retaining all the mathematical power of the underlying vector operations.

### Color Spaces

The library supports multiple color spaces:
- RGB: Standard display color space
- HSL: Intuitive color manipulation
- LAB: Perceptually uniform color space
- XYZ: Device-independent color space
- CMYK: Print-focused color space

## Common Operations

### Color Space Conversion

```typescript
import { rgbToHSL, hslToRGB } from '@fimbul-works/vec-color';

// Convert red to HSL
const rgb = new Vec3(1, 0, 0);
const hsl = rgbToHSL(rgb);
console.log(hsl); // Vec3(0, 1, 0.5)

// Create a green color in HSL
const green = hslToRGB(new Vec3(0.33, 1, 0.5));
```

### Color Blending

```typescript
import { blendMultiply, blendScreen } from '@fimbul-works/vec-color';

const base = new Vec3(0.8, 0.3, 0.3);
const blend = new Vec3(0.2, 0.5, 0.7);

const multiplied = blendMultiply(base, blend);
const screened = blendScreen(base, blend);
```

### Accessibility

```typescript
import { contrastRatio, meetsWCAGRequirements } from '@fimbul-works/vec-color';

const background = new Vec3(1, 1, 1); // White
const text = new Vec3(0, 0, 0);       // Black

const ratio = contrastRatio(text, background);
const isAccessible = meetsWCAGRequirements(text, background, 'AAA');
```

### Color Schemes

```typescript
import { analogous, generateAccessiblePalette } from '@fimbul-works/vec-color';

// Generate analogous color scheme
const baseColor = new Vec3(0.2, 0.5, 0.8);
const scheme = analogous(baseColor);

// Generate accessible palette
const palette = generateAccessiblePalette(baseColor, 5, 4.5);
```

## Advanced Topics

### Color Blindness Support

```typescript
import { optimizeForColorBlindness, validateColorBlindnessSafety } from '@fimbul-works/vec-color';

const colors = [/* your colors */];
const optimized = optimizeForColorBlindness(colors);
const validation = validateColorBlindnessSafety(optimized);
```

### Performance Considerations

- Use `calculateColorSimilarityFast` for real-time operations
- Batch color space conversions when possible
- Cache frequently used calculations

## API Documentation

See [API.md](./API.md) for complete API documentation.

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built with 🎨 by [FimbulWorks](https://github.com/fimbul-works)
